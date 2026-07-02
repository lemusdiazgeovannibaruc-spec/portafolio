import express from "express";
import path from "path";
import fs from "fs";
import crypto from "crypto";
import { createServer as createViteServer } from "vite";

// Configuración general del servidor
const PORT = Number(process.env.PORT) || 3000;
const HOST = "0.0.0.0";
const IS_PROD = process.env.NODE_ENV === "production";

// Directorio para persistencia segura de datos locales cifrados
const DATA_DIR = path.join(process.cwd(), "data");
const SECURE_DB_FILE = path.join(DATA_DIR, "messages_encrypted.bin");

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

// 🛡️ Middleware de cabeceras de seguridad personalizadas (Equivalente robusto a Helmet)
app.use((req, res, next) => {
  // Mitigar ataques de suplantación de tipo MIME (MIME-sniffing)
  res.setHeader("X-Content-Type-Options", "nosniff");
  // Prevenir que el sitio sea embebido en iframes externos, evitando Clickjacking
  res.setHeader("X-Frame-Options", "SAMEORIGIN");
  // Habilitar el bloqueo de Cross-Site Scripting (XSS) reflejado en el navegador
  res.setHeader("X-XSS-Protection", "1; mode=block");
  // Ocultar información sensible del origen en el flujo de peticiones externas
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  // Definir una estricta Política de Seguridad del Contenido (CSP)
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
app.post("/api/contact", (req, res) => {
  const { name, email, message, challengeId, challengeAnswer, honeypot } = req.body;

  // 1. Validación de campo trampa (Honeypot) para bloquear bots automáticos
  if (honeypot && honeypot.trim() !== "") {
    return res.status(400).json({ error: "Actividad de bot detectada." });
  }

  // 2. Comprobar presencia de todos los campos obligatorios
  if (!name || !email || !message || !challengeId || !challengeAnswer) {
    return res.status(400).json({ error: "Todos los campos son requeridos." });
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

  // 4. Saneamiento estricto de textos para neutralizar inyecciones de código
  const cleanName = sanitizeString(name);
  const cleanEmail = sanitizeString(email);
  const cleanMessage = sanitizeString(message);

  // Validación robusta del formato de correo electrónico
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(cleanEmail)) {
    return res.status(400).json({ error: "Formato de correo electrónico inválido." });
  }

  // 5. Cifrado simétrico de datos sensibles antes de guardarlos en el disco
  const contactData = JSON.stringify({
    name: cleanName,
    email: cleanEmail,
    message: cleanMessage,
    timestamp: new Date().toISOString(),
  });

  const encryptedRecord = encryptText(contactData);

  // Registrar el bloque cifrado de forma segura e incremental en el archivo bitácora
  try {
    fs.appendFileSync(SECURE_DB_FILE, encryptedRecord + "\n");
  } catch (error) {
    console.error("Error al guardar registro seguro:", error);
    return res.status(500).json({ error: "Fallo interno al resguardar la información." });
  }

  res.json({
    success: true,
    message: "¡Mensaje recibido de forma segura y encriptado con AES-256!",
    sanitizedName: cleanName,
  });
});

// 3. Recuperación e historial de bitácora segura descifrada de forma dinámica
app.get("/api/audit-messages", (req, res) => {
  if (!fs.existsSync(SECURE_DB_FILE)) {
    return res.json({ messages: [] });
  }

  try {
    const data = fs.readFileSync(SECURE_DB_FILE, "utf8");
    const lines = data.split("\n").filter((l) => l.trim() !== "");
    const decryptedList = lines.map((line) => {
      const decryptedStr = decryptText(line);
      try {
        return JSON.parse(decryptedStr);
      } catch (e) {
        return { error: "Formato corrupto o clave incorrecta" };
      }
    });

    res.json({ messages: decryptedList });
  } catch (err) {
    res.status(500).json({ error: "No se pudieron recuperar las bitácoras de auditoría." });
  }
});

// 4. Descarga segura del currículum imprimible en formato plano
app.get("/api/download-cv", (req, res) => {
  const cvText = `=============================================================================
PORTAFOLIO PROFESIONAL Y CURRICULUM VITAE - ING. GEOVANNI BARUC LEMUS DÍAZ
=============================================================================

DATOS GENERALES
-----------------
Nombre: Geovanni Baruc Lemus Díaz
Título: Ingeniero en Sistemas Computacionales
Ubicación: Tulancingo de Bravo, Hidalgo, México
Cédula Federal: No. 15684082 (Emitido en 2026)
Contacto: lemusdiazgeovannibaruc@gmail.com
Teléfono: Disponible bajo solicitud escrita
Licencia de conducir: Tipo C, B

PERFIL PROFESIONAL
-----------------
Ingeniero en Sistemas Computacionales apasionado por crear soluciones útiles que unan
la tecnología con las necesidades de la vida diaria y el trabajo. Me enfoco principalmente
en el diseño de redes de comunicación, la mejora de rutas de reparto para entregas rápidas,
el soporte avanzado de hardware, y el desarrollo de software seguro y modular. Me considero
una persona práctica, organizada y orientada a dar resultados eficientes.

SERVICIOS PROFESIONALES DESTACADOS
----------------------------------
1. Mantenimiento Preventivo de Computadoras (limpieza física profunda, pasta térmica).
2. Mantenimiento Correctivo de Computadoras (diagnóstico de componentes, refacciones).
3. Diagnóstico de fallas de hardware (memoria RAM, procesador, fuente, almacenamiento).
4. Reparación de laptops y equipos de escritorio (pantallas, teclados, bisagras).
5. Optimización y limpieza de sistemas (desinfección de malware, aceleración de Windows/Linux).
6. Instalación y configuración de Sistemas Operativos (Windows 10/11, distribuciones de Linux).
7. Instalación de software y utilidades bajo licencia autorizada.
8. Respaldo y recuperación segura de información de unidades de almacenamiento.
9. Configuración de redes básicas (cableado estructurado, repetidores Wi-Fi, switches).
10. Asesoría tecnológica para selección de hardware adecuado al presupuesto.
11. Desarrollo de software y aplicaciones web empresariales.

EXPERIENCIA LABORAL
-------------------
* Diseñador de Red e Infraestructura | Centro Universitario de Ciencias Ambientales
  Período: 12/2024 - 05/2025 (Hidalgo, México)
  - Diseño lógico y físico de la topología de red para el campus.
  - Instalación y configuración de switches, routers y cableado estructurado.
  - Implementación de políticas de seguridad en red Cisco.

* Encargado de Logística de Rutas de Reparto | Hamburguesas MASS
  Período: 2024 - Presente (Tulancingo, Hidalgo)
  - Planificación óptima de trayectos utilizando grafos y optimización lógica.
  - Reducción del tiempo de entrega en un 25% y ahorro de combustible.
  - Evaluación continua del estado vial del municipio para la asignación de rutas.

* Trainee de Ventas e Inventarios | Tiendas 3B S.A. de C.V.
  Período: 01/2022 - 03/2024 (Tulancingo, Hidalgo)
  - Recepción de almacén y levantamiento de inventarios físicos semanales.
  - Control de mermas y auditorías de stock de alta velocidad.

FORMACIÓN ACADÉMICA
--------------------
* Licenciatura en Ingeniería en Sistemas Computacionales
  Universidad Politécnica de Tulancingo (2022 - 2025)
  Cédula Federal Registrada No. 15684082

CERTIFICACIONES OFICIALES
------------------------
1. Cisco CCNA - Introducción a Redes (Expedido: Noviembre 2024)
2. Programación en Python - Santander Open Academy (Expedido: Agosto 2025)
3. Curso de Comunicación y Perspectiva - BUAP (Aprovechamiento: 8.5, Agosto 2025)

=============================================================================
Documento generado de forma segura y firmado digitalmente por el portafolio en línea.
Tulancingo, Hidalgo. 2026.
=============================================================================`;

  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.setHeader("Content-Disposition", "attachment; filename=CV_Geovanni_Lemus_Diaz.txt");
  res.send(cvText);
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
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, HOST, () => {
    console.log(`[OK] Servidor activo en modo ${IS_PROD ? "PRODUCCIÓN" : "DESARROLLO"} en http://${HOST}:${PORT}`);
  });
}

startServer();
