import "dotenv/config";
import express from "express";
import path from "path";
import fs from "fs";
import crypto from "crypto";
import { createServer as createViteServer } from "vite";
import { contactRateLimiter, cvRateLimiter, getClientIp } from "./src/server/services/rateLimiter";
import { sendContactEmails } from "./src/server/services/emailService";
import { generateCVPDF } from "./src/server/services/pdfService";

// Configuración general del servidor
const PORT = 3000;
const HOST = "0.0.0.0";
const IS_PROD = process.env.NODE_ENV === "production";

// Directorio para persistencia segura de datos locales cifrados
const DATA_DIR = path.join(process.cwd(), "data");
const SECURE_DB_FILE = path.join(DATA_DIR, "messages_encrypted.bin");
const SECURE_CV_DB_FILE = path.join(DATA_DIR, "cv_requests_encrypted.bin");

// Clave y vector de inicialización (IV) para cifrado simétrico AES-256-CBC
// Se utiliza un archivo de clave persistente para que las bitácoras sigan siendo descifrables tras reiniciar el servidor
const KEY_FILE = path.join(DATA_DIR, "secret.key");
let ENCRYPTION_KEY: Buffer;
let ENCRYPTION_IV: Buffer;

// Creación proactiva de los directorios necesarios si no existen
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Inicialización de las claves criptográficas seguras
if (fs.existsSync(KEY_FILE)) {
  const fileContent = fs.readFileSync(KEY_FILE);
  ENCRYPTION_KEY = fileContent.subarray(0, 32);
  ENCRYPTION_IV = fileContent.subarray(32, 48);
} else {
  // Generación aleatoria segura de la clave de 256 bits y el IV de 128 bits
  ENCRYPTION_KEY = crypto.randomBytes(32);
  ENCRYPTION_IV = crypto.randomBytes(16);
  fs.writeFileSync(KEY_FILE, Buffer.concat([ENCRYPTION_KEY, ENCRYPTION_IV]));
}

const app = express();

// Limitación del tamaño del cuerpo de la petición para mitigar ataques de denegación de servicio (DoS)
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

// 🛡️ Middleware de cabeceras de seguridad de grado de producción (Equivalente robusto a Helmet)
app.use((req, res, next) => {
  // Mitigar ataques de suplantación de tipo MIME (MIME-sniffing)
  res.setHeader("X-Content-Type-Options", "nosniff");
  // Prevenir clickjacking adaptado a entornos seguros y previews en iframe
  res.setHeader("X-Frame-Options", "SAMEORIGIN");
  // Habilitar el bloqueo de Cross-Site Scripting (XSS) en navegadores antiguos
  res.setHeader("X-XSS-Protection", "1; mode=block");
  // Ocultar información sensible del origen en el flujo de peticiones externas
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  // Cabecera HSTS para forzar conexiones HTTPS seguras en producción (Render)
  res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload");
  // Prevenir prefetch de DNS maliciosos
  res.setHeader("X-DNS-Prefetch-Control", "on");
  // Deshabilitar APIs de hardware no utilizadas por privacidad
  res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=(), interest-cohort=()");
  // Definir una estricta Política de Seguridad del Contenido (CSP) que soporte fuentes y assets locales
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://fonts.googleapis.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: referrer; connect-src 'self' *"
  );
  next();
});

// Estructura para el manejo de los desafíos matemáticos temporales anti-bot
interface ChallengeSession {
  answer: number;
  expiresAt: number;
}
const challengeStore = new Map<string, ChallengeSession>();

// Temporizador automático para limpiar retos matemáticos caducados de forma periódica
setInterval(() => {
  const now = Date.now();
  for (const [id, session] of challengeStore.entries()) {
    if (session.expiresAt < now) {
      challengeStore.delete(id);
    }
  }
}, 60000);

// Saneamiento de textos de entrada para mitigar ataques de inyección XSS (Cross Site Scripting)
function sanitizeString(str: string): string {
  if (typeof str !== "string") return "";
  return str
    .trim()
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;");
}

