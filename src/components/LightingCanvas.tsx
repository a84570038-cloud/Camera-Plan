import React, { useState, useRef } from "react";
import { 
  LightingDevice, 
  DeviceType 
} from "../types";
import { 
  Sun, 
  Camera, 
  User, 
  Lightbulb, 
  RotateCw, 
  Plus, 
  Trash2, 
  Settings2,
  Sliders,
  Sparkles
} from "lucide-react";

interface LightingCanvasProps {
  devices: LightingDevice[];
  onChange: (devices: LightingDevice[]) => void;
  selectedId: string | null;
  onSelect: (id: string | null) => void;
}

export default function LightingCanvas({
  devices,
  onChange,
  selectedId,
  onSelect,
}: LightingCanvasProps) {
  const containerRef = useRef<SVGSVGElement | null>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const dragOffset = useRef({ x: 0, y: 0 });

  // Get color representation based on Kelvin temperature
  const getKelvinColor = (temp: number) => {
    if (temp < 3500) return "rgba(251, 146, 60, 0.3)"; // Warm yellow-orange
    if (temp < 4500) return "rgba(253, 224, 71, 0.25)"; // Warm white
    if (temp < 5800) return "rgba(255, 255, 255, 0.25)"; // Neutral daylight white
    return "rgba(147, 197, 253, 0.3)"; // Ice cool blue
  };

  const getKelvinBorderColor = (temp: number) => {
    if (temp < 3500) return "#fb923c";
    if (temp < 4500) return "#fde047";
    if (temp < 5800) return "#e2e8f0";
    return "#3b82f6";
  };

  const getDeviceIcon = (type: DeviceType) => {
    switch (type) {
      case DeviceType.CAMERA:
        return <Camera className="w-5 h-5 text-zinc-100" id={`icon-${type}`} />;
      case DeviceType.MODEL:
        return <User className="w-5 h-5 text-amber-300" id={`icon-${type}`} />;
      case DeviceType.NATURAL:
        return <Sun className="w-5 h-5 text-yellow-300 animate-pulse" id={`icon-${type}`} />;
      case DeviceType.STROBE:
        return <Lightbulb className="w-5 h-5 text-orange-400" id={`icon-${type}`} />;
      case DeviceType.SPOTLIGHT:
        return <Lightbulb className="w-5 h-5 text-indigo-400 fill-indigo-400/20" id={`icon-${type}`} />;
      case DeviceType.SOFTBOX:
        return <Lightbulb className="w-5 h-5 text-sky-400" id={`icon-${type}`} />;
      case DeviceType.REFLECTOR:
        return <Sliders className="w-4 h-4 text-emerald-400" id={`icon-${type}`} />;
      default:
        return <Lightbulb className="w-5 h-5 text-zinc-400" id={`icon-${type}`} />;
    }
  };

  // Drag and drop mechanics inside SVG (using continuous container-level monitoring)
  const handleNodePointerDown = (e: React.PointerEvent<SVGGElement>, deviceId: string) => {
    e.stopPropagation();
    onSelect(deviceId);
    setDraggingId(deviceId);

    const device = devices.find((d) => d.id === deviceId);
    if (!device || !containerRef.current) return;

    // Convert screen coordinates to SVG viewport (300x300)
    const rect = containerRef.current.getBoundingClientRect();
    const clientX = e.clientX;
    const clientY = e.clientY;

    const svgX = ((clientX - rect.left) / rect.width) * 300;
    const svgY = ((clientY - rect.top) / rect.height) * 300;

    dragOffset.current = {
      x: svgX - device.x,
      y: svgY - device.y,
    };

    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch (err) {
      console.warn("Pointer capture failed", err);
    }
  };

  const handleSvgPointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!draggingId || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const clientX = e.clientX;
    const clientY = e.clientY;

    const svgX = ((clientX - rect.left) / rect.width) * 300;
    const svgY = ((clientY - rect.top) / rect.height) * 300;

    let targetX = svgX - dragOffset.current.x;
    let targetY = svgY - dragOffset.current.y;

    // Boundary constraints (margins of 15px)
    targetX = Math.round(Math.max(15, Math.min(285, targetX)));
    targetY = Math.round(Math.max(15, Math.min(285, targetY)));

    // Update devices array
    const updated = devices.map((d) => {
      if (d.id === draggingId) {
        let updatedDevice = { ...d, x: targetX, y: targetY };
        // If updating a strobe/light/reflector, recalculate standard rotation pointing towards model (150, 150)
        if (d.type !== DeviceType.MODEL && d.type !== DeviceType.CAMERA) {
          const dx = 150 - targetX;
          const dy = 150 - targetY;
          let angle2 = Math.round((Math.atan2(dy, dx) * 180) / Math.PI);
          if (angle2 < 0) angle2 += 360;
          updatedDevice.angle = angle2;
        }
        return updatedDevice;
      }
      return d;
    });
    onChange(updated);
  };

  const handleSvgPointerUp = (e: React.PointerEvent<SVGSVGElement>) => {
    if (draggingId) {
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch (err) {
        // Safe fallback
      }
      setDraggingId(null);
    }
  };

  // Add new layout items
  const addDevice = (type: DeviceType) => {
    const defaultLabels: Record<DeviceType, string> = {
      [DeviceType.MODEL]: "模特 (Subject)",
      [DeviceType.CAMERA]: "主力机位 (Camera)",
      [DeviceType.STROBE]: "闪光灯 (Strobe)",
      [DeviceType.SOFTBOX]: "主柔光箱 (Softbox)",
      [DeviceType.SPOTLIGHT]: "特写聚光灯 (Spot)",
      [DeviceType.REFLECTOR]: "补光反光板 (Reflector)",
      [DeviceType.NATURAL]: "自然环境光 (Ambient Window)",
    };

    const id = `${type}-${Date.now().toString().slice(-4)}`;
    
    // Calculate intelligent default offset based on what's currently there
    const count = devices.filter(d => d.type === type).length;
    const offset = count * 20;

    let defaultBeamWidth = 45;
    if (type === DeviceType.SPOTLIGHT) defaultBeamWidth = 25;
    if (type === DeviceType.SOFTBOX) defaultBeamWidth = 60;
    if (type === DeviceType.NATURAL) defaultBeamWidth = 90;

    const newDevice: LightingDevice = {
      id,
      type,
      x: type === DeviceType.MODEL ? 150 : (100 + offset),
      y: type === DeviceType.MODEL ? 150 : (type === DeviceType.CAMERA ? 250 : 80),
      angle: type === DeviceType.CAMERA ? 270 : 135,
      power: 6,
      colorTemp: type === DeviceType.REFLECTOR ? 3200 : 5500,
      label: `${defaultLabels[type]} ${count > 0 ? count + 1 : ""}`.trim(),
      beamWidth: defaultBeamWidth,
    };

    onChange([...devices, newDevice]);
    onSelect(id);
  };

  const removeDevice = (id: string) => {
    const updated = devices.filter((d) => d.id !== id);
    onChange(updated);
    if (selectedId === id) onSelect(null);
  };

  const changeSelectedProperty = (key: keyof LightingDevice, value: any) => {
    if (!selectedId) return;
    const updated = devices.map((d) => {
      if (d.id === selectedId) {
        return { ...d, [key]: value };
      }
      return d;
    });
    onChange(updated);
  };

  // Apply Lighting Presets to quickly educate/inspire users
  const applyPreset = (presetName: string) => {
    let preset: LightingDevice[] = [
      { id: "model-1", type: DeviceType.MODEL, x: 150, y: 150, angle: 180, power: 1, colorTemp: 5500, label: "模特 (Subject)" },
      { id: "camera-1", type: DeviceType.CAMERA, x: 150, y: 260, angle: 270, power: 1, colorTemp: 5500, label: "相机构图平拍" }
    ];

    if (presetName === "rembrandt") {
      // Rembrandt: key light 45 degrees, reflector on other side
      preset.push({
        id: "softbox-key",
        type: DeviceType.SOFTBOX,
        x: 80,
        y: 110,
        angle: 320,
        power: 8,
        colorTemp: 4500,
        label: "伦勃朗主柔光箱 (Key Light)",
        beamWidth: 60
      });
      preset.push({
        id: "reflector-fill",
        type: DeviceType.REFLECTOR,
        x: 215,
        y: 145,
        angle: 210,
        power: 3,
        colorTemp: 3200,
        label: "反光板过渡 (Golden Fill)"
      });
      preset.push({
        id: "strobe-background",
        type: DeviceType.STROBE,
        x: 180,
        y: 60,
        angle: 120,
        power: 4,
        colorTemp: 5600,
        label: "背景发丝轮廓光 (Hair Rim)",
        beamWidth: 40
      });
    } else if (presetName === "butterfly") {
      // Paramount/Butterfly: light right above and slightly in front of camera
      preset.push({
        id: "spot-key",
        type: DeviceType.SPOTLIGHT,
        x: 150,
        y: 205,
        angle: 270,
        power: 9,
        colorTemp: 5500,
        label: "派拉蒙蝴蝶顶光 (Butterfly Key)",
        beamWidth: 30
      });
      preset.push({
        id: "reflector-bounce",
        type: DeviceType.REFLECTOR,
        x: 150,
        y: 120,
        angle: 90,
        power: 2,
        colorTemp: 3200,
        label: "下部银反光板消除重阴影 (Under Bounce)"
      });
    } else if (presetName === "edge") {
      // Dramatic split/edge rim light
      preset.push({
        id: "strobe-left",
        type: DeviceType.STROBE,
        x: 50,
        y: 140,
        angle: 0,
        power: 9,
        colorTemp: 6000,
        label: "左侧逆边缘轮廓光",
        beamWidth: 45
      });
      preset.push({
        id: "strobe-right",
        type: DeviceType.STROBE,
        x: 250,
        y: 140,
        angle: 180,
        power: 9,
        colorTemp: 6000,
        label: "右侧逆边缘轮廓光",
        beamWidth: 45
      });
      preset.push({
        id: "softbox-neutral",
        type: DeviceType.SOFTBOX,
        x: 150,
        y: 235,
        angle: 270,
        power: 3,
        colorTemp: 4000,
        label: "弱正面柔和环境主光",
        beamWidth: 70
      });
    } else {
      // Loop Setup
      preset.push({
        id: "softbox-key",
        type: DeviceType.SOFTBOX,
        x: 100,
        y: 180,
        angle: 340,
        power: 7,
        colorTemp: 5000,
        label: "环型主光 (Loop Key)",
        beamWidth: 60
      });
      preset.push({
        id: "softbox-fill",
        type: DeviceType.SOFTBOX,
        x: 200,
        y: 180,
        angle: 200,
        power: 4,
        colorTemp: 5000,
        label: "弱环境辅助柔光 (Ambient Fill)",
        beamWidth: 60
      });
    }

    onChange(preset);
    onSelect(preset[2]?.id || null);
  };

  const selectedDevice = devices.find((d) => d.id === selectedId);

  return (
    <div id="lighting-canvas-wrapper" className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-zinc-900 border border-zinc-800 p-5 rounded-2xl">
      
      {/* LEFT: Quick Device Addition & Presets */}
      <div id="presets-panel" className="lg:col-span-3 flex flex-col justify-between space-y-4">
        <div>
          <h3 className="text-sm font-semibold tracking-wide text-zinc-300 uppercase mb-3 flex items-center gap-1.5">
            <Plus className="w-4 h-4 text-amber-400" />
            添加布光元素
          </h3>
          <div className="grid grid-cols-2 gap-2">
            <button
              id="add-strobe-btn"
              onClick={() => addDevice(DeviceType.STROBE)}
              className="flex items-center gap-1.5 px-3 py-2 bg-zinc-800 border border-zinc-700/60 hover:bg-zinc-700 hover:border-zinc-500 rounded-lg text-xs font-medium text-zinc-200 transition-all text-left"
            >
              <Lightbulb className="w-4 h-4 text-orange-400 shrink-0" />
              <span>裸闪光灯</span>
            </button>
            <button
              id="add-softbox-btn"
              onClick={() => addDevice(DeviceType.SOFTBOX)}
              className="flex items-center gap-1.5 px-3 py-2 bg-zinc-800 border border-zinc-700/60 hover:bg-zinc-700 hover:border-zinc-500 rounded-lg text-xs font-medium text-zinc-200 transition-all text-left"
            >
              <Sliders className="w-4 h-4 text-sky-400 shrink-0" />
              <span>柔光箱</span>
            </button>
            <button
              id="add-spotlight-btn"
              onClick={() => addDevice(DeviceType.SPOTLIGHT)}
              className="flex items-center gap-1.5 px-3 py-2 bg-zinc-800 border border-zinc-700/60 hover:bg-zinc-700 hover:border-zinc-500 rounded-lg text-xs font-medium text-zinc-200 transition-all text-left"
            >
              <Lightbulb className="w-4 h-4 text-indigo-400 shrink-0" />
              <span>聚光灯</span>
            </button>
            <button
              id="add-reflector-btn"
              onClick={() => addDevice(DeviceType.REFLECTOR)}
              className="flex items-center gap-1.5 px-3 py-2 bg-zinc-800 border border-zinc-700/60 hover:bg-zinc-700 hover:border-zinc-500 rounded-lg text-xs font-medium text-zinc-200 transition-all text-left"
            >
              <Sliders className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>反光板</span>
            </button>
            <button
              id="add-natural-btn"
              onClick={() => addDevice(DeviceType.NATURAL)}
              className="flex items-center gap-1.5 px-3 py-2 bg-zinc-800 border border-zinc-700/60 hover:bg-zinc-700 hover:border-zinc-500 rounded-lg text-xs font-medium text-zinc-200 transition-all text-left col-span-2"
            >
              <Sun className="w-4 h-4 text-yellow-300 shrink-0" />
              <span>加进自然窗光/太阳光</span>
            </button>
          </div>
        </div>

        <div className="pt-4 border-t border-zinc-800">
          <h3 className="text-sm font-semibold tracking-wide text-zinc-300 uppercase mb-3 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-pink-400" />
            快速美学布光预设
          </h3>
          <div className="space-y-1.5">
            <button
              id="apply-rembrandt"
              onClick={() => applyPreset("rembrandt")}
              className="w-full flex items-center justify-between px-3 py-2 bg-zinc-800/50 hover:bg-zinc-800 border border-transparent hover:border-zinc-700 text-zinc-300 hover:text-white rounded-lg text-left text-xs transition"
            >
              <span>伦勃朗光 (Rembrandt Portrait)</span>
              <span className="text-[10px] py-0.5 px-1.5 bg-orange-950/40 text-orange-400 rounded-full">古典</span>
            </button>
            <button
              id="apply-butterfly"
              onClick={() => applyPreset("butterfly")}
              className="w-full flex items-center justify-between px-3 py-2 bg-zinc-800/50 hover:bg-zinc-800 border border-transparent hover:border-zinc-700 text-zinc-300 hover:text-white rounded-lg text-left text-xs transition"
            >
              <span>派拉蒙蝴蝶光 (Hollywood Style)</span>
              <span className="text-[10px] py-0.5 px-1.5 bg-sky-950/30 text-sky-400 rounded-full">高光</span>
            </button>
            <button
              id="apply-edge"
              onClick={() => applyPreset("edge")}
              className="w-full flex items-center justify-between px-3 py-2 bg-zinc-800/50 hover:bg-zinc-800 border border-transparent hover:border-zinc-700 text-zinc-300 hover:text-white rounded-lg text-left text-xs transition"
            >
              <span>逆光边缘轮廓 (Dramatic Rim)</span>
              <span className="text-[10px] py-0.5 px-1.5 bg-indigo-950/40 text-indigo-400 rounded-full">情绪</span>
            </button>
            <button
              id="apply-loop"
              onClick={() => applyPreset("loop")}
              className="w-full flex items-center justify-between px-3 py-2 bg-zinc-800/50 hover:bg-zinc-800 border border-transparent hover:border-zinc-700 text-zinc-300 hover:text-white rounded-lg text-left text-xs transition"
            >
              <span>环形辅光常亮灯 (Soft loop)</span>
              <span className="text-[10px] py-0.5 px-1.5 bg-emerald-950/30 text-emerald-400 rounded-full">温柔</span>
            </button>
          </div>
        </div>
      </div>

      {/* MIDDLE: Live Vector SVG Drag-and-drop Grid Canvas */}
      <div id="canvas-main" className="lg:col-span-5 flex flex-col items-center">
        <div className="relative w-full aspect-square max-w-[320px] lg:max-w-full lg:w-[320px] bg-zinc-950 rounded-2xl border border-zinc-800 shadow-2xl overflow-hidden shadow-black/80">
          
          {/* Radar background circles and grids */}
          <div className="absolute inset-0 pointer-events-none opacity-20 flex items-center justify-center">
            <div className="border border-zinc-500 rounded-full w-1/4 h-1/4 absolute" />
            <div className="border border-zinc-500 rounded-full w-1/2 h-1/2 absolute" />
            <div className="border border-zinc-500 rounded-full w-3/4 h-3/4 absolute border-dashed" />
            <div className="w-full h-[1px] bg-zinc-500 absolute top-1/2 left-0" />
            <div className="h-full w-[1px] bg-zinc-500 absolute left-1/2 top-0" />
          </div>

          <div className="absolute bottom-2 left-3 text-[10px] text-zinc-600 font-mono tracking-wider pointer-events-none select-none">
            300x300 COLLIMATOR GRID
          </div>

          <svg
            ref={containerRef}
            viewBox="0 0 300 300"
            className="w-full h-full select-none touch-none"
            onClick={() => onSelect(null)}
            onPointerMove={handleSvgPointerMove}
            onPointerUp={handleSvgPointerUp}
          >
            {/* 1. RENDER LIGHT RAYS BEAMS */}
            {devices.map((device) => {
              if (
                device.type === DeviceType.MODEL || 
                device.type === DeviceType.CAMERA || 
                device.type === DeviceType.REFLECTOR
              ) return null;

              // Calculate directional vector endpoints based on rotation angle
              const length = 180;
              const angleRad = (device.angle * Math.PI) / 180;
              const xEnd = device.x + Math.cos(angleRad) * length;
              const yEnd = device.y + Math.sin(angleRad) * length;

              // Spotlight/Softbox/Strobe beam represented as a sector semi-transparent triangle
              const coneHalfAngle = (device.beamWidth || 45) / 2; // Degrees of cone spread
              const rad1 = ((device.angle - coneHalfAngle) * Math.PI) / 180;
              const rad2 = ((device.angle + coneHalfAngle) * Math.PI) / 180;

              const x1 = device.x + Math.cos(rad1) * length;
              const y1 = device.y + Math.sin(rad1) * length;
              const x2 = device.x + Math.cos(rad2) * length;
              const y2 = device.y + Math.sin(rad2) * length;

              const beamGradientId = `grad-${device.id}`;

              return (
                <g key={`beam-${device.id}`} className="pointer-events-none opacity-80">
                  <defs>
                    <radialGradient
                      id={beamGradientId}
                      cx={`${(device.x / 3) || 50}%`}
                      cy={`${(device.y / 3) || 50}%`}
                      r="100%"
                    >
                      <stop offset="0%" stopColor={getKelvinBorderColor(device.colorTemp)} stopOpacity={0.4 * (device.power / 10)} />
                      <stop offset="50%" stopColor={getKelvinBorderColor(device.colorTemp)} stopOpacity={0.1 * (device.power / 10)} />
                      <stop offset="100%" stopColor={getKelvinBorderColor(device.colorTemp)} stopOpacity="0" />
                    </radialGradient>
                  </defs>
                  
                  {/* Outer light beam triangle */}
                  <path
                    d={`M ${device.x} ${device.y} L ${x1} ${y1} A ${length} ${length} 0 0 1 ${x2} ${y2} Z`}
                    fill={`url(#${beamGradientId})`}
                  />
                  {/* Fine line in middle representing core light ray */}
                  <line
                    x1={device.x}
                    y1={device.y}
                    x2={xEnd}
                    y2={yEnd}
                    stroke={getKelvinBorderColor(device.colorTemp)}
                    strokeWidth="1.5"
                    strokeDasharray="4,6"
                    className="opacity-70"
                  />
                </g>
              );
            })}

            {/* 2. RENDER REFLECTOR SURFACE CONE (Passive reflection towards center) */}
            {devices.map((device) => {
              if (device.type !== DeviceType.REFLECTOR) return null;
              // Render passive reflector guidance line pointing to center
              const angleRad = (device.angle * Math.PI) / 180;
              const xEnd = device.x + Math.cos(angleRad) * 45;
              const yEnd = device.y + Math.sin(angleRad) * 45;

              return (
                <g key={`refl-${device.id}`} className="pointer-events-none">
                  {/* Subtle rebound dashed line */}
                  <line
                    x1={device.x}
                    y1={device.y}
                    x2={xEnd}
                    y2={yEnd}
                    stroke="#34d399"
                    strokeWidth="1.5"
                    strokeDasharray="2,3"
                    className="opacity-50"
                  />
                </g>
              );
            })}

            {/* 3. DRAW DRIZZLING ROTATING COMPONENT NODES/BUTTONS */}
            {devices.map((device) => {
              const isSelected = selectedId === device.id;
              const isCenterSubject = device.type === DeviceType.MODEL;
              
              // Angle rotation line inside the node indicator
              const pointerX = device.x + Math.cos((device.angle * Math.PI) / 180) * 14;
              const pointerY = device.y + Math.sin((device.angle * Math.PI) / 180) * 14;

              return (
                <g
                  key={device.id}
                  transform={`translate(0, 0)`}
                  onPointerDown={(e) => handleNodePointerDown(e, device.id)}
                  onClick={(e) => e.stopPropagation()}
                  className="cursor-move group"
                >
                  {/* Selection Indicator Ring */}
                  {isSelected && (
                    <circle
                      cx={device.x}
                      cy={device.y}
                      r="22"
                      fill="none"
                      stroke="#fbbf24"
                      strokeWidth="2"
                      strokeDasharray="4,2"
                      className="animate-spin-slow"
                    />
                  )}

                  {/* Soft Background glow representing light color temp */}
                  {!isCenterSubject && device.type !== DeviceType.CAMERA && (
                    <circle
                      cx={device.x}
                      cy={device.y}
                      r="16"
                      fill={getKelvinColor(device.colorTemp)}
                      className="transition-all"
                    />
                  )}

                  {/* Core Base Circle */}
                  <circle
                    cx={device.x}
                    cy={device.y}
                    r={isCenterSubject ? "16" : "14"}
                    fill={isCenterSubject ? "#18181b" : isSelected ? "#3f3f46" : "#27272a"}
                    stroke={
                      isCenterSubject 
                        ? "#f59e0b" // Orange/amber for model
                        : device.type === DeviceType.CAMERA
                        ? "#e4e4e7" // Light zinc for camera
                        : device.type === DeviceType.REFLECTOR
                        ? "#34d399" // Green for passive reflectors
                        : getKelvinBorderColor(device.colorTemp)
                    }
                    strokeWidth={isSelected ? "2.5" : "1.5"}
                    className="transition-all duration-150 shadow-lg drop-shadow"
                  />

                  {/* Arrow line representing rotation direction */}
                  {device.type !== DeviceType.MODEL && (
                    <line
                      x1={device.x}
                      y1={device.y}
                      x2={pointerX}
                      y2={pointerY}
                      stroke={isSelected ? "#fbbf24" : "#e2e8f0"}
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                  )}

                  {/* Embed HTML icon nicely centered */}
                  <foreignObject
                    x={device.x - 10}
                    y={device.y - 10}
                    width="20"
                    height="20"
                    className="pointer-events-none select-none flex items-center justify-center"
                  >
                    <div className="w-full h-full flex items-center justify-center">
                      {getDeviceIcon(device.type)}
                    </div>
                  </foreignObject>

                  {/* Tooltip Label on hover */}
                  <text
                    x={device.x}
                    y={device.y - 20}
                    textAnchor="middle"
                    className="fill-zinc-300 font-sans text-[8px] font-semibold opacity-0 group-hover:opacity-100 bg-zinc-950 pointer-events-none transition-all duration-150 shadow shadow-black/80 drop-shadow"
                    style={{ filter: "drop-shadow(0px 1px 2px rgba(0,0,0,0.9))" }}
                  >
                    {device.label}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
        <p className="text-[11px] text-zinc-500 mt-2 font-mono text-center">
          💡 提示：按住并在画布中拖曳可以摆放灯具；点击灯具以从下方调校数值。
        </p>
      </div>

      {/* RIGHT: Precise properties calibrator */}
      <div id="calibrator-details" className="lg:col-span-4 flex flex-col justify-between">
        {selectedDevice ? (
          <div className="bg-zinc-800/45 p-4 rounded-xl border border-zinc-700/50 flex-1 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-zinc-700 pb-2 mb-3">
                <span className="text-xs font-semibold uppercase text-amber-400 tracking-wider flex items-center gap-1">
                  <Settings2 className="w-3.5 h-3.5" />
                  元素配置
                </span>
                <button
                  id="delete-device"
                  onClick={() => removeDevice(selectedDevice.id)}
                  disabled={selectedDevice.type === DeviceType.MODEL || selectedDevice.type === DeviceType.CAMERA}
                  className="p-1 text-zinc-400 hover:text-red-400 disabled:opacity-30 disabled:hover:text-zinc-400 transition"
                  title="删除此物件"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Name input */}
              <div className="mb-3">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1">
                  名称 / 功能标注
                </label>
                <input
                  id="device-label-input"
                  type="text"
                  value={selectedDevice.label}
                  onChange={(e) => changeSelectedProperty("label", e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-zinc-900 border border-zinc-700 rounded text-xs font-medium text-zinc-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Facing Orientation Angle degrees */}
              {selectedDevice.type !== DeviceType.MODEL && (
                <div className="mb-3">
                  <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1">
                    <span>朝向 / 指向角度</span>
                    <span className="text-amber-500 font-mono font-normal">
                      {selectedDevice.angle}°
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      id="device-angle-slider"
                      type="range"
                      min="0"
                      max="360"
                      value={selectedDevice.angle}
                      onChange={(e) => changeSelectedProperty("angle", parseInt(e.target.value))}
                      className="w-full accent-amber-500 bg-zinc-900 h-1 rounded"
                    />
                    <button
                      id="reset-orientation"
                      onClick={() => {
                        // Point exactly towards default model center at (150, 150)
                        const dx = 150 - selectedDevice.x;
                        const dy = 150 - selectedDevice.y;
                        let angle = Math.round((Math.atan2(dy, dx) * 180) / Math.PI);
                        if (angle < 0) angle += 360;
                        changeSelectedProperty("angle", angle);
                      }}
                      className="p-1 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded text-[10px] text-zinc-300 transition shrink-0 flex items-center gap-0.5"
                      title="自动指向中央模特"
                    >
                      <RotateCw className="w-2.5 h-2.5" />
                      对准中心
                    </button>
                  </div>
                </div>
              )}

              {/* Light Intensity (Power output index) */}
              {selectedDevice.type !== DeviceType.MODEL && selectedDevice.type !== DeviceType.CAMERA && (
                <div className="mb-3">
                  <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1">
                    <span>闪光/常亮输出亮度</span>
                    <span className="text-sky-400 font-mono font-normal">
                      1/{(11 - selectedDevice.power) === 10 ? "1" : (11 - selectedDevice.power) === 1 ? "Full" : `2^${10 - selectedDevice.power}`} (指数: {selectedDevice.power})
                    </span>
                  </div>
                  <input
                    id="device-power-slider"
                    type="range"
                    min="1"
                    max="10"
                    value={selectedDevice.power}
                    onChange={(e) => changeSelectedProperty("power", parseInt(e.target.value))}
                    className="w-full accent-sky-400 bg-zinc-900 h-1 rounded"
                  />
                </div>
              )}

              {/* Light Color Temperature in Kelvin */}
              {selectedDevice.type !== DeviceType.MODEL && selectedDevice.type !== DeviceType.CAMERA && selectedDevice.type !== DeviceType.REFLECTOR && (
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1">
                      <span>灯珠色温 (Kelvin)</span>
                      <span className="text-orange-400 font-mono font-normal">
                        {selectedDevice.colorTemp} K
                      </span>
                    </div>
                    <input
                      id="device-temp-slider"
                      type="range"
                      min="2700"
                      max="8000"
                      step="100"
                      value={selectedDevice.colorTemp}
                      onChange={(e) => changeSelectedProperty("colorTemp", parseInt(e.target.value))}
                      className="w-full accent-orange-400 bg-zinc-900 h-1 rounded"
                    />
                    <div className="flex justify-between text-[8px] text-zinc-500 font-mono mt-1">
                      <span className="text-orange-300">2700K 暖黄</span>
                      <span className="text-zinc-300">5500K 晨白</span>
                      <span className="text-sky-300">8000K 冰蓝</span>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1">
                      <span>光束覆盖角度 (Beam Spread)</span>
                      <span className="text-pink-400 font-mono font-normal">
                        {selectedDevice.beamWidth || 45}°
                      </span>
                    </div>
                    <input
                      id="device-beam-width-slider"
                      type="range"
                      min="10"
                      max="120"
                      step="5"
                      value={selectedDevice.beamWidth || 45}
                      onChange={(e) => changeSelectedProperty("beamWidth", parseInt(e.target.value))}
                      className="w-full accent-pink-400 bg-zinc-900 h-1 rounded"
                    />
                    <div className="flex justify-between text-[8px] text-zinc-500 font-mono mt-1">
                      <span className="text-pink-300">10° 窄聚光</span>
                      <span className="text-zinc-300">45° 标准</span>
                      <span className="text-sky-300">120° 阔漫射</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="text-[10px] text-zinc-500 bg-zinc-900/50 p-2 border border-zinc-800 rounded mt-4 leading-relaxed">
              <strong>💡 摄影导师建议:</strong>{" "}
              {selectedDevice.type === DeviceType.MODEL && "拍摄对象已放置于舞台中央 (150, 150)。布光角度以他为坐标中心原点展开。"}
              {selectedDevice.type === DeviceType.CAMERA && "机位视角控制画幅透视。中长焦焦段如85mm、135mm透视较扁平方正面朝，而广角35mm则适合近身广幅构图。"}
              {selectedDevice.type === DeviceType.STROBE && "闪光灯能在瞬间压制环境余光。调整色温至5500K还原最自然的肤色表现。"}
              {selectedDevice.type === DeviceType.SOFTBOX && "柔光箱拥有大发光面，能让模特脸部的光斑和重阴影过渡得非常自然。通常作为主光。"}
              {selectedDevice.type === DeviceType.SPOTLIGHT && "束光罩或聚光灯投射聚焦的主轴线，非常适合用于塑造戏剧性轮廓，或者产生狭长的‘猫眼帘’背景投影。"}
              {selectedDevice.type === DeviceType.REFLECTOR && "用于对暗部进行漫反射补光。金色面（3200K）提供夕阳暖光，银白面提供高敏感度清亮辅助补光。"}
              {selectedDevice.type === DeviceType.NATURAL && "自然环境天空漫射。可通过调整色温和朝向来模拟特定时间的窗外场景流光。"}
            </div>
          </div>
        ) : (
          <div className="bg-zinc-800/10 border-2 border-dashed border-zinc-800 p-8 rounded-xl flex flex-col items-center justify-center text-center h-full">
            <Sliders className="w-8 h-8 text-zinc-600 mb-2 animate-bounce-slow" />
            <p className="text-xs text-zinc-500 max-w-[200px] leading-relaxed">
              没有选中任何元素。 在画布上点击灯具或相机，以精确微调其角度、输出功率及色温参数。
            </p>
          </div>
        )}
      </div>

    </div>
  );
}
