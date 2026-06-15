import React, { useState } from "react";
import { Sparkles, HelpCircle, Eye } from "lucide-react";

interface Annotation {
  x: number;
  y: number;
  label: string;
}

interface PoseSketcherProps {
  description: string;
  onDescriptionChange: (val: string) => void;
  aiSketchUrl?: string; // We can use this to store the JSON string of sketch or render directly
  onSketchGenerated: (sketchData: { paths: string[]; title: string; description: string; annotations: Annotation[] }) => void;
}

export default function PoseSketcher({
  description,
  onDescriptionChange,
  onSketchGenerated,
}: PoseSketcherProps) {
  const [prompt, setPrompt] = useState(description || "一名优雅的女模特侧身站立，微微仰头，双手自然交叠在腹部");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [renderedSketch, setRenderedSketch] = useState<{
    paths: string[];
    title: string;
    description: string;
    annotations: Annotation[];
  } | null>(null);

  const generateSketch = async (testPrompt?: string) => {
    const activePrompt = testPrompt || prompt;
    if (!activePrompt.trim()) return;
    
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/generate-pose-lineart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description: activePrompt })
      });

      if (!response.ok) {
        throw new Error("模型服务连接失败，请检查密钥配置。");
      }

      const data = await response.json();
      setRenderedSketch(data);
      onSketchGenerated(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "生成线稿失败");
    } finally {
      setLoading(false);
    }
  };

  const presetPrompts = [
    "复古赫本风侧脸，单手托腮，修长颈部线条",
    "男性模特坐在暗色皮质沙发上，眼神低垂，光影侧写",
    "双人情绪拍摄，一人回眸，另一人背影呈现空间纵深感",
    "电影感街头散步，动感微糊，微风吹拂发丝轮廓",
  ];

  return (
    <div id="pose-sketcher-container" className="bg-zinc-950 border border-zinc-800 p-5 rounded-2xl">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold tracking-wide text-zinc-100 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-400" />
            AI 灵感姿态与构图绘制
          </h3>
          <p className="text-[11px] text-zinc-500 mt-0.5">
            规避版权问题的必备利器：通过文字描述，由 AI 解析并即时渲染原创极简构图线稿。
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
        {/* INPUT FORM CONTROLS */}
        <div className="md:col-span-7 flex flex-col justify-between space-y-4">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-2">
              姿势与构图描述 (中文)
            </label>
            <textarea
              id="pose-description-textarea"
              rows={3}
              value={prompt}
              onChange={(e) => {
                setPrompt(e.target.value);
                onDescriptionChange(e.target.value);
              }}
              placeholder="例如：模特闭眼微微抬头，窗外柔和的光线洒在侧脸上，投下优美的睫毛阴影..."
              className="w-full px-3 py-2 bg-zinc-90 w-full bg-zinc-900 border border-zinc-700/60 rounded-xl text-xs font-medium text-zinc-100 focus:outline-none focus:border-amber-500 resize-none placeholder:text-zinc-600"
            />
          </div>

          <div>
            <span className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-2">
              摄影师高频灵感关键词推荐:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {presetPrompts.map((p, idx) => (
                <button
                  key={idx}
                  id={`preset-${idx}`}
                  type="button"
                  onClick={() => {
                    setPrompt(p);
                    onDescriptionChange(p);
                    generateSketch(p);
                  }}
                  className="px-2 py-1 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-[10px] text-zinc-400 hover:text-zinc-200 rounded-lg transition"
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <button
            id="generate-pose-btn"
            onClick={() => generateSketch()}
            disabled={loading || !prompt.trim()}
            className="w-full py-2.5 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 disabled:opacity-40 text-black text-xs font-bold rounded-xl transition duration-150 flex items-center justify-center gap-2 shadow-lg shadow-amber-950/20"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-4 w-4 text-black" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>AI 精度设计刻画中...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-black" />
                <span>生成原创姿势参考线稿</span>
              </>
            )}
          </button>

          {error && (
            <p className="text-[10px] text-red-400 font-mono mt-1">
              ⚠️ {error}
            </p>
          )}
        </div>

        {/* LIVE RENDER CANVAS BOX */}
        <div id="sketch-canvas-box" className="md:col-span-5 flex flex-col items-center justify-center">
          <div className="relative w-full aspect-square max-w-[190px] bg-zinc-900 rounded-2xl border border-zinc-800/80 overflow-hidden flex items-center justify-center">
            
            {renderedSketch ? (
              <svg
                viewBox="0 0 300 300"
                className="w-full h-full p-4"
              >
                {/* Reference faint backdrop coordinates */}
                <circle cx="150" cy="150" r="120" stroke="#27272a" strokeWidth="1" strokeDasharray="3,3" fill="none" />
                
                {/* SVG Curves representing lines */}
                {renderedSketch.paths && renderedSketch.paths.map((path, index) => (
                  <path
                    key={index}
                    d={path}
                    fill="none"
                    stroke="#f59e0b" // beautiful amber color for vector wireframe sketch
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="animate-pulse"
                  />
                ))}

                {/* Annotation pointers */}
                {renderedSketch.annotations && renderedSketch.annotations.map((ann, idx) => (
                  <g key={idx} className="group/ann cursor-help">
                    <circle
                      cx={ann.x}
                      cy={ann.y}
                      r="4"
                      className="fill-cyan-400 animate-ping opacity-75"
                    />
                    <circle
                      cx={ann.x}
                      cy={ann.y}
                      r="3"
                      className="fill-cyan-400 stroke-zinc-900"
                    />
                    {/* Tiny text label */}
                    <text
                      x={ann.x}
                      y={ann.y - 7}
                      textAnchor="middle"
                      className="fill-cyan-300 font-sans text-[7px] font-bold"
                      style={{ filter: "drop-shadow(0px 1px 1px black)" }}
                    >
                      {ann.label}
                    </text>
                  </g>
                ))}
              </svg>
            ) : (
              <div className="text-center p-4">
                <div className="inline-flex p-2.5 bg-zinc-950 border border-zinc-800 rounded-full text-zinc-500 mb-2">
                  <Eye className="w-5 h-5 text-zinc-400" />
                </div>
                <p className="text-[10px] text-zinc-500 max-w-[140px] mx-auto leading-relaxed">
                  暂无草图线稿，在左侧输入创意或选择热点，一键智能推演属于你的几何姿态骨架。
                </p>
              </div>
            )}
            
            {renderedSketch && (
              <div className="absolute bottom-1 right-2 bg-black/70 px-1.5 py-0.5 border border-zinc-800 rounded text-[8px] text-zinc-400 font-mono">
                ORIGINAL VECTOR Sketch
              </div>
            )}
          </div>
          {renderedSketch && (
            <div className="mt-2 text-center text-[10px] text-zinc-400 font-medium px-2 italic">
              " {renderedSketch.title} "
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