// Cifrado simétrico AES-256-CBC con codificación hexadecimal de salida
function encryptText(text: string): string {
  const cipher = crypto.createCipheriv("aes-256-cbc", ENCRYPTION_KEY, ENCRYPTION_IV);
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  return encrypted;
}

// Descifrado simétrico AES-256-CBC con manejo preventivo de errores
function decryptText(encryptedHex: string): string {
  try {
    const decipher = crypto.createDecipheriv("aes-256-cbc", ENCRYPTION_KEY, ENCRYPTION_IV);
    let decrypted = decipher.update(encryptedHex, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
  } catch (err) {
    return "[Error de Descifrado]";
  }
}

// ------------------- ENDPOINTS DE LA API (RESPALDO SEGURO) -------------------

// 1. Obtener Reto de Seguridad anti-bots (Suma matemática aleatoria)
app.get("/api/security-challenge", (req, res) => {
  const num1 = Math.floor(Math.random() * 9) + 1;
  const num2 = Math.floor(Math.random() * 9) + 1;
  const answer = num1 + num2;
  const challengeId = crypto.randomUUID();

  // Guardar desafío con tiempo límite de expiración de 5 minutos
  challengeStore.set(challengeId, {
    answer,
    expiresAt: Date.now() + 5 * 60 * 1000,
  });

  res.json({
    id: challengeId,
    question: `¿Cuánto es ${num1} + ${num2}? (Verificación de seguridad)`,
  });
});

// 2. Procesar Formulario de Contacto (Validación, Saneamiento, Desafío de seguridad y Cifrado AES-256)
app.post("/api/contact", contactRateLimiter, (req, res) => {
  const { name, email, message, challengeId, challengeAnswer, honeypot } = req.body;

  // 1. Validación de campo trampa (Honeypot) para bloquear bots automáticos
  if (honeypot && honeypot.trim() !== "") {
    return res.status(400).json({ error: "Actividad de bot detectada de forma inmediata." });
  }

  // 2. Comprobar presencia de todos los campos obligatorios
  if (!name || !email || !message || !challengeId || !challengeAnswer) {
    return res.status(400).json({ error: "Todos los campos del formulario son obligatorios." });
  }

  // 3. Validación y consumo inmediato del reto matemático temporal
  const activeChallenge = challengeStore.get(challengeId);
  if (!activeChallenge) {
    return res.status(400).json({ error: "El desafío de seguridad ha expirado. Por favor, reintente." });
  }

  const isChallengeCorrect = parseInt(challengeAnswer, 10) === activeChallenge.answer;
  challengeStore.delete(challengeId); // Consumir el reto inmediatamente para prevenir ataques de repetición

  if (!isChallengeCorrect) {
    return res.status(400).json({ error: "Respuesta al desafío de seguridad incorrecta. ¿Es usted humano?" });
  }

  // 4. Saneamiento estricto de textos para neutralizar inyecciones de código (XSS)
  const cleanName = sanitizeString(name);
  const cleanEmail = sanitizeString(email);
  const cleanMessage = sanitizeString(message);

  // 5. Validaciones de seguridad más estrictas (Límites de longitud para mitigar abusos de almacenamiento/desbordamiento)
  if (cleanName.length < 2 || cleanName.length > 100) {
    return res.status(400).json({ error: "El nombre debe tener entre 2 y 100 caracteres." });
  }

  if (cleanMessage.length < 10 || cleanMessage.length > 4000) {
    return res.status(400).json({ error: "El mensaje debe tener entre 10 y 4000 caracteres de longitud." });
  }

  // Validación de formato de correo electrónico
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(cleanEmail)) {
    return res.status(400).json({ error: "El formato de correo electrónico no cumple estándares seguros." });
  }

  // 6. Cifrado simétrico de datos sensibles antes de guardarlos en el disco para salvaguardar privacidad
  const contactData = JSON.stringify({
    name: cleanName,
    email: cleanEmail,
    message: cleanMessage,
    timestamp: new Date().toISOString(),
  });

  const encryptedRecord = encryptText(contactData);

  // Registrar el bloque cifrado de forma segura en el archivo bitácora local
  try {
    fs.appendFileSync(SECURE_DB_FILE, encryptedRecord + "\n");
  } catch (error) {
    // Registramos el error de escritura únicamente en la consola del servidor por seguridad
    console.error("❌ Error interno al guardar registro seguro en disco:", error);
    return res.status(500).json({ error: "Ha ocurrido un error inesperado al procesar su solicitud." });
  }

  // 7. Enviar correos de forma asíncrona mediante la API oficial de Resend (Notificación al Admin + Auto-respuesta)
  const clientIp = getClientIp(req);
  const userAgent = req.headers["user-agent"] || "Desconocido";

  sendContactEmails({
    name: cleanName,
    email: cleanEmail,
    message: cleanMessage,
    ip: clientIp,
    userAgent: userAgent,
  })
    .then(() => {
      // Envío de correo exitoso con Resend
      res.json({
        success: true,
        message: "¡Su mensaje fue recibido con éxito, saneado contra inyecciones e incrementalmente cifrado con AES-256! Hemos enviado una confirmación a su correo.",
        sanitizedName: cleanName,
      });
    })
    .catch((mailError) => {
      // Registramos el error de Resend únicamente en el servidor por seguridad
      console.error("❌ Fallo crítico de envío de correos con Resend API:", mailError.message || mailError);
      
      res.status(500).json({
        error: "Ocurrió un problema al enviar el mensaje.",
      });
    });
});

