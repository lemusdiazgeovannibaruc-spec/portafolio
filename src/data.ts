export interface Job {
  id: string;
  role: string;
  company: string;
  location: string;
  period: string;
  description: string;
  tasks: string[];
  skillsApplied: string[];
}

export interface Education {
  id: string;
  degree: string;
  institution: string;
  location: string;
  period: string;
  details?: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  score?: string;
  details?: string;
  credentialId?: string;
  badgeType: 'cisco' | 'python' | 'buap';
}

export interface Skill {
  name: string;
  rating: number; // out of 5
  category: 'Redes' | 'Desarrollo' | 'Logística' | 'Hardware/Soporte';
}

export const personalInfo = {
  fullName: "Geovanni Baruc Lemus Díaz",
  title: "Ingeniero en Sistemas Computacionales",
  about: "¡Hola! Soy Ingeniero en Sistemas Computacionales apasionado por crear soluciones útiles que unan la tecnología con las necesidades de la vida diaria y el trabajo. Me enfoco principalmente en el diseño de redes de comunicación, la mejora de rutas de reparto para que las entregas sean más rápidas y el soporte a equipos tecnológicos. Me considero una persona práctica, con gusto por resolver problemas de forma organizada y siempre orientada a dar resultados eficientes.",
  email: "lemusdiazgeovannibaruc@gmail.com",
  phone: "Disponible bajo solicitud",
  location: "Tulancingo de Bravo, Hidalgo, México",
  postalCode: "",
  birthDate: "20 de diciembre de 1996",
  license: "Permiso de conducir C, B",
  languages: [
    { name: "Español", level: "Nativo" },
    { name: "Inglés", level: "Intermedio" }
  ],
  extracurriculars: [
    "Mantenimiento preventivo y correctivo de computadoras",
    "Diagnóstico y reparación de dispositivos móviles (smartphones y tablets)"
  ]
};

export const workExperience: Job[] = [
  {
    id: "exp1",
    role: "Diseñador de Red e Infraestructura",
    company: "Centro Universitario de Ciencias Ambientales",
    location: "Tulancingo, Hidalgo",
    period: "12/2024 - 05/2025",
    description: "Lideré la planificación e implementación de la topología de red del campus universitario, garantizando la conectividad óptima, seguridad y correcta configuración del hardware de red.",
    tasks: [
      "Diseño lógico y físico de la topología de red local del centro universitario.",
      "Instalación, montaje y configuración de hardware de red (Routers, Switches, Cableado Estructurado).",
      "Establecimiento de políticas de red y seguridad para usuarios académicos."
    ],
    skillsApplied: ["Topología de Red", "Configuración de Hardware", "Infraestructura de Red"]
  },
  {
    id: "exp2",
    role: "Encargado de Logística de Rutas de Reparto",
    company: "Hamburguesas MASS",
    location: "Tulancingo, Hidalgo",
    period: "2024 - Actualmente",
    description: "Responsable de optimizar y coordinar las rutas de reparto a domicilio de la cadena, disminuyendo tiempos de entrega y costos operativos mediante análisis de caminos.",
    tasks: [
      "Planificación y optimización de las rutas diarias de reparto.",
      "Evaluación y análisis de vialidades y tráfico para determinar el trayecto más eficiente.",
      "Supervisión del equipo de repartidores y control de tiempos de entrega."
    ],
    skillsApplied: ["Gestión de Rutas", "Optimización de Logística", "Evaluación de Caminos", "Resolución de Problemas"]
  },
  {
    id: "exp3",
    role: "Trainee de Ventas e Inventarios",
    company: "Tiendas 3B S.A. de C.V.",
    location: "Tulancingo, Hidalgo",
    period: "01/2022 - 03/2024",
    description: "Soporte operativo en el control de stock, recepción de mercancías del almacén y mantenimiento de registros precisos de inventario mediante auditorías cíclicas.",
    tasks: [
      "Recepción y control de calidad de mercancías entrantes al almacén.",
      "Levantamiento periódico de inventarios físicos y conciliación con el sistema digital.",
      "Atención al cliente y acomodo de mercancías basado en rotación de productos."
    ],
    skillsApplied: ["Control de Inventarios", "Atención al Cliente", "Resolución de Problemas"]
  }
];

export const educationHistory: Education[] = [
  {
    id: "edu1",
    degree: "Licenciatura en Ingeniería en Sistemas Computacionales",
    institution: "Universidad Politécnica de Tulancingo",
    location: "Tulancingo de Bravo, Hidalgo",
    period: "01/2022 - 04/2025",
    details: "Título electrónico emitido el 04 de marzo de 2026. Cédula Profesional Federal de Grado No. 15684082."
  }
];

export const certificationsList: Certification[] = [
  {
    id: "cert1",
    name: "CCNA: Introducción a las Redes",
    issuer: "Cisco Networking Academy / Universidad Politécnica de Tulancingo",
    date: "19 de noviembre de 2024",
    details: "Acreditación de conocimientos fundamentales de enrutamiento, conmutación, direccionamiento IP (IPv4/IPv6) y seguridad de red.",
    badgeType: "cisco"
  },
  {
    id: "cert2",
    name: "Curso de Programación en Python",
    issuer: "Santander Open Academy",
    date: "21 de agosto de 2025",
    details: "Curso de 8 horas divididas en 2 módulos con autoevaluación final. Número de serie: OA-2025-0821001623209.",
    badgeType: "python"
  },
  {
    id: "cert3",
    name: "Curso de Comunicación con Perspectiva de Género",
    issuer: "Secretaría de las Mujeres y Benemérita Universidad Autónoma de Puebla",
    date: "06 de agosto de 2025",
    score: "8.50 / 10.0",
    details: "Acreditación y aprovechamiento en comunicación inclusiva y equidad. Folio: AkFUq11DUd.",
    badgeType: "buap"
  }
];

export const competenciesList: Skill[] = [
  { name: "Topología de Red", rating: 4, category: "Redes" },
  { name: "Infraestructura de Red", rating: 4, category: "Redes" },
  { name: "Cisco Packet Tracer / CCNA", rating: 4, category: "Redes" },
  
  { name: "Desarrollo de Software", rating: 3, category: "Desarrollo" },
  { name: "Programación en Python", rating: 4, category: "Desarrollo" },
  { name: "React & TypeScript", rating: 3, category: "Desarrollo" },
  
  { name: "Optimización de Logística", rating: 4, category: "Logística" },
  { name: "Gestión de Rutas de Reparto", rating: 4, category: "Logística" },
  { name: "Evaluación de Caminos", rating: 5, category: "Logística" },
  
  { name: "Configuración de Hardware", rating: 4, category: "Hardware/Soporte" },
  { name: "Mantenimiento de Cómputo", rating: 4, category: "Hardware/Soporte" },
  { name: "Reparación de Celulares/Móviles", rating: 4, category: "Hardware/Soporte" },
];
