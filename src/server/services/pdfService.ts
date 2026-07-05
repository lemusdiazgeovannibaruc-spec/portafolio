import PDFDocument from 'pdfkit';
import { Writable } from 'stream';

interface PDFParams {
  name: string;
  company: string;
  position: string;
  email: string;
  reason: string;
  dateStr: string;
}

export function generateCVPDF(stream: Writable, params: PDFParams): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: 'LETTER',
        margins: { top: 40, bottom: 40, left: 45, right: 45 }
      });

      doc.pipe(stream);

      // Add dynamic watermark function
      const drawWatermark = () => {
        doc.save();
        doc.opacity(0.08);
        doc.fillColor("#0F62FE");
        doc.fontSize(10);
        doc.font("Helvetica-Bold");
        
        const watermarkText = `DESCARGADO POR: ${params.name.toUpperCase()} | EMPRESA: ${params.company.toUpperCase()} | CARGO: ${params.position.toUpperCase()} | FECHA: ${params.dateStr}`;
        
        // Draw 3 diagonal lines of watermark to cover the page securely
        for (let yOffset = -200; yOffset <= 200; yOffset += 200) {
          doc.save();
          doc.translate(306, 396 + yOffset);
          doc.rotate(-35);
          doc.text(watermarkText, -400, 0, { align: 'center', width: 800 });
          doc.restore();
        }
        doc.restore();
      };

      // Draw watermark on first page
      drawWatermark();

      // --- HEADER ---
      doc.fillColor("#111111");
      doc.font("Helvetica-Bold").fontSize(26);
      doc.text("Geovanni Baruc Lemus Díaz", { characterSpacing: 0.5 });
      
      doc.font("Helvetica").fontSize(12).fillColor("#0F62FE");
      doc.text("INGENIERO EN SISTEMAS COMPUTACIONALES", { characterSpacing: 1, paragraphGap: 15 });

      // Horizontal separator line
      doc.strokeColor("#E5E5E5").lineWidth(1).moveTo(45, doc.y).lineTo(567, doc.y).stroke();
      doc.y += 15;

      // Contact & Professional Registry Grid
      const colWidth = 170;
      const startY = doc.y;

      // Column 1
      doc.font("Helvetica-Bold").fontSize(9).fillColor("#666666").text("CONTACTO", 45, startY);
      doc.font("Helvetica").fontSize(9).fillColor("#111111");
      doc.text("lemusdiazgeovannibaruc@gmail.com", { paragraphGap: 3 });
      doc.text("Hidalgo, México", { paragraphGap: 3 });
      doc.text("Licencias: Tipo C, B", { paragraphGap: 3 });

      // Column 2
      doc.font("Helvetica-Bold").fontSize(9).fillColor("#666666").text("REGISTRO FEDERAL", 45 + colWidth, startY);
      doc.font("Helvetica").fontSize(9).fillColor("#111111");
      doc.text("Cédula Federal: 1568••••", { paragraphGap: 3 });
      doc.text("Folio de Título: 1315••••••••5889", { paragraphGap: 3 });
      doc.text("Emisión Federal: 04 de marzo de 2026", { paragraphGap: 3 });

      // Column 3
      doc.font("Helvetica-Bold").fontSize(9).fillColor("#666666").text("ID DE DESCARGA", 45 + colWidth * 2, startY);
      doc.font("Helvetica").fontSize(9).fillColor("#111111");
      doc.text(`Solicitante: ${params.name}`, { paragraphGap: 3 });
      doc.text(`Empresa: ${params.company}`, { paragraphGap: 3 });
      doc.text(`Licencia temporal certificada`, { paragraphGap: 3 });

      doc.y = startY + 55;
      doc.strokeColor("#E5E5E5").lineWidth(1).moveTo(45, doc.y).lineTo(567, doc.y).stroke();
      doc.y += 15;

      // --- PERFIL PROFESIONAL ---
      doc.font("Helvetica-Bold").fontSize(11).fillColor("#0F62FE").text("PERFIL PROFESIONAL", 45, doc.y, { paragraphGap: 6 });
      doc.font("Helvetica").fontSize(9.5).fillColor("#333333").text(
        "Ingeniero en Sistemas Computacionales con un enfoque analítico y estructurado en la resolución de problemas lógicos y de infraestructura. Certificado por Cisco en redes (CCNA) y especializado en el desarrollo de software seguro, la optimización de rutas de distribución de alta velocidad y el soporte avanzado de hardware. Orientado a la eficiencia operativa y al liderazgo técnico en entornos empresariales complejos.",
        { align: "justify", paragraphGap: 15, width: 522 }
      );

      // --- SERVICIOS PROFESIONALES DESTACADOS ---
      doc.font("Helvetica-Bold").fontSize(11).fillColor("#0F62FE").text("SERVICIOS PROFESIONALES DESTACADOS", 45, doc.y, { paragraphGap: 8 });
      const services = [
        "Mantenimiento preventivo, correctivo y diagnóstico avanzado de hardware de cómputo y laptops.",
        "Optimización de sistemas operativos (Windows 10/11 y distribuciones Linux) y eliminación de malware.",
        "Diseño e instalación de redes básicas, cableado estructurado, repetidores y switches.",
        "Desarrollo de software y aplicaciones web empresariales robustas y seguras."
      ];
      services.forEach(serv => {
        doc.font("Helvetica-Bold").fontSize(9).fillColor("#0F62FE").text("• ", 55, doc.y, { continued: true });
        doc.font("Helvetica").fontSize(9).fillColor("#333333").text(serv, { paragraphGap: 4, width: 500 });
      });
      doc.y += 10;

      // --- EXPERIENCIA LABORAL ---
      doc.font("Helvetica-Bold").fontSize(11).fillColor("#0F62FE").text("TRAYECTORIA LABORAL", 45, doc.y, { paragraphGap: 10 });

      // Job 1
      doc.font("Helvetica-Bold").fontSize(10).fillColor("#111111").text("Diseñador de Red e Infraestructura", 45, doc.y, { continued: true });
      doc.font("Helvetica").fontSize(9).fillColor("#666666").text("  |  12/2024 - 05/2025", { paragraphGap: 2 });
      doc.font("Helvetica-Oblique").fontSize(9).fillColor("#0F62FE").text("Centro Universitario de Ciencias Ambientales (Hidalgo, México)", { paragraphGap: 4 });
      doc.font("Helvetica").fontSize(9).fillColor("#333333").text(
        "Responsable del diseño lógico y físico de la topología de red del campus. Instalación de switches, routers y cableado estructurado bajo estándares Cisco, garantizando alta disponibilidad y seguridad en la red local.",
        { width: 522, paragraphGap: 8 }
      );

      // Job 2
      doc.font("Helvetica-Bold").fontSize(10).fillColor("#111111").text("Encargado de Logística de Rutas de Reparto", 45, doc.y, { continued: true });
      doc.font("Helvetica").fontSize(9).fillColor("#666666").text("  |  2024 - Presente", { paragraphGap: 2 });
      doc.font("Helvetica-Oblique").fontSize(9).fillColor("#0F62FE").text("Hamburguesas MASS (Tulancingo, Hidalgo)", { paragraphGap: 4 });
      doc.font("Helvetica").fontSize(9).fillColor("#333333").text(
        "Planificación y optimización de trayectos de reparto mediante modelado de grafos y algoritmos lógicos, logrando reducir los tiempos promedio de entrega en un 25% y disminuyendo costos de combustible.",
        { width: 522, paragraphGap: 8 }
      );

      // Job 3
      doc.font("Helvetica-Bold").fontSize(10).fillColor("#111111").text("Trainee de Ventas e Inventarios", 45, doc.y, { continued: true });
      doc.font("Helvetica").fontSize(9).fillColor("#666666").text("  |  01/2022 - 03/2024", { paragraphGap: 2 });
      doc.font("Helvetica-Oblique").fontSize(9).fillColor("#0F62FE").text("Tiendas 3B S.A. de C.V. (Tulancingo, Hidalgo)", { paragraphGap: 4 });
      doc.font("Helvetica").fontSize(9).fillColor("#333333").text(
        "Recepción de mercancías en almacén, control y mitigación de mermas, y levantamiento semanal acelerado de inventarios físicos en tienda.",
        { width: 522, paragraphGap: 15 }
      );

      // --- EDUCACIÓN Y CERTIFICACIONES ---
      doc.font("Helvetica-Bold").fontSize(11).fillColor("#0F62FE").text("FORMACIÓN ACADÉMICA Y CERTIFICACIONES", 45, doc.y, { paragraphGap: 10 });
      
      const eduCertColWidth = 250;
      const startY2 = doc.y;

      // Col 1: Educación
      doc.font("Helvetica-Bold").fontSize(9.5).fillColor("#111111").text("Ingeniería en Sistemas Computacionales", 45, startY2, { paragraphGap: 2 });
      doc.font("Helvetica").fontSize(9).fillColor("#666666").text("Universidad Politécnica de Tulancingo", { paragraphGap: 1 });
      doc.font("Helvetica-Oblique").fontSize(8.5).text("Egresado en 2025  |  Hidalgo, México", { paragraphGap: 15 });

      // Col 2: Certificaciones
      doc.font("Helvetica-Bold").fontSize(9.5).fillColor("#111111").text("Certificaciones Oficiales", 45 + eduCertColWidth, startY2, { paragraphGap: 4 });
      const certs = [
        "Cisco CCNA - Introducción a Redes (Nov 2024)",
        "Programación en Python - Santander Academy (Ago 2025)",
        "Curso de Comunicación y Perspectiva - BUAP (Ago 2025)"
      ];
      certs.forEach(cert => {
        doc.font("Helvetica").fontSize(8.5).fillColor("#333333").text(`• ${cert}`, 45 + eduCertColWidth, doc.y, { paragraphGap: 3 });
      });

      // --- FOOTER ---
      doc.y = 740;
      doc.strokeColor("#E5E5E5").lineWidth(0.5).moveTo(45, doc.y).lineTo(567, doc.y).stroke();
      doc.y += 8;
      doc.font("Helvetica-Oblique").fontSize(8).fillColor("#999999").text(
        "Documento emitido electrónicamente con marca de agua dinámica y firma del servidor. Tulancingo, Hidalgo, México. © 2026",
        45, doc.y, { align: "center", width: 522 }
      );

      doc.end();
      resolve();
    } catch (e) {
      reject(e);
    }
  });
}
