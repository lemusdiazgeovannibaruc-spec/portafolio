import nodemailer from "nodemailer";

// Interfaz para la configuración del correo
interface EmailConfig {
  host: string;
  port: number;
  user: string;
  pass: string;
  from: string;
  to: string;
}

// Interfaz para los datos del correo a enviar
interface SendEmailParams {
  name: string;
  email: string;
  message: string;
  ip?: string;
  userAgent?: string;
}

// Variables en caché para el transportador de correo
let transporterCache: nodemailer.Transporter | null = null;
let activeConfig: EmailConfig | null = null;

/**
 * Obtiene o crea la configuración del servicio de correo.
 * Si faltan variables de entorno, intentará crear una cuenta de prueba de Ethereal de forma dinámica.
 */
async function getEmailConfig(): Promise<EmailConfig> {
  const host = process.env.EMAIL_HOST || "";
  const port = parseInt(process.env.EMAIL_PORT || "587", 10);
  const user = process.env.EMAIL_USER || "";
  const pass = process.env.EMAIL_PASS || "";
  const from = process.env.EMAIL_FROM || "onboarding@resend.dev";
  const to = process.env.EMAIL_TO || "lemusdiazgeovannibaruc@gmail.com";

  // Si tenemos credenciales configuradas en el entorno, las usamos directamente
  if (host && user && pass) {
    return { host, port, user, pass, from, to };
  }

  // De lo contrario, creamos un transportador de pruebas automático (Ethereal Email) para desarrollo
  console.log("⚠️ EMAIL_HOST, EMAIL_USER o EMAIL_PASS no están configurados en .env.");
  console.log("🔧 Creando cuenta de correo de prueba temporal de Ethereal...");
  
  try {
    const testAccount = await nodemailer.createTestAccount();
    return {
      host: testAccount.smtp.host,
      port: testAccount.smtp.port,
      user: testAccount.user,
      pass: testAccount.pass,
      from: `Portafolio Geovanni <${testAccount.user}>`,
      to: to || "lemusdiazgeovannibaruc@gmail.com",
    };
  } catch (error) {
    console.error("❌ Error al crear cuenta de prueba Ethereal:", error);
    // Retornamos valores vacíos como último recurso
    return { host, port, user, pass, from, to };
  }
}

/**
 * Obtiene el transportador de correo de forma perezosa (Lazy Initialization)
 */
async function getTransporter(): Promise<{ transporter: nodemailer.Transporter; config: EmailConfig }> {
  const config = await getEmailConfig();
  
  // Si la configuración ha cambiado o no está en caché, creamos un nuevo transportador
  if (!transporterCache || JSON.stringify(activeConfig) !== JSON.stringify(config)) {
    activeConfig = config;
    
    // Verificar si las credenciales son válidas antes de crear el transportador
    if (!config.host || !config.user || !config.pass) {
      throw new Error("No hay credenciales de correo válidas para inicializar el servicio de email.");
    }

    transporterCache = nodemailer.createTransport({
      host: config.host,
      port: Number(config.port),
      secure: false, // STARTTLS recomendado para puerto 587
      auth: {
        user: config.user,
        pass: config.pass,
      },
      tls: {
        // No fallar con certificados auto-firmados en ciertos entornos de correo corporativos y asegurar STARTTLS
        rejectUnauthorized: false,
      },
    });

    // Probar conexión de forma asíncrona y no bloqueante
    transporterCache.verify((error) => {
      if (error) {
        console.error("❌ Falló la verificación de conexión SMTP:", error.message);
      } else {
        console.log(`✅ Conexión SMTP verificada con éxito hacia ${config.host}:${config.port}`);
      }
    });
  }

  return { transporter: transporterCache, config };
}

/**
 * Envía los correos de contacto de forma asíncrona:
 * 1. Correo de notificación con todos los detalles al administrador (Geovanni Lemus).
 * 2. Correo de respuesta automática al usuario que envió el formulario.
 */
