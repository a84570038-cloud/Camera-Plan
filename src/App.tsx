import React, { useState, useEffect } from "react";
import { 
  Plus, 
  Trash2, 
  Sparkles, 
  FileDown, 
  Share2, 
  Camera, 
  Image as ImageIcon, 
  Link as LinkIcon, 
  Check, 
  Clock, 
  User, 
  Sliders, 
  Sun,
  Eye,
  Star,
  Info,
  Settings,
  HelpCircle,
  Scissors,
  Folder,
  FolderOpen,
  FileCode,
  ChevronDown,
  ChevronRight,
  FileText
} from "lucide-react";
import { 
  CustomPlan, 
  LightingDevice, 
  DeviceType, 
  InspirationLink, 
  FinalPhoto, 
  StoryboardElement 
} from "./types";
import { INITIAL_PLANS } from "./constants/defaultPlans";
import LightingCanvas from "./components/LightingCanvas";
import PoseSketcher from "./components/PoseSketcher";
import { 
  renderSpecDoc, 
  renderIterationsDoc, 
  renderTechValidationDoc, 
  renderMilestoneDoc, 
  renderSystemPanel,
  renderPrdDoc
} from "./constants/docs";

export default function App() {
  // 1. Core Reactive states
  const [plans, setPlans] = useState<CustomPlan[]>([]);
  const [activePlanId, setActivePlanId] = useState<string>("");
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);

  // Left Directory Tree states
  const [activeExplorerItem, setActiveExplorerItem] = useState<"app" | "spec" | "iterations" | "tech-validation" | "milestone" | "system" | "prd">("app");
  const [sysFolderExpanded, setSysFolderExpanded] = useState(true);
  const [prodFolderExpanded, setProdFolderExpanded] = useState(true);
  const [docsFolderExpanded, setDocsFolderExpanded] = useState(true);

  // AI custom planning variables
  const [aiKeywordsInput, setAiKeywordsInput] = useState("");
  const [aiSceneInput, setAiSceneInput] = useState("");
  const [aiMood, setAiMood] = useState("清新微粉日系自然风");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  // Forms helper states
  const [newInspirationTitle, setNewInspirationTitle] = useState("");
  const [newInspirationPhotographer, setNewInspirationPhotographer] = useState("");
  const [newInspirationUrl, setNewInspirationUrl] = useState("");
  const [newInspirationNotes, setNewInspirationNotes] = useState("");

  const [newPhotoTitle, setNewPhotoTitle] = useState("");
  const [newPhotoUrl, setNewPhotoUrl] = useState("");
  const [newPhotoNotes, setNewPhotoNotes] = useState("");
  const [newPhotoRating, setNewPhotoRating] = useState(5);

  const [shareSuccess, setShareSuccess] = useState(false);
  const [hoveredInspiration, setHoveredInspiration] = useState<string | null>(null);
  
  // States for hovering over inspiration links to display thumbnail previews
  const [hoveredImageUrl, setHoveredImageUrl] = useState<string | null>(null);
  const [hoveredPosition, setHoveredPosition] = useState<{ x: number; y: number } | null>(null);

  // Helper to determine if a URL is an image resource
  const isImageUrl = (url: string): boolean => {
    if (!url) return false;
    const cleanUrl = url.toLowerCase().split('?')[0].split('#')[0];
    const imageExtensions = [".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg", ".bmp"];
    if (imageExtensions.some(ext => cleanUrl.endsWith(ext))) {
      return true;
    }
    if (url.startsWith("data:image/")) {
      return true;
    }
    if (
      url.includes("images.unsplash.com") || 
      url.includes("images.pexels.com") || 
      url.includes("images.pixabay.com") ||
      url.includes("img.com") ||
      url.includes("giphy.com")
    ) {
      return true;
    }
    return false;
  };

  // Load from LocalStorage or Fallback defaults
  useEffect(() => {
    const cached = localStorage.getItem("photo_canvas_blueprints");
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (parsed && parsed.length > 0) {
          setPlans(parsed);
          setActivePlanId(parsed[0].id);
          return;
        }
      } catch (e) {
        console.warn("读取缓存有误，已重置为标准默认案。");
      }
    }
    // Set initially
    setPlans(INITIAL_PLANS);
    setActivePlanId(INITIAL_PLANS[0].id);
    localStorage.setItem("photo_canvas_blueprints", JSON.stringify(INITIAL_PLANS));
  }, []);

  // Save changes automatically to keep persistence stable
  const savePlans = (updatedList: CustomPlan[]) => {
    setPlans(updatedList);
    localStorage.setItem("photo_canvas_blueprints", JSON.stringify(updatedList));
  };

  const activePlan = plans.find((p) => p.id === activePlanId) || plans[0];

  // Modifying active plan fields safely
  const updateActivePlanField = (key: keyof CustomPlan, value: any) => {
    const updated = plans.map((p) => {
      if (p.id === activePlanId) {
        return { ...p, [key]: value };
      }
      return p;
    });
    savePlans(updated);
  };

  // Add individual new empty plan
  const createBlankPlan = () => {
    const id = `plan-${Date.now()}`;
    const newPlan: CustomPlan = {
      id,
      title: "「未命名」新生摄影创意画布",
      createdAt: new Date().toISOString(),
      keywords: ["胶片", "情绪"],
      sceneDetails: "一个充满自然柔光的极简室内场景。",
      concept: "点击右侧或左下编辑灵感核心，在这里输入整个拍摄的灵魂概念。你可以设计场景色系、表达的情绪以及主要想讲述的人间故事。",
      weatherGuide: "下午 15:30-17:00 黄金时段的温和日光，或多云天气漫反射，以便实现温润的低反差胶片质感。",
      wardrobeGuide: "低饱和度米白、灰色棉麻质感衬衫或挺括风衣。",
      propsGuide: "一本空白羊皮笔记本，一枝干燥的干枯郁金香。",
      locationGuide: "一处极富采光的高挑北欧格调室内工作室。",
      equipmentGuide: "推荐全画幅微单相机，镜头建议 85mm f/1.4 (主拍摄情绪人像) 或 35mm f/1.8 (展示环境氛围)，使用1/4黑柔光镜柔化白点高光。",
      scheduleGuide: "【14:00-15:00】模特妆造设计；【15:15-16:00】棚内逆光试片与微弱常亮打光；【16:15-17:30】室外采风与黄金时刻黄昏情绪抢拍。",
      lightingInstructions: "在侧前方 45 度设置一束大进深常亮暖柔光箱；另一侧配置微弱的反光板用以挽救眼窝重阴影。",
      lightingSetup: [
        { id: "model-1", type: DeviceType.MODEL, x: 150, y: 150, angle: 180, power: 1, colorTemp: 5500, label: "模特 (Subject)" },
        { id: "camera-1", type: DeviceType.CAMERA, x: 150, y: 260, angle: 270, power: 1, colorTemp: 5500, label: "相机构图 (Camera)" }
      ],
      storyboard: [
        {
          id: `st-${Date.now()}-1`,
          shotType: "特写分镜",
          cameraAngle: "平视",
          lensName: "85mm f/1.4",
          actionDescription: "侧脸看向光亮一侧，神采微露思索，双肩放松。",
          lightDescription: "斜逆日光从发丝边缘切入，明暗过渡温和。"
        }
      ],
      inspirations: [],
      finalPhotos: []
    };

    savePlans([...plans, newPlan]);
    setActivePlanId(id);
  };

  // Delete current selected plan safely
  const deletePlan = (id: string) => {
    if (plans.length <= 1) {
      alert("请至少保留一份摄影策划画布！");
      return;
    }
    const filtered = plans.filter((p) => p.id !== id);
    savePlans(filtered);
    setActivePlanId(filtered[0].id);
  };

  // Generate customized bespoke photography program calling server-side API (Gemini inside)
  const generateBespokePlan = async () => {
    if (!aiKeywordsInput.trim()) {
      setAiError("请输入核心关键词 (比如：‘王家卫、雨夜街头、冷酷迷幻’ 等)");
      return;
    }
    setAiLoading(true);
    setAiError(null);

    const keysArray = aiKeywordsInput.split(/[,，\s]+/).filter(Boolean);

    try {
      const response = await fetch("/api/generate-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          keywords: keysArray,
          sceneDetails: aiSceneInput,
          mood: aiMood
        })
      });

      if (!response.ok) {
        throw new Error("生成服务未就绪，或者未配置密钥。");
      }

      const generatedData = await response.json();
      
      // Adapt generated data structure to system custom plan format
      const id = `plan-ai-${Date.now()}`;
      
      const newPlan: CustomPlan = {
        id,
        title: generatedData.title || `「${keysArray[0]}」意向订制策划案`,
        createdAt: new Date().toISOString(),
        keywords: keysArray,
        sceneDetails: aiSceneInput || "未指定细节",
        concept: generatedData.concept || "无描述",
        weatherGuide: generatedData.weatherGuide || "未指定环境及自然光照天气",
        wardrobeGuide: generatedData.wardrobeGuide || "低调简约长衫",
        propsGuide: generatedData.propsGuide || "无需任何道具",
        locationGuide: generatedData.locationGuide || "推荐通用摄影棚",
        equipmentGuide: generatedData.equipmentGuide || "推荐通用 50mm f/1.8 焦段镜头",
        scheduleGuide: generatedData.scheduleGuide || "通常日间光照充裕下完成拍摄",
        lightingInstructions: generatedData.lightingInstructions || "主光配置",
        lightingSetup: generatedData.recommendedDevices || [
          { id: "model-1", type: DeviceType.MODEL, x: 150, y: 150, angle: 180, power: 1, colorTemp: 5500, label: "模特" },
          { id: "camera-1", type: DeviceType.CAMERA, x: 150, y: 260, angle: 270, power: 1, colorTemp: 5500, label: "主体相机" }
        ],
        storyboard: generatedData.storyboard ? generatedData.storyboard.map((st: any, i: number) => ({
          id: `st-${id}-${i}`,
          ...st
        })) : [],
        inspirations: [],
        finalPhotos: []
      };

      savePlans([newPlan, ...plans]);
      setActivePlanId(id);

      // Clear AI inputs on success
      setAiKeywordsInput("");
      setAiSceneInput("");
    } catch (e: any) {
      setAiError(e.message || "请求 AI 策划失败，请手动编辑或稍后重试。");
    } finally {
      setAiLoading(false);
    }
  };

  // Add individual inspiration reference link
  const addInspirationLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newInspirationTitle.trim() || !newInspirationUrl.trim()) return;

    const newLink: InspirationLink = {
      id: `insp-${Date.now()}`,
      title: newInspirationTitle,
      photographer: newInspirationPhotographer || "未知摄影师",
      url: newInspirationUrl,
      notes: newInspirationNotes
    };

    const updatedInspirations = [...(activePlan.inspirations || []), newLink];
    updateActivePlanField("inspirations", updatedInspirations);

    // reset fields
    setNewInspirationTitle("");
    setNewInspirationPhotographer("");
    setNewInspirationUrl("");
    setNewInspirationNotes("");
  };

  // Remove individual inspiration reference link
  const removeInspirationLink = (id: string) => {
    const updated = (activePlan.inspirations || []).filter((item) => item.id !== id);
    updateActivePlanField("inspirations", updated);
  };

  // Add individual final photo management card
  const addFinalPhoto = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPhotoTitle.trim()) return;

    // Default to a beautiful photo placeholder if the user didn't enter one,
    // to provide quick photorealistic layouts completely free of copyright claims.
    const fallbackUrls = [
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=600&q=80"
    ];
    const chosenUrl = newPhotoUrl.trim() || fallbackUrls[Math.floor(Math.random() * fallbackUrls.length)];

    const newPhoto: FinalPhoto = {
      id: `photo-${Date.now()}`,
      title: newPhotoTitle,
      url: chosenUrl,
      notes: newPhotoNotes,
      rating: newPhotoRating
    };

    const updatedPhotos = [...(activePlan.finalPhotos || []), newPhoto];
    updateActivePlanField("finalPhotos", updatedPhotos);

    // reset fields
    setNewPhotoTitle("");
    setNewPhotoUrl("");
    setNewPhotoNotes("");
    setNewPhotoRating(5);
  };

  const removeFinalPhoto = (id: string) => {
    const updated = (activePlan.finalPhotos || []).filter((item) => item.id !== id);
    updateActivePlanField("finalPhotos", updated);
  };

  // Share URL simulation
  const handleShareClick = () => {
    setShareSuccess(true);
    // Write link dummy query param
    const link = `${window.location.origin}${window.location.pathname}?planId=${activePlanId}`;
    navigator.clipboard.writeText(link).catch(() => {});
    setTimeout(() => {
      setShareSuccess(false);
    }, 2500);
  };

  // Fast seed database simulation to populate empty environments
  const handleFastRestoreDefault = () => {
    if (confirm("是否确认还原初始模版策划案并清除所有自定义数据？")) {
      savePlans(INITIAL_PLANS);
      setActivePlanId(INITIAL_PLANS[0].id);
    }
  };

  if (!activePlan) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-zinc-300 font-sans p-6">
        <div className="text-center">
          <svg className="animate-spin h-8 w-8 text-amber-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <p className="text-sm font-medium">摄影美学画布引擎加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 font-sans flex flex-col selection:bg-amber-500 selection:text-black">
      
      {/* GLOBAL BACKGROUND GLOW EFFECT FOR HIGH-END VISUALS */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none" />

      {/* HEADER SECTION --- Professional typography with fine borders */}
      <header id="app-marketing-header" className="sticky top-0 z-40 bg-zinc-950/85 backdrop-blur-md border-b border-zinc-800/80 px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="relative p-2.5 bg-zinc-900 border-2 border-amber-500/40 rounded-xl shadow-lg flex items-center justify-center">
            <Camera className="w-5 h-5 text-amber-400 stroke-[1.8]" />
            <span className="absolute -top-1 -right-1 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold tracking-tight text-white font-serif">摄影创意策划画布</h1>
              <span className="px-1.5 py-0.5 bg-zinc-800 text-[9px] text-zinc-400 tracking-wider uppercase font-mono rounded border border-zinc-700">MVP 1.0</span>
            </div>
            <p className="text-xs text-zinc-400 font-sans mt-0.5">面向摄影工作者的灵感策划、智能姿态与 2D 互动布光报告系统</p>
          </div>
        </div>

        {/* Global Toolbar */}
        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {/* Quick PDF Printable Layout trigger with Cover Page badge */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              id="export-pdf-btn"
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-xs text-zinc-300 text-nowrap rounded-xl transition"
              title="一键高定打印：自动生排版高规格拍摄大纲及互动2D布光画布报告"
            >
              <FileDown className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
              <span>导出 PDF 美学报告</span>
            </button>
            <span className="hidden sm:inline-flex items-center gap-1 px-2 py-1.5 bg-zinc-950 border border-zinc-900 text-[10px] text-zinc-400 font-mono rounded-xl">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              封面页·已联入
            </span>
          </div>

          {/* Share via copy parameters */}
          <button
            id="share-canvas-btn"
            onClick={handleShareClick}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-xs text-zinc-300 text-nowrap rounded-xl transition relative"
          >
            {shareSuccess ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">分享链接已复写！</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5 text-indigo-400" />
                <span>连接拷贝</span>
              </>
            )}
          </button>

          {/* Restore sample system defaults */}
          <button
            id="restore-defaults-btn"
            onClick={handleFastRestoreDefault}
            className="p-1.5 bg-zinc-950 hover:bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200 rounded-xl transition"
            title="还原初始内置范例"
          >
            <Clock className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* WRAPPER FOR LEFT DIRECTORY NAV TREE + MAIN WORKSPACE */}
      <div className="flex-1 flex flex-col lg:flex-row pb-12 print:block">
        
        {/* LEFT DIRECTORY TREE PANEL */}
        <aside id="project-directories" className="w-full lg:w-[250px] shrink-0 bg-[#09090b] border-b lg:border-b-0 lg:border-r border-zinc-900 lg:p-5 p-4 font-mono text-[13px] print:hidden">
          <div className="flex items-center justify-between text-zinc-500 pb-2.5 mb-3 border-b border-zinc-900/40">
            <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-400">大纲目录/文件树</span>
            <span className="text-[9px] bg-amber-500/10 text-amber-400 px-1 py-0.5 rounded font-mono">Workspace</span>
          </div>

          <div className="space-y-1.5 select-none text-zinc-300">
            {/* _系统 SECTION */}
            <div>
              <div 
                className="flex items-center gap-1.5 text-zinc-400 hover:text-zinc-200 cursor-pointer py-1 px-1 rounded hover:bg-zinc-900/40 transition"
                onClick={() => setSysFolderExpanded(!sysFolderExpanded)}
              >
                {sysFolderExpanded ? <ChevronDown className="w-3.5 h-3.5 shrink-0 text-zinc-650" /> : <ChevronRight className="w-3.5 h-3.5 shrink-0 text-zinc-650" />}
                <Folder className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                <span className="text-[12px] font-semibold text-zinc-300">_系统 (Settings)</span>
              </div>
              
              {sysFolderExpanded && (
                <div className="pl-6 space-y-1 mt-1 border-l border-zinc-900/60 ml-2.5">
                  <div 
                    onClick={() => setActiveExplorerItem("system")}
                    className={`flex items-center gap-2 cursor-pointer py-1 px-1.5 rounded transition text-[11px] ${
                      activeExplorerItem === "system" 
                        ? "bg-amber-500/10 text-amber-405 font-bold border-l-2 border-amber-500" 
                        : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/20"
                    }`}
                  >
                    <Settings className="w-3.5 h-3.5 shrink-0" />
                    <span>diagnostics.json</span>
                  </div>
                </div>
              )}
            </div>

            {/* 产出 SECTION */}
            <div>
              <div 
                className="flex items-center gap-1.5 text-zinc-400 hover:text-zinc-200 cursor-pointer py-1 px-1 rounded hover:bg-zinc-900/40 transition"
                onClick={() => setProdFolderExpanded(!prodFolderExpanded)}
              >
                {prodFolderExpanded ? <ChevronDown className="w-3.5 h-3.5 shrink-0 text-zinc-650" /> : <ChevronRight className="w-3.5 h-3.5 shrink-0 text-zinc-650" />}
                <Folder className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                <span className="text-[12px] font-semibold text-zinc-300">产出 (Outputs)</span>
              </div>

              {prodFolderExpanded && (
                <div className="pl-4 space-y-1 mt-1 border-l border-zinc-900/60 ml-2.5">
                  {/* APP SUBITEM */}
                  <div 
                    onClick={() => setActiveExplorerItem("app")}
                    className={`flex items-center gap-2 cursor-pointer py-1 px-1.5 rounded transition text-[11px] ${
                      activeExplorerItem === "app" 
                        ? "bg-amber-500/10 text-amber-405 font-bold border-l-2 border-amber-500" 
                        : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/30"
                    }`}
                  >
                    <FileCode className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span className="truncate">app (摄影创意策划)</span>
                  </div>

                  {/* 规划文档 SUB-FOLDER */}
                  <div>
                    <div 
                      className="flex items-center gap-1.5 text-zinc-400 hover:text-zinc-200 cursor-pointer py-1 px-1 rounded hover:bg-zinc-900/20 transition"
                      onClick={() => setDocsFolderExpanded(!docsFolderExpanded)}
                    >
                      {docsFolderExpanded ? <ChevronDown className="w-3.5 h-3.5 shrink-0" /> : <ChevronRight className="w-3.5 h-3.5 shrink-0" />}
                      <FolderOpen className="w-3.5 h-3.5 text-sky-455 shrink-0" />
                      <span className="text-[11px] text-zinc-300">规划文档</span>
                    </div>

                    {docsFolderExpanded && (
                      <div className="pl-4 space-y-1 mt-1 border-l border-zinc-900/40 ml-2">
                        {/* Spec文档 */}
                        <div 
                          onClick={() => setActiveExplorerItem("spec")}
                          className={`flex items-center gap-1.5 cursor-pointer py-1 px-1.5 rounded transition text-[11px] truncate ${
                            activeExplorerItem === "spec" 
                              ? "bg-sky-500/10 text-sky-400 font-bold border-l-2 border-sky-400" 
                              : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/25"
                          }`}
                        >
                          <FileText className="w-3 h-3 text-zinc-500 shrink-0" />
                          <span>Spec文档.md</span>
                        </div>

                        {/* 产品迭代 */}
                        <div 
                          onClick={() => setActiveExplorerItem("iterations")}
                          className={`flex items-center gap-1.5 cursor-pointer py-1 px-1.5 rounded transition text-[11px] truncate ${
                            activeExplorerItem === "iterations" 
                              ? "bg-sky-500/10 text-sky-400 font-bold border-l-2 border-sky-400" 
                              : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/25"
                          }`}
                        >
                          <FileText className="w-3 h-3 text-zinc-500 shrink-0" />
                          <span>产品迭代.md</span>
                        </div>

                        {/* 技术验证 */}
                        <div 
                          onClick={() => setActiveExplorerItem("tech-validation")}
                          className={`flex items-center gap-1.5 cursor-pointer py-1 px-1.5 rounded transition text-[11px] truncate ${
                            activeExplorerItem === "tech-validation" 
                              ? "bg-sky-500/10 text-sky-400 font-bold border-l-2 border-sky-400" 
                              : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/25"
                          }`}
                        >
                          <FileText className="w-3 h-3 text-zinc-500 shrink-0" />
                          <span>技术验证.md</span>
                        </div>

                        {/* 里程碑文档 */}
                        <div 
                          onClick={() => setActiveExplorerItem("milestone")}
                          className={`flex items-center gap-1.5 cursor-pointer py-1 px-1.5 rounded transition text-[11px] truncate ${
                            activeExplorerItem === "milestone" 
                              ? "bg-sky-500/10 text-sky-400 font-bold border-l-2 border-sky-400" 
                              : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/25"
                          }`}
                        >
                          <FileText className="w-3 h-3 text-zinc-500 shrink-0" />
                          <span>里程碑文档.md</span>
                        </div>

                        {/* 对接PRD规约 */}
                        <div 
                          onClick={() => setActiveExplorerItem("prd")}
                          className={`flex items-center gap-1.5 cursor-pointer py-1 px-1.5 rounded transition text-[11px] truncate ${
                            activeExplorerItem === "prd" 
                              ? "bg-emerald-500/10 text-emerald-400 font-bold border-l-2 border-emerald-400" 
                              : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/25"
                          }`}
                        >
                          <FileText className="w-3 h-3 text-emerald-500 shrink-0" />
                          <span>对接PRD规约.md</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </aside>

        {/* WORKSPACE AREA BODY CONTAINER */}
        <div className="flex-1 min-w-0">
          {activeExplorerItem === "app" ? (
            <>
              {/* HIGH-FIDELITY PRINT COVER PAGE (ONLY SHOWN IN PDF PRINT EXPORTS) */}
              <div 
                id="print-cover-page" 
                className="hidden print:flex flex-col justify-between w-full p-16 border-[16px] border-zinc-900 bg-white text-zinc-900"
                style={{ 
                  pageBreakAfter: "always", 
                  minHeight: "297mm", 
                  boxSizing: "border-box"
                }}
              >
                {/* Header */}
                <div className="flex justify-between items-center border-b-2 border-zinc-900 pb-4">
                  <div className="text-[10px] uppercase font-mono tracking-widest text-zinc-500 font-bold">
                    PRODUCTION DIRECTIVE OUTLINE // 摄影美学与智能布光方案书
                  </div>
                  <div className="text-[9px] font-mono tracking-wider text-zinc-800 bg-zinc-100 px-2 py-0.5 rounded border border-zinc-300 font-bold">
                    CONFIDENTIAL / 限拍摄执行组内部使用
                  </div>
                </div>

                {/* Cover Main Content */}
                <div className="my-auto py-12 flex flex-col justify-center">
                  <div className="text-xs uppercase tracking-widest text-amber-600 font-bold mb-4 font-mono">
                    - BESPOKE CREATIVE PORTFOLIO · 创意大纲策划案 -
                  </div>
                  
                  <h1 className="text-4xl md:text-5xl font-black tracking-tight text-zinc-900 font-serif leading-tight mb-6">
                    {activePlan.title || "无标题创意摄影案"}
                  </h1>

                  {/* Generated Tags */}
                  <div className="flex flex-wrap gap-2 mb-10">
                    {activePlan.keywords && activePlan.keywords.length > 0 ? (
                      activePlan.keywords.map((key, i) => (
                        <span 
                          key={i} 
                          className="px-3 py-1 bg-zinc-100 border border-zinc-300 text-zinc-800 text-xs font-mono font-semibold rounded-full"
                        >
                          #{key}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-zinc-400 font-mono">#默认美学 #日常</span>
                    )}
                  </div>

                  {/* Core Visual Concept Box */}
                  <div className="mt-4 p-8 bg-zinc-50 border-l-4 border-zinc-850 rounded-r-2xl relative">
                    <div className="absolute top-4 right-6 text-zinc-200 text-7xl font-serif leading-none select-none">
                      “
                    </div>
                    <div className="text-zinc-500 text-[10px] uppercase tracking-wider font-mono font-bold mb-3">
                      视觉美学创意内核 / Core Concept
                    </div>
                    <p className="text-sm text-zinc-800 leading-relaxed font-serif relative z-10 whitespace-pre-wrap">
                      {activePlan.concept || "等待输入或通过 AI 灵感器一键清洗。在这里将自动排版并渲染出整个拍摄的灵魂概念，指导整场机位和情绪拉扯。"}
                    </p>
                  </div>
                </div>

                {/* Footer metadata */}
                <div className="border-t-2 border-zinc-900 pt-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs">
                  <div>
                    <p className="text-zinc-500 font-mono text-[10px]">
                      SYSTEM ARCHITECTURE: <strong className="text-zinc-900 font-bold">摄影美学多模态编排与 2D 互动布光沙盘 (MVP v1.0)</strong>
                    </p>
                    <p className="text-zinc-400 font-mono mt-1 text-[10px]">
                      PLANNED DATE: {new Date(activePlan.createdAt).toLocaleString("zh-CN")}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-zinc-500 font-mono tracking-wider font-bold text-[10px]">
                      DIRECTIVE OUTLINE // COVER PAGE
                    </p>
                    <p className="text-zinc-400 font-mono mt-1 text-[10px]">
                      Page 1 of 3
                    </p>
                  </div>
                </div>
              </div>

              <main id="main-photography-dashboard" className="flex-1 grid grid-cols-1 xl:grid-cols-12 gap-6 p-6">
        
        {/* =========================================================
            Column A: Plan Explorer & Bespoke Generator (Col span 3)
            ========================================================= */}
        <section id="sidebar-explorer" className="xl:col-span-3 space-y-6">
          
          {/* A1: Active Selector */}
          <div className="bg-zinc-950 border border-zinc-800/80 p-4 rounded-2xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3 border-b border-zinc-900 pb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">切换 / 选择已有策划案</span>
                <button
                  id="create-blank-plan-btn"
                  onClick={createBlankPlan}
                  className="px-2 py-1 bg-zinc-900 hover:bg-zinc-850 text-amber-400 text-[10px] font-bold rounded-lg border border-amber-500/20 hover:border-amber-400/40 transition flex items-center gap-1"
                >
                  <Plus className="w-2.5 h-2.5" />
                  新建画布
                </button>
              </div>

              {/* Responsive Select dropdown for easy mobile navigation */}
              <div className="mb-3 block xl:hidden">
                <select
                  id="plan-mobile-select"
                  value={activePlanId}
                  onChange={(e) => setActivePlanId(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-90 w-full bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-zinc-200"
                >
                  {plans.map((p) => (
                    <option key={p.id} value={p.id}>{p.title}</option>
                  ))}
                </select>
              </div>

              {/* Sidebar list on large screen */}
              <div className="hidden xl:block space-y-1.5 max-h-[170px] overflow-y-auto pr-1">
                {plans.map((p) => {
                  const isActive = p.id === activePlanId;
                  return (
                    <div
                      key={p.id}
                      className={`group flex items-center justify-between p-2.5 rounded-xl border transition pointer-events-auto cursor-pointer ${
                        isActive
                          ? "bg-zinc-900 border-amber-500/40 text-amber-300"
                          : "bg-zinc-900/40 border-zinc-900 text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200"
                      }`}
                      onClick={() => setActivePlanId(p.id)}
                    >
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <div className={`w-1.5 h-1.5 rounded-full ${isActive ? "bg-amber-400 animate-pulse" : "bg-zinc-600"}`} />
                        <span className="text-xs font-medium truncate leading-relaxed">{p.title}</span>
                      </div>
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deletePlan(p.id);
                        }}
                        className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-400 transition ml-2"
                        title="删除该案"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* A2: Bespoke AI Photography Architect */}
          <div className="bg-zinc-950 border border-zinc-800/80 p-4 rounded-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-3 pointer-events-none opacity-5">
              <Sparkles className="w-20 h-20 text-amber-500" />
            </div>
            
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-300 mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              一键式 AI 摄影全案策划生成器
            </h3>
            
            <p className="text-[11px] text-zinc-500 mb-3 leading-relaxed">
              输入画面破碎词，一键为您生成融合【场地勘景、服饰材质、自然天气、道具手势、摄影器材、执行时序、2D智能交互打光】的顶级摄影策划案。
            </p>

            {/* 日系小清新深度学习卡片 */}
            <div className="mb-4 p-2.5 bg-sky-950/20 border border-sky-900/30 rounded-xl">
              <div className="flex items-center gap-1.5 mb-1">
                <span className="w-1.5 h-1.5 bg-sky-400 rounded-full animate-pulse"></span>
                <span className="text-[10px] font-bold text-sky-400 uppercase tracking-wide">日系小清新空气感研究要脉</span>
              </div>
              <ul className="text-[9px] text-zinc-400 space-y-1 list-disc pl-3">
                <li><strong className="text-zinc-300">影调：</strong>高明度低反差，选用轻柔漫射晨光或多云天。</li>
                <li><strong className="text-zinc-300">道具：</strong>波子汽水瓶、玻璃冰块、透明雨伞、复古单车。</li>
                <li><strong className="text-zinc-300">镜滤：</strong>使用大光圈镜头(如105mm f/2.4)加装 Glimmerglass/白柔。</li>
              </ul>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-[9px] font-bold text-zinc-400 uppercase tracking-tight mb-1">
                  拍摄风格关键词 (用逗号隔开)
                </label>
                <input
                  id="ai-keywords-input"
                  type="text"
                  placeholder="如：日系、初夏、空气感、海边电车"
                  value={aiKeywordsInput}
                  onChange={(e) => setAiKeywordsInput(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-zinc-200 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-[9px] font-bold text-zinc-400 uppercase tracking-tight mb-1">
                  拍摄情境详情 (选填)
                </label>
                <input
                  id="ai-scene-input"
                  type="text"
                  placeholder="如：手捧冰汽水瓶贴在柔颊，发丝随清风飞扬"
                  value={aiSceneInput}
                  onChange={(e) => setAiSceneInput(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-zinc-200 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-[9px] font-bold text-zinc-400 uppercase tracking-tight mb-1">
                  画骨氛围倾向
                </label>
                <select
                  id="ai-mood-select"
                  value={aiMood}
                  onChange={(e) => setAiMood(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-zinc-300"
                >
                  <option value="清新微粉日系自然风">温暖日系高调 (温柔弱对比)</option>
                  <option value="复古暗色底电影高比">复古暗调电影 (低调高反差)</option>
                  <option value="清澈冰蓝高级北欧侘寂">北欧冷感寂夜 (冷淡纯净度)</option>
                  <option value="经典黄金暖阳强烈戏剧光">夕阳午后暖光 (戏剧性金黄)</option>
                </select>
              </div>

              <button
                id="generate-bespoke-btn"
                onClick={generateBespokePlan}
                disabled={aiLoading}
                className="w-full py-2 bg-gradient-to-r from-amber-600/90 to-amber-500 hover:from-amber-500 hover:to-amber-400 disabled:opacity-40 text-black text-xs font-bold rounded-xl transition duration-150 flex items-center justify-center gap-1.5"
              >
                {aiLoading ? (
                  <>
                    <svg className="animate-spin h-3.5 w-3.5 text-black" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>构建美学方案...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>AI 撰写美学方案</span>
                  </>
                )}
              </button>

              {aiError && (
                <p className="text-[10px] text-red-400 font-mono text-center">
                  ⚠️ {aiError}
                </p>
              )}
            </div>
          </div>

          {/* Useful checklist and safety warnings */}
          <div className="bg-zinc-950/40 border border-zinc-900 p-4 rounded-2xl text-[11px] text-zinc-500 leading-relaxed">
            <h4 className="text-zinc-400 font-bold mb-1 flex items-center gap-1">
              <Info className="w-3.5 h-3.5 text-zinc-400" />
              美学安全共识
            </h4>
            为了规避版权纠纷，本程序设计坚决放弃直接在本地存放网络画作或受版权保护的作品作为例图。我们极力推行:
            <ul className="list-disc pl-4 mt-1 space-y-0.5">
              <li>通过原文链接跳转获取外部原贴例图</li>
              <li>依托 AI 自研模型清洗构想，在线直接生成独特的线稿轮廓解剖手绘</li>
            </ul>
          </div>
        </section>


        {/* =========================================================
            Column B: Core Workspace (Lighting Canvas & AI Pose Drawer) (Col span 5 + 4)
            ========================================================= */}
        <section id="workspace-center" className="xl:col-span-9 space-y-6">
          
          {/* Active Program General Details Edit */}
          <div className="bg-zinc-950 border border-zinc-800/80 p-5 rounded-2xl">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 border-b border-zinc-900 pb-3 mb-4">
              <div>
                <input
                  id="active-plan-title-input"
                  type="text"
                  value={activePlan.title}
                  onChange={(e) => updateActivePlanField("title", e.target.value)}
                  className="text-lg md:text-xl font-bold font-serif text-white bg-transparent border-b border-transparent hover:border-zinc-700/60 focus:border-amber-500 focus:outline-none transition w-full max-w-lg"
                  placeholder="输入策划案主题名称..."
                />
                <p className="text-[11px] text-zinc-500 mt-1">创建时间: {new Date(activePlan.createdAt).toLocaleString("zh-CN")}</p>
              </div>

              {/* Tag badges */}
              <div className="flex flex-wrap gap-1">
                {activePlan.keywords.map((key, i) => (
                  <span key={i} className="px-2 py-0.5 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] rounded-full">
                    #{key}
                  </span>
                ))}
              </div>
            </div>

            {/* Quick view text fields: Concept, Wardrobe, Makeup, Props, Location, Weather, Equipment, Schedule */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* 美学大内核 */}
              <div className="md:col-span-2">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-amber-500/80 mb-1 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
                  拍摄美学创意内核 (Concept)
                </label>
                <textarea
                  id="plan-concept-area"
                  rows={4}
                  value={activePlan.concept}
                  onChange={(e) => updateActivePlanField("concept", e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800/60 rounded-xl text-xs text-zinc-300 focus:border-zinc-700 focus:outline-none resize-none leading-relaxed"
                  placeholder="请输入整个拍摄的灵魂概念..."
                />
              </div>

              {/* 服饰设计与质感 */}
              <div className="md:col-span-2">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full"></span>
                  服饰设计与质感 (Wardrobe)
                </label>
                <textarea
                  id="plan-wardrobe-area"
                  rows={4}
                  value={activePlan.wardrobeGuide || ""}
                  onChange={(e) => updateActivePlanField("wardrobeGuide", e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-900 border border-zinc-805 rounded-xl text-xs text-zinc-300 focus:border-zinc-700 focus:outline-none resize-none leading-relaxed"
                  placeholder="服装色系、裁剪面料建议..."
                />
              </div>

              {/* 影响美学的环境及自然光因素 */}
              <div className="md:col-span-2">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-sky-400 mb-1 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-sky-400 rounded-full"></span>
                  自然天气、时轴与日光状态 (Weather & Natural Light)
                </label>
                <textarea
                  id="plan-weather-area"
                  rows={3}
                  value={activePlan.weatherGuide || ""}
                  onChange={(e) => updateActivePlanField("weatherGuide", e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-900/80 border border-zinc-850 rounded-xl text-xs text-zinc-300 focus:border-zinc-700 focus:outline-none resize-none leading-relaxed"
                  placeholder="天气条件、拍摄时间段段与环境光（如：黄昏黄金一小时、树影漫反射）..."
                />
              </div>

              {/* 推荐摄影机身、镜头与特殊滤镜系统 */}
              <div className="md:col-span-2">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-emerald-400 mb-1 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>
                  建议摄影器材与镜头搭配 (Camera & Lenses)
                </label>
                <textarea
                  id="plan-equipment-area"
                  rows={3}
                  value={activePlan.equipmentGuide || ""}
                  onChange={(e) => updateActivePlanField("equipmentGuide", e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-900/80 border border-zinc-850 rounded-xl text-xs text-zinc-300 focus:border-zinc-700 focus:outline-none resize-none leading-relaxed"
                  placeholder="推荐机身焦段（如 85mm F1.4 / 35mm）以及特殊滤镜搭配..."
                />
              </div>

              {/* 全天实地执行进度时序表 */}
              <div className="md:col-span-4 border-t border-zinc-900 pt-3">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-teal-400 mb-1 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-teal-400 rounded-full"></span>
                  实地拍摄黄金时间时序推进进度表 (Schedule)
                </label>
                <textarea
                  id="plan-schedule-area"
                  rows={2}
                  value={activePlan.scheduleGuide || ""}
                  onChange={(e) => updateActivePlanField("scheduleGuide", e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-900/40 border border-zinc-900 rounded-xl text-xs text-zinc-300 focus:border-zinc-700 focus:outline-none resize-none leading-relaxed"
                  placeholder="全天拍摄时序与执行进度分配表..."
                />
              </div>

              {/* 道具、场地、打光辅助行 */}
              <div className="md:col-span-4 grid grid-cols-1 md:grid-cols-3 gap-3 pt-3 border-t border-zinc-900">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1">
                    特色道具与持装动作 (Props)
                  </label>
                  <input
                    id="plan-props-input"
                    type="text"
                    value={activePlan.propsGuide}
                    onChange={(e) => updateActivePlanField("propsGuide", e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-zinc-900/50 border border-zinc-800/70 rounded-lg text-xs text-zinc-300 focus:border-zinc-700 focus:outline-none"
                    placeholder="营造故事画面的辅助道具清单..."
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1">
                    精确场地与制景 (Location)
                  </label>
                  <input
                    id="plan-location-input"
                    type="text"
                    value={activePlan.locationGuide}
                    onChange={(e) => updateActivePlanField("locationGuide", e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-zinc-900/50 border border-zinc-800/70 rounded-lg text-xs text-zinc-300 focus:border-zinc-700 focus:outline-none"
                    placeholder="棚内搭景方案或户外勘景推荐..."
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1">
                    雷达辅助控光指示 (Lighting Brief)
                  </label>
                  <input
                    id="plan-lighting-brief-input"
                    type="text"
                    value={activePlan.lightingInstructions}
                    onChange={(e) => updateActivePlanField("lightingInstructions", e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-zinc-900/50 border border-zinc-800/70 rounded-lg text-xs text-zinc-300 focus:border-zinc-700 focus:outline-none"
                    placeholder="灯位明暗对比、主辅光控光说明..."
                  />
                </div>
              </div>
            </div>
          </div>

          {/* TWO COLUMN CENTER WORKSPACE */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* 2D LIGHTING SIMULATOR DESIGN CANVAS (Center Col span 8) */}
            <div className="lg:col-span-8 flex flex-col space-y-3">
              <div className="flex items-center justify-between border-b border-zinc-900 pb-1">
                <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-300 flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-amber-500" />
                  专业场景 2D 二维布光方案模拟器
                </h2>
                <span className="text-[10px] text-zinc-500 font-mono">MODEL AT (150, 150)</span>
              </div>
              
              <LightingCanvas
                devices={activePlan.lightingSetup}
                onChange={(devs) => updateActivePlanField("lightingSetup", devs)}
                selectedId={selectedDeviceId}
                onSelect={setSelectedDeviceId}
              />
            </div>

            {/* AI IMAGINATION DESIGN DRAWINGS (Center Col span 4) */}
            <div className="lg:col-span-4">
              <PoseSketcher
                description={activePlan.sceneDetails}
                onDescriptionChange={(val) => updateActivePlanField("sceneDetails", val)}
                onSketchGenerated={(sku) => {
                  updateActivePlanField("sceneDetails", sku.description);
                }}
              />
            </div>

          </div>

          {/* SYSTEM BENTO-GRID: STORYBOARD & INSPIRATION PREVIEW &成片 (Tab/Bento section) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* B1: STORYBOARD TIMELINE (Col span 6) */}
            <div className="lg:col-span-6 bg-zinc-950 border border-zinc-800/80 p-5 rounded-2xl flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3 border-b border-zinc-900 pb-2">
                  <h3 className="text-sm font-semibold text-zinc-200 tracking-wide flex items-center gap-1.5">
                    <Sliders className="w-4 h-4 text-amber-500" />
                    电影感镜位分镜轴 (Visual Storyboard)
                  </h3>
                  <button
                    id="add-storyboard-btn"
                    onClick={() => {
                      const newSt: StoryboardElement = {
                        id: `st-${Date.now()}`,
                        shotType: "远景 / 中景或特写",
                        cameraAngle: "平视",
                        lensName: "50mm f/1.2",
                        actionDescription: "模特姿态神采...",
                        lightDescription: "光影调性刻画..."
                      };
                      updateActivePlanField("storyboard", [...(activePlan.storyboard || []), newSt]);
                    }}
                    className="p-1 px-2.5 bg-zinc-900 hover:bg-zinc-800 text-[10px] border border-zinc-800 text-zinc-300 rounded-lg flex items-center gap-1 transition"
                  >
                    <Plus className="w-3 h-3" />
                    <span>增加分镜</span>
                  </button>
                </div>

                <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
                  {(activePlan.storyboard || []).length > 0 ? (
                    (activePlan.storyboard || []).map((step, idx) => (
                      <div key={step.id} className="relative p-3 bg-zinc-900/60 rounded-xl border border-zinc-800 flex items-start gap-3">
                        <div className="px-2 py-1 bg-zinc-800 rounded text-[10px] text-amber-500 font-bold tracking-tight">
                          #{idx + 1}
                        </div>

                        <div className="flex-1 space-y-1.5">
                          <div className="grid grid-cols-3 gap-1">
                            <input
                              id={`shotType-${step.id}`}
                              type="text"
                              value={step.shotType}
                              placeholder="景别 (如，特写)"
                              onChange={(e) => {
                                const updated = activePlan.storyboard.map(st => st.id === step.id ? { ...st, shotType: e.target.value } : st);
                                updateActivePlanField("storyboard", updated);
                              }}
                              className="px-1.5 py-0.5 bg-zinc-950 text-[11px] rounded text-zinc-200 border border-transparent focus:border-zinc-700/60 focus:outline-none"
                            />
                            <input
                              id={`cameraAngle-${step.id}`}
                              type="text"
                              value={step.cameraAngle}
                              placeholder="机位角度 (平视)"
                              onChange={(e) => {
                                const updated = activePlan.storyboard.map(st => st.id === step.id ? { ...st, cameraAngle: e.target.value } : st);
                                updateActivePlanField("storyboard", updated);
                              }}
                              className="px-1.5 py-0.5 bg-zinc-950 text-[11px] rounded text-zinc-200 border border-transparent focus:border-zinc-700/60 focus:outline-none"
                            />
                            <input
                              id={`lensName-${step.id}`}
                              type="text"
                              value={step.lensName}
                              placeholder="焦段光圈 (85mm)"
                              onChange={(e) => {
                                const updated = activePlan.storyboard.map(st => st.id === step.id ? { ...st, lensName: e.target.value } : st);
                                updateActivePlanField("storyboard", updated);
                              }}
                              className="px-1.5 py-0.5 bg-zinc-950 text-[11px] rounded text-zinc-200 border border-transparent focus:border-zinc-700/60 focus:outline-none"
                            />
                          </div>

                          <div className="space-y-1 mt-1.5">
                            <input
                              id={`action-${step.id}`}
                              type="text"
                              value={step.actionDescription}
                              placeholder="动作姿势: 模特微低头..."
                              onChange={(e) => {
                                const updated = activePlan.storyboard.map(st => st.id === step.id ? { ...st, actionDescription: e.target.value } : st);
                                updateActivePlanField("storyboard", updated);
                              }}
                              className="w-full px-2 py-1 bg-zinc-900 border border-transparent focus:border-zinc-800 rounded text-xs text-zinc-300 placeholder:text-zinc-600 focus:outline-none"
                            />
                            <input
                              id={`lightDesc-${step.id}`}
                              type="text"
                              value={step.lightDescription}
                              placeholder="光影特征与阴影..."
                              onChange={(e) => {
                                const updated = activePlan.storyboard.map(st => st.id === step.id ? { ...st, lightDescription: e.target.value } : st);
                                updateActivePlanField("storyboard", updated);
                              }}
                              className="w-full px-2 py-0.5 bg-zinc-900 border border-transparent focus:border-zinc-800 rounded text-[11px] text-zinc-400 placeholder:text-zinc-600 focus:outline-none"
                            />
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            const updated = activePlan.storyboard.filter(st => st.id !== step.id);
                            updateActivePlanField("storyboard", updated);
                          }}
                          className="p-1 text-zinc-500 hover:text-red-400 opacity-60 hover:opacity-100 transition"
                          title="删除此分镜"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="text-center p-6 bg-zinc-900/35 border border-dashed border-zinc-800 rounded-xl">
                      <p className="text-xs text-zinc-500">暂无电影镜位分镜安排。点击上方“+ 增加分镜”来丰富你的拍摄步骤。</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="text-[10px] text-zinc-500 mt-2 font-mono border-t border-zinc-900 pt-2 text-right">
                STORYBOARD ENGINE SYSTEM
              </div>
            </div>

            {/* B2: INSPIRATION JUMP REF LINKS (Col span 6) */}
            <div className="lg:col-span-6 bg-zinc-950 border border-zinc-800/80 p-5 rounded-2xl flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3 border-b border-zinc-900 pb-2">
                  <h3 className="text-sm font-semibold text-zinc-200 tracking-wide flex items-center gap-1.5">
                    <LinkIcon className="w-4 h-4 text-emerald-400" />
                    参考意向例图原文索引 (规避纠纷)
                  </h3>
                </div>

                <p className="text-[11px] text-zinc-500 mb-3 leading-relaxed">
                  为预防未经授权的二次例图分发侵权，在此登记灵感帖子源链接（如：小红书、豆瓣或 Pinterest ）。
                </p>

                {/* Form to add link */}
                <form id="add-inspiration-form" onSubmit={addInspirationLink} className="space-y-2 mb-4 bg-zinc-900/40 p-3 rounded-xl border border-zinc-800">
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      id="insp-title-input"
                      type="text"
                      placeholder="例图标题 (如，高反差黑白海滩)"
                      required
                      value={newInspirationTitle}
                      onChange={(e) => setNewInspirationTitle(e.target.value)}
                      className="px-2.5 py-1.5 bg-zinc-950 text-xs rounded border border-transparent focus:border-zinc-800 focus:outline-none placeholder:text-zinc-600"
                    />
                    <input
                      id="insp-photographer-input"
                      type="text"
                      placeholder="原作者 (如，赫尔穆特纽顿)"
                      value={newInspirationPhotographer}
                      onChange={(e) => setNewInspirationPhotographer(e.target.value)}
                      className="px-2.5 py-1.5 bg-zinc-950 text-xs rounded border border-transparent focus:border-zinc-800 focus:outline-none placeholder:text-zinc-600"
                    />
                  </div>
                  
                  <input
                    id="insp-url-input"
                    type="url"
                    required
                    placeholder="参考地址 (URL，如 https://...)"
                    value={newInspirationUrl}
                    onChange={(e) => setNewInspirationUrl(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-zinc-950 text-xs rounded border border-transparent focus:border-zinc-800 focus:outline-none placeholder:text-zinc-600"
                  />

                  <div className="flex items-center justify-between gap-2">
                    <input
                      id="insp-notes-input"
                      type="text"
                      placeholder="美学提炼点拨 (如，学习其强烈肢体侧倾)"
                      value={newInspirationNotes}
                      onChange={(e) => setNewInspirationNotes(e.target.value)}
                      className="flex-1 px-2.5 py-1 bg-zinc-950 text-[11px] rounded border border-transparent focus:border-zinc-800 focus:outline-none placeholder:text-zinc-600"
                    />
                    <button
                      id="submit-insp-btn"
                      type="submit"
                      className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-black text-xs font-bold rounded-lg transition"
                    >
                      添加参考
                    </button>
                  </div>
                </form>

                {/* Inspiration source lists with external jumps */}
                <div className="space-y-1.5 max-h-[160px] overflow-y-auto pr-1">
                  {(activePlan.inspirations || []).length > 0 ? (
                    (activePlan.inspirations || []).map((insp) => (
                      <div 
                        key={insp.id} 
                        onMouseEnter={(e) => {
                          if (isImageUrl(insp.url)) {
                            setHoveredImageUrl(insp.url);
                            setHoveredPosition({ x: e.clientX + 20, y: e.clientY - 110 });
                           }
                        }}
                        onMouseMove={(e) => {
                          if (isImageUrl(insp.url)) {
                            let posX = e.clientX + 20;
                            let posY = e.clientY - 110;
                            if (posX + 240 > window.innerWidth) {
                              posX = e.clientX - 250;
                            }
                            if (posY + 240 > window.innerHeight) {
                              posY = window.innerHeight - 250;
                            }
                            if (posY < 10) {
                              posY = 10;
                            }
                            setHoveredPosition({ x: posX, y: posY });
                          }
                        }}
                        onMouseLeave={() => {
                          setHoveredImageUrl(null);
                          setHoveredPosition(null);
                        }}
                        className="flex items-center justify-between p-2.5 bg-zinc-900 border border-zinc-850/60 rounded-xl text-xs hover:border-zinc-700 transition relative group"
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="font-bold text-zinc-200 truncate">{insp.title}</span>
                            <span className="text-[10px] text-zinc-500">by {insp.photographer}</span>
                            {isImageUrl(insp.url) && (
                              <span className="inline-flex items-center gap-0.5 px-1 py-0.5 bg-emerald-950/40 border border-emerald-900/40 text-emerald-400 text-[8px] font-mono rounded">
                                <ImageIcon className="w-2 h-2 text-emerald-400" />
                                <span>有图</span>
                              </span>
                            )}
                          </div>
                          {insp.notes && <p className="text-[10px] text-zinc-400 mt-0.5 truncate italic">" {insp.notes} "</p>}
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <a
                            id={`ext-link-${insp.id}`}
                            href={insp.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1 px-2 bg-emerald-950/40 text-emerald-400 border border-emerald-900 rounded-lg hover:bg-emerald-900 hover:text-white text-[10px] tracking-tight transition inline-flex items-center gap-1"
                          >
                            <span>前往原文</span>
                            <LinkIcon className="w-2.5 h-2.5" />
                          </a>
                          <button
                            onClick={() => removeInspirationLink(insp.id)}
                            className="p-1 text-zinc-500 hover:text-red-400 ml-1.5"
                            title="回收意向"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center p-4 bg-zinc-900/30 border border-dashed border-zinc-850 rounded-xl">
                      <p className="text-[11px] text-zinc-500">尚无注册灵感帖子超链接。可以通过上表保存优雅跳转标记！</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="text-[10px] text-zinc-500 mt-2 font-mono border-t border-zinc-900 pt-2 text-right">
                INTENDED SOURCE TRACEABILITY
              </div>
            </div>

          </div>

          {/* SECTION C: FINAL PHOTO MANAGEMENT ("两者结合，管理成片，作为创意记录工具") */}
          <div className="bg-zinc-950 border border-zinc-800/80 p-5 rounded-2xl">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-zinc-900 pb-3 mb-4 gap-3">
              <div>
                <h3 className="text-sm font-semibold text-zinc-100 flex items-center gap-1.5">
                  <ImageIcon className="w-4 h-4 text-cyan-400 animate-pulse" />
                  实拍摄影成片归档 & 现场创意快记 (Creative Photo Manager)
                </h3>
                <p className="text-[11px] text-zinc-500 mt-0.5">
                  将拍摄完工后的高清成片或测试底片关联至此画布，完美闭环：不仅能做前期的周备策划，也可用作最终作品档案库。
                </p>
              </div>
            </div>

            {/* Quick entry for photorealistic imagery archiving */}
            <form id="add-archived-photo-form" onSubmit={addFinalPhoto} className="grid grid-cols-1 md:grid-cols-12 gap-3 mb-5 p-3.5 bg-zinc-900/40 border border-zinc-850/60 rounded-xl">
              <div className="md:col-span-3">
                <label className="block text-[9px] font-bold text-zinc-400 uppercase tracking-tight mb-1">作品标题说明</label>
                <input
                  id="final-photo-title-input"
                  type="text"
                  required
                  placeholder="如：霓虹街角第一版试片"
                  value={newPhotoTitle}
                  onChange={(e) => setNewPhotoTitle(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-zinc-200 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="md:col-span-4">
                <label className="block text-[9px] font-bold text-zinc-400 uppercase tracking-tight mb-1">图片链接 / Base64</label>
                <input
                  id="final-photo-url-input"
                  type="text"
                  placeholder="可选。不填时自动填充Unsplash版权保护安全的精彩例图"
                  value={newPhotoUrl}
                  onChange={(e) => setNewPhotoUrl(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-zinc-200 focus:outline-none focus:border-cyan-500 placeholder:text-zinc-700"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-[9px] font-bold text-zinc-400 uppercase tracking-tight mb-1">画作现场评级</label>
                <select
                  id="final-photo-rating"
                  value={newPhotoRating}
                  onChange={(e) => setNewPhotoRating(parseInt(e.target.value))}
                  className="w-full px-2.5 py-1.5 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-zinc-300"
                >
                  <option value="5">⭐⭐⭐⭐⭐ 传世神作</option>
                  <option value="4">⭐⭐⭐⭐ 高质商业案</option>
                  <option value="3">⭐⭐⭐ 一般试片</option>
                  <option value="2">⭐⭐ 存在失温偏色</option>
                </select>
              </div>

              <div className="md:col-span-3 flex items-end">
                <button
                  id="submit-photo-btn"
                  type="submit"
                  className="w-full py-1.5 bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-black text-xs font-bold rounded-lg transition"
                >
                  + 登记实排成片
                </button>
              </div>

              <div className="md:col-span-12">
                <input
                  id="final-photo-notes-input"
                  type="text"
                  placeholder="关于该成片在灯光偏振、滤镜叠加和拍摄手法的快记日记 (如，200mm焦距，单向偏振片过滤公汽玻璃高光)..."
                  value={newPhotoNotes}
                  onChange={(e) => setNewPhotoNotes(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-zinc-950 border border-zinc-800 rounded-lg text-[11px] text-zinc-300 focus:outline-none placeholder:text-zinc-650"
                />
              </div>
            </form>

            {/* List rendered final photos */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {(activePlan.finalPhotos || []).length > 0 ? (
                (activePlan.finalPhotos || []).map((photo) => (
                  <div key={photo.id} className="group relative bg-[#121214] border border-zinc-800/80 rounded-xl overflow-hidden flex flex-col justify-between">
                    
                    {/* Top image layout */}
                    <div className="relative aspect-video bg-zinc-900 border-b border-zinc-800 overflow-hidden flex items-center justify-center">
                      <img
                        src={photo.url}
                        alt={photo.title}
                        className="object-cover w-full h-full group-hover:scale-105 transition duration-500"
                        onError={(e) => {
                          // fallback if broken url
                          (e.target as any).src = "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&w=600&q=80";
                        }}
                      />
                      <div className="absolute top-2 left-2 px-1.5 py-0.5 bg-black/80 rounded select-none flex items-center gap-0.5 text-[10px] text-amber-400">
                        <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                        <span className="font-mono font-bold">{photo.rating}</span>
                      </div>

                      <button
                        id="destroy-photo"
                        onClick={() => removeFinalPhoto(photo.id)}
                        className="absolute top-2 right-2 p-1 bg-black/80 text-zinc-400 hover:text-red-400 rounded transition opacity-0 group-hover:opacity-100"
                        title="回收成片"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Meta info tags */}
                    <div className="p-3 space-y-1">
                      <h4 className="text-xs font-bold text-zinc-200 truncate">{photo.title}</h4>
                      {photo.notes && (
                        <p className="text-[10px] text-zinc-400 line-clamp-2 leading-relaxed italic bg-zinc-950/40 p-1.5 rounded border border-zinc-900/60 mt-1">
                          {photo.notes}
                        </p>
                      )}
                    </div>

                  </div>
                ))
              ) : (
                <div className="col-span-4 py-8 text-center bg-zinc-900/10 border-2 border-dashed border-zinc-900 rounded-xl">
                  <ImageIcon className="w-6 h-6 text-zinc-750 mx-auto mb-1" />
                  <p className="text-xs text-zinc-500">尚无摄影成片记录。在上方表单登记你的试照或样片吧！</p>
                </div>
              )}
            </div>

          </div>

        </section>

      </main>
            </>
          ) : (
             <section className="p-6 lg:p-10 shrink-0">
               <div className="mb-6">
                 <button
                   onClick={() => setActiveExplorerItem("app")}
                   className="px-3.5 py-1.5 bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 hover:border-zinc-700 text-xs text-amber-400 rounded-xl transition flex items-center gap-1.5 font-mono cursor-pointer"
                 >
                   <span>← 返回极速布光方案 app 空间</span>
                 </button>
               </div>
               <div className="bg-zinc-950/40 border border-zinc-90/80 p-6 lg:p-8 rounded-2xl max-w-5xl shadow-xl shadow-black/40">
                 {activeExplorerItem === "spec" && renderSpecDoc()}
                 {activeExplorerItem === "iterations" && renderIterationsDoc()}
                 {activeExplorerItem === "tech-validation" && renderTechValidationDoc()}
                 {activeExplorerItem === "milestone" && renderMilestoneDoc()}
                 {activeExplorerItem === "system" && renderSystemPanel(plans.length, "Cached")}
                 {activeExplorerItem === "prd" && renderPrdDoc()}
               </div>
             </section>
          )}
        </div>

      {/* GLOBAL HOVER PREVIEW CARD */}
      {hoveredImageUrl && hoveredPosition && (
        <div 
          className="fixed z-[9999] pointer-events-none p-1.5 bg-zinc-950 border border-zinc-805 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 flex flex-col items-center justify-center opacity-95"
          style={{ 
            left: `${hoveredPosition.x}px`, 
            top: `${hoveredPosition.y}px`,
            width: "220px",
            height: "220px"
          }}
        >
          <img 
            src={hoveredImageUrl} 
            alt="Reference Preview" 
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover rounded-xl"
            onError={(e) => {
              (e.target as any).src = "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&w=600&q=80";
            }}
          />
          <div className="absolute bottom-2.5 left-2.5 right-2.5 bg-black/85 backdrop-blur-md px-2 py-1.5 rounded-lg text-[9px] text-zinc-300 font-mono flex items-center justify-between border border-zinc-800/55">
            <span className="flex items-center gap-1.5 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              参考例图·视觉对比中
            </span>
          </div>
        </div>
      )}

      </div>

      {/* FOOTER SECTION */}
      <footer id="app-footer" className="bg-zinc-950 border-t border-zinc-900 px-6 py-6 mt-12 flex flex-col md:flex-row items-center justify-between text-[11px] text-zinc-500 gap-4">
        <div>
          <span className="text-zinc-400 font-serif font-bold tracking-wider mr-2">摄影创意策划画布</span>
          致力为国内摄影师、剧组与影楼提供优雅高对比度的布光、姿态解构与灵感闭环。所有 AI 模型功能均安全隔离运行。
        </div>
        <div className="flex items-center gap-1">
          <span>美学架构体系由 AI 编排支持</span>
          <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse" />
        </div>
      </footer>

      {/* CSS STYLES SPECIFICALLY OPTIMIZED FOR GORGEOUS MINIMALIST HIGH-RESOLUTION GRAPHICS PDF PRINTING */}
      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 15s linear infinite;
        }
        .animate-bounce-slow {
          animation: bounce 4s infinite;
        }

        @media print {
          /* Perfect editorial booklet layout when printing */
          body {
            background: #ffffff !important;
            color: #1c1c1e !important;
          }
          #app-marketing-header, 
          #presets-panel, 
          #presets-panel button, 
          #app-footer,
          #create-blank-plan-btn,
          #add-storyboard-btn,
          #add-inspiration-form,
          #add-archived-photo-form,
          #sidebar-explorer,
          #project-directories,
          select,
          input,
          textarea,
          button,
          #destroy-photo {
            display: none !important;
          }
          #print-cover-page {
            display: flex !important;
            flex-direction: column !important;
            justify-content: space-between !important;
            background-color: #ffffff !important;
            color: #09090b !important;
            border-color: #0c0a09 !important;
            min-height: 297mm !important;
            page-break-after: always !important;
            box-sizing: border-box !important;
          }
          #print-cover-page * {
            color: #09090b !important;
          }
          #main-photography-dashboard {
            display: block !important;
            grid-template-columns: 1fr !important;
            padding: 0 !important;
            gap: 20px !important;
          }
          #workspace-center {
            grid-column: span 12 / span 12 !important;
          }
          .lg\\:grid-cols-12 {
            grid-template-columns: 1fr !important;
          }
          /* Custom style tweaks for physical paper readability */
          .bg-zinc-950, .bg-zinc-900, .bg-zinc-805, .bg-zinc-800, .bg-zinc-800\\/45 {
            background-color: #f4f4f5 !important;
            border-color: #e4e4e7 !important;
            color: #18181b !important;
          }
          h1, h2, h3, h4, span, label, p {
            color: #09090b !important;
          }
          img {
            max-height: 250px;
            object-fit: contain;
          }
        }
      `}</style>

    </div>
  );
}
