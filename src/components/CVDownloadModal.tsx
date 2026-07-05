import React, { useState } from "react";
import { 
  X, 
  CheckCircle, 
  Loader2, 
  FileDown, 
  Building2, 
  User, 
  Briefcase, 
  Mail, 
  FileQuestion,
  ShieldCheck,
  AlertTriangle
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface CVDownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CVDownloadModal: React.FC<CVDownloadModalProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    position: "",
    email: "",
    reason: ""
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [downloadToken, setDownloadToken] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);

  // Real-time local validation
  const validateField = (name: string, value: string): string => {
    switch (name) {
      case "name":
        if (!value.trim()) return "El nombre es obligatorio.";
        if (value.trim().length < 2) return "El nombre debe tener al menos 2 caracteres.";
        if (value.trim().length > 100) return "Máximo 100 caracteres.";
        return "";
      case "company":
        if (!value.trim()) return "La empresa o institución es obligatoria.";
        if (value.trim().length < 2) return "La empresa debe tener al menos 2 caracteres.";
        if (value.trim().length > 100) return "Máximo 100 caracteres.";
        return "";
      case "position":
        if (!value.trim()) return "El cargo o rol es obligatorio.";
        if (value.trim().length < 2) return "El cargo debe tener al menos 2 caracteres.";
        if (value.trim().length > 100) return "Máximo 100 caracteres.";
        return "";
      case "email":
        if (!value.trim()) return "El correo es obligatorio.";
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value.trim())) return "Formato de correo electrónico inválido.";
        return "";
      case "reason":
        if (!value.trim()) return "El motivo del contacto es obligatorio.";
        if (value.trim().length < 5) return "El motivo debe tener al menos 5 caracteres.";
        if (value.trim().length > 1000) return "Máximo 1000 caracteres.";
        return "";
      default:
        return "";
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    const fieldError = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: fieldError }));
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const fieldError = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: fieldError }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Final full validation
    const tempErrors: Record<string, string> = {};
    Object.keys(formData).forEach(key => {
      const err = validateField(key, formData[key as keyof typeof formData]);
      if (err) tempErrors[key] = err;
    });

    if (Object.keys(tempErrors).length > 0) {
      setErrors(tempErrors);
      return;
    }

    setStatus("loading");
    setApiError(null);

    try {
      const response = await fetch("/api/request-cv", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Ocurrió un error inesperado al procesar la solicitud.");
      }

      setDownloadToken(data.token);
      setStatus("success");
    } catch (err: any) {
      setApiError(err.message || "Fallo de red al intentar conectar con el servidor.");
      setStatus("error");
    }
  };

  const handleDownload = () => {
    if (!downloadToken) return;
    window.location.href = `/api/download-cv-pdf?token=${downloadToken}`;
  };

  const resetForm = () => {
    setFormData({
      name: "",
      company: "",
      position: "",
      email: "",
      reason: ""
    });
    setErrors({});
    setStatus("idle");
    setDownloadToken(null);
    setApiError(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          {/* Backdrop con desenfoque de fondo elegante */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-neutral-900/60 backdrop-blur-sm"
          />

          {/* Tarjeta del modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: "spring", duration: 0.4 }}
            className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-neutral-100 overflow-hidden z-10 font-sans"
          >
            {/* Cabecera */}
            <div className="flex items-center justify-between px-6 py-4 bg-neutral-50 border-b border-neutral-200/60">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#0F62FE]" />
                <span className="font-mono text-xs font-bold uppercase tracking-widest text-neutral-800">
                  Descarga Certificada de CV
                </span>
              </div>
              <button
                onClick={handleClose}
                className="p-1 rounded-full text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Contenido según estados */}
            <div className="p-6">
              {status === "idle" || status === "loading" || status === "error" ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <p className="text-xs text-neutral-500 leading-relaxed">
                    Para acceder al currículum completo en formato **PDF de alta definición**, completa los siguientes datos. El archivo generado incluirá una marca de agua dinámica con tu información para garantizar un uso seguro y profesional.
                  </p>

                  {/* Nombre */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block">
                      Nombre Completo
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-neutral-400 pointer-events-none">
                        <User className="w-4 h-4" />
                      </span>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="Ej. Ing. Carlos Pérez"
                        className={`w-full pl-9 pr-4 py-2 text-sm bg-neutral-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F62FE]/20 focus:bg-white transition-all ${
                          errors.name ? "border-red-400 focus:border-red-400" : "border-neutral-200 focus:border-[#0F62FE]"
                        }`}
                      />
                    </div>
                    {errors.name && (
                      <span className="text-[10px] text-red-500 font-medium block">{errors.name}</span>
                    )}
                  </div>

                  {/* Empresa y Cargo (Grid de 2 cols) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block">
                        Empresa / Institución
                      </label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-neutral-400 pointer-events-none">
                          <Building2 className="w-4 h-4" />
                        </span>
                        <input
                          type="text"
                          name="company"
                          value={formData.company}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          placeholder="Ej. Redes Globales S.A."
                          className={`w-full pl-9 pr-4 py-2 text-sm bg-neutral-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F62FE]/20 focus:bg-white transition-all ${
                            errors.company ? "border-red-400 focus:border-red-400" : "border-neutral-200 focus:border-[#0F62FE]"
                          }`}
                        />
                      </div>
                      {errors.company && (
                        <span className="text-[10px] text-red-500 font-medium block">{errors.company}</span>
                      )}
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block">
                        Cargo / Rol profesional
                      </label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-neutral-400 pointer-events-none">
                          <Briefcase className="w-4 h-4" />
                        </span>
                        <input
                          type="text"
                          name="position"
                          value={formData.position}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          placeholder="Ej. Gerente de TI"
                          className={`w-full pl-9 pr-4 py-2 text-sm bg-neutral-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F62FE]/20 focus:bg-white transition-all ${
                            errors.position ? "border-red-400 focus:border-red-400" : "border-neutral-200 focus:border-[#0F62FE]"
                          }`}
                        />
                      </div>
                      {errors.position && (
                        <span className="text-[10px] text-red-500 font-medium block">{errors.position}</span>
                      )}
                    </div>
                  </div>

                  {/* Correo */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block">
                      Correo Corporativo / Profesional
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-neutral-400 pointer-events-none">
                        <Mail className="w-4 h-4" />
                      </span>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="Ej. carlos.perez@empresa.com"
                        className={`w-full pl-9 pr-4 py-2 text-sm bg-neutral-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F62FE]/20 focus:bg-white transition-all ${
                          errors.email ? "border-red-400 focus:border-red-400" : "border-neutral-200 focus:border-[#0F62FE]"
                        }`}
                      />
                    </div>
                    {errors.email && (
                      <span className="text-[10px] text-red-500 font-medium block">{errors.email}</span>
                    )}
                  </div>

                  {/* Motivo de descarga */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block">
                      Motivo del contacto
                    </label>
                    <div className="relative">
                      <span className="absolute top-2.5 left-3 text-neutral-400 pointer-events-none">
                        <FileQuestion className="w-4 h-4" />
                      </span>
                      <textarea
                        name="reason"
                        value={formData.reason}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        rows={3}
                        placeholder="Ej. Busco consultoría para el mantenimiento de nuestros servidores..."
                        className={`w-full pl-9 pr-4 py-2 text-sm bg-neutral-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F62FE]/20 focus:bg-white transition-all ${
                          errors.reason ? "border-red-400 focus:border-red-400" : "border-neutral-200 focus:border-[#0F62FE]"
                        }`}
                      />
                    </div>
                    {errors.reason && (
                      <span className="text-[10px] text-red-500 font-medium block">{errors.reason}</span>
                    )}
                  </div>

                  {/* Api Error Display */}
                  {status === "error" && apiError && (
                    <motion.div 
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg flex items-start gap-2 text-xs"
                    >
                      <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>{apiError}</span>
                    </motion.div>
                  )}

                  {/* Botón de Enviar */}
                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="w-full mt-2 py-3 bg-[#111111] hover:bg-[#0F62FE] text-white font-mono uppercase tracking-wider text-xs rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {status === "loading" ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Registrando solicitud...
                      </>
                    ) : (
                      <>
                        Generar enlace seguro
                      </>
                    )}
                  </button>
                </form>
              ) : (
                /* Éxito - Mostrar enlace temporal */
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-6 text-center py-4"
                >
                  <div className="flex flex-col items-center gap-2">
                    <CheckCircle className="w-14 h-14 text-emerald-500" />
                    <h3 className="text-base font-bold text-neutral-800">
                      ¡Solicitud Aprobada y Firmada!
                    </h3>
                    <p className="text-xs text-neutral-500 max-w-sm leading-relaxed">
                      Se ha generado una firma criptográfica temporal única para ti. Tu currículum en formato **PDF** con marca de agua dinámica ya está listo para su descarga.
                    </p>
                  </div>

                  <div className="p-4 bg-emerald-50/50 border border-emerald-100 rounded-xl max-w-md mx-auto text-left space-y-1.5">
                    <div className="flex justify-between text-[10px] font-mono text-emerald-700 uppercase tracking-wider">
                      <span>Propietario de la licencia:</span>
                      <span className="font-bold">{formData.name}</span>
                    </div>
                    <div className="flex justify-between text-[10px] font-mono text-emerald-700 uppercase tracking-wider">
                      <span>Empresa autorizada:</span>
                      <span className="font-bold">{formData.company}</span>
                    </div>
                    <div className="flex justify-between text-[10px] font-mono text-emerald-700 uppercase tracking-wider">
                      <span>Expira en:</span>
                      <span className="font-bold">5 minutos</span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <button
                      onClick={handleDownload}
                      className="flex-1 py-3 bg-[#0F62FE] hover:bg-[#0b4ecb] text-white font-mono uppercase tracking-wider text-xs rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-[#0F62FE]/20"
                    >
                      <FileDown className="w-4 h-4" />
                      Descargar PDF Certificado
                    </button>
                    <button
                      onClick={handleClose}
                      className="py-3 px-5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-mono uppercase tracking-wider text-xs rounded-lg transition-colors cursor-pointer"
                    >
                      Cerrar
                    </button>
                  </div>

                  <p className="text-[9px] text-neutral-400 font-mono italic">
                    * Nunca compartas tu credencial temporal. Este link expira automáticamente para mitigar redistribución no autorizada.
                  </p>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