export async function sendContactEmails(params: SendEmailParams): Promise<{ success: boolean; previewUrl?: string }> {
  try {
    const { transporter, config } = await getTransporter();
    const nowStr = new Date().toLocaleString("es-MX", { timeZone: "America/Mexico_City" }) + " (Hora de México)";

    // --- 1. CONFIGURACIÓN DEL CORREO PARA EL ADMINISTRADOR ---
    const adminSubject = `📥 Nuevo mensaje de contacto de: ${params.name}`;
    const adminHtml = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);">
        <div style="background-color: #0f172a; padding: 24px; text-align: center;">
          <h1 style="color: #14b8a6; margin: 0; font-size: 20px;">Nuevo Mensaje Recibido</h1>
          <p style="color: #94a3b8; margin: 4px 0 0 0; font-size: 14px;">Portafolio Profesional de Geovanni Lemus</p>
        </div>
        <div style="padding: 24px; background-color: #ffffff; color: #334155;">
          <h2 style="font-size: 16px; border-bottom: 2px solid #f1f5f9; padding-bottom: 8px; margin-top: 0;">Detalles del Remitente</h2>
          <table style="width: 100%; border-collapse: collapse; font-size: 14px; margin-bottom: 20px;">
            <tr>
              <td style="padding: 6px 0; font-weight: bold; width: 130px;">Nombre:</td>
              <td style="padding: 6px 0; color: #0f172a;">${params.name}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; font-weight: bold;">Correo:</td>
              <td style="padding: 6px 0; color: #0f172a;"><a href="mailto:${params.email}" style="color: #14b8a6; text-decoration: none;">${params.email}</a></td>
            </tr>
            <tr>
              <td style="padding: 6px 0; font-weight: bold;">Fecha y Hora:</td>
              <td style="padding: 6px 0; color: #64748b;">${nowStr}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; font-weight: bold;">Dirección IP:</td>
              <td style="padding: 6px 0; color: #64748b; font-family: monospace;">${params.ip || "No detectada"}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; font-weight: bold;">Navegador:</td>
              <td style="padding: 6px 0; color: #64748b; font-size: 12px;">${params.userAgent || "No detectado"}</td>
            </tr>
          </table>

          <h2 style="font-size: 16px; border-bottom: 2px solid #f1f5f9; padding-bottom: 8px; margin-top: 24px;">Contenido del Mensaje</h2>
          <div style="background-color: #f8fafc; padding: 16px; border-radius: 6px; font-size: 14px; line-height: 1.6; color: #0f172a; white-space: pre-wrap; border-left: 4px solid #14b8a6;">${params.message}</div>
        </div>
        <div style="background-color: #f1f5f9; padding: 16px; text-align: center; font-size: 11px; color: #64748b; border-top: 1px solid #e2e8f0;">
          Servicio de Mensajería Seguro del Portafolio de Geovanni Lemus © 2026
        </div>
      </div>
    `;

    // --- 2. CONFIGURACIÓN DEL CORREO DE CONFIRMACIÓN AUTOMÁTICA (AUTO-REPLY) ---
    const userSubject = `✉️ Gracias por ponerte en contacto, ${params.name}`;
    const userHtml = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);">
        <div style="background-color: #14b8a6; padding: 32px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 24px; letter-spacing: -0.5px;">¡Mensaje Recibido con Éxito!</h1>
          <p style="color: #ccfbf1; margin: 8px 0 0 0; font-size: 15px;">Gracias por tu interés en mi perfil profesional</p>
        </div>
        <div style="padding: 32px; background-color: #ffffff; color: #334155; line-height: 1.6;">
          <p style="font-size: 16px; margin-top: 0; color: #0f172a;">Hola <strong>${params.name}</strong>,</p>
          <p style="font-size: 14px;">He recibido correctamente tu mensaje enviado desde mi portafolio profesional en línea.</p>
          <p style="font-size: 14px;">Quiero agradecerte el tiempo dedicado a escribirme. Revisaré detalladamente la información que me has proporcionado y <strong>te responderé lo antes posible</strong> a esta dirección de correo (<a href="mailto:${params.email}" style="color: #14b8a6; text-decoration: none;">${params.email}</a>).</p>
          
          <div style="background-color: #f0fdfa; border-left: 4px solid #14b8a6; padding: 16px; margin: 24px 0; border-radius: 0 6px 6px 0;">
            <p style="margin: 0; font-size: 13px; color: #0f766e; font-weight: bold;">Copia de tu mensaje enviado:</p>
            <p style="margin: 8px 0 0 0; font-size: 13px; color: #334155; font-style: italic; white-space: pre-wrap;">"${params.message}"</p>
          </div>

          <p style="font-size: 14px; margin-bottom: 0;">Atentamente,</p>
          <p style="font-size: 15px; font-weight: bold; color: #0f172a; margin-top: 4px; margin-bottom: 0;">Ing. Geovanni Baruc Lemus Díaz</p>
          <p style="font-size: 13px; color: #64748b; margin-top: 2px;">Ingeniero en Sistemas Computacionales</p>
        </div>
        <div style="background-color: #f1f5f9; padding: 16px; text-align: center; font-size: 11px; color: #64748b; border-top: 1px solid #e2e8f0;">
          Has recibido este correo de forma automática porque enviaste un formulario en geovannilemus.com.<br>
          Por favor, no respondas directamente a este correo automático.
        </div>
      </div>
    `;

    // Enviar correo al administrador
    const adminMailInfo = await transporter.sendMail({
      from: config.from,
      to: config.to,
      replyTo: params.email,
      subject: adminSubject,
      html: adminHtml,
    });

    // Enviar respuesta automática de confirmación al visitante
    let userMailInfo;
    try {
      userMailInfo = await transporter.sendMail({
        from: config.from,
        to: params.email,
        subject: userSubject,
        html: userHtml,
      });
    } catch (userMailError: any) {
      // Si falla la confirmación al visitante, registramos el error pero no bloqueamos la respuesta al cliente
      console.error("⚠️ No se pudo enviar el correo de confirmación al usuario:", userMailError.message || userMailError);
    }

    // Obtener enlace de vista previa para cuentas de Ethereal Email de prueba
    let previewUrl: string | undefined;
    if (config.host.includes("ethereal.email")) {
      previewUrl = nodemailer.getTestMessageUrl(adminMailInfo) || undefined;
      console.log("---------------------------------------------------------");
      console.log("📬 CORREO DE PRUEBA ENVIADO (Ethereal Email Mode)");
      console.log("🔗 Ver correo de notificación en:");
      console.log(`   ${previewUrl}`);
      if (userMailInfo) {
        console.log(`🔗 Ver correo de auto-respuesta en:`);
        console.log(`   ${nodemailer.getTestMessageUrl(userMailInfo)}`);
      }
      console.log("---------------------------------------------------------");
    }

    return { success: true, previewUrl };
  } catch (error: any) {
    // Registramos el error de forma segura únicamente en el servidor
    console.error("❌ ERROR CRÍTICO EN EL SERVICIO DE CORREO:", error.message || error);
    throw error; // Propagar para manejo de errores centralizado
  }
}
