package com.portfolio.controller;

import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Controlador REST encargado de generar y transmitir el archivo imprimible de CV.
 * Configurado con cabeceras de respuesta que indican al navegador forzar la descarga de forma segura.
 */
@RestController
@CrossOrigin(origins = "*")
public class CvController {

    @GetMapping("/api/download-cv")
    public ResponseEntity<byte[]> downloadCv() {
        String cvText = "=============================================================================\n" +
                "PORTAFOLIO PROFESIONAL Y CURRICULUM VITAE - ING. GEOVANNI BARUC LEMUS DÍAZ\n" +
                "=============================================================================\n\n" +
                "DATOS GENERALES\n" +
                "-----------------\n" +
                "Nombre: Geovanni Baruc Lemus Díaz\n" +
                "Título: Ingeniero en Sistemas Computacionales\n" +
                "Ubicación: Tulancingo de Bravo, Hidalgo, México\n" +
                "Cédula Federal: No. 15684082 (Emitido en 2026)\n" +
                "Contacto: lemusdiazgeovannibaruc@gmail.com\n" +
                "Teléfono: Disponible bajo solicitud escrita\n" +
                "Licencia de conducir: Tipo C, B\n\n" +
                "PERFIL PROFESIONAL\n" +
                "-----------------\n" +
                "Ingeniero en Sistemas Computacionales apasionado por crear soluciones útiles que unan\n" +
                "la tecnología con las necesidades de la vida diaria y el trabajo. Me enfoco principalmente\n" +
                "en el diseño de redes de comunicación, la mejora de rutas de reparto para entregas rápidas,\n" +
                "el soporte avanzado de hardware, y el desarrollo de software seguro y modular. Me considero\n" +
                "una persona práctica, organizada y orientada a dar resultados eficientes.\n\n" +
                "SERVICIOS PROFESIONALES DESTACADOS\n" +
                "----------------------------------\n" +
                "1. Mantenimiento Preventivo de Computadoras (limpieza física profunda, pasta térmica).\n" +
                "2. Mantenimiento Correctivo de Computadoras (diagnóstico de componentes, refacciones).\n" +
                "3. Diagnóstico de fallas de hardware (memoria RAM, procesador, fuente, almacenamiento).\n" +
                "4. Reparación de laptops y equipos de escritorio (pantallas, teclados, bisagras).\n" +
                "5. Optimización y limpieza de sistemas (desinfección de malware, aceleración de Windows/Linux).\n" +
                "6. Instalación y configuración de Sistemas Operativos (Windows 10/11, distribuciones de Linux).\n" +
                "7. Instalación de software y utilidades bajo licencia autorizada.\n" +
                "8. Respaldo y recuperación segura de información de unidades de almacenamiento.\n" +
                "9. Configuración de redes básicas (cableado estructurado, repetidores Wi-Fi, switches).\n" +
                "10. Asesoría tecnológica para selección de hardware adecuado al presupuesto.\n" +
                "11. Desarrollo de software y aplicaciones web empresariales.\n\n" +
                "EXPERIENCIA LABORAL\n" +
                "-------------------\n" +
                "* Diseñador de Red e Infraestructura | Centro Universitario de Ciencias Ambientales\n" +
                "  Período: 12/2024 - 05/2025 (Hidalgo, México)\n" +
                "  - Diseño lógico y físico de la topología de red para el campus.\n" +
                "  - Instalación y configuración de switches, routers y cableado estructurado.\n" +
                "  - Implementación de políticas de seguridad en red Cisco.\n\n" +
                "* Encargado de Logística de Rutas de Reparto | Hamburguesas MASS\n" +
                "  Período: 2024 - Presente (Tulancingo, Hidalgo)\n" +
                "  - Planificación óptima de trayectos utilizando grafos y optimización lógica.\n" +
                "  - Reducción del tiempo de entrega en un 25% y ahorro de combustible.\n" +
                "  - Evaluación continua del estado vial del municipio para la asignación de rutas.\n\n" +
                "* Trainee de Ventas e Inventarios | Tiendas 3B S.A. de C.V.\n" +
                "  Período: 01/2022 - 03/2024 (Tulancingo, Hidalgo)\n" +
                "  - Recepción de almacén y levantamiento de inventarios físicos semanales.\n" +
                "  - Control de mermas y auditorías de stock de alta velocidad.\n\n" +
                "FORMACIÓN ACADÉMICA\n" +
                "--------------------\n" +
                "* Licenciatura en Ingeniería en Sistemas Computacionales\n" +
                "  Universidad Politécnica de Tulancingo (2022 - 2025)\n" +
                "  Cédula Federal Registrada No. 15684082\n\n" +
                "CERTIFICACIONES OFICIALES\n" +
                "------------------------\n" +
                "1. Cisco CCNA - Introducción a Redes (Expedido: Noviembre 2024)\n" +
                "2. Programación en Python - Santander Open Academy (Expedido: Agosto 2025)\n" +
                "3. Curso de Comunicación y Perspectiva - BUAP (Aprovechamiento: 8.5, Agosto 2025)\n\n" +
                "=============================================================================\n" +
                "Documento generado de forma segura y firmado digitalmente por el portafolio en línea.\n" +
                "Tulancingo, Hidalgo. 2026.\n" +
                "=============================================================================";

        byte[] cvBytes = cvText.getBytes(java.nio.charset.StandardCharsets.UTF_8);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=CV_Geovanni_Lemus_Diaz.txt")
                .contentType(MediaType.TEXT_PLAIN)
                .contentLength(cvBytes.length)
                .body(cvBytes);
    }
}
