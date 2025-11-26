import React, { useState, useMemo, useEffect, useRef } from 'react';
import { SimulatorMode, SimulationDataPoint } from '../types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { getAIExplanation } from '../services/geminiService';

const Simulator: React.FC = () => {
  const [mode, setMode] = useState<SimulatorMode>(SimulatorMode.SPHERE_GAP);
  const [loadingAI, setLoadingAI] = useState(false);
  const [aiExplanation, setAiExplanation] = useState<string | null>(null);

  // --- States for Sphere Gap ---
  const [vinSphere, setVinSphere] = useState(0); // kV (Input Voltage)
  const [gapDistance, setGapDistance] = useState(2); // cm
  const [temperature, setTemperature] = useState(25); // Celsius
  const [pressure, setPressure] = useState(760); // mmHg
  
  // --- States for Resistive Divider ---
  const [vinResistive, setVinResistive] = useState(50); // kV
  const [r1, setR1] = useState(1000); // MegaOhm
  const [r2, setR2] = useState(100); // KiloOhm
  
  // --- States for Capacitive Divider ---
  const [vinCapacitive, setVinCapacitive] = useState(50); // kV
  const [c1, setC1] = useState(100); // pF (HV Cap)
  const [c2, setC2] = useState(0.1); // uF (LV Cap) -> convert to pF for math

  // --- Animation State for Oscilloscope & Effects ---
  const [time, setTime] = useState(0);
  const requestRef = useRef<number>(0);

  useEffect(() => {
    const animate = (timestamp: number) => {
      setTime(timestamp / 1000); // Convert to seconds
      requestRef.current = requestAnimationFrame(animate);
    };
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, []);

  // AI Handler
  const handleAskAI = async () => {
    setLoadingAI(true);
    setAiExplanation(null);
    let topic = "";
    let context = "";

    if (mode === SimulatorMode.SPHERE_GAP) {
      topic = "Fenomena Tembus Listrik (Breakdown) pada Sela Bola";
      context = `Tegangan Input: ${vinSphere} kV, Jarak: ${gapDistance} cm. Apakah terjadi breakdown? Jelaskan mekanismenya.`;
    } else if (mode === SimulatorMode.RESISTIVE_DIVIDER) {
      topic = "Distribusi Tegangan pada Pembagi Resistif";
      context = `Vin: ${vinResistive} kV, R1: ${r1} MOhm, R2: ${r2} kOhm. Bagaimana tegangan terdistribusi dan apakah aman untuk alat ukur?`;
    } else {
      topic = "Prinsip Pembagi Tegangan Kapasitif";
      context = `Vin: ${vinCapacitive} kV, C1: ${c1} pF, C2: ${c2} uF. Jelaskan hubungan impedansi kapasitif dengan pembagian tegangan.`;
    }

    const explanation = await getAIExplanation(topic, context);
    setAiExplanation(explanation);
    setLoadingAI(false);
  };

  // --- Calculations ---
  
  // Sphere Gap
  const sphereGapData = useMemo(() => {
    const delta = (0.386 * pressure) / (273 + temperature);
    // Formula approx for standard spheres
    const calculatedVb = (24.22 * delta * gapDistance) + (6.08 * Math.sqrt(delta * gapDistance));
    
    const isBreakdown = vinSphere >= calculatedVb;
    const safetyMargin = calculatedVb - vinSphere;
    // For Corona visual effect (starts appearing at 70% of Vb)
    const coronaIntensity = Math.max(0, (vinSphere - (calculatedVb * 0.7)) / (calculatedVb * 0.3));
    
    // Critical zone for streamers (80% - 99% of Vb)
    const isCritical = !isBreakdown && vinSphere > calculatedVb * 0.8;

    const points: SimulationDataPoint[] = [];
    for (let d = 0.5; d <= 5.0; d += 0.25) {
        const v = (24.22 * delta * d) + (6.08 * Math.sqrt(delta * d));
        points.push({ x: d, y: parseFloat(v.toFixed(2)) });
    }
    return { vb: calculatedVb, points, delta, isBreakdown, safetyMargin, coronaIntensity, isCritical };
  }, [gapDistance, temperature, pressure, vinSphere]);

  // Resistive Divider
  const resistiveData = useMemo(() => {
    const r2_M = r2 / 1000; // Convert kOhm to MOhm
    const ratio = (r1 + r2_M) / r2_M;
    const vout_kV = vinResistive / ratio;
    const vout_V = vout_kV * 1000;
    
    // Safety Logic: Updated to 600V based on request
    const maxSafeOutputVoltage = 600; // Volts
    const isOverLimit = vout_V > maxSafeOutputVoltage;

    // Calculated HV based on Meter Reading
    const measuredHV = (vout_V * ratio) / 1000; // Convert back to kV

    const points: SimulationDataPoint[] = [];
    // Plot Vin vs Vout
    for (let v = 0; v <= 300; v += 20) {
        const vo = (v / ratio) * 1000; 
        points.push({ x: v, y: parseFloat(vo.toFixed(2)) });
    }
    return { vout: vout_V, ratio, points, isOverLimit, maxSafeOutputVoltage, measuredHV };
  }, [vinResistive, r1, r2]);

  // Capacitive Divider
  const capacitiveData = useMemo(() => {
    const c2_pF = c2 * 1000000; // Convert uF to pF
    // Vout = Vin * (C1 / (C1 + C2))
    const ratio = (c1 + c2_pF) / c1; // This is the divider ratio (Vin/Vout)
    const vout_kV = vinCapacitive * (c1 / (c1 + c2_pF));
    const vout_V = vout_kV * 1000;

    // Safety Logic: Updated to 600V based on request
    const maxSafeOutputVoltage = 600; // Volts
    const isOverLimit = vout_V > maxSafeOutputVoltage;

    // Calculated HV based on Meter Reading
    const measuredHV = (vout_V * ratio) / 1000; // Convert back to kV

    const points: SimulationDataPoint[] = [];
    for (let v = 0; v <= 300; v += 20) {
        const vo = (v * (c1 / (c1 + c2_pF))) * 1000;
        points.push({ x: v, y: parseFloat(vo.toFixed(2)) });
    }
    return { vout: vout_V, ratio, points, isOverLimit, maxSafeOutputVoltage, measuredHV };
  }, [vinCapacitive, c1, c2]);

  // Helper for Oscilloscope Wave
  const generateWavePath = (amplitude: number, frequency: number, phase: number, width: number, height: number, color: string, isClipped = false) => {
    let path = `M 0 ${height / 2}`;
    for (let x = 0; x <= width; x++) {
      let yNorm = Math.sin((x / width) * Math.PI * 2 * frequency - phase * 5);
      if (isClipped && yNorm > 0.5) yNorm = 0.05 + Math.random() * 0.1; // Breakdown noise
      if (isClipped && yNorm < -0.5) yNorm = -0.05 - Math.random() * 0.1;

      const y = (height / 2) - (yNorm * amplitude);
      path += ` L ${x} ${y}`;
    }
    return <path d={path} stroke={color} strokeWidth="2" fill="none" />;
  };

  // Helper for Jagged Lightning Path
  const generateJaggedPath = (startX: number, startY: number, endX: number, endY: number, segments: number, spread: number, timeVal: number) => {
    let path = `M ${startX} ${startY}`;
    const stepY = (endY - startY) / segments;

    for (let i = 1; i < segments; i++) {
        // Use sine and random noise to create jitter based on time
        const noise = (Math.random() - 0.5) * spread;
        const drift = Math.sin(timeVal * 10 + i) * (spread / 2); 
        const nextX = startX + noise + drift;
        const nextY = startY + (stepY * i);
        path += ` L ${nextX} ${nextY}`;
    }
    path += ` L ${endX} ${endY}`;
    return path;
  };

  // --- Render Circuit Diagram & Animation ---
  const renderCircuit = () => {
    // CSS Animations for SVG
    const svgStyles = (
      <style>{`
        @keyframes flow {
          to { stroke-dashoffset: -40; }
        }
        @keyframes buzz {
          0% { transform: translate(0, 0); }
          25% { transform: translate(-1px, 1px); }
          50% { transform: translate(1px, -1px); }
          75% { transform: translate(-1px, -1px); }
          100% { transform: translate(0, 0); }
        }
        @keyframes fieldPulse {
          0%, 100% { opacity: 0.1; stroke-width: 1px; }
          50% { opacity: 0.8; stroke-width: 2px; }
        }
        @keyframes float {
          0% { transform: translateY(0px) scale(1); opacity: 0; }
          50% { opacity: 0.8; }
          100% { transform: translateY(20px) scale(0); opacity: 0; }
        }
        @keyframes flash {
          0%, 100% { opacity: 0; }
          5% { opacity: 0.8; }
          10% { opacity: 0; }
        }
        @keyframes streamer {
            0% { opacity: 0; stroke-dashoffset: 10; }
            50% { opacity: 1; stroke-dashoffset: 0; }
            100% { opacity: 0; stroke-dashoffset: -10; }
        }
      `}</style>
    );

    switch(mode) {
      case SimulatorMode.SPHERE_GAP:
        const { isBreakdown, coronaIntensity, isCritical } = sphereGapData;
        const coronaOpacity = Math.min(coronaIntensity, 1) * 0.8;
        // Make corona breathe
        const coronaSize = (20 * Math.min(coronaIntensity, 1)) + (Math.sin(time * 5) * 5); 
        const ionizationOpacity = Math.min(coronaIntensity, 0.5) * 0.5;

        return (
          <div className="relative w-full h-full flex items-center justify-center bg-slate-900 rounded-xl overflow-hidden border-2 border-slate-700">
            {svgStyles}
            {/* Background Grid */}
            <div className="absolute inset-0 opacity-20" 
                 style={{backgroundImage: 'linear-gradient(#334155 1px, transparent 1px), linear-gradient(90deg, #334155 1px, transparent 1px)', backgroundSize: '20px 20px'}}>
            </div>

            {/* Flash Overlay when breakdown */}
            {isBreakdown && (
                <div className="absolute inset-0 bg-white pointer-events-none z-50 animate-[flash_0.1s_ease-in-out_infinite]"></div>
            )}
            
            <div className="relative z-10 flex flex-col items-center h-full justify-center w-full">
                <div className={`absolute top-4 font-bold text-lg tracking-widest ${isBreakdown ? 'text-red-500 animate-pulse' : 'text-green-500'}`}>
                    {isBreakdown ? '⚡ BREAKDOWN / TEMBUS ⚡' : 'ISOLASI AMAN'}
                </div>
                
                <div className="text-white font-mono text-xs mb-2">{vinSphere} kV</div>

                {/* Top Sphere (HV) */}
                <div className="relative z-20">
                    {/* Corona Glow Effect */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500 mix-blend-screen pointer-events-none transition-all duration-75"
                         style={{
                             width: `${100 + coronaSize}px`,
                             height: `${100 + coronaSize}px`,
                             opacity: isBreakdown ? 0.2 : coronaOpacity,
                             filter: 'blur(15px)'
                         }}>
                    </div>
                    
                    <div className={`w-24 h-24 rounded-full bg-gradient-to-b from-blue-400 to-blue-700 shadow-xl relative z-20 transition-all duration-300 ${isBreakdown ? 'shadow-[0_0_30px_rgba(239,68,68,0.8)]' : ''}`}>
                        <div className="w-8 h-8 bg-white/20 rounded-full absolute top-4 left-4 blur-sm"></div>
                    </div>
                </div>

                {/* The Gap Area */}
                <div className="relative w-full flex justify-center items-center" style={{ height: `${Math.min(gapDistance * 10, 100)}px`, minHeight: '40px', transition: 'height 0.3s ease' }}>
                    
                    {/* Ionization Field (Purple Gradient appearing before breakdown) */}
                    <div className="absolute w-24 h-full bg-indigo-500 blur-xl rounded-full transition-opacity duration-300" 
                         style={{ opacity: ionizationOpacity }}></div>

                    {/* Central Axis Line */}
                    <div className="absolute left-1/2 -translate-x-1/2 w-px h-full border-l border-dashed border-slate-500 opacity-30"></div>
                    
                    {/* Streamers (Pre-breakdown, critical zone) */}
                    {isCritical && (
                        <svg className="absolute inset-0 w-full h-full overflow-visible z-20 pointer-events-none">
                            {[1, 2, 3].map(i => (
                                <path 
                                    key={i}
                                    d={`M ${50 + (Math.random()-0.5)*10}% 0 Q ${50 + (Math.random()-0.5)*30}% ${30 + Math.random()*20}% ${50 + (Math.random()-0.5)*20}% 60%`}
                                    stroke="#a855f7" 
                                    strokeWidth="1" 
                                    fill="none" 
                                    className="animate-[streamer_0.2s_linear_infinite]"
                                    style={{ animationDelay: `${i * 0.1}s` }}
                                />
                            ))}
                        </svg>
                    )}

                    {/* Breakdown Arc */}
                    {isBreakdown && (
                        <svg className="absolute inset-0 w-full h-full overflow-visible z-30" preserveAspectRatio="none">
                            {/* Outer Glow Arc */}
                            <path 
                                d={generateJaggedPath(200, 0, 200, Math.min(gapDistance * 10, 100), 8, 30, time)} 
                                stroke="#3b82f6" strokeWidth="8" fill="none"
                                className="blur-md opacity-80" vectorEffect="non-scaling-stroke"
                            />
                            {/* Main Arc */}
                            <path 
                                d={generateJaggedPath(200, 0, 200, Math.min(gapDistance * 10, 100), 10, 25, time + 0.5)} 
                                stroke="#fef08a" strokeWidth="4" fill="none"
                                className="drop-shadow-[0_0_10px_rgba(250,204,21,1)]" vectorEffect="non-scaling-stroke"
                            />
                             {/* Inner White Core */}
                             <path 
                                d={generateJaggedPath(200, 0, 200, Math.min(gapDistance * 10, 100), 10, 25, time + 0.5)} 
                                stroke="#ffffff" strokeWidth="1" fill="none"
                                vectorEffect="non-scaling-stroke"
                            />
                        </svg>
                    )}
                </div>

                {/* Bottom Sphere (GND) */}
                <div className="w-24 h-24 rounded-full bg-gradient-to-t from-emerald-600 to-emerald-400 shadow-xl z-20 relative">
                     {/* Reflection from spark */}
                     {isBreakdown && (
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-8 bg-yellow-200 rounded-full blur-lg opacity-50"></div>
                     )}
                    <div className="w-8 h-8 bg-white/20 rounded-full absolute top-4 left-4 blur-sm"></div>
                </div>
                <div className="text-white font-mono text-xs mt-2">0 kV</div>
            </div>
          </div>
        );

      case SimulatorMode.RESISTIVE_DIVIDER:
        const stressColorR = resistiveData.isOverLimit ? '#ef4444' : '#059669'; 
        const glowOpacity = Math.min(vinResistive / 300, 1); 
        // Animation speed calculation (faster flow at higher voltage)
        const flowSpeed = Math.max(0.1, 50 / (vinResistive + 1)); 

        return (
          <svg viewBox="0 0 400 300" className="w-full h-full bg-slate-50 rounded-xl border border-slate-200">
            {svgStyles}
            <defs>
                <filter id="glow">
                    <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
                    <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
                </filter>
            </defs>
            
            {/* Source */}
            <g transform="translate(60, 150)">
                <circle cx="0" cy="0" r="20" stroke="#334155" strokeWidth="2" fill="none" />
                <path d="M -10 0 Q -5 -10 0 0 T 10 0" stroke="#334155" strokeWidth="2" fill="none" />
                <text x="0" y="35" textAnchor="middle" className="text-[10px] font-bold fill-slate-500">HV Source</text>
                <text x="0" y="-30" textAnchor="middle" className="text-xs font-bold fill-slate-700">{vinResistive} kV</text>
            </g>

            {/* Main Circuit Path for Electron Flow Animation */}
            <path d="M 60 150 L 60 50 L 200 50 L 200 270 L 60 270 L 60 150" 
                  fill="none" stroke="#fbbf24" strokeWidth="3" 
                  strokeDasharray="8 6" strokeOpacity="0.8"
                  style={{ animation: `flow ${flowSpeed}s linear infinite` }} />

            {/* Static Lines Overlay (Circuit Structure) */}
            <line x1="60" y1="130" x2="60" y2="50" stroke="#334155" strokeWidth="2" />
            <line x1="60" y1="50" x2="200" y2="50" stroke="#334155" strokeWidth="2" />
            <line x1="200" y1="50" x2="200" y2="70" stroke="#334155" strokeWidth="2" />
            
            {/* R1 (HV Resistor) with Thermal Stress Shake */}
            <g style={resistiveData.isOverLimit ? { animation: 'buzz 0.2s infinite' } : {}}>
                <rect x="190" y="70" width="20" height="90" rx="2" fill="white" stroke={stressColorR} strokeWidth="2" 
                      filter={vinResistive > 100 ? "url(#glow)" : ""} />
                <rect x="192" y="72" width="16" height="86" fill={stressColorR} opacity={glowOpacity * 0.5} />
                {/* Heat Lines if Hot */}
                {vinResistive > 200 && (
                    <g opacity={glowOpacity}>
                         <path d="M 185 80 Q 180 90 185 100" stroke="orange" fill="none" strokeWidth="1" className="animate-pulse"/>
                         <path d="M 215 100 Q 220 110 215 120" stroke="orange" fill="none" strokeWidth="1" className="animate-pulse"/>
                    </g>
                )}
            </g>
            <text x="185" y="115" textAnchor="end" className="text-xs font-mono fill-slate-500">R1</text>
            
            <line x1="200" y1="160" x2="200" y2="190" stroke="#334155" strokeWidth="2" />
            <circle cx="200" cy="175" r="4" fill="#334155" /> 

            {/* R2 (Measuring Resistor) */}
            <rect x="190" y="190" width="20" height="40" rx="2" fill="white" stroke="#334155" strokeWidth="2" />
            <text x="185" y="215" textAnchor="end" className="text-xs font-mono fill-slate-500">R2</text>
            
            <line x1="200" y1="230" x2="200" y2="270" stroke="#334155" strokeWidth="2" />

            {/* Measurement Tap */}
            <line x1="200" y1="175" x2="320" y2="175" stroke="#334155" strokeWidth="2" />
            <line x1="320" y1="175" x2="320" y2="210" stroke="#334155" strokeWidth="2" />
            
            {/* Voltmeter */}
            <g transform="translate(320, 230)">
                <circle cx="0" cy="0" r="20" fill={resistiveData.isOverLimit ? "#fecaca" : "white"} stroke={resistiveData.isOverLimit ? "#ef4444" : "#334155"} strokeWidth="2" />
                <text x="0" y="5" textAnchor="middle" className={`text-lg font-bold ${resistiveData.isOverLimit ? "fill-red-600 animate-pulse" : "fill-slate-700"}`}>V</text>
                <text x="30" y="5" className={`text-xs font-bold ${resistiveData.isOverLimit ? "fill-red-600" : "fill-blue-600"}`}>{resistiveData.vout.toFixed(1)}V</text>
            </g>
            <line x1="320" y1="250" x2="320" y2="270" stroke="#334155" strokeWidth="2" />

            {/* Grounding Rail */}
            <line x1="60" y1="170" x2="60" y2="270" stroke="#334155" strokeWidth="2" />
            <line x1="60" y1="270" x2="320" y2="270" stroke="#334155" strokeWidth="2" />
            
            <line x1="180" y1="270" x2="220" y2="270" stroke="#334155" strokeWidth="2" />
            <line x1="190" y1="275" x2="210" y2="275" stroke="#334155" strokeWidth="2" />
            <line x1="195" y1="280" x2="205" y2="280" stroke="#334155" strokeWidth="2" />

            <text x="200" y="30" textAnchor="middle" className={`text-xs font-bold uppercase ${resistiveData.isOverLimit ? 'fill-red-600' : 'fill-slate-400'}`}>
                {resistiveData.isOverLimit ? `⚠️ DANGER: V_out > ${resistiveData.maxSafeOutputVoltage}V` : 'Normal Operation'}
            </text>
          </svg>
        );

      case SimulatorMode.CAPACITIVE_DIVIDER:
        const capStressColor = capacitiveData.isOverLimit ? '#ef4444' : '#7c3aed';
        const capGlow = Math.min(vinCapacitive / 300, 1);
        const fieldOpacity = Math.min(vinCapacitive / 200, 1);

        return (
          <svg viewBox="0 0 400 300" className="w-full h-full bg-slate-50 rounded-xl border border-slate-200">
             {svgStyles}
             <defs>
                <filter id="glowCap">
                    <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                    <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
                </filter>
            </defs>

            {/* Source */}
            <g transform="translate(60, 150)">
                <circle cx="0" cy="0" r="20" stroke="#334155" strokeWidth="2" fill="none" />
                <path d="M -10 0 Q -5 -10 0 0 T 10 0" stroke="#334155" strokeWidth="2" fill="none" />
                <text x="0" y="35" textAnchor="middle" className="text-[10px] font-bold fill-slate-500">HV Source</text>
                <text x="0" y="-30" textAnchor="middle" className="text-xs font-bold fill-slate-700">{vinCapacitive} kV</text>
            </g>
            <line x1="60" y1="130" x2="60" y2="50" stroke="#334155" strokeWidth="2" />
            <line x1="60" y1="50" x2="200" y2="50" stroke="#334155" strokeWidth="2" />

            {/* CAPACITIVE COLUMN */}
            <line x1="200" y1="50" x2="200" y2="80" stroke="#334155" strokeWidth="2" />
            
            {/* C1 (HV Cap) */}
            <g filter={vinCapacitive > 100 ? "url(#glowCap)" : ""}>
                {/* Top Plate */}
                <line x1="170" y1="80" x2="230" y2="80" stroke={capStressColor} strokeWidth="4" />
                
                {/* Electric Field Lines Animation */}
                <g className="field-lines">
                    {[180, 190, 200, 210, 220].map((x, i) => (
                        <line key={i} x1={x} y1="82" x2={x} y2="98" stroke={capStressColor} 
                              strokeDasharray="2 2"
                              style={{ 
                                  animation: `fieldPulse ${1 + (i%2)*0.5}s infinite ease-in-out`,
                                  opacity: fieldOpacity 
                              }} 
                        />
                    ))}
                </g>
                
                {/* Inner Glow Block */}
                <rect x="170" y="82" width="60" height="16" fill={capStressColor} opacity={capGlow * 0.3} />
                
                {/* Bottom Plate */}
                <line x1="170" y1="100" x2="230" y2="100" stroke={capStressColor} strokeWidth="4" />
            </g>
            <text x="160" y="95" textAnchor="end" className="text-xs font-mono fill-slate-500">C1</text>
            
            <line x1="200" y1="100" x2="200" y2="150" stroke="#334155" strokeWidth="2" />
            <circle cx="200" cy="125" r="4" fill="#334155" />

            {/* C2 (LV Cap) */}
            <line x1="200" y1="150" x2="200" y2="180" stroke="#334155" strokeWidth="2" />
            <line x1="170" y1="180" x2="230" y2="180" stroke="#334155" strokeWidth="3" />
            <line x1="170" y1="195" x2="230" y2="195" stroke="#334155" strokeWidth="3" />
            <text x="160" y="195" textAnchor="end" className="text-xs font-mono fill-slate-500">C2</text>
            
            <line x1="200" y1="195" x2="200" y2="270" stroke="#334155" strokeWidth="2" />

            {/* Measurement Tap */}
            <line x1="200" y1="125" x2="320" y2="125" stroke="#334155" strokeWidth="2" />
            <line x1="320" y1="125" x2="320" y2="180" stroke="#334155" strokeWidth="2" />
            
            {/* Meter */}
            <g transform="translate(320, 205)">
                <rect x="-25" y="-25" width="50" height="50" rx="4" fill={capacitiveData.isOverLimit ? "#fecaca" : "white"} stroke={capacitiveData.isOverLimit ? "#ef4444" : "#334155"} strokeWidth="2" />
                <path d="M -15 0 Q -7 -10 0 0 T 15 0" stroke="#3b82f6" strokeWidth="2" fill="none" />
                <text x="35" y="5" className={`text-xs font-bold ${capacitiveData.isOverLimit ? "fill-red-600" : "fill-blue-600"}`}>{capacitiveData.vout.toFixed(1)}V</text>
            </g>
            <line x1="320" y1="230" x2="320" y2="270" stroke="#334155" strokeWidth="2" />

             {/* Grounding */}
            <line x1="60" y1="170" x2="60" y2="270" stroke="#334155" strokeWidth="2" />
            <line x1="60" y1="270" x2="320" y2="270" stroke="#334155" strokeWidth="2" />
            
            <line x1="180" y1="270" x2="220" y2="270" stroke="#334155" strokeWidth="2" />
            <line x1="190" y1="275" x2="210" y2="275" stroke="#334155" strokeWidth="2" />
            <line x1="195" y1="280" x2="205" y2="280" stroke="#334155" strokeWidth="2" />

            <text x="200" y="30" textAnchor="middle" className={`text-xs font-bold uppercase ${capacitiveData.isOverLimit ? 'fill-red-600' : 'fill-slate-400'}`}>
                {capacitiveData.isOverLimit ? `⚠️ DANGER: V_out > ${capacitiveData.maxSafeOutputVoltage}V` : 'Normal Operation'}
            </text>
          </svg>
        );
      default: 
        return null;
    }
  }

  // --- Render Oscilloscope Waveform ---
  const renderOscilloscope = () => {
     return (
        <div className="w-full h-full bg-slate-900 rounded-xl border border-slate-700 p-4 relative overflow-hidden">
            {/* Grid */}
            <div className="absolute inset-0 opacity-20" 
                 style={{backgroundImage: 'linear-gradient(#334155 1px, transparent 1px), linear-gradient(90deg, #334155 1px, transparent 1px)', backgroundSize: '20px 20px'}}>
            </div>
            
            {/* Screen */}
            <div className="relative w-full h-full flex items-center">
                <svg className="w-full h-full overflow-visible" preserveAspectRatio="none">
                    {/* Zero Line */}
                    <line x1="0" y1="50%" x2="100%" y2="50%" stroke="#475569" strokeWidth="1" strokeDasharray="4 4"/>
                    
                    {mode === SimulatorMode.SPHERE_GAP ? (
                        <>
                           {/* Sphere Gap Wave: Input (Blue) - Crashes if breakdown */}
                           {generateWavePath(
                               sphereGapData.isBreakdown ? 40 : 35, // amplitude
                               2, // frequency
                               time, // phase
                               300, // width points
                               120, // height ref (approx)
                               sphereGapData.isBreakdown ? "#ef4444" : "#3b82f6",
                               sphereGapData.isBreakdown
                           )}
                           <text x="10" y="20" fill="#3b82f6" fontSize="10">Channel 1: HV Input {sphereGapData.isBreakdown ? '(BREAKDOWN)' : ''}</text>
                        </>
                    ) : (
                        <>
                           {/* Divider Wave: Vin (Blue) and Vout (Green/Purple) */}
                           {/* Vin (Large) */}
                           {generateWavePath(40, 2, time, 300, 120, "#3b82f6")}
                           
                           {/* Vout (Small - Scaled up visually for comparison but keeping phase) */}
                           {generateWavePath(25, 2, time, 300, 120, mode === SimulatorMode.RESISTIVE_DIVIDER ? "#10b981" : "#8b5cf6")}
                           
                           <text x="10" y="20" fill="#3b82f6" fontSize="10">CH1: Vin (scaled)</text>
                           <text x="10" y="35" fill={mode === SimulatorMode.RESISTIVE_DIVIDER ? "#10b981" : "#8b5cf6"} fontSize="10">
                               CH2: Vout (Meas)
                           </text>
                        </>
                    )}
                </svg>
            </div>
            <div className="absolute bottom-2 right-2 text-[10px] text-slate-500 font-mono">
                TIME/DIV: 5ms
            </div>
        </div>
     )
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Tab Selection */}
      <div className="flex flex-wrap gap-2 justify-center">
        {Object.values(SimulatorMode).map((m) => (
          <button
            key={m}
            onClick={() => { setMode(m); setAiExplanation(null); }}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
              mode === m 
                ? 'bg-slate-800 text-white shadow-lg' 
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {m === SimulatorMode.SPHERE_GAP && "Sela Bola"}
            {m === SimulatorMode.RESISTIVE_DIVIDER && "Pembagi Resistif"}
            {m === SimulatorMode.CAPACITIVE_DIVIDER && "Pembagi Kapasitif"}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Controls Panel */}
        <div className="lg:col-span-1 bg-slate-900 p-6 rounded-2xl shadow-lg border border-slate-700 space-y-6 text-white h-fit">
          <h3 className="text-xl font-bold text-blue-400 border-b border-slate-700 pb-2">Panel Kontrol</h3>
          
          {mode === SimulatorMode.SPHERE_GAP && (
            <>
              <div>
                <label className="block text-sm font-bold text-white mb-2 flex justify-between">
                    <span>Tegangan Input (kV)</span>
                    <span className="text-green-400">{vinSphere} kV</span>
                </label>
                <input 
                  type="range" min="0" max="100" step="1" 
                  value={vinSphere} onChange={(e) => setVinSphere(parseFloat(e.target.value))}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2 flex justify-between">
                    <span>Jarak Sela/Gap (cm)</span>
                    <span className="text-blue-400">{gapDistance} cm</span>
                </label>
                <input 
                  type="range" min="0.5" max="5.0" step="0.25" 
                  value={gapDistance} onChange={(e) => setGapDistance(parseFloat(e.target.value))}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">Temp (°C)</label>
                    <input 
                      type="number" value={temperature} onChange={(e) => setTemperature(parseFloat(e.target.value))}
                      className="w-full bg-slate-800 border border-slate-600 rounded px-2 py-1 text-white text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">Pressure (mmHg)</label>
                    <input 
                      type="number" value={pressure} onChange={(e) => setPressure(parseFloat(e.target.value))}
                      className="w-full bg-slate-800 border border-slate-600 rounded px-2 py-1 text-white text-sm"
                    />
                  </div>
              </div>

              <div className="bg-slate-800 p-4 rounded-lg border border-slate-700 mt-4">
                 <h4 className="text-yellow-400 text-sm font-bold mb-2">Parameter Perhitungan</h4>
                 <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                        <p className="text-slate-400">Tegangan Breakdown:</p>
                        <p className={`text-lg font-mono font-bold ${sphereGapData.isBreakdown ? 'text-red-400' : 'text-green-400'}`}>
                            {sphereGapData.vb.toFixed(1)} kV
                        </p>
                    </div>
                    <div>
                        <p className="text-slate-400">Margin Keamanan:</p>
                        <p className="text-lg font-mono font-bold text-white">
                            {Math.abs(sphereGapData.safetyMargin).toFixed(1)} kV
                        </p>
                    </div>
                 </div>
              </div>
            </>
          )}

          {mode === SimulatorMode.RESISTIVE_DIVIDER && (
            <>
              <div>
                <label className="block text-sm font-bold text-white mb-2 flex justify-between">
                    <span>Tegangan Input (Vin)</span>
                    <span className="text-emerald-400">{vinResistive} kV</span>
                </label>
                <input 
                  type="range" min="10" max="300" step="1" 
                  value={vinResistive} onChange={(e) => setVinResistive(parseFloat(e.target.value))}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">R1 (HV) [MΩ]</label>
                <input 
                  type="range" min="100" max="2000" step="50" 
                  value={r1} onChange={(e) => setR1(parseFloat(e.target.value))}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
                <div className="text-right font-mono text-emerald-400 text-xs mt-1">{r1} MΩ</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">R2 (Measure) [kΩ]</label>
                <input 
                  type="range" min="1" max="500" step="1" 
                  value={r2} onChange={(e) => setR2(parseFloat(e.target.value))}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
                <div className="text-right font-mono text-emerald-400 text-xs mt-1">{r2} kΩ</div>
              </div>
            </>
          )}

          {mode === SimulatorMode.CAPACITIVE_DIVIDER && (
            <>
              <div>
                <label className="block text-sm font-bold text-white mb-2 flex justify-between">
                    <span>Tegangan Input (Vin)</span>
                    <span className="text-violet-400">{vinCapacitive} kV</span>
                </label>
                <input 
                  type="range" min="10" max="300" step="1" 
                  value={vinCapacitive} onChange={(e) => setVinCapacitive(parseFloat(e.target.value))}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-violet-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">C1 (HV) [pF]</label>
                <input 
                  type="range" min="10" max="500" step="10" 
                  value={c1} onChange={(e) => setC1(parseFloat(e.target.value))}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-violet-500"
                />
                <div className="text-right font-mono text-violet-400 text-xs mt-1">{c1} pF</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">C2 (LV) [µF]</label>
                <input 
                  type="range" min="0.01" max="1.0" step="0.01" 
                  value={c2} onChange={(e) => setC2(parseFloat(e.target.value))}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-violet-500"
                />
                <div className="text-right font-mono text-violet-400 text-xs mt-1">{c2} µF</div>
              </div>
            </>
          )}

          <div className="pt-4 border-t border-slate-700">
             <div className="bg-slate-800 p-4 rounded-lg">
                <h4 className="text-xs font-bold text-slate-400 mb-2 uppercase">Informasi Simulator</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                    {mode === SimulatorMode.SPHERE_GAP && "Simulator ini menunjukkan prinsip kerja metode sela bola. Grafik gelombang menunjukkan tegangan AC, yang akan 'runtuh' saat terjadi breakdown."}
                    {mode === SimulatorMode.RESISTIVE_DIVIDER && `Simulator ini memvisualisasikan pembagian tegangan pada resistor. Warning muncul jika tegangan output (Vout) > ${resistiveData.maxSafeOutputVoltage}V.`}
                    {mode === SimulatorMode.CAPACITIVE_DIVIDER && `Simulator ini menunjukkan distribusi tegangan pada kapasitor. Warning muncul jika tegangan output (Vout) > ${capacitiveData.maxSafeOutputVoltage}V.`}
                </p>
             </div>
          </div>
        </div>

        {/* Results & Visualization Panel */}
        <div className="lg:col-span-2 space-y-6">
          {/* Top Row: Circuit & Waveform */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-[400px] md:h-[350px]">
            {/* Visualisasi (Circuit) */}
            <div className="bg-white p-1 rounded-2xl shadow-sm border border-slate-200 flex flex-col h-full">
               <h4 className="text-sm font-bold text-center py-2 text-slate-600 bg-slate-50 rounded-t-xl border-b">
                 Rangkaian Visual
               </h4>
               <div className="flex-1 w-full relative overflow-hidden rounded-b-xl">
                  {renderCircuit()}
               </div>
            </div>

            {/* Waveform Monitor */}
            <div className="bg-white p-1 rounded-2xl shadow-sm border border-slate-200 flex flex-col h-full">
               <h4 className="text-sm font-bold text-center py-2 text-slate-600 bg-slate-50 rounded-t-xl border-b">
                 Bentuk Gelombang (Oscilloscope)
               </h4>
               <div className="flex-1 w-full relative overflow-hidden rounded-b-xl bg-slate-900">
                  {renderOscilloscope()}
               </div>
            </div>
          </div>
          
          {/* Results Values */}
          <div className={`grid grid-cols-1 gap-4 ${mode === SimulatorMode.SPHERE_GAP ? 'md:grid-cols-2' : 'md:grid-cols-3'}`}>
             
             {/* Box 1: Meter Reading / Status */}
             <div className={`p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-center relative overflow-hidden group transition-all duration-300
                  ${mode === SimulatorMode.SPHERE_GAP && sphereGapData.isBreakdown ? 'bg-red-50 border-red-200' : 'bg-white'}
                  ${(mode !== SimulatorMode.SPHERE_GAP && ((mode === SimulatorMode.RESISTIVE_DIVIDER && resistiveData.isOverLimit) || (mode === SimulatorMode.CAPACITIVE_DIVIDER && capacitiveData.isOverLimit))) ? 'bg-red-50 border-red-200' : ''}
                  `}>
                
                <p className="text-sm font-medium text-slate-500 mb-2 uppercase tracking-wide">
                  {mode === SimulatorMode.SPHERE_GAP ? "Status Tegangan" : "Tegangan Terukur (Vout)"}
                </p>
                <div className="text-4xl font-extrabold text-slate-800">
                  {mode === SimulatorMode.SPHERE_GAP && (
                       <span className={sphereGapData.isBreakdown ? 'text-red-600' : 'text-green-600'}>
                           {sphereGapData.isBreakdown ? 'TEMBUS' : 'AMAN'}
                       </span>
                  )}
                  {mode === SimulatorMode.RESISTIVE_DIVIDER && (
                      <span className={resistiveData.isOverLimit ? 'text-red-600' : 'text-slate-800'}>
                          {resistiveData.vout.toFixed(2)} <span className="text-lg font-normal text-slate-500">V</span>
                      </span>
                  )}
                  {mode === SimulatorMode.CAPACITIVE_DIVIDER && (
                      <span className={capacitiveData.isOverLimit ? 'text-red-600' : 'text-slate-800'}>
                          {capacitiveData.vout.toFixed(2)} <span className="text-lg font-normal text-slate-500">V</span>
                      </span>
                  )}
                </div>
             </div>

             {/* Box 2: Ratio / Correction Factor */}
             <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-center">
                <p className="text-sm font-medium text-slate-500 mb-2 uppercase tracking-wide">
                  {mode === SimulatorMode.SPHERE_GAP ? "Faktor Koreksi Udara (δ)" : "Rasio Pembagi (Ratio)"}
                </p>
                <div className="text-3xl font-bold text-slate-700">
                  {mode === SimulatorMode.SPHERE_GAP && <span>{sphereGapData.delta.toFixed(4)} <span className="text-sm font-normal text-slate-400">pu</span></span>}
                  {mode === SimulatorMode.RESISTIVE_DIVIDER && <span>{resistiveData.ratio.toFixed(0)} <span className="text-sm font-normal text-slate-400">: 1</span></span>}
                  {mode === SimulatorMode.CAPACITIVE_DIVIDER && <span>{capacitiveData.ratio.toFixed(0)} <span className="text-sm font-normal text-slate-400">: 1</span></span>}
                </div>
             </div>

             {/* Box 3: Calculated Primary Voltage (Only for Dividers) */}
             {mode !== SimulatorMode.SPHERE_GAP && (
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-center">
                    <p className="text-sm font-medium text-slate-500 mb-2 uppercase tracking-wide">
                        Tegangan Primer Terhitung
                    </p>
                    <div className="text-3xl font-bold text-blue-700">
                        {mode === SimulatorMode.RESISTIVE_DIVIDER && <span>{resistiveData.measuredHV.toFixed(2)} <span className="text-sm font-normal text-slate-400">kV</span></span>}
                        {mode === SimulatorMode.CAPACITIVE_DIVIDER && <span>{capacitiveData.measuredHV.toFixed(2)} <span className="text-sm font-normal text-slate-400">kV</span></span>}
                    </div>
                     <p className="text-[10px] text-slate-400 mt-1 italic">
                        (Vout × Ratio)
                    </p>
                </div>
             )}

          </div>

          {/* Chart */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 h-80">
             <h4 className="text-sm font-semibold text-slate-400 mb-4">Grafik Karakteristik Transfer</h4>
             <ResponsiveContainer width="100%" height="100%">
                <LineChart data={
                  mode === SimulatorMode.SPHERE_GAP ? sphereGapData.points :
                  mode === SimulatorMode.RESISTIVE_DIVIDER ? resistiveData.points : capacitiveData.points
                }>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis 
                    dataKey="x" 
                    label={{ 
                      value: mode === SimulatorMode.SPHERE_GAP ? 'Jarak (cm)' : 'Vin (kV)', 
                      position: 'insideBottom', 
                      offset: -5,
                      fill: '#64748b',
                      fontSize: 12
                    }} 
                    tick={{fill: '#64748b', fontSize: 12}}
                  />
                  <YAxis 
                    label={{ 
                      value: mode === SimulatorMode.SPHERE_GAP ? 'Vb (kV)' : 'Vout (V)', 
                      angle: -90, 
                      position: 'insideLeft',
                      fill: '#64748b',
                      fontSize: 12
                    }} 
                    tick={{fill: '#64748b', fontSize: 12}}
                  />
                  <Tooltip 
                    contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} 
                    formatter={(value: number) => [value.toFixed(2), mode === SimulatorMode.SPHERE_GAP ? 'kV' : 'V']}
                  />
                  
                  {mode === SimulatorMode.SPHERE_GAP && (
                       <ReferenceLine y={vinSphere} label="Vin" stroke="red" strokeDasharray="3 3" />
                  )}

                  <Line 
                    type="monotone" 
                    dataKey="y" 
                    stroke={
                      mode === SimulatorMode.SPHERE_GAP ? "#2563eb" :
                      mode === SimulatorMode.RESISTIVE_DIVIDER ? "#059669" : "#7c3aed"
                    } 
                    strokeWidth={3} 
                    dot={false}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
             </ResponsiveContainer>
          </div>

          {/* New Sections: Working Principles and Result Analysis */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
                <h4 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                       <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                   </svg>
                   Prinsip Kerja (Working Principle)
                </h4>
                <p className="text-sm text-slate-700 leading-relaxed">
                   {mode === SimulatorMode.SPHERE_GAP && 
                     "Metode Sela Bola bekerja berdasarkan Hukum Paschen. Ketika medan listrik di celah udara melampaui kekuatan dielektriknya (sekitar 30 kV/cm pada STP), terjadi ionisasi yang memicu loncatan bunga api (breakdown). Tegangan tembus (Vb) sangat bergantung pada diameter bola, jarak celah, serta faktor koreksi udara (suhu dan tekanan)."
                   }
                   {mode === SimulatorMode.RESISTIVE_DIVIDER && 
                     "Pembagi tegangan resistif menggunakan hukum Ohm sederhana. Tegangan tinggi diturunkan secara proporsional menggunakan resistor HV (R1) bernilai sangat besar untuk meminimalkan arus dan panas, serta resistor LV (R2) untuk pengukuran. Vout = Vin × [R2 / (R1 + R2)]. Cocok untuk tegangan DC stabil."
                   }
                   {mode === SimulatorMode.CAPACITIVE_DIVIDER && 
                     "Pembagi kapasitif memanfaatkan reaktansi kapasitif (Xc = 1/2πfC). Tegangan terbagi secara terbalik terhadap nilai kapasitansi: Vout ≈ Vin × (C1 / C2). Karena tidak mendisipasikan daya aktif (watt), metode ini sangat efisien dan akurat untuk pengukuran tegangan AC frekuensi tinggi atau tegangan impuls."
                   }
                </p>
             </div>

             <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100">
                <h4 className="font-bold text-emerald-900 mb-3 flex items-center gap-2">
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                       <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 00-1-1H3zm6 4a1 1 0 100 2 1 1 0 000-2zm-2 4a1 1 0 100 2 1 1 0 000-2zm4 0a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
                   </svg>
                   Analisa Hasil Simulasi
                </h4>
                <p className="text-sm text-slate-700 leading-relaxed">
                   {mode === SimulatorMode.SPHERE_GAP && (
                     <>
                        Pada kondisi lingkungan {temperature}°C dan {pressure} mmHg, faktor koreksi udara (δ) bernilai <strong>{sphereGapData.delta.toFixed(3)}</strong>. 
                        Dengan jarak {gapDistance} cm, tegangan tembus teoritis adalah {sphereGapData.vb.toFixed(1)} kV. 
                        Saat ini Vin = {vinSphere} kV. {sphereGapData.isBreakdown ? 
                            <span className="text-red-600 font-bold">Terjadi BREAKDOWN karena Vin &gt; Vb. Udara kehilangan sifat isolasinya.</span> : 
                            <span className="text-emerald-600 font-bold">Kondisi AMAN, isolasi udara masih mampu menahan tegangan.</span>
                        }
                     </>
                   )}
                   {mode === SimulatorMode.RESISTIVE_DIVIDER && (
                     <>
                        Rasio pembagi saat ini adalah <strong>{resistiveData.ratio.toFixed(0)}:1</strong>.
                        Tegangan yang terbaca di sisi alat ukur adalah {resistiveData.vout.toFixed(1)} Volt.
                        {resistiveData.isOverLimit ? 
                           <span className="text-red-600 font-bold block mt-1">PERINGATAN BAHAYA: Tegangan output melebihi batas aman 600V! Segera perbesar nilai R1 atau perkecil Vin.</span> :
                           <span className="text-emerald-600 block mt-1">Tegangan output dalam batas aman (Safe Operation Area).</span>
                        }
                     </>
                   )}
                   {mode === SimulatorMode.CAPACITIVE_DIVIDER && (
                     <>
                         Impedansi C1 jauh lebih tinggi daripada C2, menghasilkan rasio tegangan <strong>{capacitiveData.ratio.toFixed(0)}:1</strong>.
                         Tegangan terukur: {capacitiveData.vout.toFixed(1)} Volt.
                         {capacitiveData.isOverLimit ? 
                           <span className="text-red-600 font-bold block mt-1">BAHAYA: Tegangan sekunder terlalu tinggi! Potensi kerusakan alat ukur. Naikkan nilai C2.</span> :
                           <span className="text-emerald-600 block mt-1">Sistem beroperasi normal. Distribusi tegangan dielektrik stabil.</span>
                        }
                     </>
                   )}
                </p>
             </div>
          </div>

           {/* AI Explanation Section */}
           <div className="bg-gradient-to-br from-slate-50 to-indigo-50 p-6 rounded-2xl border border-indigo-100">
             <div className="flex justify-between items-center mb-4">
               <h4 className="font-bold text-indigo-900 flex items-center gap-2">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-500" viewBox="0 0 20 20" fill="currentColor">
                   <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                 </svg>
                 Analisis Cerdas AI
               </h4>
               <button 
                onClick={handleAskAI}
                disabled={loadingAI}
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
               >
                 {loadingAI ? 'Sedang Menganalisa...' : 'Jelaskan Fenomena Ini'}
               </button>
             </div>
             
             {aiExplanation ? (
               <div className="text-sm text-slate-700 leading-relaxed bg-white p-4 rounded-lg border border-indigo-100 animate-in fade-in duration-500">
                 {aiExplanation}
               </div>
             ) : (
               <p className="text-sm text-slate-400 italic">Klik tombol di atas untuk mendapatkan penjelasan teknis mendalam mengenai konfigurasi saat ini dari AI.</p>
             )}
           </div>

        </div>
      </div>
    </div>
  );
};

export default Simulator;