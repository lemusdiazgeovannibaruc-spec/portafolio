import "dotenv/config";
import { Resend } from "resend";

// Interfaz para los datos del correo a enviar
interface SendEmailParams {
  name: string;
  email: string;
  message: string;
  ip?: string;
  userAgent?: string;
}

/**
 * Limpia y sanea de forma robusta las variables de entorno.
 * Elimina espacios en blanco y comillas simples o dobles externas accidentales (común en Render/dotenv).
 */
function cleanEnvValue(value: string | undefined): string {
  if (!value) return "";
  let cleaned = value.trim();
  if ((cleaned.startsWith('"') && cleaned.endsWith('"')) || (cleaned.startsWith("'") && cleaned.endsWith("'"))) {
    cleaned = cleaned.substring(1, cleaned.length - 1).trim();
  }
  return cleaned;
}

// Inicialización perezosa (Lazy Initialization) del cliente de Resend para evitar fallos si no hay API Key al inicio
let resendClientCache: Resend | null = null;

function getResendClient(): Resend {
  if (!resendClientCache) {
    const apiKey = cleanEnvValue(process.env.RESEND_API_KEY);
    if (!apiKey) {
      throw new Error("La variable de entorno RESEND_API_KEY no está configurada o es inválida.");
    }
    resendClientCache = new Resend(apiKey);
  }
  return resendClientCache;
}

/**
 * Envía los correos de contacto utilizando el servicio profesional de Resend:
 * 1. Envía una notificación por correo al Administrador (Geovanni Lemus).
 * 2. Envía un correo de confirmación automático (Auto-reply) al visitante.
 */