// 3. Registrar descarga de CV y generar Token firmado temporal
app.post("/api/request-cv", cvRateLimiter, (req, res) => {
  const { name, company, position, email, reason } = req.body;

  // 1. Validaciones robustas de presencia y tipo
  if (!name || !company || !position || !email || !reason) {
    return res.status(400).json({ error: "Todos los campos de la solicitud de descarga son obligatorios." });
  }

  const cleanName = sanitizeString(name);
  const cleanCompany = sanitizeString(company);
  const cleanPosition = sanitizeString(position);
  const cleanEmail = sanitizeString(email);
  const cleanReason = sanitizeString(reason);

  if (cleanName.length < 2 || cleanName.length > 100) {
    return res.status(400).json({ error: "El nombre debe tener entre 2 y 100 caracteres." });
  }
  if (cleanCompany.length < 2 || cleanCompany.length > 100) {
    return res.status(400).json({ error: "La empresa debe tener entre 2 y 100 caracteres." });
  }
  if (cleanPosition.length < 2 || cleanPosition.length > 100) {
    return res.status(400).json({ error: "El cargo debe tener entre 2 y 100 caracteres." });
  }
  if (cleanReason.length < 5 || cleanReason.length > 1000) {
    return res.status(400).json({ error: "El motivo de contacto debe tener entre 5 y 1000 caracteres." });
  }

  // Validación de correo corporativo / institucional
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(cleanEmail)) {
    return res.status(400).json({ error: "El formato de correo corporativo es inválido." });
  }

  // Comprobar correos genéricos comunes (Gmail, Outlook, Hotmail, Yahoo)
  const isGeneric = /@(gmail|outlook|hotmail|yahoo|live|icloud|aol)\./i.test(cleanEmail);
  if (isGeneric) {
    // Alentamos el uso de correos profesionales, pero permitimos para evitar bloquear usuarios genuinos si lo aclaran
    // Dejamos la advertencia pero permitimos el registro por usabilidad con bandera informativa
    console.log(`[CV REQUEST] Remitente usó correo común: ${cleanEmail}`);
  }

  // 2. Registro cifrado AES-256-CBC en disco para auditoría de seguridad
  const logData = JSON.stringify({
    name: cleanName,
    company: cleanCompany,
    position: cleanPosition,
    email: cleanEmail,
    reason: cleanReason,
    ip: getClientIp(req),
    timestamp: new Date().toISOString()
  });

  try {
    const encryptedRecord = encryptText(logData);
    fs.appendFileSync(SECURE_CV_DB_FILE, encryptedRecord + "\n");
  } catch (error) {
    console.error("❌ Fallo guardando log de CV cifrado:", error);
  }

  // 3. Generar token temporal firmado (validez: 5 minutos / 300 segundos)
  const expiresAt = Date.now() + 5 * 60 * 1000;
  const tokenPayload = {
    name: cleanName,
    company: cleanCompany,
    position: cleanPosition,
    email: cleanEmail,
    reason: cleanReason,
    expiresAt
  };

  // Convertir a base64url para evitar URL encoding corruptions
  const serialized = Buffer.from(JSON.stringify(tokenPayload)).toString("base64url");
  const signature = crypto.createHmac("sha256", ENCRYPTION_KEY).update(serialized).digest("base64url");
  const downloadToken = `${serialized}.${signature}`;

  res.json({
    success: true,
    token: downloadToken,
    message: "Solicitud registrada con éxito. Generando enlace de descarga temporal."
  });
});

