import React, { useState, useEffect } from 'react';
import { Laptop, Server, Network as NetworkIcon, Activity, AlertCircle, Play, RefreshCw, Terminal, Eye } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Device {
  id: string;
  name: string;
  type: 'pc' | 'switch' | 'router' | 'server';
  ip: string;
  mac: string;
  gateway?: string;
  status: 'online' | 'offline';
  description: string;
}

export default function NetworkSimulator() {
  const [devices, setDevices] = useState<Device[]>([
    { id: 'pca', name: 'PC-Administración', type: 'pc', ip: '192.168.10.15', mac: '00:0A:95:9D:68:16', gateway: '192.168.10.1', status: 'online', description: 'Computadora de la administración para control de personal.' },
    { id: 'pcb', name: 'PC-Soporte', type: 'pc', ip: '192.168.10.16', mac: '00:0A:95:9D:68:17', gateway: '192.168.10.1', status: 'online', description: 'Estación de soporte técnico para mantenimiento y diagnóstico.' },
    { id: 'sw1', name: 'Switch-Cisco-2960', type: 'switch', ip: '192.168.10.2', mac: '00:11:92:B3:C4:01', status: 'online', description: 'Switch de acceso de 24 puertos Gigabit Ethernet.' },
    { id: 'r1', name: 'Router-Gateway (Cisco 4331)', type: 'router', ip: '192.168.10.1', mac: '00:11:92:D4:E5:02', status: 'online', description: 'Router principal de frontera y salida a Internet.' },
    { id: 'srv', name: 'Servidor-Local', type: 'server', ip: '10.0.0.80', mac: '00:15:C5:E6:F7:03', gateway: '10.0.0.1', status: 'online', description: 'Servidor local de bases de datos y control de inventarios.' }
  ]);

  const [selectedDevice, setSelectedDevice] = useState<Device | null>(devices[0]);
  const [pingSource, setPingSource] = useState<string>('pca');
  const [pingDest, setPingDest] = useState<string>('srv');
  const [pingStatus, setPingStatus] = useState<'idle' | 'pinging' | 'completed' | 'failed'>('idle');
  const [terminalLogs, setTerminalLogs] = useState<string[]>(['C:\\> _ (Selecciona dispositivos y haz click en "Ejecutar Ping")']);
  const [packetStep, setPacketStep] = useState<number>(-1); // -1: idle, 0: source, 1: switch, 2: router, 3: destination

  const toggleDeviceStatus = (id: string) => {
    setDevices(prev => prev.map(d => {
      if (d.id === id) {
        const nextStatus = d.status === 'online' ? 'offline' : 'online';
        return { ...d, status: nextStatus };
      }
      return d;
    }));
  };

  useEffect(() => {
    // Sync selected device details with updated status
    if (selectedDevice) {
      const updated = devices.find(d => d.id === selectedDevice.id);
      if (updated) setSelectedDevice(updated);
    }
  }, [devices]);

  const handlePing = async () => {
    if (pingStatus === 'pinging') return;

    const sourceDev = devices.find(d => d.id === pingSource);
    const destDev = devices.find(d => d.id === pingDest);

    if (!sourceDev || !destDev) return;

    setPingStatus('pinging');
    setPacketStep(0);
    setTerminalLogs([
      `C:\\> ping ${destDev.ip} -t 4`,
      `Haciendo ping a ${destDev.name} [${destDev.ip}] con 32 bytes de datos:`
    ]);

    const isPathClear = devices.every(d => {
      // If we are pinging from pca/pcb to server, the active path includes:
      // Source, Switch, Router, Server. All must be online.
      if (pingSource === 'pca' || pingSource === 'pcb') {
        if (d.id === pingSource || d.id === 'sw1' || d.id === 'r1' || d.id === pingDest) {
          return d.status === 'online';
        }
      }
      // If server to something
      if (pingSource === 'srv') {
        if (d.id === 'srv' || d.id === 'r1' || d.id === 'sw1' || d.id === pingDest) {
          return d.status === 'online';
        }
      }
      return true;
    });

    const steps = [
      { step: 0, desc: `Paquete saliendo de ${sourceDev.name}...` },
      { step: 1, desc: `Procesando en ${devices.find(d => d.id === 'sw1')?.name}...` },
      { step: 2, desc: `Enrutando por Gateway: ${devices.find(d => d.id === 'r1')?.name}...` },
      { step: 3, desc: `Paquete entregado con éxito a ${destDev.name}.` }
    ];

    for (let i = 0; i < steps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 800));
      if (!isPathClear && i > 0) {
        // Path is broken
        setPacketStep(-1);
        setPingStatus('failed');
        setTerminalLogs(prev => [
          ...prev,
          `Error: Enlace caído. Destino inaccesible en el paso intermedio.`,
          `Tiempo de espera agotado para esta solicitud.`,
          `Estadísticas de ping: Enviados = 1, Recibidos = 0, Perdidos = 1 (100% de pérdida).`
        ]);
        return;
      }
      setPacketStep(steps[i].step);
      setTerminalLogs(prev => [...prev, `[RED] ${steps[i].desc}`]);
    }

    // Success response ping packets back
    await new Promise(resolve => setTimeout(resolve, 600));
    setPacketStep(-1);
    setPingStatus('completed');
    setTerminalLogs(prev => [
      ...prev,
      `Respuesta desde ${destDev.ip}: bytes=32 tiempo=14ms TTL=128`,
      `Respuesta desde ${destDev.ip}: bytes=32 tiempo=11ms TTL=128`,
      `Estadísticas de ping para ${destDev.ip}:`,
      `    Paquetes: enviados = 4, recibidos = 4, perdidos = 0 (0% de pérdida).`,
      `Ping finalizado con éxito. Conectividad física y lógica verificada (CCNA).`
    ]);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 overflow-hidden text-slate-100" id="network-simulator-card">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6 border-b border-slate-800 pb-4">
        <div>
          <h4 className="font-display text-xl font-bold text-teal-400 flex items-center gap-2">
            <NetworkIcon className="w-6 h-6" />
            Simulador de Topología de Red (Cisco CCNA)
          </h4>
          <p className="text-xs text-slate-400 mt-1 font-sans">
            Diseña, interactúa y prueba la conectividad física de la infraestructura que Geovanni diseñó.
          </p>
        </div>
        <div className="flex gap-2 text-xs font-mono">
          <span className="px-2 py-1 rounded bg-teal-500/10 text-teal-400 border border-teal-500/20">CCNA: Introducción a Redes</span>
          <span className="px-2 py-1 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20">Cisco Packet Tracer</span>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Interactive Diagram Area */}
        <div className="xl:col-span-2 bg-slate-950/60 rounded-xl p-4 border border-slate-850 flex flex-col justify-between min-h-[380px] relative">
          <div className="absolute top-3 left-3 text-[10px] font-mono text-slate-500 uppercase tracking-widest pointer-events-none">
            Diagrama Lógico de Infraestructura
          </div>
          
          <div className="flex justify-end gap-3 mb-4 text-[10px] font-mono text-slate-400">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-teal-500"></span> ACTIVO
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> INACTIVO
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse"></span> PAQUETE
            </div>
          </div>

          {/* SVG Connection Lines & Devices Grid */}
          <div className="relative flex-1 flex flex-col justify-around py-8 select-none">
            {/* Visual Connections Map */}
            <div className="absolute inset-0 z-0 pointer-events-none">
              <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                {/* Wires from PC-A / PC-B to Switch */}
                <line x1="20%" y1="30%" x2="50%" y2="50%" stroke={devices[0].status === 'online' && devices[2].status === 'online' ? '#14b8a6' : '#64748b'} strokeWidth="2.5" strokeDasharray="4 4" />
                <line x1="20%" y1="70%" x2="50%" y2="50%" stroke={devices[1].status === 'online' && devices[2].status === 'online' ? '#14b8a6' : '#64748b'} strokeWidth="2.5" strokeDasharray="4 4" />
                
                {/* Wire from Switch to Router */}
                <line x1="50%" y1="50%" x2="80%" y2="30%" stroke={devices[2].status === 'online' && devices[3].status === 'online' ? '#14b8a6' : '#64748b'} strokeWidth="3" />
                
                {/* Wire from Router to Server */}
                <line x1="80%" y1="30%" x2="80%" y2="70%" stroke={devices[3].status === 'online' && devices[4].status === 'online' ? '#14b8a6' : '#64748b'} strokeWidth="3" />

                {/* Animated Packet Circle */}
                {packetStep !== -1 && (
                  <circle
                    r="8"
                    fill="#f59e0b"
                    className="shadow-lg"
                    style={{
                      transition: 'all 0.8s ease-in-out',
                      cx: packetStep === 0 ? '20%' 
                        : packetStep === 1 ? '50%' 
                        : packetStep === 2 ? '80%' 
                        : '80%',
                      cy: packetStep === 0 ? (pingSource === 'pca' ? '30%' : '70%')
                        : packetStep === 1 ? '50%'
                        : packetStep === 2 ? '30%'
                        : '70%'
                    }}
                  />
                )}
              </svg>
            </div>

            {/* Devices placement columns */}
            <div className="flex justify-between items-center px-4 md:px-12 relative z-10">
              {/* Column 1: PCs */}
              <div className="flex flex-col gap-16 w-1/4">
                {/* PC A */}
                <div 
                  onClick={() => setSelectedDevice(devices[0])}
                  className={`cursor-pointer p-2.5 rounded-xl border flex flex-col items-center transition-all ${selectedDevice?.id === 'pca' ? 'bg-slate-850 border-teal-500 shadow-lg shadow-teal-500/10' : 'bg-slate-900/90 border-slate-800 hover:border-slate-700'}`}
                >
                  <Laptop className={`w-8 h-8 ${devices[0].status === 'online' ? 'text-teal-400' : 'text-slate-500'}`} />
                  <span className="text-[10px] font-mono mt-1 text-center font-medium truncate max-w-full">{devices[0].name}</span>
                  <span className={`w-2 h-2 rounded-full mt-1.5 ${devices[0].status === 'online' ? 'bg-teal-500' : 'bg-rose-500'}`}></span>
                </div>

                {/* PC B */}
                <div 
                  onClick={() => setSelectedDevice(devices[1])}
                  className={`cursor-pointer p-2.5 rounded-xl border flex flex-col items-center transition-all ${selectedDevice?.id === 'pcb' ? 'bg-slate-850 border-teal-500 shadow-lg shadow-teal-500/10' : 'bg-slate-900/90 border-slate-800 hover:border-slate-700'}`}
                >
                  <Laptop className={`w-8 h-8 ${devices[1].status === 'online' ? 'text-teal-400' : 'text-slate-500'}`} />
                  <span className="text-[10px] font-mono mt-1 text-center font-medium truncate max-w-full">{devices[1].name}</span>
                  <span className={`w-2 h-2 rounded-full mt-1.5 ${devices[1].status === 'online' ? 'bg-teal-500' : 'bg-rose-500'}`}></span>
                </div>
              </div>

              {/* Column 2: Switch */}
              <div className="w-1/4 flex justify-center">
                <div 
                  onClick={() => setSelectedDevice(devices[2])}
                  className={`cursor-pointer p-3 rounded-xl border flex flex-col items-center transition-all ${selectedDevice?.id === 'sw1' ? 'bg-slate-850 border-teal-500 shadow-lg shadow-teal-500/10' : 'bg-slate-900/90 border-slate-800 hover:border-slate-700'}`}
                >
                  <NetworkIcon className={`w-10 h-10 ${devices[2].status === 'online' ? 'text-teal-400' : 'text-slate-500'}`} />
                  <span className="text-[10px] font-mono mt-1 text-center font-medium truncate max-w-full">Switch-2960</span>
                  <span className={`w-2 h-2 rounded-full mt-1.5 ${devices[2].status === 'online' ? 'bg-teal-500' : 'bg-rose-500'}`}></span>
                </div>
              </div>

              {/* Column 3: Router & Server */}
              <div className="flex flex-col gap-16 w-1/4 items-end">
                {/* Router */}
                <div 
                  onClick={() => setSelectedDevice(devices[3])}
                  className={`cursor-pointer p-2.5 rounded-xl border flex flex-col items-center transition-all ${selectedDevice?.id === 'r1' ? 'bg-slate-850 border-teal-500 shadow-lg shadow-teal-500/10' : 'bg-slate-900/90 border-slate-800 hover:border-slate-700'}`}
                >
                  <Activity className={`w-8 h-8 ${devices[3].status === 'online' ? 'text-teal-400' : 'text-slate-500'}`} />
                  <span className="text-[10px] font-mono mt-1 text-center font-medium truncate max-w-full">Router-Gateway</span>
                  <span className={`w-2 h-2 rounded-full mt-1.5 ${devices[3].status === 'online' ? 'bg-teal-500' : 'bg-rose-500'}`}></span>
                </div>

                {/* Server */}
                <div 
                  onClick={() => setSelectedDevice(devices[4])}
                  className={`cursor-pointer p-2.5 rounded-xl border flex flex-col items-center transition-all ${selectedDevice?.id === 'srv' ? 'bg-slate-850 border-teal-500 shadow-lg shadow-teal-500/10' : 'bg-slate-900/90 border-slate-800 hover:border-slate-700'}`}
                >
                  <Server className={`w-8 h-8 ${devices[4].status === 'online' ? 'text-teal-400' : 'text-slate-500'}`} />
                  <span className="text-[10px] font-mono mt-1 text-center font-medium truncate max-w-full">Servidor-Local</span>
                  <span className={`w-2 h-2 rounded-full mt-1.5 ${devices[4].status === 'online' ? 'bg-teal-500' : 'bg-rose-500'}`}></span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick instructions bar */}
          <div className="text-[11px] bg-slate-900/80 p-2 border border-slate-800 rounded-lg text-slate-400 flex items-center justify-between">
            <span>💡 Haz clic en cualquier dispositivo para inspeccionar o encender/apagar</span>
            <span className="text-teal-400 font-mono text-[10px]">Interconectado con Cat6 UTP</span>
          </div>
        </div>

        {/* Console / Configuration & Ping Settings */}
        <div className="flex flex-col gap-4">
          {/* Selected Device Details */}
          {selectedDevice && (
            <div className="bg-slate-950/60 border border-slate-850 rounded-xl p-4 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs uppercase font-mono tracking-wider text-teal-400 font-semibold">{selectedDevice.type}</span>
                  <button 
                    onClick={() => toggleDeviceStatus(selectedDevice.id)}
                    className={`text-[10px] font-mono px-2 py-0.5 rounded transition-all cursor-pointer ${selectedDevice.status === 'online' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500/20' : 'bg-teal-500/10 text-teal-400 border border-teal-500/20 hover:bg-teal-500/20'}`}
                  >
                    {selectedDevice.status === 'online' ? 'Apagar Equipo' : 'Encender Equipo'}
                  </button>
                </div>
                <h5 className="font-display font-bold text-slate-200">{selectedDevice.name}</h5>
                <p className="text-xs text-slate-400 mt-2 min-h-[36px]">{selectedDevice.description}</p>
                
                <div className="mt-4 space-y-1 text-xs font-mono">
                  <div className="flex justify-between py-1 border-b border-slate-900">
                    <span className="text-slate-500">Dirección IP:</span>
                    <span className="text-slate-300 font-semibold">{selectedDevice.ip}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-900">
                    <span className="text-slate-500">Dirección MAC:</span>
                    <span className="text-slate-300">{selectedDevice.mac}</span>
                  </div>
                  {selectedDevice.gateway && (
                    <div className="flex justify-between py-1 border-b border-slate-900">
                      <span className="text-slate-500">Puerta Enlace:</span>
                      <span className="text-slate-300">{selectedDevice.gateway}</span>
                    </div>
                  )}
                  <div className="flex justify-between py-1">
                    <span className="text-slate-500">Estado Enlace:</span>
                    <span className={`font-semibold ${selectedDevice.status === 'online' ? 'text-teal-400' : 'text-rose-400'}`}>
                      {selectedDevice.status === 'online' ? 'UP (Activo)' : 'DOWN (Apagado)'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Test Ping Tool */}
          <div className="bg-slate-950/60 border border-slate-850 rounded-xl p-4 flex flex-col gap-3">
            <h5 className="font-display font-semibold text-slate-200 text-xs uppercase tracking-wider flex items-center gap-1.5 text-teal-400">
              <Activity className="w-4 h-4" />
              Herramienta de Diagnóstico (Ping)
            </h5>
            
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <label className="block text-slate-500 font-mono mb-1">Origen:</label>
                <select 
                  value={pingSource} 
                  onChange={(e) => setPingSource(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-slate-200 focus:outline-none focus:border-teal-500 font-mono cursor-pointer"
                >
                  <option value="pca">PC-Admon (192.168.10.15)</option>
                  <option value="pcb">PC-Soporte (192.168.10.16)</option>
                  <option value="srv">Servidor (10.0.0.80)</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-500 font-mono mb-1">Destino:</label>
                <select 
                  value={pingDest} 
                  onChange={(e) => setPingDest(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-slate-200 focus:outline-none focus:border-teal-500 font-mono cursor-pointer"
                >
                  <option value="srv">Servidor (10.0.0.80)</option>
                  <option value="pca">PC-Admon (192.168.10.15)</option>
                  <option value="pcb">PC-Soporte (192.168.10.16)</option>
                </select>
              </div>
            </div>

            <button
              onClick={handlePing}
              disabled={pingSource === pingDest || pingStatus === 'pinging'}
              className={`w-full py-2 px-4 rounded-lg font-sans font-medium text-xs flex justify-center items-center gap-2 transition-all cursor-pointer ${pingSource === pingDest ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-850' : 'bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold hover:shadow-lg hover:shadow-teal-500/10'}`}
            >
              {pingStatus === 'pinging' ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Transmitiendo Paquete...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  Ejecutar Ping de Prueba
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Terminal logs section */}
      <div className="mt-6">
        <div className="bg-slate-950 border border-slate-850 rounded-xl overflow-hidden font-mono text-xs">
          <div className="bg-slate-900 px-4 py-2 border-b border-slate-850 flex items-center justify-between text-slate-400">
            <span className="flex items-center gap-1.5 font-bold">
              <Terminal className="w-3.5 h-3.5 text-teal-400" />
              Consola del Administrador de Red - CCNA Cisco Systems
            </span>
            <div className="flex gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-teal-500"></span>
            </div>
          </div>
          <div className="p-4 space-y-1.5 max-h-[160px] overflow-y-auto bg-black text-slate-300">
            {terminalLogs.map((log, idx) => (
              <div 
                key={idx} 
                className={
                  log.startsWith('Error:') ? 'text-rose-400' :
                  log.startsWith('[RED]') ? 'text-amber-400' :
                  log.startsWith('Ping finalizado') ? 'text-teal-400 font-bold' :
                  log.startsWith('C:\\>') ? 'text-slate-400 font-semibold' : 'text-slate-300'
                }
              >
                {log}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
