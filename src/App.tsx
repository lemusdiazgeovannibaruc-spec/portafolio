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
  ChevronDown,
  ChevronUp,
  ArrowRight, 
  ExternalLink, 
  ShieldCheck, 
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
  const [scrolled, setScrolled] = useState(false);
  const [expandedJob, setExpandedJob] = useState<string | null>("exp1");
  
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

  // Control del scroll para la navbar de tipo cápsula
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  // Curva de animación premium para Framer Motion
  const transitionProps = { duration: 0.6, ease: [0.16, 1, 0.3, 1] };

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#111111] font-sans antialiased selection:bg-[#0F62FE] selection:text-white">
      
      {/* Dynamic Floating Capsule Navigation */}
      <nav 
        className={`fixed left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ${
          scrolled 
            ? 'top-4 w-[90%] max-w-4xl bg-white/80 border border-neutral-200/50 backdrop-blur-md py-2 px-6 rounded-full shadow-[0_8px_30px_rgba(0,0,0,0.04)]' 
            : 'top-0 w-full max-w-7xl bg-transparent py-6 px-6 lg:px-8'
        }`}
      >
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => scrollToSection('inicio')}>
            <div className="w-8 h-8 rounded-full bg-[#111111] text-white flex items-center justify-center font-display font-bold text-xs tracking-wide">
              GL
            </div>
            {!scrolled && (
              <span className="font-display font-bold text-xs tracking-tight text-[#111111] uppercase hidden sm:inline">
                {personalInfo.fullName}
              </span>
            )}
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-6 text-[11px] font-mono tracking-wider uppercase text-[#666666]">
            <button onClick={() => scrollToSection('inicio')} className="hover:text-[#111111] transition-colors cursor-pointer">Inicio</button>
            <button onClick={() => scrollToSection('proyectos-interactivos')} className="hover:text-[#111111] transition-colors cursor-pointer">Selected Work</button>
            <button onClick={() => scrollToSection('sobre-mi')} className="hover:text-[#111111] transition-colors cursor-pointer">About</button>
            <button onClick={() => scrollToSection('experiencia')} className="hover:text-[#111111] transition-colors cursor-pointer">Experience</button>
            <button onClick={() => scrollToSection('tecnologias')} className="hover:text-[#111111] transition-colors cursor-pointer">Tech Stack</button>
          </div>

          <div className="hidden md:block">
            <button 
              onClick={() => scrollToSection('contacto')}
              className="px-4 py-1.5 bg-[#111111] hover:bg-[#0F62FE] text-white text-[11px] font-mono uppercase tracking-wider rounded-full transition-colors cursor-pointer"
            >
              Contact
            </button>
          </div>

          {/* Mobile hamburger button */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
            className="md:hidden p-1.5 text-[#111111] hover:text-[#0F62FE] transition-colors cursor-pointer"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile menu panel */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="md:hidden bg-white/95 border border-neutral-200/60 rounded-2xl mt-3 p-4 shadow-xl backdrop-blur-md flex flex-col gap-3 text-xs font-mono uppercase tracking-wider text-[#666666]"
            >
              <button onClick={() => scrollToSection('inicio')} className="text-left py-2 px-3 hover:bg-neutral-50 rounded-lg hover:text-[#111111]">Inicio</button>
              <button onClick={() => scrollToSection('proyectos-interactivos')} className="text-left py-2 px-3 hover:bg-neutral-50 rounded-lg hover:text-[#111111]">Selected Work</button>
              <button onClick={() => scrollToSection('sobre-mi')} className="text-left py-2 px-3 hover:bg-neutral-50 rounded-lg hover:text-[#111111]">About</button>
              <button onClick={() => scrollToSection('experiencia')} className="text-left py-2 px-3 hover:bg-neutral-50 rounded-lg hover:text-[#111111]">Experience</button>
              <button onClick={() => scrollToSection('tecnologias')} className="text-left py-2 px-3 hover:bg-neutral-50 rounded-lg hover:text-[#111111]">Tech Stack</button>
              <button 
                onClick={() => scrollToSection('contacto')}
                className="mt-2 w-full text-center py-2 bg-[#111111] text-white rounded-lg hover:bg-[#0F62FE] transition-colors"
              >
                Contacto Directo
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Editorial Hero Section */}
      <section id="inicio" className="min-h-screen flex flex-col justify-center items-start px-6 sm:px-12 lg:px-24 max-w-5xl mx-auto pt-24 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={transitionProps}
          className="space-y-6 w-full"
        >
          {/* Subtle ISC Credential Tag */}
          <span className="inline-flex items-center gap-2 text-[10px] font-mono tracking-widest text-[#666666] uppercase bg-white border border-neutral-200/60 px-3 py-1 rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.01)]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#0F62FE]" />
            Cédula Federal ISC No. 1568••••
          </span>

          <h1 className="font-display text-5xl sm:text-7xl lg:text-8xl font-bold tracking-tighter text-[#111111] leading-[0.95]">
            Geovanni Lemus
          </h1>

          <p className="font-display text-2xl sm:text-3xl lg:text-4xl font-light text-[#666666] max-w-3xl leading-snug">
            Software & Systems Engineer.<br />
            <span className="text-[#111111] font-normal">Building robust communication infrastructures and optimized operational paths.</span>
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-6 w-full sm:w-auto">
            <button
              onClick={() => scrollToSection('proyectos-interactivos')}
              className="px-6 py-3.5 bg-[#111111] hover:bg-[#0F62FE] text-white font-mono uppercase tracking-wider text-xs rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
            >
              Explore my work
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => scrollToSection('contacto')}
              className="px-6 py-3.5 bg-white border border-neutral-200 hover:border-neutral-400 text-[#111111] font-mono uppercase tracking-wider text-xs rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              Get in touch
            </button>
          </div>

          {/* Minimal Quick Meta Labels */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 pt-16 border-t border-neutral-200/60 text-[10px] font-mono uppercase tracking-widest text-[#666666]">
            <div>
              <span className="block text-neutral-400 mb-1">Location</span>
              <span className="text-[#111111] font-semibold flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#0F62FE]" /> Hidalgo, MX
              </span>
            </div>
            <div>
              <span className="block text-neutral-400 mb-1">Status</span>
              <span className="text-[#111111] font-semibold flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0F62FE] animate-ping"></span> Available
              </span>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <span className="block text-neutral-400 mb-1">Specialties</span>
              <span className="text-[#111111] font-semibold">Cisco CCNA & Logistics</span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Selected Work (Simulators Showcase) Section */}
      <section id="proyectos-interactivos" className="py-24 border-t border-neutral-200/60 bg-white px-6 sm:px-12 lg:px-24">
        <div className="max-w-5xl mx-auto space-y-12">
          
          <div className="space-y-4 max-w-2xl">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#666666] block">
              // Selected Work
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#111111] tracking-tight">
              Sistemas e Interfaces Interactivas
            </h2>
            <p className="text-[#666666] text-xs font-mono uppercase tracking-wider text-[#0F62FE] mt-1">
              Simuladores técnicos basados en competencias reales de Geovanni
            </p>
            <p className="text-[#666666] text-sm leading-relaxed font-sans">
              En lugar de presentar capturas estáticas, este espacio te permite interactuar con miniapps operativas que replican la lógica de enrutamiento de red local, optimización de trayectorias de reparto y conciliación de stock de almacenes.
            </p>
          </div>

          {/* Minimalist Switcher Layout */}
          <div className="flex flex-col sm:flex-row justify-start items-stretch sm:items-center gap-1 bg-neutral-50 p-1 rounded-xl border border-neutral-200/60 max-w-xl">
            <button
              onClick={() => setActiveTab('network')}
              className={`px-4 py-2.5 rounded-lg text-[10px] font-mono uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${
                activeTab === 'network' 
                  ? 'bg-white text-[#111111] shadow-[0_2px_8px_rgba(0,0,0,0.04)] font-bold border border-neutral-200/40' 
                  : 'text-[#666666] hover:text-[#111111]'
              }`}
            >
              <Network className="w-3.5 h-3.5 text-[#0F62FE]" />
              1. Red CCNA
            </button>
            <button
              onClick={() => setActiveTab('routes')}
              className={`px-4 py-2.5 rounded-lg text-[10px] font-mono uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${
                activeTab === 'routes' 
                  ? 'bg-white text-[#111111] shadow-[0_2px_8px_rgba(0,0,0,0.04)] font-bold border border-neutral-200/40' 
                  : 'text-[#666666] hover:text-[#111111]'
              }`}
            >
              <Navigation className="w-3.5 h-3.5 text-[#0F62FE]" />
              2. Logística MASS
            </button>
            <button
              onClick={() => setActiveTab('inventory')}
              className={`px-4 py-2.5 rounded-lg text-[10px] font-mono uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${
                activeTab === 'inventory' 
                  ? 'bg-white text-[#111111] shadow-[0_2px_8px_rgba(0,0,0,0.04)] font-bold border border-neutral-200/40' 
                  : 'text-[#666666] hover:text-[#111111]'
              }`}
            >
              <Package className="w-3.5 h-3.5 text-[#0F62FE]" />
              3. Almacén 3B
            </button>
          </div>

          {/* Majestic Mock Workstation Window Frame */}
          <div className="bg-[#FAFAFA] border border-neutral-200 rounded-xl overflow-hidden shadow-[0_12px_40px_rgba(0,0,0,0.02)]">
            {/* Header Title Bar */}
            <div className="bg-white border-b border-neutral-200/80 px-4 py-3.5 flex justify-between items-center text-[10px] font-mono text-[#666666]">
              {/* Fake Window Controls */}
              <div className="flex gap-1.5 items-center">
                <span className="w-2.5 h-2.5 rounded-full bg-neutral-200"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-neutral-200"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-neutral-200"></span>
              </div>
              {/* Dynamic Path indicator */}
              <span className="text-neutral-500 font-bold tracking-tight uppercase flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0F62FE]"></span>
                {activeTab === 'network' && "system_simulation / campus_network_ccna.config"}
                {activeTab === 'routes' && "logistic_optimization / route_optimizer_mass.json"}
                {activeTab === 'inventory' && "warehouse_audit / stores_3b_inventory.py"}
              </span>
              <div className="w-12 text-right">v1.1</div>
            </div>

            {/* Simulated Workspace Inner Screen */}
            <div className="p-6 bg-[#FAFAFA]">
              <AnimatePresence mode="wait">
                {activeTab === 'network' && (
                  <motion.div
                    key="network"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={transitionProps}
                  >
                    <NetworkSimulator />
                  </motion.div>
                )}
                {activeTab === 'routes' && (
                  <motion.div
                    key="routes"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={transitionProps}
                  >
                    <RouteOptimizer />
                  </motion.div>
                )}
                {activeTab === 'inventory' && (
                  <motion.div
                    key="inventory"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={transitionProps}
                  >
                    <InventorySimulator />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

        </div>
      </section>

      {/* About Me Section */}
      <section id="sobre-mi" className="py-24 border-t border-neutral-200/60 px-6 sm:px-12 lg:px-24">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Left Column: Visual Profiler Card */}
            <div className="lg:col-span-5 bg-white border border-neutral-200/65 p-6 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.01)] space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-[#111111] text-white flex items-center justify-center font-display font-bold text-3xl">
                  G
                </div>
                <div>
                  <h3 className="font-display font-bold text-lg text-[#111111]">{personalInfo.fullName}</h3>
                  <p className="text-[10px] font-mono text-[#0F62FE] uppercase tracking-wider">{personalInfo.title}</p>
                </div>
              </div>

              <div className="border-t border-neutral-100 my-4"></div>

              {/* Personal Quick Info Rows */}
              <div className="space-y-4 text-xs font-mono text-left">
                <div className="flex gap-3 text-[#666666]">
                  <MapPin className="w-4 h-4 text-[#0F62FE] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-neutral-400 block text-[9px] uppercase">Location</span>
                    <span className="text-[#111111] font-medium block mt-0.5">{personalInfo.location}</span>
                  </div>
                </div>
                <div className="flex gap-3 text-[#666666]">
                  <Car className="w-4 h-4 text-[#0F62FE] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-neutral-400 block text-[9px] uppercase">Licensing</span>
                    <span className="text-[#111111] font-medium block mt-0.5">{personalInfo.license}</span>
                  </div>
                </div>
                <div className="flex gap-3 text-[#666666]">
                  <BookOpen className="w-4 h-4 text-[#0F62FE] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-neutral-400 block text-[9px] uppercase">Languages</span>
                    <span className="text-[#111111] font-medium block mt-0.5">
                      {personalInfo.languages.map(l => `${l.name} (${l.level})`).join(', ')}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Narrative Biography */}
            <div className="lg:col-span-7 space-y-8">
              <div className="space-y-4">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#666666] block">// Biography</span>
                <h2 className="font-display text-3xl font-bold text-[#111111] tracking-tight">
                  Sistemas, Infraestructuras y Optimización
                </h2>
                <p className="text-[#666666] text-sm leading-relaxed font-sans">
                  {personalInfo.about}
                </p>
                <p className="text-[#666666] text-xs leading-relaxed font-sans italic border-l-2 border-neutral-200 pl-4">
                  Egresado formalmente de la Universidad Politécnica de Tulancingo en Abril de 2025 y certificado por Cisco en Noviembre de 2024. Mi enfoque profesional une el desarrollo de software y algoritmos lógicos con la ingeniería de redes de comunicación tradicionales para proveer soluciones de alto impacto comercial y logístico.
                </p>
              </div>

              {/* Minimal Services Render */}
              <div className="space-y-4">
                <h4 className="font-mono text-[10px] uppercase tracking-widest text-neutral-400 flex items-center gap-2">
                  <Wrench className="w-3.5 h-3.5 text-[#0F62FE]" />
                  Servicios Técnicos Especializados
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {personalInfo.extracurriculars.map((act, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-white border border-neutral-200/60 flex gap-3 items-start shadow-[0_2px_8px_rgba(0,0,0,0.01)]">
                      <div className="p-1.5 rounded bg-[#0F62FE]/5 text-[#0F62FE] mt-0.5">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <span className="font-mono text-[10px] uppercase tracking-wider font-bold text-[#111111] block">
                          {idx === 0 ? "Mantenimiento Preventivo" : "Diagnóstico Correctivo"}
                        </span>
                        <span className="text-[#666666] text-xs block mt-1 leading-relaxed">
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

      {/* Experience (Interactive expansion, no classic timelines) Section */}
      <section id="experiencia" className="py-24 border-t border-neutral-200/60 bg-white px-6 sm:px-12 lg:px-24">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Expanded Job List Column */}
            <div className="lg:col-span-7 space-y-6">
              <div className="space-y-2 mb-8">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#666666] block">// Professional Experience</span>
                <h3 className="font-display text-3xl font-bold text-[#111111] tracking-tight">
                  Trayectoria Laboral
                </h3>
              </div>

              <div className="space-y-4">
                {workExperience.map((job) => {
                  const isExpanded = expandedJob === job.id;
                  return (
                    <div 
                      key={job.id} 
                      className={`border rounded-xl transition-all duration-300 overflow-hidden cursor-pointer ${
                        isExpanded 
                          ? 'border-[#0F62FE]/60 bg-[#FAFAFA]' 
                          : 'border-neutral-200/60 bg-white hover:border-neutral-300'
                      }`}
                      onClick={() => setExpandedJob(isExpanded ? null : job.id)}
                    >
                      <div className="p-5 flex justify-between items-start gap-4">
                        <div className="space-y-1.5">
                          <span className="text-[9px] font-mono text-[#666666] tracking-wider uppercase">{job.period}</span>
                          <h4 className="font-display font-bold text-[#111111] text-base leading-tight">{job.role}</h4>
                          <span className="text-xs font-sans text-[#666666] block">{job.company} • {job.location}</span>
                        </div>
                        <div className="p-1 rounded-full bg-neutral-100 text-[#666666] shrink-0 mt-1">
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </div>
                      </div>

                      <AnimatePresence initial={false}>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={transitionProps}
                            className="px-5 pb-5 border-t border-neutral-200/40"
                          >
                            <p className="text-[#111111] text-xs leading-relaxed font-sans pt-4 mb-4">
                              {job.description}
                            </p>

                            <ul className="space-y-2 text-xs text-[#666666] font-sans list-none pl-0">
                              {job.tasks.map((task, idx) => (
                                <li key={idx} className="flex gap-2 items-start">
                                  <span className="text-[#0F62FE] shrink-0 mt-1 font-bold">•</span>
                                  <span>{task}</span>
                                </li>
                              ))}
                            </ul>

                            {/* Tech/Skills applied list */}
                            <div className="flex flex-wrap gap-1.5 mt-5 pt-4 border-t border-neutral-200/30">
                              {job.skillsApplied.map(tag => (
                                <span key={tag} className="px-2.5 py-1 rounded bg-white text-[#666666] text-[9px] font-mono border border-neutral-200/60">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Education & Mission Column */}
            <div className="lg:col-span-5 space-y-6 lg:pl-4">
              <div className="space-y-2 mb-8">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#666666] block">// Academic Background</span>
                <h3 className="font-display text-3xl font-bold text-[#111111] tracking-tight">
                  Formación Académica
                </h3>
              </div>

              <div className="space-y-6">
                {educationHistory.map((edu) => (
                  <div key={edu.id} className="p-5 rounded-xl bg-[#FAFAFA] border border-neutral-200/60 relative overflow-hidden space-y-3">
                    <span className="text-[9px] font-mono text-[#0F62FE] tracking-widest uppercase">{edu.period}</span>
                    <h4 className="font-display font-bold text-[#111111] text-base leading-snug">{edu.degree}</h4>
                    <span className="text-xs font-sans text-[#666666] block font-medium">{edu.institution}</span>
                    <span className="text-[11px] font-mono text-neutral-400 block">{edu.location}</span>

                    <p className="text-[#666666] text-xs mt-3 leading-relaxed font-sans border-t border-neutral-200/50 pt-3">
                      {edu.details}
                    </p>

                    <div className="mt-4 p-3 rounded-lg bg-white border border-neutral-200/60 text-[10px] font-mono text-[#666666] space-y-1.5 shadow-[0_2px_8px_rgba(0,0,0,0.01)]">
                      <div className="flex justify-between">
                        <span>Cédula Profesional No:</span>
                        <span className="text-[#111111] font-semibold">1568••••</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Folio de Título:</span>
                        <span className="text-[#111111]">1315••••••••5889</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Emisión Federal:</span>
                        <span className="text-[#111111]">04 de marzo de 2026</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* High-End Mission Quote */}
              <div className="p-5 bg-neutral-900 text-white rounded-xl space-y-3 shadow-md">
                <span className="text-[9px] font-mono text-[#0F62FE] font-bold block uppercase tracking-widest">Misión Profesional</span>
                <p className="text-xs text-neutral-300 leading-relaxed font-sans italic">
                  "Ejercer la ingeniería con el más alto rigor analítico, implementando redes robustas certificadas que garanticen la disponibilidad de la información y liderando operaciones logísticas mediante el uso inteligente de algoritmos de optimización."
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Tech Stack & Certifications (No ratings, purely organized) Section */}
      <section id="tecnologias" className="py-24 border-t border-neutral-200/60 px-6 sm:px-12 lg:px-24">
        <div className="max-w-5xl mx-auto space-y-16">
          
          {/* Section Header */}
          <div className="space-y-4 max-w-xl">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#666666] block">// Tech Stack</span>
            <h2 className="font-display text-3xl font-bold text-[#111111] tracking-tight">
              Ecosistema Tecnológico
            </h2>
            <p className="text-sm text-[#666666] leading-relaxed font-sans">
              Herramientas, lenguajes y entornos de especialización técnica organizados de manera elegante, sin porcentajes ni barras genéricas.
            </p>
          </div>

          {/* Categorized Technologies Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Redes */}
            <div className="p-5 rounded-xl bg-white border border-neutral-200/60 flex flex-col justify-between space-y-4 shadow-[0_2px_12px_rgba(0,0,0,0.01)]">
              <div className="space-y-2">
                <div className="p-2.5 bg-[#0F62FE]/5 text-[#0F62FE] rounded-lg w-fit">
                  <Network className="w-5 h-5" />
                </div>
                <h4 className="font-mono text-[10px] uppercase tracking-wider font-bold text-[#111111]">Redes y Conexiones</h4>
              </div>
              <div className="flex flex-wrap gap-1.5 pt-2">
                {['Cisco IOS', 'Packet Tracer', 'Subneteo CIDR/VLSM', 'Cableado Estructurado', 'Topologías de Red', 'LAN/WAN Config'].map(skill => (
                  <span key={skill} className="px-2.5 py-1 rounded bg-neutral-50 text-[#666666] text-[10px] font-mono border border-neutral-200/40">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Sistemas Operativos */}
            <div className="p-5 rounded-xl bg-white border border-neutral-200/60 flex flex-col justify-between space-y-4 shadow-[0_2px_12px_rgba(0,0,0,0.01)]">
              <div className="space-y-2">
                <div className="p-2.5 bg-[#0F62FE]/5 text-[#0F62FE] rounded-lg w-fit">
                  <Monitor className="w-5 h-5" />
                </div>
                <h4 className="font-mono text-[10px] uppercase tracking-wider font-bold text-[#111111]">Sistemas Operativos</h4>
              </div>
              <div className="flex flex-wrap gap-1.5 pt-2">
                {['Windows 10/11', 'Windows Server', 'Linux Ubuntu', 'Linux Debian', 'Unix Terminal', 'Android / iOS OS'].map(skill => (
                  <span key={skill} className="px-2.5 py-1 rounded bg-neutral-50 text-[#666666] text-[10px] font-mono border border-neutral-200/40">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Desarrollo */}
            <div className="p-5 rounded-xl bg-white border border-neutral-200/60 flex flex-col justify-between space-y-4 shadow-[0_2px_12px_rgba(0,0,0,0.01)]">
              <div className="space-y-2">
                <div className="p-2.5 bg-[#0F62FE]/5 text-[#0F62FE] rounded-lg w-fit">
                  <Code className="w-5 h-5" />
                </div>
                <h4 className="font-mono text-[10px] uppercase tracking-wider font-bold text-[#111111]">Desarrollo y Datos</h4>
              </div>
              <div className="flex flex-wrap gap-1.5 pt-2">
                {['Python', 'Java Core', 'Spring Boot', 'PostgreSQL', 'SQLite', 'TypeScript', 'React.js', 'HTML5 & CSS3'].map(skill => (
                  <span key={skill} className="px-2.5 py-1 rounded bg-neutral-50 text-[#666666] text-[10px] font-mono border border-neutral-200/40">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Entornos */}
            <div className="p-5 rounded-xl bg-white border border-neutral-200/60 flex flex-col justify-between space-y-4 shadow-[0_2px_12px_rgba(0,0,0,0.01)]">
              <div className="space-y-2">
                <div className="p-2.5 bg-[#0F62FE]/5 text-[#0F62FE] rounded-lg w-fit">
                  <Cpu className="w-5 h-5" />
                </div>
                <h4 className="font-mono text-[10px] uppercase tracking-wider font-bold text-[#111111]">Entornos y Control</h4>
              </div>
              <div className="flex flex-wrap gap-1.5 pt-2">
                {['VS Code IDE', 'IntelliJ IDEA', 'Git Control', 'GitHub Repos', 'Docker Basic', 'Resend Email API', 'Framer Motion'].map(skill => (
                  <span key={skill} className="px-2.5 py-1 rounded bg-neutral-50 text-[#666666] text-[10px] font-mono border border-neutral-200/40">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

          </div>

          {/* Certifications Sub Grid inside tech stack for unified profile */}
          <div className="space-y-6 pt-12 border-t border-neutral-200/60">
            <div className="space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#666666] block">// Credentials</span>
              <h3 className="font-display text-2xl font-bold text-[#111111] tracking-tight">
                Certificaciones Oficiales
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {certificationsList.map((cert) => (
                <div key={cert.id} className="bg-white border border-neutral-200/60 p-5 rounded-xl flex flex-col justify-between relative overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.015)]">
                  
                  {/* Premium badge identifier */}
                  <div className="absolute top-4 right-4 text-[9px] font-mono font-bold tracking-wider uppercase">
                    {cert.badgeType === 'cisco' && <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-600 border border-blue-200/50">Cisco CCNA</span>}
                    {cert.badgeType === 'python' && <span className="px-2 py-0.5 rounded bg-yellow-50 text-yellow-700 border border-yellow-200/50">Python</span>}
                    {cert.badgeType === 'buap' && <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200/50">BUAP Acad</span>}
                  </div>

                  <div className="space-y-3">
                    <div className="p-2 rounded bg-neutral-50 border border-neutral-100 w-fit text-[#0F62FE]">
                      <Award className="w-4 h-4" />
                    </div>
                    <h4 className="font-display font-bold text-[#111111] text-sm leading-snug pr-20">{cert.name}</h4>
                    <span className="text-[10px] font-mono text-neutral-400 block">{cert.issuer}</span>
                    <p className="text-xs text-[#666666] leading-relaxed font-sans pt-2">
                      {cert.details}
                    </p>
                  </div>

                  <div className="border-t border-neutral-100 pt-3 mt-6 flex justify-between items-center text-[9px] font-mono text-neutral-400">
                    <span>Expedido: {cert.date.split(' de ')[2] || cert.date}</span>
                    {cert.score && (
                      <span className="text-[#0F62FE] font-bold bg-[#0F62FE]/5 px-2 py-0.5 rounded border border-[#0F62FE]/10">Nota: {cert.score.split(' ')[0]}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* Structured Minimal Contact Section */}
      <section id="contacto" className="py-28 border-t border-neutral-200/60 bg-[#FAFAFA] px-6 sm:px-12 lg:px-24">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Left Info Column */}
            <div className="lg:col-span-5 space-y-6">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#666666] block">
                  // Contact Channels
                </span>
                <h2 className="font-display text-4xl sm:text-5xl font-bold text-[#111111] tracking-tighter leading-none mt-2">
                  Construyamos algo robusto.
                </h2>
                <p className="text-[#666666] text-xs leading-relaxed font-mono uppercase tracking-wider text-[#0F62FE] mt-3">
                  Contacto directo seguro y confidencial
                </p>
                <p className="text-[#666666] text-sm leading-relaxed font-sans mt-4">
                  ¿Quieres hablar sobre desarrollo de software, optimizar la infraestructura de red, realizar mantenimiento de sistemas o proponer una colaboración laboral? Escríbeme directamente. Mi enfoque principal es el desarrollo y mantenimiento especializado de soluciones digitales robustas.
                </p>
              </div>

              {/* Grid of clean visual contact details */}
              <div className="space-y-4 text-xs font-mono">
                <a 
                  href={`mailto:${personalInfo.email}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3.5 rounded-xl bg-white border border-neutral-200/60 hover:border-neutral-400 hover:text-[#0F62FE] transition-all group shadow-[0_2px_8px_rgba(0,0,0,0.01)]"
                >
                  <Mail className="w-4 h-4 text-[#0F62FE] shrink-0" />
                  <div className="truncate">
                    <span className="text-[9px] text-neutral-400 block uppercase">Correo Electrónico</span>
                    <span className="text-[#111111] font-semibold group-hover:text-[#0F62FE] transition-colors">{personalInfo.email}</span>
                  </div>
                </a>

                <div 
                  className="flex items-center gap-3 p-3.5 rounded-xl bg-white border border-neutral-200/60 shadow-[0_2px_8px_rgba(0,0,0,0.01)]"
                >
                  <Phone className="w-4 h-4 text-[#0F62FE] shrink-0" />
                  <div>
                    <span className="text-[9px] text-neutral-400 block uppercase">Teléfono</span>
                    <span className="text-[#111111] font-semibold">{personalInfo.phone}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Form Column */}
            <div className="lg:col-span-7 bg-white border border-neutral-200 p-6 sm:p-8 rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.01)]">
              <form onSubmit={handleContactSubmit} className="space-y-6">
                
                {/* Honeypot Spam Barrier (invisible) */}
                <div className="hidden">
                  <label htmlFor="website">Ignora este campo si eres un humano:</label>
                  <input 
                    type="text" 
                    id="website" 
                    value={honeypot} 
                    onChange={(e) => setHoneypot(e.target.value)} 
                    autoComplete="off" 
                  />
                </div>

                <div className="space-y-1">
                  <label htmlFor="nombre" className="text-[9px] font-mono uppercase tracking-widest text-neutral-400 block">Nombre Completo</label>
                  <input
                    id="nombre"
                    type="text"
                    required
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="Ej. Ing. Carlos Mendoza"
                    className="w-full pb-2 pt-1 border-b border-neutral-200 focus:border-[#0F62FE] bg-transparent outline-none text-sm transition-colors placeholder:text-neutral-300 text-[#111111]"
                  />
                </div>

                <div className="space-y-1">
                  <label htmlFor="email" className="text-[9px] font-mono uppercase tracking-widest text-neutral-400 block">Correo de Contacto</label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="carlos@empresa.com"
                    className="w-full pb-2 pt-1 border-b border-neutral-200 focus:border-[#0F62FE] bg-transparent outline-none text-sm transition-colors placeholder:text-neutral-300 text-[#111111]"
                  />
                </div>

                <div className="space-y-1">
                  <label htmlFor="mensaje" className="text-[9px] font-mono uppercase tracking-widest text-neutral-400 block">Contenido del Mensaje</label>
                  <textarea
                    id="mensaje"
                    rows={4}
                    required
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                    placeholder="Escribe aquí los detalles del proyecto..."
                    className="w-full pb-2 pt-1 border-b border-neutral-200 focus:border-[#0F62FE] bg-transparent outline-none text-sm transition-colors placeholder:text-neutral-300 text-[#111111] resize-none"
                  ></textarea>
                </div>

                {/* Mathematical Anti-Spam Gate */}
                <div className="p-4 bg-neutral-50 rounded-lg border border-neutral-200/60 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4">
                  <div className="flex gap-2.5 items-center">
                    <div className="p-1.5 bg-white border border-neutral-200 rounded text-[#0F62FE]">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[9px] font-mono uppercase tracking-widest text-neutral-400 block">Verificación de Seguridad</span>
                      <span className="text-xs font-mono text-[#111111] font-semibold">{challengeQuestion}</span>
                    </div>
                  </div>
                  
                  <input
                    type="text"
                    required
                    placeholder="Resultado"
                    value={challengeAnswer}
                    onChange={(e) => setChallengeAnswer(e.target.value)}
                    className="px-3 py-1.5 bg-white border border-neutral-200 focus:border-[#0F62FE] rounded-md outline-none text-xs font-mono w-full sm:w-28 text-center"
                  />
                </div>

                {submitError && (
                  <div className="p-3 bg-red-50 border border-red-200/60 rounded-lg text-xs text-red-600 flex items-center gap-2 font-sans">
                    <ShieldAlert className="w-4 h-4 text-red-500 shrink-0" />
                    <span>{submitError}</span>
                  </div>
                )}

                {formSubmitted && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200/60 rounded-lg text-xs text-emerald-700 flex items-center gap-2 font-sans animate-fade-in">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>¡Su mensaje fue recibido con éxito y despachado de forma segura! Hemos enviado una confirmación a su correo.</span>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-3 bg-[#111111] hover:bg-[#0F62FE] text-white font-mono uppercase tracking-wider text-xs rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                >
                  <Send className="w-3.5 h-3.5" />
                  Enviar Mensaje de Forma Segura
                </button>
              </form>
            </div>

          </div>
        </div>
      </section>

      {/* Minimalistic Footer */}
      <footer className="bg-[#111111] text-white border-t border-neutral-800 py-12 px-6 sm:px-12 lg:px-24 text-xs font-mono uppercase tracking-wider">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-[#0F62FE]"></span>
            <span>Geovanni Lemus © 2026</span>
          </div>
          <div className="text-neutral-400 text-center md:text-right text-[10px]">
            Ingeniero en Sistemas Computacionales
          </div>
        </div>
      </footer>

    </div>
  );
}
