import React, { useState } from 'react';
import { MapPin, Navigation, Compass, AlertTriangle, ShieldCheck, Zap, RotateCcw, Map } from 'lucide-react';
import { motion } from 'motion/react';

interface Node {
  id: string;
  name: string;
  x: number; // percentage
  y: number; // percentage
  description: string;
}

interface Edge {
  id: string;
  from: string;
  to: string;
  baseDistance: number; // km
  condition: 'perfect' | 'traffic' | 'potholes'; // Dynamic multipliers
}

export default function RouteOptimizer() {
  const [nodes] = useState<Node[]>([
    { id: 'h_mass', name: 'Hamburguesas MASS (Centro)', x: 50, y: 50, description: 'Sucursal principal de preparación y centro de despacho de pedidos.' },
    { id: 'jaltepec', name: 'Jaltepec', x: 20, y: 25, description: 'Zona residencial alta. Pendiente pronunciada y accesos empedrados.' },
    { id: 'paraiso', name: 'El Paraíso', x: 25, y: 75, description: 'Sector norte de alta densidad. Calles anchas pero tráfico moderado.' },
    { id: 'huapalcalco', name: 'Huapalcalco', x: 80, y: 20, description: 'Zona arqueológica e histórica. Pavimento regular, tramos rurales.' },
    { id: 'rojo_gomez', name: 'Rojo Gómez', x: 85, y: 70, description: 'Sector industrial-comercial. Tráfico pesado frecuente de carga.' },
    { id: 'esmeralda', name: 'La Esmeralda', x: 50, y: 15, description: 'Fraccionamiento residencial. Excelentes avenidas con semáforos.' }
  ]);

  const [edges, setEdges] = useState<Edge[]>([
    { id: 'e1', from: 'h_mass', to: 'jaltepec', baseDistance: 4.2, condition: 'perfect' },
    { id: 'e2', from: 'h_mass', to: 'paraiso', baseDistance: 3.5, condition: 'perfect' },
    { id: 'e3', from: 'h_mass', to: 'huapalcalco', baseDistance: 5.8, condition: 'perfect' },
    { id: 'e4', from: 'h_mass', to: 'rojo_gomez', baseDistance: 4.9, condition: 'perfect' },
    { id: 'e5', from: 'h_mass', to: 'esmeralda', baseDistance: 2.8, condition: 'perfect' },
    { id: 'e6', from: 'esmeralda', to: 'jaltepec', baseDistance: 3.1, condition: 'perfect' },
    { id: 'e7', from: 'esmeralda', to: 'huapalcalco', baseDistance: 4.0, condition: 'perfect' },
    { id: 'e8', from: 'paraiso', to: 'jaltepec', baseDistance: 5.0, condition: 'perfect' },
    { id: 'e9', from: 'rojo_gomez', to: 'huapalcalco', baseDistance: 6.2, condition: 'perfect' }
  ]);

  const [selectedDest, setSelectedDest] = useState<string>('jaltepec');
  const [optimalPath, setOptimalPath] = useState<string[]>([]);
  const [totalTime, setTotalTime] = useState<number | null>(null);
  const [totalDist, setTotalDist] = useState<number | null>(null);
  const [routeRating, setRouteRating] = useState<'excelente' | 'aceptable' | 'critica'>('excelente');
  const [activeTab, setActiveTab] = useState<'simulador' | 'conceptos'>('simulador');

  // Multiplier of travel time based on road condition
  const getWeightMultiplier = (condition: 'perfect' | 'traffic' | 'potholes') => {
    switch (condition) {
      case 'traffic': return 2.2; // 120% delay
      case 'potholes': return 1.6; // 60% delay
      case 'perfect': default: return 1.0;
    }
  };

  const toggleEdgeCondition = (id: string) => {
    setEdges(prev => prev.map(e => {
      if (e.id === id) {
        let nextCondition: 'perfect' | 'traffic' | 'potholes' = 'perfect';
        if (e.condition === 'perfect') nextCondition = 'traffic';
        else if (e.condition === 'traffic') nextCondition = 'potholes';
        return { ...e, condition: nextCondition };
      }
      return e;
    }));
    // Reset optimized path when weights change
    setOptimalPath([]);
    setTotalTime(null);
    setTotalDist(null);
  };

  // Run Dijkstra Algorithm (Simple authorative implementation)
  const calculateRoute = () => {
    const startNode = 'h_mass';
    const endNode = selectedDest;

    if (startNode === endNode) {
      setOptimalPath([startNode]);
      setTotalDist(0);
      setTotalTime(0);
      return;
    }

    // Prepare graph weights
    const graph: { [key: string]: { [key: string]: { dist: number, weight: number } } } = {};
    nodes.forEach(n => { graph[n.id] = {}; });

    edges.forEach(e => {
      const w = e.baseDistance * getWeightMultiplier(e.condition);
      graph[e.from][e.to] = { dist: e.baseDistance, weight: w };
      graph[e.to][e.from] = { dist: e.baseDistance, weight: w }; // Undirected
    });

    // Dijkstra state
    const distances: { [key: string]: number } = {};
    const previous: { [key: string]: string | null } = {};
    const unvisited = new Set<string>();

    nodes.forEach(n => {
      distances[n.id] = Infinity;
      previous[n.id] = null;
      unvisited.add(n.id);
    });
    distances[startNode] = 0;

    while (unvisited.size > 0) {
      // Find closest unvisited node
      let closestNode: string | null = null;
      let minDistance = Infinity;
      unvisited.forEach(n => {
        if (distances[n] < minDistance) {
          minDistance = distances[n];
          closestNode = n;
        }
      });

      if (closestNode === null || closestNode === endNode) break;

      unvisited.delete(closestNode);

      const neighbors = graph[closestNode];
      for (const neighborId in neighbors) {
        if (unvisited.has(neighborId)) {
          const edgeWeight = neighbors[neighborId].weight;
          const alt = distances[closestNode] + edgeWeight;
          if (alt < distances[neighborId]) {
            distances[neighborId] = alt;
            previous[neighborId] = closestNode;
          }
        }
      }
    }

    // Build path
    const path: string[] = [];
    let current: string | null = endNode;
    while (current !== null) {
      path.unshift(current);
      current = previous[current];
    }

    if (path[0] !== startNode) {
      // No path (should not happen in connected network)
      return;
    }

    // Calculate total actual distance and duration
    let calcDist = 0;
    let calcWeight = 0; // Travel cost in minutes (approx: baseSpeed of 40 km/h = 1.5 min per km)
    for (let i = 0; i < path.length - 1; i++) {
      const fromN = path[i];
      const toN = path[i + 1];
      const edgeData = graph[fromN][toN];
      calcDist += edgeData.dist;
      calcWeight += edgeData.weight;
    }

    // 1 km = 1.5 min base travel time
    const baseTravelTimeMin = calcDist * 1.5;
    const finalTravelTimeMin = calcWeight * 1.5; // accounts for traffic and road blocks

    setOptimalPath(path);
    setTotalDist(parseFloat(calcDist.toFixed(1)));
    setTotalTime(parseFloat(finalTravelTimeMin.toFixed(1)));

    // Rating based on delays
    const delaysRatio = finalTravelTimeMin / baseTravelTimeMin;
    if (delaysRatio < 1.1) {
      setRouteRating('excelente');
    } else if (delaysRatio < 1.7) {
      setRouteRating('aceptable');
    } else {
      setRouteRating('critica');
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 overflow-hidden text-slate-100" id="route-optimizer-card">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6 border-b border-slate-800 pb-4">
        <div>
          <h4 className="font-display text-xl font-bold text-amber-400 flex items-center gap-2">
            <Navigation className="w-6 h-6 animate-pulse" />
            Optimizador & Planificador de Rutas Inteligentes
          </h4>
          <p className="text-xs text-slate-400 mt-1 font-sans">
            Solución logística inspirada en la gestión de rutas y evaluación de caminos realizada en Hamburguesas MASS.
          </p>
        </div>
        
        <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
          <button 
            onClick={() => setActiveTab('simulador')}
            className={`px-3 py-1.5 rounded-md font-sans transition-all cursor-pointer ${activeTab === 'simulador' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'}`}
          >
            Simulador de Ruta
          </button>
          <button 
            onClick={() => setActiveTab('conceptos')}
            className={`px-3 py-1.5 rounded-md font-sans transition-all cursor-pointer ${activeTab === 'conceptos' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'}`}
          >
            Metodología de Evaluación
          </button>
        </div>
      </div>

      {activeTab === 'simulador' ? (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Interactive Routing Graph View */}
          <div className="xl:col-span-2 bg-slate-950/60 rounded-xl p-4 border border-slate-850 flex flex-col justify-between min-h-[400px] relative">
            <div className="absolute top-3 left-3 text-[10px] font-mono text-slate-500 uppercase tracking-widest pointer-events-none">
              Mapa Logístico de Tulancingo (Hidalgo)
            </div>

            {/* Path Weights Legend */}
            <div className="flex justify-end gap-2.5 mb-4 text-[10px] font-mono text-slate-400 flex-wrap">
              <div className="flex items-center gap-1">
                <span className="w-2.5 h-1 bg-teal-500 block"></span> Normal (Velocidad Base)
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2.5 h-1 bg-amber-500 block"></span> Baches / Daños (+60% tiempo)
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2.5 h-1 bg-rose-500 block"></span> Tráfico / Carga (+120% tiempo)
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2.5 h-1 border border-dashed border-amber-400 block"></span> Ruta Óptima
              </div>
            </div>

            {/* Visual SVG Map Graph */}
            <div className="relative flex-1 min-h-[250px] bg-slate-900/40 rounded-xl border border-slate-900/80 overflow-hidden">
              <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
                {/* Connections (Edges) */}
                {edges.map(edge => {
                  const fromNode = nodes.find(n => n.id === edge.from);
                  const toNode = nodes.find(n => n.id === edge.to);
                  if (!fromNode || !toNode) return null;

                  const isOptimal = optimalPath.includes(edge.from) && 
                                    optimalPath.includes(edge.to) &&
                                    Math.abs(optimalPath.indexOf(edge.from) - optimalPath.indexOf(edge.to)) === 1;

                  let strokeColor = '#14b8a6'; // perfect
                  if (edge.condition === 'traffic') strokeColor = '#f43f5e';
                  else if (edge.condition === 'potholes') strokeColor = '#f59e0b';

                  return (
                    <g key={edge.id}>
                      {/* Base connection wire */}
                      <line
                        x1={`${fromNode.x}%`}
                        y1={`${fromNode.y}%`}
                        x2={`${toNode.x}%`}
                        y2={`${toNode.y}%`}
                        stroke={strokeColor}
                        strokeWidth={isOptimal ? "5" : "2.5"}
                        className="transition-all duration-300"
                        opacity={isOptimal ? 0.9 : 0.4}
                      />
                      {/* Highlighted dotted path if in current optimal route */}
                      {isOptimal && (
                        <line
                          x1={`${fromNode.x}%`}
                          y1={`${fromNode.y}%`}
                          x2={`${toNode.x}%`}
                          y2={`${toNode.y}%`}
                          stroke="#fbbf24"
                          strokeWidth="2"
                          strokeDasharray="6 4"
                          className="animate-[dash_1s_linear_infinite]"
                          style={{
                            strokeDashoffset: 10,
                          }}
                        />
                      )}
                      
                      {/* Interactive edge weight button placeholder (middle of line) */}
                      <foreignObject
                        x={`${(fromNode.x + toNode.x) / 2 - 22}%`}
                        y={`${(fromNode.y + toNode.y) / 2 - 12}%`}
                        width="44"
                        height="24"
                        className="overflow-visible"
                      >
                        <button
                          onClick={() => toggleEdgeCondition(edge.id)}
                          title="Click para cambiar condición de este camino"
                          className={`w-11 h-6 rounded-full text-[9px] font-mono flex items-center justify-center border font-bold shadow-md transition-all cursor-pointer ${
                            edge.condition === 'traffic' ? 'bg-rose-950/90 text-rose-400 border-rose-500' :
                            edge.condition === 'potholes' ? 'bg-amber-950/90 text-amber-400 border-amber-500' :
                            'bg-slate-900/95 text-teal-400 border-teal-500/30'
                          } hover:scale-105`}
                        >
                          {edge.baseDistance} km
                        </button>
                      </foreignObject>
                    </g>
                  );
                })}

                {/* Draw Node Markers */}
                {nodes.map(node => {
                  const isSource = node.id === 'h_mass';
                  const isSelectedDest = node.id === selectedDest;
                  const isInPath = optimalPath.includes(node.id);

                  return (
                    <g key={node.id}>
                      <foreignObject
                        x={`${node.x - 7}%`}
                        y={`${node.y - 7}%`}
                        width="14%"
                        height="14%"
                        className="overflow-visible"
                      >
                        <div className="flex flex-col items-center justify-center text-center h-full">
                          <button
                            onClick={() => {
                              if (!isSource) setSelectedDest(node.id);
                            }}
                            disabled={isSource}
                            className={`w-7 h-7 rounded-full flex items-center justify-center shadow-lg transition-all border cursor-pointer ${
                              isSource ? 'bg-indigo-600 border-indigo-400 ring-4 ring-indigo-500/20 text-white' :
                              isSelectedDest ? 'bg-amber-500 border-amber-300 ring-4 ring-amber-500/30 text-slate-950 font-bold' :
                              isInPath ? 'bg-amber-950/80 border-amber-500 text-amber-400' :
                              'bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-500'
                            }`}
                          >
                            <MapPin className="w-4 h-4" />
                          </button>
                          <span className={`text-[10px] font-sans font-medium px-1.5 py-0.5 rounded bg-slate-950/90 border mt-1 select-none pointer-events-none truncate max-w-full ${
                            isSource ? 'text-indigo-300 border-indigo-900' :
                            isSelectedDest ? 'text-amber-400 border-amber-600 font-semibold' :
                            'text-slate-400 border-slate-850'
                          }`}>
                            {node.name.split(' ')[0]}
                          </span>
                        </div>
                      </foreignObject>
                    </g>
                  );
                })}
              </svg>
            </div>

            <div className="text-[11px] bg-slate-900/80 p-2 border border-slate-800 rounded-lg text-slate-400 flex items-center justify-between">
              <span>💡 Haz clic en los botones de kilometraje para alternar el estado del camino (Normal ➔ Tráfico ➔ Bache)</span>
              <span className="text-amber-400 font-mono text-[10px]">Cálculo en Tiempo Real</span>
            </div>
          </div>

          {/* Configuration and Results Column */}
          <div className="flex flex-col gap-4 justify-between">
            {/* Set Destination and Action */}
            <div className="bg-slate-950/60 border border-slate-850 rounded-xl p-4 flex flex-col gap-4">
              <h5 className="font-display font-semibold text-slate-200 text-xs uppercase tracking-wider text-amber-400">
                Configuración del Pedido
              </h5>

              <div>
                <label className="block text-xs text-slate-400 mb-1.5 font-sans">Seleccionar Punto de Reparto:</label>
                <select
                  value={selectedDest}
                  onChange={(e) => {
                    setSelectedDest(e.target.value);
                    setOptimalPath([]); // Clear until recalc
                  }}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-slate-200 text-xs focus:outline-none focus:border-amber-500 font-sans cursor-pointer"
                >
                  {nodes.filter(n => n.id !== 'h_mass').map(n => (
                    <option key={n.id} value={n.id}>{n.name}</option>
                  ))}
                </select>
                <p className="text-[11px] text-slate-400 mt-2 italic">
                  "{nodes.find(n => n.id === selectedDest)?.description}"
                </p>
              </div>

              <button
                onClick={calculateRoute}
                className="w-full py-2.5 px-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-sans font-bold text-xs rounded-lg shadow-lg hover:shadow-amber-500/10 flex justify-center items-center gap-2 transition-all cursor-pointer"
              >
                <Compass className="w-4 h-4 animate-spin-slow" />
                Optimizar Ruta de Entrega
              </button>
            </div>

            {/* Output Results */}
            <div className="bg-slate-950/60 border border-slate-850 rounded-xl p-4 flex-1 flex flex-col justify-between">
              <div>
                <h5 className="font-display font-semibold text-slate-200 text-xs uppercase tracking-wider text-amber-400 mb-3">
                  Reporte de Ruta Óptima (MASS)
                </h5>

                {optimalPath.length > 0 ? (
                  <div className="space-y-4">
                    {/* Path summary nodes list */}
                    <div className="space-y-1.5">
                      <span className="text-[10px] uppercase font-mono text-slate-500 block">Trayectoria Recomendada:</span>
                      <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono">
                        {optimalPath.map((nodeId, idx) => {
                          const isLast = idx === optimalPath.length - 1;
                          const name = nodes.find(n => n.id === nodeId)?.name.split(' ')[0] || '';
                          return (
                            <React.Fragment key={nodeId}>
                              <span className={`px-2 py-0.5 rounded font-semibold ${idx === 0 ? 'bg-indigo-950/60 text-indigo-400 border border-indigo-500/20' : isLast ? 'bg-amber-950/60 text-amber-400 border border-amber-500/20' : 'bg-slate-900 text-slate-300 border border-slate-800'}`}>
                                {name}
                              </span>
                              {!isLast && <span className="text-slate-600">➔</span>}
                            </React.Fragment>
                          );
                        })}
                      </div>
                    </div>

                    {/* Stats metrics */}
                    <div className="grid grid-cols-2 gap-3 mt-4">
                      <div className="p-2 bg-slate-900/60 rounded border border-slate-850">
                        <span className="text-[10px] font-mono text-slate-500 block">DISTANCIA TOTAL:</span>
                        <span className="text-lg font-bold font-mono text-teal-400">{totalDist} km</span>
                      </div>
                      <div className="p-2 bg-slate-900/60 rounded border border-slate-850">
                        <span className="text-[10px] font-mono text-slate-500 block">TIEMPO ESTIMADO:</span>
                        <span className="text-lg font-bold font-mono text-amber-400">{totalTime} mins</span>
                      </div>
                    </div>

                    {/* Evaluation status feedback */}
                    <div className="mt-3 text-xs font-sans">
                      <span className="text-[10px] font-mono text-slate-500 block uppercase mb-1">Evaluación de Viabilidad (5★):</span>
                      {routeRating === 'excelente' && (
                        <div className="flex items-center gap-1.5 text-teal-400 bg-teal-500/5 p-2 rounded border border-teal-500/10">
                          <ShieldCheck className="w-4 h-4 shrink-0" />
                          <span>Excelente vialidad. Ruta despejada, ideal para motocicletas de reparto.</span>
                        </div>
                      )}
                      {routeRating === 'aceptable' && (
                        <div className="flex items-center gap-1.5 text-amber-400 bg-amber-500/5 p-2 rounded border border-amber-500/10">
                          <AlertTriangle className="w-4 h-4 shrink-0" />
                          <span>Retrasos moderados por baches o tráfico medio. Avance con precaución.</span>
                        </div>
                      )}
                      {routeRating === 'critica' && (
                        <div className="flex items-center gap-1.5 text-rose-400 bg-rose-500/5 p-2 rounded border border-rose-500/10">
                          <AlertTriangle className="w-4 h-4 shrink-0" />
                          <span>Ruta saturada. Se sugiere evaluar tiempos de entrega adicionales.</span>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center text-center py-8 text-slate-500">
                    <Map className="w-8 h-8 text-slate-600 mb-2" />
                    <p className="text-xs">Haz clic en "Optimizar Ruta" para computar el algoritmo de despacho.</p>
                  </div>
                )}
              </div>

              {optimalPath.length > 0 && (
                <button
                  onClick={() => {
                    setOptimalPath([]);
                    setTotalDist(null);
                    setTotalTime(null);
                  }}
                  className="w-full text-center text-slate-400 hover:text-slate-200 font-mono text-[10px] mt-4 flex items-center justify-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" /> Limpiar Análisis
                </button>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-slate-950/60 border border-slate-850 rounded-xl p-6 font-sans text-xs space-y-4">
          <h5 className="font-display font-semibold text-sm text-amber-400">¿Cómo funciona la Evaluación de Caminos y Rutas?</h5>
          <p className="text-slate-300 leading-relaxed">
            Como responsable de logística, Geovanni aplica metodologías estructuradas para garantizar entregas en tiempo récord,
            minimizando el desgaste de los vehículos de reparto. La evaluación se fundamenta en tres pilares:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
            <div className="p-4 bg-slate-900 rounded-lg border border-slate-800">
              <div className="flex items-center gap-2 mb-2">
                <span className="p-1.5 rounded bg-teal-500/10 text-teal-400"><Compass className="w-4 h-4" /></span>
                <span className="font-bold text-slate-200">Algoritmia de Caminos</span>
              </div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Utilización del algoritmo de Dijkstra para resolver el problema del camino más corto, evaluando distancias ponderadas dinámicamente basadas en las variables del entorno real.
              </p>
            </div>

            <div className="p-4 bg-slate-900 rounded-lg border border-slate-800">
              <div className="flex items-center gap-2 mb-2">
                <span className="p-1.5 rounded bg-amber-500/10 text-amber-400"><AlertTriangle className="w-4 h-4" /></span>
                <span className="font-bold text-slate-200">Evaluación del Terreno</span>
              </div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Clasificación de vialidades de Tulancingo por su estado de pavimentación. Se asignan penalizaciones de velocidad para evitar baches que pongan en riesgo la mercancía.
              </p>
            </div>

            <div className="p-4 bg-slate-900 rounded-lg border border-slate-800">
              <div className="flex items-center gap-2 mb-2">
                <span className="p-1.5 rounded bg-indigo-500/10 text-indigo-400"><Zap className="w-4 h-4" /></span>
                <span className="font-bold text-slate-200">Despacho Dinámico</span>
              </div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Monitoreo de flujos de tráfico pesado e industrial en sectores comerciales (como la col. Rojo Gómez), recomendando rutas alternas en horarios críticos.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
