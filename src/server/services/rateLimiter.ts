import { Request, Response, NextFunction } from "express";

interface RateLimitInfo {
  count: number;
  resetTime: number;
}

// Almacén en memoria para registrar las peticiones por dirección IP
const ipRequestMap = new Map<string, RateLimitInfo>();

// Configuración del limitador de tasa (ajustable)
const WINDOW_MS = 15 * 60 * 1000; // Ventana de tiempo: 15 minutos
const MAX_REQUESTS = 3;            // Límite: Máximo 3 envíos de formulario por ventana

/**
 * Obtiene la dirección IP real del cliente considerando cabeceras de proxies o balanceadores de carga.
 */
export function getClientIp(req: Request): string {
  const forwardedFor = req.headers["x-forwarded-for"];
  if (forwardedFor) {
    const ips = typeof forwardedFor === "string" ? forwardedFor.split(",") : forwardedFor[0].split(",");
    return ips[0].trim();
  }
  return req.socket.remoteAddress || "127.0.0.1";
}

/**
 * Middleware de Express para limitar el envío de formularios de contacto por IP.
 * Si se supera el límite de peticiones configurado dentro de la ventana de tiempo,
 * se retorna una respuesta amigable, ocultando detalles técnicos.
 */
export function contactRateLimiter(req: Request, res: Response, next: NextFunction) {
  const ip = getClientIp(req);
  const now = Date.now();

  let ipInfo = ipRequestMap.get(ip);

  // Si no existe registro o la ventana anterior ya expiró, inicializamos un nuevo registro
  if (!ipInfo || now > ipInfo.resetTime) {
    ipInfo = {
      count: 0,
      resetTime: now + WINDOW_MS,
    };
    ipRequestMap.set(ip, ipInfo);
  }

  // Si el usuario ha superado el límite permitido de envíos
  if (ipInfo.count >= MAX_REQUESTS) {
    const remainingTimeMinutes = Math.ceil((ipInfo.resetTime - now) / (60 * 1000));
    
    // Registramos la alerta en el servidor (únicamente visible para el administrador en los logs)
    console.warn(`[SPAM DETECTADO] IP bloqueada temporalmente por Rate Limiting: ${ip}. Reintentos restantes en ${remainingTimeMinutes}m`);

    // Retornamos un mensaje de error limpio y amigable sin exponer información técnica interna
    return res.status(429).json({
      error: `Has enviado demasiados mensajes recientemente. Por motivos de seguridad, por favor espera ${remainingTimeMinutes} minuto(s) antes de intentarlo de nuevo.`,
    });
  }

  // Incrementamos el contador para esta IP
  ipInfo.count += 1;
  ipRequestMap.set(ip, ipInfo);

  next();
}

const cvRequestMap = new Map<string, RateLimitInfo>();
const CV_MAX_REQUESTS = 5; // Límite de 5 descargas por IP cada 15 minutos

/**
 * Middleware para limitar la generación y descarga de CV en PDF.
 */
export function cvRateLimiter(req: Request, res: Response, next: NextFunction) {
  const ip = getClientIp(req);
  const now = Date.now();

  let ipInfo = cvRequestMap.get(ip);

  if (!ipInfo || now > ipInfo.resetTime) {
    ipInfo = {
      count: 0,
      resetTime: now + WINDOW_MS,
    };
    cvRequestMap.set(ip, ipInfo);
  }

  if (ipInfo.count >= CV_MAX_REQUESTS) {
    const remainingTimeMinutes = Math.ceil((ipInfo.resetTime - now) / (60 * 1000));
    console.warn(`[CV LIMIT EXCEEDED] IP: ${ip} intentando descargar CV en exceso.`);
    return res.status(429).json({
      error: `Has superado el límite de descargas de CV temporales. Por favor, espera ${remainingTimeMinutes} minuto(s) para proteger la seguridad de los datos.`,
    });
  }

  ipInfo.count += 1;
  cvRequestMap.set(ip, ipInfo);
  next();
}

/**
 * Limpieza automática de la memoria de IPs expiradas para evitar fugas de memoria.
 */
setInterval(() => {
  const now = Date.now();
  for (const [ip, info] of ipRequestMap.entries()) {
    if (now > info.resetTime) {
      ipRequestMap.delete(ip);
    }
  }
  for (const [ip, info] of cvRequestMap.entries()) {
    if (now > info.resetTime) {
      cvRequestMap.delete(ip);
    }
  }
}, 300000); // Se ejecuta cada 5 minutos