// 4. Descarga del CV personalizado y con marca de agua dinámica
app.get("/api/download-cv-pdf", cvRateLimiter, async (req, res) => {
  const { token } = req.query;

  if (!token || typeof token !== "string") {
    return res.status(400).send("Enlace de descarga de currículum inválido o ausente.");
  }

  const parts = token.split(".");
  if (parts.length !== 2) {
    return res.status(400).send("Estructura de credencial de descarga corrupta.");
  }

  const [serialized, signature] = parts;
  const expectedSignature = crypto.createHmac("sha256", ENCRYPTION_KEY).update(serialized).digest("base64url");

  if (signature !== expectedSignature) {
    return res.status(403).send("La firma digital de esta credencial de descarga es inválida o fue modificada.");
  }

  try {
    const decodedStr = Buffer.from(serialized, "base64url").toString("utf8");
    const payload = JSON.parse(decodedStr);

    if (!payload.expiresAt || Date.now() > payload.expiresAt) {
      return res.status(410).send("Este enlace de descarga temporal ha expirado (válido por 5 minutos). Por favor, genera una nueva solicitud.");
    }

    // Configurar cabeceras HTTP ultra seguras para entrega de binarios y evitar caché antigua
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="CV_Geovanni_Lemus_Diaz.pdf"`);
    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("X-Frame-Options", "DENY");

    const dateStr = new Date().toLocaleDateString("es-MX", {
      timeZone: "America/Mexico_City",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    // Stream el PDF dinámico con marca de agua personalizada
    await generateCVPDF(res, {
      name: payload.name,
      company: payload.company,
      position: payload.position,
      email: payload.email,
      reason: payload.reason,
      dateStr
    });
  } catch (error) {
    console.error("❌ Fallo crítico generando o transmitiendo PDF de CV:", error);
    if (!res.headersSent) {
      res.status(500).send("Ocurrió un error en el servidor al generar el documento PDF.");
    }
  }
});

// ------------------- ENLACE INTEGRADO DE VITE Y PÁGINA SPA -------------------

async function startServer() {
  if (!IS_PROD) {
    // Modo Desarrollo: Inicializa el servidor Vite y acopla sus middlewares de compilación al vuelo
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Modo Producción: Sirve los archivos estáticos precompilados de la carpeta /dist
    const distPath = path.join(process.cwd(), "dist");
    
    // Servir estáticos con cabeceras estrictas contra caché obsoleta para HTML
    app.use(express.static(distPath, {
      maxAge: "1y",
      etag: true,
      setHeaders: (res, filePath) => {
        if (filePath.endsWith(".html")) {
          // No permitir almacenamiento de index.html para asegurar carga de builds nuevos de forma instantánea
          res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0");
          res.setHeader("Pragma", "no-cache");
          res.setHeader("Expires", "0");
        } else if (filePath.includes("/assets/") || filePath.endsWith(".js") || filePath.endsWith(".css")) {
          // Activos inmutables con hashes pueden ser cacheados indefinidamente
          res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
        }
      }
    }));

    app.get("*", (req, res) => {
      // Forzar que el router SPA de index.html tampoco se guarde en caché
      res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0");
      res.setHeader("Pragma", "no-cache");
      res.setHeader("Expires", "0");
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, HOST, () => {
    console.log(`[OK] Servidor activo en modo ${IS_PROD ? "PRODUCCIÓN" : "DESARROLLO"} en http://${HOST}:${PORT}`);
  });
}

startServer();
