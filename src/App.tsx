import React, { useState, useEffect } from 'react';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Award, 
  BookOpen, 
  Briefcase, 
  Code, 
  Network, 
  Navigation, 
  Package, 
  Menu, 
  X, 
  Check, 
  ChevronRight, 
  Star, 
  ArrowRight, 
  ExternalLink, 
  ShieldCheck, 
  Heart, 
  Wrench,
  Github,
  Send,
  MessageSquare,
  Clock,
  Car,
  Cpu,
  HardDrive,
  Laptop,
  Monitor,
  RefreshCw,
  Wifi,
  Info,
  ShieldAlert,
  Database,
  Download
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  personalInfo, 
  workExperience, 
  educationHistory, 
  certificationsList, 
  competenciesList 
} from './data';
import NetworkSimulator from './components/NetworkSimulator';
import RouteOptimizer from './components/RouteOptimizer';
import InventorySimulator from './components/InventorySimulator';

export default function App() {
  const [activeTab, setActiveTab] = useState<'network' | 'routes' | 'inventory'>('network');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Estado para el formulario de contacto con mitigación de spam
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [honeypot, setHoneypot] = useState('');
  
  // Estado para el desafío matemático anti-bot generado en el backend
  const [challengeId, setChallengeId] = useState('');
  const [challengeQuestion, setChallengeQuestion] = useState('Cargando verificación...');
  const [challengeAnswer, setChallengeAnswer] = useState('');
  
  // Estado para rastrear el progreso y resultado del envío seguro del formulario
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Solicita un nuevo reto matemático de seguridad al servidor backend
  const fetchChallenge = async () => {
    try {
      const res = await fetch('/api/security-challenge');
      if (res.ok) {
        const data = await res.json();
        setChallengeId(data.id);
        setChallengeQuestion(data.question);
        setChallengeAnswer('');
      }
    } catch (e) {
      setChallengeQuestion('Error al conectar con el servidor de seguridad.');
    }
  };

  useEffect(() => {
    fetchChallenge();
  }, []);

  // Procesa el envío del formulario sanitizándolo y resolviendo el reto en el backend
  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    // Validación preventiva en el cliente
    if (!contactName.trim() || !contactEmail.trim() || !contactMessage.trim() || !challengeAnswer.trim()) {
      setSubmitError('Por favor completa todos los campos del formulario.');
      return;
    }

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: contactName,
          email: contactEmail,
          message: contactMessage,
          challengeId,
          challengeAnswer,
          honeypot,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setSubmitError(result.error || 'Ocurrió un error al enviar el mensaje.');
        fetchChallenge(); // Refrescar el reto en caso de fallo
        return;
      }

      setFormSubmitted(true);
      setContactName('');
      setContactEmail('');
      setContactMessage('');
      setChallengeAnswer('');
      
      // Solicitar nuevo reto matemático tras el envío exitoso
      fetchChallenge();

      setTimeout(() => {
        setFormSubmitted(false);
      }, 5000);
    } catch (error) {
      setSubmitError('Error de red. No se pudo contactar al servidor seguro.');
    }
  };

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-teal-500 selection:text-slate-950">
      
      {/* Floating Header Navigation */}
      <header className="sticky top-0 z-50 bg-slate-950/85 backdrop-blur-md border-b border-slate-900 px-4 py-3 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-teal-500 via-emerald-600 to-amber-500 p-[1.5px] flex items-center justify-center shadow-lg shadow-teal-500/10">
              <div className="w-full h-full bg-slate-900 rounded-full flex items-center justify-center">
                <span className="font-display font-bold text-teal-400 text-sm">GL</span>
              </div>
            </div>
            <div>
              <span className="font-display font-bold text-sm tracking-wide text-slate-100 block">{personalInfo.fullName}</span>
              <span className="text-[10px] font-mono text-teal-400 tracking-wider uppercase">Ing. en Sistemas Computacionales</span>
            </div>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-5 text-xs font-medium tracking-wide">
            <button onClick={() => scrollToSection('inicio')} className="text-slate-400 hover:text-teal-400 transition-colors cursor-pointer">Inicio</button>
            <button onClick={() => scrollToSection('sobre-mi')} className="text-slate-400 hover:text-teal-400 transition-colors cursor-pointer">Sobre mí</button>
            <button onClick={() => scrollToSection('competencias')} className="text-slate-400 hover:text-teal-400 transition-colors cursor-pointer">Competencias</button>
            <button onClick={() => scrollToSection('tecnologias')} className="text-slate-400 hover:text-teal-400 transition-colors cursor-pointer">Tecnologías</button>
            <button onClick={() => scrollToSection('servicios')} className="text-slate-400 hover:text-teal-400 transition-colors cursor-pointer">Servicios</button>
            <button onClick={() => scrollToSection('experiencia')} className="text-slate-400 hover:text-teal-400 transition-colors cursor-pointer">Educación</button>
            <button onClick={() => scrollToSection('certificaciones')} className="text-slate-400 hover:text-teal-400 transition-colors cursor-pointer">Certificaciones</button>
            <button onClick={() => scrollToSection('proyectos-interactivos')} className="text-slate-400 hover:text-teal-400 transition-colors cursor-pointer">Simuladores</button>
          </nav>

          <div className="hidden lg:block">
            <button 
              onClick={() => scrollToSection('contacto')}
              className="px-4 py-2 bg-gradient-to-r from-teal-500 to-emerald-600 text-slate-950 font-bold text-xs rounded-full hover:shadow-lg hover:shadow-teal-500/10 transition-all cursor-pointer"
            >
              Contacto
            </button>
          </div>

          {/* Mobile hamburger button */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
            className="lg:hidden p-2 text-slate-400 hover:text-teal-400 transition-colors cursor-pointer focus:outline-none"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile menu panel */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-slate-950 border-t border-slate-900 mt-2 overflow-hidden"
            >
              <div className="py-4 px-2 flex flex-col gap-3 text-sm font-medium">
                <button onClick={() => scrollToSection('inicio')} className="text-left py-2 px-3 hover:bg-slate-900 rounded-lg text-slate-300 hover:text-teal-400 transition-all">Inicio</button>
                <button onClick={() => scrollToSection('sobre-mi')} className="text-left py-2 px-3 hover:bg-slate-900 rounded-lg text-slate-300 hover:text-teal-400 transition-all">Sobre mí</button>
                <button onClick={() => scrollToSection('competencias')} className="text-left py-2 px-3 hover:bg-slate-900 rounded-lg text-slate-300 hover:text-teal-400 transition-all">Competencias</button>
                <button onClick={() => scrollToSection('tecnologias')} className="text-left py-2 px-3 hover:bg-slate-900 rounded-lg text-slate-300 hover:text-teal-400 transition-all">Tecnologías</button>
                <button onClick={() => scrollToSection('servicios')} className="text-left py-2 px-3 hover:bg-slate-900 rounded-lg text-slate-300 hover:text-teal-400 transition-all">Servicios</button>
                <button onClick={() => scrollToSection('experiencia')} className="text-left py-2 px-3 hover:bg-slate-900 rounded-lg text-slate-300 hover:text-teal-400 transition-all">Educación</button>
                <button onClick={() => scrollToSection('certificaciones')} className="text-left py-2 px-3 hover:bg-slate-900 rounded-lg text-slate-300 hover:text-teal-400 transition-all">Certificaciones</button>
                <button onClick={() => scrollToSection('proyectos-interactivos')} className="text-left py-2 px-3 hover:bg-slate-900 rounded-lg text-slate-300 hover:text-teal-400 transition-all">Simuladores</button>
                <button 
                  onClick={() => scrollToSection('contacto')}
                  className="mt-2 w-full text-center py-2.5 bg-gradient-to-r from-teal-500 to-emerald-600 text-slate-950 font-bold rounded-lg"
                >
                  Contacto Directo
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Hero Section */}
      <section id="inicio" className="relative min-h-[85vh] flex items-center justify-center overflow-hidden py-12 px-4 sm:px-6 lg:px-8">
        
        {/* Ambient background decoration */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-teal-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl animate-pulse delay-700"></div>
          <div className="absolute top-1/3 right-10 w-60 h-60 bg-amber-500/5 rounded-full blur-3xl"></div>
          
          {/* Technical Grid Accent overlay */}
          <div className="absolute inset-0 opacity-[0.02] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs font-mono text-teal-400 mb-6"
          >
            <ShieldCheck className="w-4 h-4 text-teal-400 animate-pulse" />
            <span>Ingeniero en Sistemas Computacionales • Cédula Federal No. 15684082</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="font-display text-4xl sm:text-6xl font-bold tracking-tight text-white mb-6"
          >
            Geovanni Baruc <br />
            <span className="bg-gradient-to-r from-teal-400 via-emerald-400 to-amber-400 bg-clip-text text-transparent">
              Lemus Díaz
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed font-sans mb-10"
          >
            Especializado en <strong className="text-slate-200">diseño e infraestructura de redes (CCNA)</strong>, 
            <strong className="text-slate-200"> optimización logística de reparto</strong> y configuración de hardware de red. 
            Soluciones robustas que conectan e impulsan las operaciones.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="flex flex-col sm:flex-row justify-center items-center gap-4"
          >
            <button
              onClick={() => scrollToSection('proyectos-interactivos')}
              className="w-full sm:w-auto px-6 py-3.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold font-sans text-sm rounded-xl shadow-lg shadow-teal-500/10 flex items-center justify-center gap-2 transition-all cursor-pointer hover:scale-[1.02]"
            >
              Probar Proyectos Interactivos
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => scrollToSection('contacto')}
              className="w-full sm:w-auto px-6 py-3.5 bg-slate-900 hover:bg-slate-850 text-slate-200 border border-slate-800 hover:border-slate-700 font-sans text-sm rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              Contactar Directamente
            </button>
            <a
              href="/api/download-cv"
              download="CV_Geovanni_Lemus_Diaz.txt"
              className="w-full sm:w-auto px-6 py-3.5 bg-amber-500/10 hover:bg-amber-500/25 text-amber-400 border border-amber-500/20 hover:border-amber-500/40 font-sans text-sm font-bold rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
              Descargar CV en PDF
            </a>
          </motion.div>

          {/* Quick contact tags under hero */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-xl mx-auto mt-16 text-xs text-slate-500 font-mono"
          >
            <div className="flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-slate-950/40 border border-slate-900">
              <MapPin className="w-4 h-4 text-teal-500 shrink-0" />
              <span>Hidalgo, México</span>
            </div>
            <div className="flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-slate-950/40 border border-slate-900">
              <Mail className="w-4 h-4 text-teal-500 shrink-0" />
              <span className="truncate">lemusdiazgeovanni...</span>
            </div>
            <div className="flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-slate-950/40 border border-slate-900">
              <Award className="w-4 h-4 text-teal-500 shrink-0" />
              <span>CCNA Certified</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* About Me Section */}
      <section id="sobre-mi" className="py-20 border-t border-slate-900 px-4 sm:px-6 lg:px-8 bg-slate-950/40">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
            
            {/* Visual Intro Card */}
            <div className="lg:sticky lg:top-24 bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-850 p-6 rounded-2xl flex flex-col items-center text-center">
              {/* Profile Frame with Glowing Accents */}
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-gradient-to-tr from-teal-500 to-amber-500 rounded-full blur-md opacity-40 animate-pulse"></div>
                <div className="w-32 h-32 rounded-full border-2 border-teal-500/30 p-1 relative z-10 bg-slate-950 flex items-center justify-center">
                  <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center">
                    <span className="font-display font-extrabold text-4xl text-gradient bg-gradient-to-br from-teal-400 to-emerald-400 bg-clip-text text-transparent">G</span>
                  </div>
                </div>
              </div>

              <h3 className="font-display font-bold text-xl text-slate-100">{personalInfo.fullName}</h3>
              <p className="text-xs text-teal-400 font-mono mt-1 uppercase tracking-wider">{personalInfo.title}</p>
              
              <div className="w-full border-t border-slate-900 my-4"></div>

              {/* Personal Quick Info Rows */}
              <div className="w-full space-y-3 text-xs font-mono text-left">
                <div className="flex items-center gap-2.5 text-slate-400">
                  <MapPin className="w-4 h-4 text-teal-500 shrink-0" />
                  <div>
                    <span className="text-slate-600 block text-[9px] uppercase">Ubicación</span>
                    <span className="text-slate-300">{personalInfo.location}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2.5 text-slate-400">
                  <Car className="w-4 h-4 text-teal-500 shrink-0" />
                  <div>
                    <span className="text-slate-600 block text-[9px] uppercase">Permisos de Conducir</span>
                    <span className="text-slate-300">{personalInfo.license}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2.5 text-slate-400">
                  <BookOpen className="w-4 h-4 text-teal-500 shrink-0" />
                  <div>
                    <span className="text-slate-600 block text-[9px] uppercase">Idiomas</span>
                    <span className="text-slate-300">
                      {personalInfo.languages.map(l => `${l.name} (${l.level})`).join(', ')}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* In Depth Narrative & Activities */}
            <div className="lg:col-span-2 space-y-8">
              <div>
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-100 tracking-tight flex items-center gap-2">
                  <span className="text-teal-400">#</span> Sobre mí
                </h2>
                <p className="text-slate-300 text-sm leading-relaxed mt-4">
                  {personalInfo.about}
                </p>
                <p className="text-slate-400 text-xs mt-3 italic">
                  Egresado formalmente de la Universidad Politécnica de Tulancingo en Abril de 2025 y certificado por Cisco en Noviembre de 2024. Mi enfoque profesional une la ingeniería de software con la ingeniería de redes tradicionales para proveer soluciones de alto impacto comercial y logístico.
                </p>
              </div>

              {/* Extracurricular Services Render */}
              <div className="border border-slate-900 bg-slate-950 p-6 rounded-2xl">
                <h4 className="font-display font-bold text-slate-200 text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Wrench className="w-4 h-4 text-teal-400" />
                  Servicios y Actividades Extracurriculares
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {personalInfo.extracurriculars.map((act, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-slate-900/60 border border-slate-850 flex gap-3 items-start">
                      <div className="p-2 rounded bg-teal-500/10 text-teal-400 mt-0.5">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <span className="font-sans font-semibold text-slate-200 text-xs block">
                          {idx === 0 ? "Mantenimiento Técnico" : "Reparación Especializada"}
                        </span>
                        <span className="text-slate-400 text-xs block mt-1 leading-relaxed">
                          {act}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Competencies / Skills Section */}
      <section id="competencias" className="py-20 border-t border-slate-900 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-xl mx-auto mb-12">
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-100 tracking-tight">
              Competencias Técnicas y Profesionales
            </h2>
            <p className="text-xs text-slate-400 mt-2 font-mono uppercase tracking-wider text-teal-400">
              Evaluación curricular de habilidades clave
            </p>
          </div>

          {/* Categorized Skills Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            
            {/* Redes Skill Card */}
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-850 flex flex-col justify-between">
              <div>
                <div className="p-3 bg-teal-500/10 text-teal-400 rounded-xl w-fit mb-4">
                  <Network className="w-6 h-6" />
                </div>
                <h4 className="font-display font-bold text-slate-100 text-base">Redes y Conectividad</h4>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  Ayudo a planificar, armar y organizar redes para que las computadoras y equipos de una escuela u oficina estén siempre conectados de forma rápida y segura.
                </p>
              </div>
              <div className="space-y-2 mt-6">
                {competenciesList.filter(s => s.category === 'Redes').map(skill => (
                  <div key={skill.name} className="text-xs">
                    <div className="flex justify-between items-center text-[11px] font-mono mb-1">
                      <span className="text-slate-300 font-medium">{skill.name}</span>
                      <div className="flex text-amber-400 gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`w-3 h-3 ${i < skill.rating ? 'fill-amber-400 stroke-amber-400' : 'stroke-slate-600'}`} />
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Desarrollo Skill Card */}
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-850 flex flex-col justify-between">
              <div>
                <div className="p-3 bg-teal-500/10 text-teal-400 rounded-xl w-fit mb-4">
                  <Code className="w-6 h-6" />
                </div>
                <h4 className="font-display font-bold text-slate-100 text-base">Desarrollo de Software</h4>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  Creo programas sencillos y páginas web que automatizan tareas repetitivas y ayudan a las personas a gestionar mejor su información diaria.
                </p>
              </div>
              <div className="space-y-2 mt-6">
                {competenciesList.filter(s => s.category === 'Desarrollo').map(skill => (
                  <div key={skill.name} className="text-xs">
                    <div className="flex justify-between items-center text-[11px] font-mono mb-1">
                      <span className="text-slate-300 font-medium">{skill.name}</span>
                      <div className="flex text-amber-400 gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`w-3 h-3 ${i < skill.rating ? 'fill-amber-400 stroke-amber-400' : 'stroke-slate-600'}`} />
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Logística Skill Card */}
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-850 flex flex-col justify-between">
              <div>
                <div className="p-3 bg-teal-500/10 text-teal-400 rounded-xl w-fit mb-4">
                  <Navigation className="w-6 h-6" />
                </div>
                <h4 className="font-display font-bold text-slate-100 text-base">Optimización Logística</h4>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  Organizo las mejores rutas de entrega en la ciudad para ahorrar tiempo, evitar el tráfico pesado y reducir los costos de reparto.
                </p>
              </div>
              <div className="space-y-2 mt-6">
                {competenciesList.filter(s => s.category === 'Logística').map(skill => (
                  <div key={skill.name} className="text-xs">
                    <div className="flex justify-between items-center text-[11px] font-mono mb-1">
                      <span className="text-slate-300 font-medium">{skill.name}</span>
                      <div className="flex text-amber-400 gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`w-3 h-3 ${i < skill.rating ? 'fill-amber-400 stroke-amber-400' : 'stroke-slate-600'}`} />
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Soporte Técnico Skill Card */}
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-850 flex flex-col justify-between">
              <div>
                <div className="p-3 bg-teal-500/10 text-teal-400 rounded-xl w-fit mb-4">
                  <Wrench className="w-6 h-6" />
                </div>
                <h4 className="font-display font-bold text-slate-100 text-base">Soporte y Hardware</h4>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  Doy mantenimiento, armo y reparo computadoras, laptops y celulares para mantenerlos funcionando al máximo y prolongar su vida útil.
                </p>
              </div>
              <div className="space-y-2 mt-6">
                {competenciesList.filter(s => s.category === 'Hardware/Soporte').map(skill => (
                  <div key={skill.name} className="text-xs">
                    <div className="flex justify-between items-center text-[11px] font-mono mb-1">
                      <span className="text-slate-300 font-medium">{skill.name}</span>
                      <div className="flex text-amber-400 gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`w-3 h-3 ${i < skill.rating ? 'fill-amber-400 stroke-amber-400' : 'stroke-slate-600'}`} />
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 🛠️ Tecnologías Dominadas Section */}
      <section id="tecnologias" className="py-20 border-t border-slate-900 bg-slate-950/30 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-xl mx-auto mb-12">
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-100 tracking-tight">
              Tecnologías Dominadas
            </h2>
            <p className="text-xs text-slate-400 mt-2 font-mono uppercase tracking-wider text-teal-400">
              Herramientas, lenguajes y entornos de especialización
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Redes */}
            <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-850 hover:border-teal-500/20 transition-all">
              <div className="p-3 bg-teal-500/10 text-teal-400 rounded-xl w-fit mb-4">
                <Network className="w-5 h-5" />
              </div>
              <h4 className="font-sans font-bold text-slate-200 text-sm uppercase tracking-wider">Redes y Conexiones</h4>
              <ul className="mt-4 space-y-2 text-xs text-slate-400 font-mono">
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-teal-500" /> Cisco IOS</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-teal-500" /> Packet Tracer</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-teal-500" /> Subneteo IP (CIDR/VLSM)</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-teal-500" /> Cableado Estructurado</li>
              </ul>
            </div>

            {/* Sistemas Operativos */}
            <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-850 hover:border-teal-500/20 transition-all">
              <div className="p-3 bg-teal-500/10 text-teal-400 rounded-xl w-fit mb-4">
                <Monitor className="w-5 h-5" />
              </div>
              <h4 className="font-sans font-bold text-slate-200 text-sm uppercase tracking-wider">Sistemas Operativos</h4>
              <ul className="mt-4 space-y-2 text-xs text-slate-400 font-mono">
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-teal-500" /> Windows 10 & 11</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-teal-500" /> Windows Server</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-teal-500" /> Linux (Ubuntu / Debian)</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-teal-500" /> Android / iOS</li>
              </ul>
            </div>

            {/* Desarrollo */}
            <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-850 hover:border-teal-500/20 transition-all">
              <div className="p-3 bg-teal-500/10 text-teal-400 rounded-xl w-fit mb-4">
                <Code className="w-5 h-5" />
              </div>
              <h4 className="font-sans font-bold text-slate-200 text-sm uppercase tracking-wider">Desarrollo y Datos</h4>
              <ul className="mt-4 space-y-2 text-xs text-slate-400 font-mono">
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-teal-500" /> Python</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-teal-500" /> Java / Spring Boot</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-teal-500" /> SQL (SQLite, PostgreSQL)</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-teal-500" /> HTML5 / CSS3 / JS / TS</li>
              </ul>
            </div>

            {/* Entornos */}
            <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-850 hover:border-teal-500/20 transition-all">
              <div className="p-3 bg-teal-500/10 text-teal-400 rounded-xl w-fit mb-4">
                <Cpu className="w-5 h-5" />
              </div>
              <h4 className="font-sans font-bold text-slate-200 text-sm uppercase tracking-wider">Entornos y Control</h4>
              <ul className="mt-4 space-y-2 text-xs text-slate-400 font-mono">
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-teal-500" /> VS Code</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-teal-500" /> IntelliJ IDEA</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-teal-500" /> Git & GitHub</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-teal-500" /> Docker (Básico)</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 🚀 Servicios Profesionales Section */}
      <section id="servicios" className="py-20 border-t border-slate-900 bg-slate-950 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-xl mx-auto mb-16">
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-100 tracking-tight">
              Servicios Profesionales de TI
            </h2>
            <p className="text-xs text-slate-400 mt-2 font-mono uppercase tracking-wider text-teal-400">
              Soluciones de ingeniería en sistemas, hardware y soporte técnico
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* 1 */}
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-850 hover:border-teal-500/30 transition-all duration-300">
              <div className="p-3 bg-teal-500/10 text-teal-400 rounded-xl w-fit mb-4">
                <Wrench className="w-5 h-5" />
              </div>
              <h4 className="font-display font-bold text-slate-100 text-sm uppercase tracking-wider">Mantenimiento preventivo</h4>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Limpieza física profunda de componentes, lubricación de ventiladores y cambio de pasta térmica de alto rendimiento para evitar sobrecalentamiento.
              </p>
            </div>

            {/* 2 */}
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-850 hover:border-teal-500/30 transition-all duration-300">
              <div className="p-3 bg-teal-500/10 text-teal-400 rounded-xl w-fit mb-4">
                <Cpu className="w-5 h-5" />
              </div>
              <h4 className="font-display font-bold text-slate-100 text-sm uppercase tracking-wider">Mantenimiento correctivo</h4>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Reparación y reemplazo de componentes físicos defectuosos o quemados, incluyendo fuentes de poder, almacenamiento, memorias y periféricos.
              </p>
            </div>

            {/* 3 */}
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-850 hover:border-teal-500/30 transition-all duration-300">
              <div className="p-3 bg-teal-500/10 text-teal-400 rounded-xl w-fit mb-4">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <h4 className="font-display font-bold text-slate-100 text-sm uppercase tracking-wider">Diagnóstico de fallas</h4>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Detección analítica y precisa de errores físicos de hardware mediante herramientas especializadas para evitar gastos innecesarios en refacciones.
              </p>
            </div>

            {/* 4 */}
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-850 hover:border-teal-500/30 transition-all duration-300">
              <div className="p-3 bg-teal-500/10 text-teal-400 rounded-xl w-fit mb-4">
                <Laptop className="w-5 h-5" />
              </div>
              <h4 className="font-display font-bold text-slate-100 text-sm uppercase tracking-wider">Reparación de equipos</h4>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Reparación especializada de laptops y equipos de escritorio, ensamblado personalizado de PCs de oficina o gaming, cambio de pantallas y teclados.
              </p>
            </div>

            {/* 5 */}
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-850 hover:border-teal-500/30 transition-all duration-300">
              <div className="p-3 bg-teal-500/10 text-teal-400 rounded-xl w-fit mb-4">
                <RefreshCw className="w-5 h-5" />
              </div>
              <h4 className="font-display font-bold text-slate-100 text-sm uppercase tracking-wider">Optimización y limpieza</h4>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Remoción de virus y malware, depuración del registro, desactivación de software inútil en el inicio y aceleración general de Windows y Linux.
              </p>
            </div>

            {/* 6 */}
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-850 hover:border-teal-500/30 transition-all duration-300">
              <div className="p-3 bg-teal-500/10 text-teal-400 rounded-xl w-fit mb-4">
                <Monitor className="w-5 h-5" />
              </div>
              <h4 className="font-display font-bold text-slate-100 text-sm uppercase tracking-wider">Instalación de S.O.</h4>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Instalación limpia, segura y optimizada de sistemas operativos Windows (10/11) o distribuciones Linux (Ubuntu, Debian) con controladores al día.
              </p>
            </div>

            {/* 7 */}
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-850 hover:border-teal-500/30 transition-all duration-300">
              <div className="p-3 bg-teal-500/10 text-teal-400 rounded-xl w-fit mb-4">
                <Package className="w-5 h-5" />
              </div>
              <h4 className="font-display font-bold text-slate-100 text-sm uppercase tracking-wider">Instalación de Software</h4>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Configuración de paqueterías de oficina, suites creativas, utilidades de seguridad y herramientas de desarrollo bajo licenciamiento autorizado.
              </p>
            </div>

            {/* 8 */}
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-850 hover:border-teal-500/30 transition-all duration-300">
              <div className="p-3 bg-teal-500/10 text-teal-400 rounded-xl w-fit mb-4">
                <HardDrive className="w-5 h-5" />
              </div>
              <h4 className="font-display font-bold text-slate-100 text-sm uppercase tracking-wider">Respaldo y Recuperación</h4>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Creación de copias de seguridad automáticas y recuperación de archivos importantes eliminados por accidente de discos duros o memorias USB.
              </p>
            </div>

            {/* 9 */}
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-850 hover:border-teal-500/30 transition-all duration-300">
              <div className="p-3 bg-teal-500/10 text-teal-400 rounded-xl w-fit mb-4">
                <Wifi className="w-5 h-5" />
              </div>
              <h4 className="font-display font-bold text-slate-100 text-sm uppercase tracking-wider">Redes Básicas</h4>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Diseño e instalación de redes domésticas y de oficina, configuración de módems, routers repetidores, switches y cableado estructurado.
              </p>
            </div>

            {/* 10 */}
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-850 hover:border-teal-500/30 transition-all duration-300">
              <div className="p-3 bg-teal-500/10 text-teal-400 rounded-xl w-fit mb-4">
                <Info className="w-5 h-5" />
              </div>
              <h4 className="font-display font-bold text-slate-100 text-sm uppercase tracking-wider">Asesoría Tecnológica</h4>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Te ayudo a elegir las mejores computadoras, componentes de hardware o infraestructura de red para tus necesidades específicas sin desperdiciar dinero.
              </p>
            </div>

            {/* 11 */}
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-850 hover:border-teal-500/30 transition-all duration-300">
              <div className="p-3 bg-teal-500/10 text-teal-400 rounded-xl w-fit mb-4">
                <Code className="w-5 h-5" />
              </div>
              <h4 className="font-display font-bold text-slate-100 text-sm uppercase tracking-wider">Desarrollo de Software</h4>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Creación de programas de escritorio, automatizaciones lógicas con Python y sitios web interactivos modernos adaptados a tus requerimientos.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Experience & Education Section */}
      <section id="experiencia" className="py-20 border-t border-slate-900 bg-slate-950/20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* Experience timeline */}
            <div>
              <h3 className="font-display text-2xl font-bold text-slate-100 tracking-tight mb-8 flex items-center gap-2.5">
                <Briefcase className="w-6 h-6 text-teal-400" />
                Trayectoria Laboral
              </h3>

              <div className="relative border-l-2 border-slate-850 pl-6 space-y-10">
                {workExperience.map((job) => (
                  <div key={job.id} className="relative">
                    {/* Circle marker on timeline */}
                    <span className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-slate-950 border-2 border-teal-500 shadow shadow-teal-500/20"></span>
                    
                    <div>
                      <span className="text-[10px] font-mono text-teal-400">{job.period}</span>
                      <h4 className="font-display font-bold text-slate-100 text-base mt-1">{job.role}</h4>
                      <span className="text-xs font-sans font-medium text-slate-400">{job.company} • {job.location}</span>
                      
                      <p className="text-slate-300 text-xs mt-3 leading-relaxed">
                        {job.description}
                      </p>

                      <ul className="mt-3 space-y-1.5 text-xs text-slate-400 font-sans list-disc pl-4">
                        {job.tasks.map((task, idx) => (
                          <li key={idx}>{task}</li>
                        ))}
                      </ul>

                      {/* Tech/Skills badges */}
                      <div className="flex flex-wrap gap-1.5 mt-4">
                        {job.skillsApplied.map(tag => (
                          <span key={tag} className="px-2 py-0.5 rounded bg-slate-900 text-slate-400 text-[10px] font-mono border border-slate-850">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Education timeline */}
            <div>
              <h3 className="font-display text-2xl font-bold text-slate-100 tracking-tight mb-8 flex items-center gap-2.5">
                <BookOpen className="w-6 h-6 text-teal-400" />
                Formación Académica
              </h3>

              <div className="space-y-6">
                {educationHistory.map((edu) => (
                  <div key={edu.id} className="p-5 rounded-2xl bg-slate-900/40 border border-slate-850 relative overflow-hidden">
                    {/* Visual pattern ornament inside card */}
                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-teal-500/5 to-transparent rounded-full pointer-events-none"></div>

                    <span className="text-[10px] font-mono text-teal-400">{edu.period}</span>
                    <h4 className="font-display font-bold text-slate-100 text-base mt-1">{edu.degree}</h4>
                    <span className="text-xs font-sans text-slate-300 block">{edu.institution}</span>
                    <span className="text-[11px] font-mono text-slate-500 block mt-1">{edu.location}</span>

                    <p className="text-slate-400 text-xs mt-4 leading-relaxed font-sans border-t border-slate-850/60 pt-3">
                      {edu.details}
                    </p>

                    <div className="mt-4 p-3 rounded-lg bg-slate-950/60 border border-slate-850 text-[11px] font-mono text-slate-400 space-y-1.5">
                      <div className="flex justify-between">
                        <span>Cédula Profesional No:</span>
                        <span className="text-slate-200 font-semibold">15684082</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Folio de Título:</span>
                        <span className="text-slate-200">1315052026465889</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Emisión Federal:</span>
                        <span className="text-slate-200">04 de marzo de 2026</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Extra visual CV quote block */}
              <div className="mt-8 p-5 bg-gradient-to-r from-teal-950/30 to-indigo-950/30 border border-teal-900/30 rounded-2xl">
                <span className="text-xs font-mono text-teal-400 font-bold block uppercase mb-1">Misión Profesional</span>
                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  "Ejercer la ingeniería con el más alto rigor analítico, implementando redes robustas certificadas que garanticen la disponibilidad de la información y liderando operaciones logísticas mediante el uso inteligente de algoritmos de optimización."
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Certifications Section */}
      <section id="certificaciones" className="py-20 border-t border-slate-900 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-xl mx-auto mb-12">
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-100 tracking-tight">
              Certificaciones Oficiales
            </h2>
            <p className="text-xs text-slate-400 mt-2 font-mono uppercase tracking-wider text-teal-400">
              Acreditación curricular y cursos completados
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {certificationsList.map((cert) => (
              <div key={cert.id} className="bg-slate-900/60 border border-slate-850 p-5 rounded-2xl flex flex-col justify-between relative overflow-hidden">
                
                {/* Visual Accent Badge Based on type */}
                <div className="absolute top-4 right-4 text-xs font-mono font-bold tracking-wider uppercase">
                  {cert.badgeType === 'cisco' && <span className="px-2 py-0.5 rounded bg-blue-500/15 text-blue-400 border border-blue-500/20">Cisco CCNA</span>}
                  {cert.badgeType === 'python' && <span className="px-2 py-0.5 rounded bg-yellow-500/15 text-yellow-400 border border-yellow-500/20">Python</span>}
                  {cert.badgeType === 'buap' && <span className="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">BUAP</span>}
                </div>

                <div>
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-850 w-fit mb-4 text-teal-400">
                    <Award className="w-5 h-5" />
                  </div>
                  <h4 className="font-display font-bold text-slate-100 text-sm md:text-base leading-snug mt-1 pr-16">{cert.name}</h4>
                  <span className="text-[11px] font-sans text-slate-400 mt-1 block font-medium">{cert.issuer}</span>
                  <p className="text-xs text-slate-400 mt-4 leading-relaxed font-sans min-h-[48px]">
                    {cert.details}
                  </p>
                </div>

                <div className="border-t border-slate-850/60 pt-3 mt-5 flex justify-between items-center text-[10px] font-mono text-slate-500">
                  <span>Expedido: {cert.date.split(' de ')[2] || cert.date}</span>
                  {cert.score && (
                    <span className="text-teal-400 font-bold bg-teal-500/5 px-1.5 py-0.5 rounded border border-teal-500/15">Aprovechamiento: {cert.score.split(' ')[0]}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Projects Showcase Dashboard */}
      <section id="proyectos-interactivos" className="py-20 border-t border-slate-900 bg-slate-950/40 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-100 tracking-tight">
              Proyectos de Sistemas Interactivos
            </h2>
            <p className="text-xs text-slate-400 mt-2 font-mono uppercase tracking-wider text-teal-400">
              Prueba los simuladores técnicos basados en las competencias reales de Geovanni
            </p>
            <p className="text-slate-400 text-xs mt-3 leading-relaxed">
              En lugar de solo mostrar capturas estáticas, este portafolio te permite interactuar con miniapps lógicas que replican problemas reales resueltos por Geovanni en su carrera profesional.
            </p>
          </div>

          {/* Large custom tabs switcher */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-2 mb-8 bg-slate-900 p-1.5 rounded-xl border border-slate-850 max-w-2xl mx-auto">
            <button
              onClick={() => setActiveTab('network')}
              className={`w-full sm:w-auto px-4 py-2.5 rounded-lg text-xs font-sans font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${activeTab === 'network' ? 'bg-teal-500 text-slate-950 shadow-md shadow-teal-500/10' : 'text-slate-400 hover:text-slate-200'}`}
            >
              <Network className="w-4 h-4" />
              1. Simulador de Red CCNA
            </button>
            <button
              onClick={() => setActiveTab('routes')}
              className={`w-full sm:w-auto px-4 py-2.5 rounded-lg text-xs font-sans font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${activeTab === 'routes' ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/10' : 'text-slate-400 hover:text-slate-200'}`}
            >
              <Navigation className="w-4 h-4" />
              2. Optimizador de Rutas (MASS)
            </button>
            <button
              onClick={() => setActiveTab('inventory')}
              className={`w-full sm:w-auto px-4 py-2.5 rounded-lg text-xs font-sans font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${activeTab === 'inventory' ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/10' : 'text-slate-400 hover:text-slate-200'}`}
            >
              <Package className="w-4 h-4" />
              3. Auditor de Almacén (3B)
            </button>
          </div>

          {/* Dynamic Switch Panel Container */}
          <div className="transition-all duration-300">
            {activeTab === 'network' && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <NetworkSimulator />
              </motion.div>
            )}
            {activeTab === 'routes' && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <RouteOptimizer />
              </motion.div>
            )}
            {activeTab === 'inventory' && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <InventorySimulator />
              </motion.div>
            )}
          </div>

        </div>
      </section>

      {/* Structured Contact Section */}
      <section id="contacto" className="py-20 border-t border-slate-900 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            
            {/* Direct contact channels */}
            <div className="space-y-6">
              <div>
                <span className="text-[10px] font-mono text-teal-400 uppercase tracking-widest block mb-2">Canal de Comunicación Directa</span>
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-100 tracking-tight">
                  Ponte en contacto con Geovanni
                </h2>
                <p className="text-slate-400 text-xs mt-3 leading-relaxed">
                  ¿Quieres hablar sobre el diseño de una red, la optimización de un flujo de reparto, o realizar una consulta técnica? Puedes enviar un mensaje directo mediante el formulario o utilizar los canales directos provistos abajo.
                </p>
              </div>

              {/* Grid of contact links */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Email link box */}
                <a 
                  href="mailto:lemusdiazgeovannibaruc@gmail.com?subject=Contacto%20Portafolio%20Profesional"
                  className="p-4 rounded-xl bg-slate-900/60 border border-slate-850 hover:border-teal-500/30 transition-all flex items-start gap-3 group"
                >
                  <div className="p-2.5 rounded-lg bg-teal-500/10 text-teal-400 group-hover:bg-teal-500/20 shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div className="overflow-hidden">
                    <span className="font-sans font-semibold text-xs text-slate-200 block">Enviar Correo</span>
                    <span className="text-[11px] font-mono text-slate-400 block mt-1 truncate group-hover:text-teal-400">
                      lemusdiazgeovannibaruc@gmail.com
                    </span>
                  </div>
                </a>

                {/* Telephone box */}
                <div 
                  className="p-4 rounded-xl bg-slate-900/60 border border-slate-850 flex items-start gap-3"
                >
                  <div className="p-2.5 rounded-lg bg-teal-500/10 text-teal-400 shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-sans font-semibold text-xs text-slate-200 block">Llamada / Celular</span>
                    <span className="text-[11px] font-mono text-slate-400 block mt-1">
                      Disponible bajo solicitud
                    </span>
                  </div>
                </div>
              </div>

              {/* Physical Location Badge card */}
              <div className="p-5 rounded-2xl bg-slate-900/30 border border-slate-850 space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-teal-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-sans font-semibold text-xs text-slate-200 block">Ubicación de Trabajo</span>
                    <span className="text-xs text-slate-400 block mt-1">
                      Tulancingo de Bravo, Hidalgo, México.
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono block mt-1">
                      Disponibilidad de movilidad local y regional.
                    </span>
                  </div>
                </div>

                <div className="h-32 rounded-xl bg-slate-950 border border-slate-850 flex items-center justify-center relative overflow-hidden">
                  {/* Styled visual Map Placeholder */}
                  <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#14b8a6_1px,transparent_1px)] bg-[size:16px_16px]"></div>
                  <div className="text-center z-10 px-4">
                    <span className="font-mono text-[10px] text-teal-400 uppercase tracking-widest block mb-1">Zona de Residencia</span>
                    <span className="font-display font-bold text-xs text-slate-300">Tulancingo de Bravo, Hgo.</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive Message Form with Advanced Security & AES Encryption */}
            <div className="bg-slate-900/60 border border-slate-850 rounded-2xl p-6">
              <h3 className="font-display font-bold text-lg text-slate-100 mb-2 flex items-center gap-1.5">
                <MessageSquare className="w-5 h-5 text-teal-400" />
                Dejar un mensaje directo
              </h3>
              <p className="text-[10px] text-slate-500 font-mono mb-4 leading-relaxed uppercase tracking-wider">
                🛡️ Conexión Protegida con AES-256-CBC y Cabeceras CSP/HSTS
              </p>

              {submitError && (
                <div className="p-3 mb-4 rounded-lg bg-rose-500/10 border border-rose-500/20 text-xs text-rose-400 font-mono">
                  {submitError}
                </div>
              )}

              <form onSubmit={handleContactSubmit} className="space-y-4">
                {/* Honeypot Spam Prevention (Hidden to humans, bots will auto-fill it) */}
                <input
                  type="text"
                  name="user_special_field_check"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                  style={{ display: "none" }}
                  tabIndex={-1}
                  autoComplete="off"
                />

                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">Nombre Completo:</label>
                  <input
                    type="text"
                    required
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="Ej. Ing. Carlos Pérez"
                    className="w-full bg-slate-950 border border-slate-850 focus:border-teal-500 focus:outline-none rounded-lg p-2.5 text-xs text-slate-100 placeholder:text-slate-600 font-sans"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">Correo Electrónico:</label>
                  <input
                    type="email"
                    required
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="carlos.perez@empresa.com"
                    className="w-full bg-slate-950 border border-slate-850 focus:border-teal-500 focus:outline-none rounded-lg p-2.5 text-xs text-slate-100 placeholder:text-slate-600 font-sans"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">Mensaje o Propuesta Comercial:</label>
                  <textarea
                    required
                    rows={3}
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                    placeholder="Ecribe tu propuesta o mensaje aquí..."
                    className="w-full bg-slate-950 border border-slate-850 focus:border-teal-500 focus:outline-none rounded-lg p-2.5 text-xs text-slate-100 placeholder:text-slate-600 font-sans"
                  ></textarea>
                </div>

                {/* Anti-Bot Math Challenge */}
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-850 space-y-2">
                  <label className="block text-xs font-mono text-teal-400">
                    {challengeQuestion}
                  </label>
                  <input
                    type="number"
                    required
                    value={challengeAnswer}
                    onChange={(e) => setChallengeAnswer(e.target.value)}
                    placeholder="Tu respuesta numérica"
                    className="w-full bg-slate-900 border border-slate-800 focus:border-teal-500 focus:outline-none rounded-lg p-2 text-xs text-slate-100 font-mono"
                  />
                </div>

                <button
                  type="submit"
                  disabled={formSubmitted}
                  className={`w-full py-2.5 px-4 rounded-xl font-sans font-bold text-xs flex justify-center items-center gap-2 transition-all cursor-pointer ${
                    formSubmitted ? 'bg-teal-500/10 text-teal-400 border border-teal-500/20' : 'bg-teal-500 hover:bg-teal-400 text-slate-950 shadow-lg hover:shadow-teal-500/10'
                  }`}
                >
                  {formSubmitted ? (
                    <>
                      <Check className="w-4 h-4" />
                      ¡Mensaje Encriptado y Enviado con Éxito!
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Enviar Mensaje Seguro
                    </>
                  )}
                </button>
              </form>
            </div>

          </div>
        </div>
      </section>

      {/* Styled Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-8 px-4 sm:px-6 lg:px-8 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 font-mono">
            <span>© 2026 {personalInfo.fullName}.</span>
            <span className="text-slate-700">|</span>
            <span className="text-[10px] uppercase text-teal-500 font-bold">Hecho en México</span>
          </div>

          <div className="flex items-center gap-2 text-slate-500 text-[10px] font-mono">
            <span>Servidor Dev Activo en Puerto 3000</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