export async function sendContactEmails(params: SendEmailParams): Promise<{ success: boolean }> {
  try {
    const resend = getResendClient();
    
    const fromEmail = cleanEnvValue(process.env.EMAIL_FROM) || "onboarding@resend.dev";
    const toEmail = cleanEnvValue(process.env.EMAIL_TO) || "lemusdiazgeovannibaruc@gmail.com";
    
    const nowStr = new Date().toLocaleString("es-MX", { timeZone: "America/Mexico_City" }) + " (Hora de México)";

    // --- 1. CONFIGURACIÓN DEL CORREO DE NOTIFICACIÓN PARA EL ADMINISTRADOR ---
    const adminSubject = "Nuevo mensaje desde el Portafolio";
    const adminHtml = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); background-color: #ffffff;">
        <div style="background-color: #0f172a; padding: 28px; text-align: center;">
          <h1 style="color: #14b8a6; margin: 0; font-size: 22px; font-weight: 700;">📥 Nuevo Mensaje Recibido</h1>
          <p style="color: #94a3b8; margin: 6px 0 0 0; font-size: 14px;">Formulario de Contacto - Portafolio Profesional</p>
        </div>
        <div style="padding: 24px; color: #334155;">
          <h2 style="font-size: 16px; border-bottom: 2px solid #f1f5f9; padding-bottom: 8px; margin-top: 0; color: #0f172a; font-weight: 600;">Detalles del Mensaje</h2>
          <table style="width: 100%; border-collapse: collapse; font-size: 14px; margin-bottom: 20px;">
            <tr>
              <td style="padding: 8px 0; font-weight: 600; width: 140px; color: #475569;">Nombre:</td>
              <td style="padding: 8px 0; color: #0f172a;">${params.name}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: 600; color: #475569;">Correo del remitente:</td>
              <td style="padding: 8px 0; color: #0f172a;"><a href="mailto:${params.email}" style="color: #14b8a6; text-decoration: none; font-weight: 500;">${params.email}</a></td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: 600; color: #475569;">Asunto:</td>
              <td style="padding: 8px 0; color: #0f172a; font-weight: 500;">Nuevo mensaje desde el Portafolio</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: 600; color: #475569;">Fecha y Hora:</td>
              <td style="padding: 8px 0; color: #64748b;">${nowStr}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: 600; color: #475569;">Dirección IP:</td>
              <td style="padding: 8px 0; color: #64748b; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-size: 13px;">${params.ip || "No disponible"}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: 600; color: #475569;">Navegador:</td>
              <td style="padding: 8px 0; color: #64748b; font-size: 12px; line-height: 1.4;">${params.userAgent || "No disponible"}</td>
            </tr>
          </table>

          <h2 style="font-size: 16px; border-bottom: 2px solid #f1f5f9; padding-bottom: 8px; margin-top: 24px; color: #0f172a; font-weight: 600;">Contenido del Mensaje</h2>
          <div style="background-color: #f8fafc; padding: 18px; border-radius: 8px; font-size: 14px; line-height: 1.6; color: #0f172a; white-space: pre-wrap; border-left: 4px solid #14b8a6; margin-top: 10px;">${params.message}</div>
        </div>
        <div style="background-color: #f1f5f9; padding: 16px; text-align: center; font-size: 11px; color: #64748b; border-top: 1px solid #e2e8f0;">
          Servicio de Mensajería Profesional del Portafolio de Geovanni Lemus © 2026
        </div>
      </div>
    `;

    // --- 2. CONFIGURACIÓN DEL CORREO DE CONFIRMACIÓN AUTOMÁTICA (AUTO-REPLY) ---
    const userSubject = "Gracias por contactar a Geovanni Baruc Lemus Díaz";
    const userHtml = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); background-color: #ffffff;">
        <div style="background-color: #14b8a6; padding: 32px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 700; letter-spacing: -0.5px;">¡Mensaje Recibido!</h1>
          <p style="color: #ccfbf1; margin: 8px 0 0 0; font-size: 15px;">Gracias por tu interés en mi perfil profesional</p>
        </div>
        <div style="padding: 32px; color: #334155; line-height: 1.6;">
          <p style="font-size: 16px; margin-top: 0; color: #0f172a; font-weight: 600;">Hola ${params.name},</p>
          <p style="font-size: 14px;">He recibido de manera exitosa el mensaje que enviaste desde el formulario de contacto en mi portafolio profesional.</p>
          <p style="font-size: 14px;">Agradezco enormemente tu tiempo e interés en escribirme. Estaré revisando detenidamente los detalles de tu consulta y <strong>te responderé lo antes posible</strong> a esta misma dirección de correo electrónico.</p>
          
          <div style="background-color: #f0fdfa; border-left: 4px solid #14b8a6; padding: 18px; margin: 24px 0; border-radius: 6px;">
            <p style="margin: 0 0 8px 0; font-size: 13px; color: #0f766e; font-weight: bold;">Copia del mensaje recibido:</p>
            <p style="margin: 0; font-size: 13px; color: #334155; font-style: italic; white-space: pre-wrap;">"${params.message}"</p>
          </div>

          <p style="font-size: 14px; margin-bottom: 0;">Atentamente,</p>
          <p style="font-size: 15px; font-weight: bold; color: #0f172a; margin-top: 6px; margin-bottom: 0;">Ing. Geovanni Baruc Lemus Díaz</p>
          <p style="font-size: 13px; color: #64748b; margin-top: 2px;">Ingeniero en Sistemas Computacionales</p>
        </div>
        <div style="background-color: #f1f5f9; padding: 18px; text-align: center; font-size: 11px; color: #64748b; border-top: 1px solid #e2e8f0; line-height: 1.5;">
          Este correo ha sido generado y enviado de manera automática tras tu solicitud de contacto en geovannilemus.com.<br>
          Por favor, no respondas directamente a este mensaje automático.
        </div>
      </div>
    `;

    // 1. Enviar notificación al administrador
    const adminMailResponse = await resend.emails.send({
      from: fromEmail,
      to: toEmail,
      subject: adminSubject,
      html: adminHtml,
      replyTo: params.email,
    });

    if (adminMailResponse.error) {
      throw new Error(`Error de Resend al enviar notificación al admin: ${JSON.stringify(adminMailResponse.error)}`);
    }

    // 2. Enviar respuesta automática de confirmación al visitante
    try {
      const userMailResponse = await resend.emails.send({
        from: fromEmail,
        to: params.email,
        subject: userSubject,
        html: userHtml,
      });

      if (userMailResponse.error) {
        console.error("⚠️ Error menor al enviar confirmación automática al usuario:", JSON.stringify(userMailResponse.error));
      }
    } catch (userError: any) {
      // Registramos en el servidor pero no interrumpimos la respuesta exitosa al cliente
      console.error("⚠️ Falló el envío del correo de confirmación automática de Resend:", userError.message || userError);
    }

    console.log("✅ Correos de contacto enviados de forma exitosa usando Resend API.");
    return { success: true };
  } catch (error: any) {
    // Registramos los errores reales de forma segura únicamente en los logs del servidor
    console.error("❌ ERROR DE RESEND DETECTADO EN EL SERVIDOR:", error.message || error);
    throw error; // Lanzar para el middleware o try/catch superior
  }
}
