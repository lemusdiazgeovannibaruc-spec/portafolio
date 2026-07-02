import React, { useState } from 'react';
import { Package, ShieldAlert, BarChart3, Plus, CheckCircle, AlertTriangle, RefreshCw, Layers, FileSpreadsheet } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Product {
  code: string;
  name: string;
  category: 'Lácteos' | 'Abarrotes' | 'Bebidas' | 'Limpieza';
  systemStock: number;
  physicalStock: number | null; // Null until audit runs
  minThreshold: number;
}

export default function InventorySimulator() {
  const [products, setProducts] = useState<Product[]>([
    { code: '3B-1020', name: 'Leche Entera Ultra 1L', category: 'Lácteos', systemStock: 48, physicalStock: null, minThreshold: 15 },
    { code: '3B-2051', name: 'Cereal de Maíz Crujiente 400g', category: 'Abarrotes', systemStock: 8, physicalStock: null, minThreshold: 12 },
    { code: '3B-3094', name: 'Agua Purificada Mineral 1.5L', category: 'Bebidas', systemStock: 72, physicalStock: null, minThreshold: 20 },
    { code: '3B-4011', name: 'Detergente Multiusos 1kg', category: 'Limpieza', systemStock: 14, physicalStock: null, minThreshold: 10 },
    { code: '3B-2088', name: 'Aceite de Cocina Soya 900ml', category: 'Abarrotes', systemStock: 4, physicalStock: null, minThreshold: 12 }
  ]);

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditComplete, setAuditComplete] = useState(false);
  const [discrepancyCount, setDiscrepancyCount] = useState<number>(0);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const restockItem = (code: string, amount: number) => {
    setProducts(prev => prev.map(p => {
      if (p.code === code) {
        const nextSystem = p.systemStock + amount;
        return { 
          ...p, 
          systemStock: nextSystem,
          // If we had run an audit, sync physical stock if matched, otherwise keep audit state
          physicalStock: p.physicalStock !== null ? p.physicalStock + amount : null
        };
      }
      return p;
    }));
    const pName = products.find(p => p.code === code)?.name;
    showToast(`Recepción exitosa: +${amount} unidades de "${pName}" agregadas al almacén.`);
  };

  const runInventoryAudit = () => {
    setIsAuditing(true);
    setAuditComplete(false);
    
    setTimeout(() => {
      let discrepancies = 0;
      setProducts(prev => prev.map(p => {
        // Randomly generate physical discrepancies (30% chance)
        const hasDiscrepancy = Math.random() < 0.4;
        let physicalCount = p.systemStock;
        
        if (hasDiscrepancy) {
          // off by small random margin (-3 to +3, but not 0)
          const offset = [ -2, -1, 1, 2 ][Math.floor(Math.random() * 4)];
          physicalCount = Math.max(0, p.systemStock + offset);
          discrepancies++;
        }
        
        return { ...p, physicalStock: physicalCount };
      }));
      
      setIsAuditing(false);
      setAuditComplete(true);
      setDiscrepancyCount(discrepancies);
      showToast(`Levantamiento completado. Se encontraron ${discrepancies} discrepancias de stock.`);
    }, 1500);
  };

  const reconcileStock = () => {
    setProducts(prev => prev.map(p => {
      if (p.physicalStock !== null) {
        return { ...p, systemStock: p.physicalStock };
      }
      return p;
    }));
    setDiscrepancyCount(0);
    showToast('Ajuste de inventario aplicado. El stock digital coincide al 100% con el físico.');
  };

  const getStockStatus = (p: Product) => {
    if (p.systemStock === 0) return { label: 'Sin Stock', color: 'text-rose-400 bg-rose-500/10 border-rose-500/20' };
    if (p.systemStock < p.minThreshold) return { label: 'Stock Crítico', color: 'text-amber-400 bg-amber-500/10 border-amber-500/20 animate-pulse' };
    return { label: 'Saludable', color: 'text-teal-400 bg-teal-500/10 border-teal-500/20' };
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 overflow-hidden text-slate-100" id="inventory-simulator-card">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6 border-b border-slate-800 pb-4">
        <div>
          <h4 className="font-display text-xl font-bold text-sky-400 flex items-center gap-2">
            <Package className="w-6 h-6" />
            Control de Inventario & Auditoría de Almacén
          </h4>
          <p className="text-xs text-slate-400 mt-1 font-sans">
            Terminal interactiva de levantamiento de existencias basada en metodologías operativas de Tiendas 3B.
          </p>
        </div>
        <div className="flex gap-2 text-xs font-mono">
          <span className="px-2 py-1 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20">Tiendas 3B S.A.</span>
          <span className="px-2 py-1 rounded bg-slate-850 text-slate-400">Trainee de Almacén</span>
        </div>
      </div>

      {/* Grid panels */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Main Products Stock Table */}
        <div className="xl:col-span-2 bg-slate-950/60 rounded-xl p-4 border border-slate-850 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-3">
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Base de Datos de Almacén</span>
              <span className="text-[10px] font-mono text-slate-400">Total: {products.length} productos registrados</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-850 text-slate-500 font-mono">
                    <th className="pb-2 font-medium">Código</th>
                    <th className="pb-2 font-medium">Descripción</th>
                    <th className="pb-2 font-medium">Categoría</th>
                    <th className="pb-2 font-medium text-center">Mín.</th>
                    <th className="pb-2 font-medium text-right">Stock Sis.</th>
                    <th className="pb-2 font-medium text-right">Auditoría (Físico)</th>
                    <th className="pb-2 font-medium text-center">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(p => {
                    const status = getStockStatus(p);
                    const isDiscrepant = p.physicalStock !== null && p.physicalStock !== p.systemStock;

                    return (
                      <tr key={p.code} className="border-b border-slate-900/60 hover:bg-slate-900/30 transition-colors">
                        <td className="py-2.5 font-mono text-slate-500">{p.code}</td>
                        <td className="py-2.5 font-sans font-medium text-slate-200">{p.name}</td>
                        <td className="py-2.5 font-sans text-slate-400">{p.category}</td>
                        <td className="py-2.5 font-mono text-center text-slate-500">{p.minThreshold}</td>
                        <td className={`py-2.5 font-mono text-right font-semibold ${p.systemStock < p.minThreshold ? 'text-amber-400' : 'text-slate-300'}`}>
                          {p.systemStock}
                        </td>
                        <td className={`py-2.5 font-mono text-right font-semibold ${
                          p.physicalStock === null ? 'text-slate-600' :
                          isDiscrepant ? 'text-rose-400 bg-rose-950/20 rounded px-1' : 'text-teal-400'
                        }`}>
                          {p.physicalStock === null ? 'Pendiente' : `${p.physicalStock} pzas`}
                        </td>
                        <td className="py-2.5 text-center">
                          <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] border ${status.color}`}>
                            {status.label}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-900 flex flex-wrap justify-between items-center gap-3">
            <span className="text-[11px] text-slate-400 flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-sky-400" />
              Soporta reabastecimiento rápido e inventario cíclico por SKU.
            </span>

            {/* Quick stock actions buttons */}
            <div className="flex gap-1.5 flex-wrap">
              <button
                onClick={() => restockItem('3B-2051', 12)}
                className="px-2 py-1 bg-slate-900 hover:bg-slate-850 border border-slate-800 rounded text-[10px] font-mono text-slate-300 flex items-center gap-1 transition-colors cursor-pointer"
              >
                <Plus className="w-3 h-3 text-sky-400" /> Reabastecer Cereal (+12)
              </button>
              <button
                onClick={() => restockItem('3B-2088', 15)}
                className="px-2 py-1 bg-slate-900 hover:bg-slate-850 border border-slate-800 rounded text-[10px] font-mono text-slate-300 flex items-center gap-1 transition-colors cursor-pointer"
              >
                <Plus className="w-3 h-3 text-sky-400" /> Reabastecer Aceite (+15)
              </button>
            </div>
          </div>
        </div>

        {/* Audit Management Panel */}
        <div className="flex flex-col gap-4">
          
          {/* Action Trigger Box */}
          <div className="bg-slate-950/60 border border-slate-850 rounded-xl p-4 flex flex-col gap-4">
            <h5 className="font-display font-semibold text-slate-200 text-xs uppercase tracking-wider text-sky-400 flex items-center gap-1.5">
              <BarChart3 className="w-4 h-4" />
              Consola de Levantamiento Físico
            </h5>
            
            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              Inicia una auditoría de existencias cíclicas en el almacén de la tienda. El escáner verificará la cantidad real de cajas en estantes.
            </p>

            <button
              onClick={runInventoryAudit}
              disabled={isAuditing}
              className={`w-full py-2.5 px-4 rounded-lg font-sans font-bold text-xs flex justify-center items-center gap-2 transition-all cursor-pointer ${
                isAuditing ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-850' : 'bg-sky-500 hover:bg-sky-400 text-slate-950 shadow-lg hover:shadow-sky-500/10'
              }`}
            >
              {isAuditing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Escanear Códigos de Barras...
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4" />
                  Iniciar Auditoría General
                </>
              )}
            </button>
          </div>

          {/* Audit Results Reconciliation Box */}
          <div className="bg-slate-950/60 border border-slate-850 rounded-xl p-4 flex-1 flex flex-col justify-between">
            <div>
              <h5 className="font-display font-semibold text-slate-200 text-xs uppercase tracking-wider text-sky-400 mb-3">
                Diagnóstico de Conciliación
              </h5>

              {auditComplete ? (
                <div className="space-y-4 text-xs font-sans">
                  {discrepancyCount > 0 ? (
                    <>
                      <div className="flex items-start gap-2 text-rose-400 bg-rose-500/5 p-3 rounded-lg border border-rose-500/10">
                        <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold block">Discrepancias Detectadas</span>
                          <span className="text-slate-400 text-[11px] block mt-0.5">
                            Se identificaron {discrepancyCount} productos donde el inventario físico difiere del registro del sistema (posibles mermas o errores de captura).
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={reconcileStock}
                        className="w-full py-2 px-4 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs rounded-lg shadow transition-all cursor-pointer flex justify-center items-center gap-1.5"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Ajustar Sistema (Conciliar Stock)
                      </button>
                    </>
                  ) : (
                    <div className="flex items-start gap-2 text-teal-400 bg-teal-500/5 p-3 rounded-lg border border-teal-500/10">
                      <CheckCircle className="w-5 h-5 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold block">Inventario Cuadrado</span>
                        <span className="text-slate-400 text-[11px] block mt-0.5">
                          ¡Excelente! No hay discrepancias en la bodega. Todos los conteos coinciden a la perfección.
                        </span>
                      </div>
                    </div>
                  )}

                  {/* PDF Simulation Link */}
                  <div className="p-3 bg-slate-900/60 border border-slate-850 rounded-lg text-slate-400 font-sans text-[11px] space-y-1">
                    <span className="font-mono text-[9px] uppercase tracking-wider text-slate-500 block">Reporte de Cuadrado:</span>
                    <div className="flex justify-between">
                      <span>Exactitud del Inventario:</span>
                      <span className="text-slate-200 font-mono font-semibold">
                        {parseFloat(((products.length - discrepancyCount) / products.length * 100).toFixed(0))}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Estado General:</span>
                      <span className={discrepancyCount > 0 ? 'text-rose-400' : 'text-teal-400'}>
                        {discrepancyCount > 0 ? 'Por Ajustar' : 'Óptimo'}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-center py-8 text-slate-500">
                  <FileSpreadsheet className="w-8 h-8 text-slate-600 mb-2" />
                  <p className="text-xs">No se ha ejecutado el levantamiento físico de inventario en este ciclo.</p>
                </div>
              )}
            </div>

            {/* Simulated Live Toast feedback inside component */}
            <AnimatePresence>
              {toastMessage && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  className="bg-sky-500/15 border border-sky-500/25 p-2 rounded-lg text-sky-400 text-[10px] font-mono mt-4 text-center"
                >
                  🔔 {toastMessage}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

      </div>
    </div>
  );
}
