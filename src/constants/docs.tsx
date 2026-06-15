import React from "react";
import { 
  FileText, 
  Settings, 
  Terminal, 
  HelpCircle, 
  Sparkles, 
  Milestone, 
  ListRestart, 
  Compass, 
  Calculator 
} from "lucide-react";

export function renderSpecDoc() {
  return (
    <div className="space-y-6 text-zinc-300 leading-relaxed max-w-4xl">
      <div className="border-b border-zinc-800 pb-4 mb-6">
        <span className="px-2.5 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs rounded-full font-mono font-medium">{"docs / spec.md"}</span>
        <h1 className="text-2xl lg:text-3xl font-bold text-white font-serif mt-3">摄影一键生成创意策划案与打光说明 - Spec 规格说明书</h1>
        <p className="text-zinc-500 text-xs mt-1">{"Version: MVP 1.2 | Classification: 规划文档 / Spec文档"}</p>
      </div>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2 border-l-2 border-amber-500 pl-3">
          <Compass className="w-4 h-4 text-amber-500" />
          1. 项目主旨与一键全案策划定位
        </h2>
        <p>
          「摄影创意策划与智能美学画布」是以<strong>一键式美学全案生成</strong>为重心的核心生产力工具。创作者只需输入画面风格词，AI 大脑将精确统筹并拟定包括<strong>精准场地制景（Location）、精致彩妆发型（Makeup）、日光与天气时间条件（Weather）、烘托故事的物理道具（Props）、特写服装及面料组合（Wardrobe）、相机推荐焦段与机身（Equipment）、全天执行排班时间表（Schedule）</strong>在内的黄金摄影全案策划。2D 互动布光雷达作为落地化示意报告并轨呈现，从而打通灵感到执行的最后一公里。
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2 border-l-2 border-amber-500 pl-3">
          <Calculator className="w-4 h-4 text-amber-500" />
          2. 核心大纲功能规格
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-zinc-900/60 p-4 border border-zinc-800/80 rounded-xl space-y-2">
            <h3 className="text-sm font-bold text-zinc-100">顶级场景 2D 二维布光方案模拟器</h3>
            <ul className="list-disc pl-4 text-xs space-y-1.5 text-zinc-400">
              <li>中心原点 <code className="text-amber-400 text-[10px]">(150, 150)</code> 恒定绑定为拍摄对象模特。</li>
              <li>初始机位 <code className="text-zinc-350 text-[10px]">(150, 260)</code> 绑定为主力相机，用以标定镜头轴线。</li>
              <li>提供多种高仿真光源（Strobe、Softbox、Spotlight、Natural、Reflector）。</li>
              <li><strong>高平滑拖放 (Smooth Drag & Drop)</strong>：使用 `isDraggingRef.current` 避免 React 回调造成的拖拽丢失。</li>
              <li><strong>智能向心对焦 (Smart Auto-Angling)</strong>：拖拽释放时，自研三角函数算法自动旋转灯芯指向模特。</li>
            </ul>
          </div>

          <div className="bg-zinc-900/60 p-4 border border-zinc-800/80 rounded-xl space-y-2">
            <h3 className="text-sm font-bold text-zinc-100">写意轮廓姿态设计器 (Pose Sketcher)</h3>
            <ul className="list-disc pl-4 text-xs space-y-1.5 text-zinc-400">
              <li>接入 AI 简笔线条，创作者键入构想姿态，生成贝塞尔物理线稿轮廓。</li>
              <li>提供精准的三维度辅导指示牌文字标签云，同步默契。</li>
              <li><strong>合规导向</strong>：抛弃在本地存放高清侵权大盘例图，提倡 <strong>URL 文字索引</strong> 登记与原创写意 SVG 转换。</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2 border-l-2 border-amber-500 pl-3">
          <FileText className="w-4 h-4 text-amber-500" />
          3. 印刷与分发格式标准 (A4 Print Layout)
        </h2>
        <p>
          本系统设计了兼容 <strong>A4 纸张排版规格</strong> 的 CSS 打印输出标准。创作者点击右上方<strong>「导出 PDF 美学报告」</strong>或直接键入 <kbd className="px-1.5 py-0.5 bg-zinc-800 border border-zinc-700 rounded text-xs">Ctrl + P</kbd> 时，系统将剔除网页配置层、网格工具、目录大纲，只保留高清纯白底黑字的高端排版，便于打印携带和线下贴棚使用。
        </p>
      </section>
    </div>
  );
}

export function renderIterationsDoc() {
  return (
    <div className="space-y-6 text-zinc-300 leading-relaxed max-w-4xl">
      <div className="border-b border-zinc-800 pb-4 mb-6">
        <span className="px-2.5 py-1 bg-sky-500/10 border border-sky-500/20 text-sky-450 text-xs rounded-full font-mono font-medium">{"docs / iteration_log.md"}</span>
        <h1 className="text-2xl lg:text-3xl font-bold text-white font-serif mt-3">美学策划系统 - 产品迭代日志</h1>
        <p className="text-zinc-500 text-xs mt-1">{"Classification: 规划文档 / 产品迭代"}</p>
      </div>

      <div className="space-y-6">
        {/* v1.1 */}
        <div className="bg-zinc-900/40 border border-zinc-805 p-5 rounded-2xl space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-2.5 py-0.5 rounded-full">v1.1 精进版本 (Active)</span>
            <span className="text-xs text-zinc-500 font-mono">June 15, 2026</span>
          </div>
          
          <div className="space-y-3">
            <h3 className="text-zinc-100 font-bold text-sm">2D 布光控制系统重大修复与功能重塑：</h3>
            <ul className="list-disc pl-5 text-xs text-zinc-400 space-y-1.5">
              <li>
                <strong className="text-zinc-200">【修复】解决触点失效、瞬间丢失选择 bug</strong>：
                给装置 <code className="bg-zinc-950 px-1 py-0.5 rounded text-red-400">&lt;g&gt;</code> 添加了阻断传播事件 
                <code className="bg-zinc-950 px-1 py-0.5 rounded text-amber-400">e.stopPropagation()</code>，杜绝了点击任何灯具滑标瞬间被父级 <code className="bg-zinc-950 px-1 py-0.5 rounded">&lt;svg&gt;</code> 重新清零deselect的顽疾。
              </li>
              <li>
                <strong className="text-zinc-200">【修复】解决拖曳滑脱 lag 现象</strong>：
                使用 <code className="bg-zinc-950 px-1 py-0.5 rounded text-sky-400">isDraggingRef.current</code> 作为瞬态定位依据，完全避开了浏览器或 React 组件渲染慢动作时导致的抓取滑脱。
              </li>
              <li>
                <strong className="text-zinc-200">【新增】反向动力向心自动对焦角度算法</strong>：
                当任意拖拽 Strobe、Softbox、Spotlight 或 Reflector 时，系统将实时逆向求解当前坐标与模特 <code className="bg-zinc-950 px-1 py-0.5 rounded text-zinc-400">(150, 150)</code> 焦点的夹角，自动旋正光芯，让灯束自然覆盖。
              </li>
              <li>
                <strong className="text-zinc-200">【新增】多维大纲目录文件树</strong>：
                完美复刻用户大纲，将系统与规划文档（包含 Spec 规格、迭代轨迹、算法技术验证、开发里程碑）集成在 VSCode 级目录树左侧，支持极其优雅的快速切换。
              </li>
            </ul>
          </div>
        </div>

        {/* v1.0 */}
        <div className="bg-zinc-900/20 border border-zinc-900 p-5 rounded-2xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-zinc-400 px-2.5 py-0.5 rounded-full bg-zinc-800">v1.0 基础 MVP (Baseline)</span>
            <span className="text-xs text-zinc-600 font-mono">June 01, 2026</span>
          </div>
          <p className="text-xs text-zinc-400">
            首发上线，实现了基于 Gemini 3.5 智能模型对情景和色彩倾向进行文本推演，自动写出妆、搭、用、场、设备、及初步 2D 坐标。
          </p>
        </div>

        {/* v2.0 */}
        <div className="bg-zinc-900/20 border border-zinc-900 p-5 rounded-2xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-zinc-500">v2.0 未来演化规划 (Backlog)</span>
            <span className="text-xs text-zinc-700 font-mono">规划中</span>
          </div>
          <p className="text-xs text-zinc-500">
            预计加入 3D WebGL 模特五官阴影预览与 AI 彩妆自动推荐品牌（ लिपस्टिक 口红色卡自动匹配）。
          </p>
        </div>
      </div>
    </div>
  );
}

export function renderTechValidationDoc() {
  return (
    <div className="space-y-6 text-zinc-300 leading-relaxed max-w-4xl">
      <div className="border-b border-zinc-800 pb-4 mb-6">
        <span className="px-2.5 py-1 bg-pink-500/10 border border-pink-500/20 text-pink-400 text-xs rounded-full font-mono font-medium">{"docs / tech_validation.md"}</span>
        <h1 className="text-2xl lg:text-3xl font-bold text-white font-serif mt-3">2D 布光数学原理与技术可行性验证</h1>
        <p className="text-zinc-500 text-xs mt-1">{"Classification: 规划文档 / 技术验证"}</p>
      </div>

      <div className="space-y-6">
        <section className="bg-zinc-950 p-5 border border-zinc-850 rounded-xl space-y-3">
          <h3 className="font-bold text-sm text-zinc-100 flex items-center gap-1.5">
            <Terminal className="w-4 h-4 text-pink-400" />
            数学方程验证 1：向心自动指向几何正切角
          </h3>
          <p className="text-xs text-zinc-350 leading-relaxed">
            设模特原点恒定在圆心 $M(x_m, y_m) = (150, 150)$。灯具体在二维平面坐标系中拖曳释放的目标位置为 $T(x_t, y_t)$。<br />
            要使该光源的角度 $\theta$（在 0 至 360 度之间）正好指回 $M$，其对齐偏角的平面直角三角几何正切算法为：
          </p>
          <div className="bg-zinc-900 p-3.5 rounded font-mono text-xs text-amber-300 space-y-1">
            <p>const dx = 150 - targetX;</p>
            <p>const dy = 150 - targetY;</p>
            <p>let angle = Math.round((Math.atan2(dy, dx) * 180) / Math.PI);</p>
            <p>if (angle &lt; 0) angle += 360;</p>
            <p className="text-zinc-500 font-sans mt-1">这就是 handlePointerMove 内能零开销获得自然对焦航向角的数学核心。</p>
          </div>
        </section>

        <section className="bg-zinc-950 p-5 border border-zinc-850 rounded-xl space-y-3">
          <h3 className="font-bold text-sm text-zinc-100 flex items-center gap-1.5">
            <Terminal className="w-4 h-4 text-pink-400" />
            数学方程验证 2：光轨锥扇弧角路径 SVG 运算
          </h3>
          <p className="text-xs text-zinc-350 leading-relaxed">
            {"已知设备主光射角为 θ，扇面扩散半角默认为 α = 22°，投光距离为 L = 180 像素。其出射光圈切面两端极值拐点 Q1(x_q1, y_q1) 和 Q2(x_q2, y_q2) 为："}
          </p>
          <div className="bg-zinc-900/60 p-3 rounded font-mono text-xs text-zinc-400 space-y-1">
            <p>{"x1 = device.x + Math.cos((device.angle - 22) * Math.PI / 180) * 180"}</p>
            <p>{"y1 = device.y + Math.sin((device.angle - 22) * Math.PI / 180) * 180"}</p>
            <p>{"x2 = device.x + Math.cos((device.angle + 22) * Math.PI / 180) * 180"}</p>
            <p>{"y2 = device.y + Math.sin((device.angle + 22) * Math.PI / 180) * 180"}</p>
          </div>
          <p className="text-xs text-zinc-400">
            生成的光波切面依靠 SVG 完美的二元路径插弧渲染出来，并绑定极速渐变（`radialGradient`），在浏览器端展现出了电影级散射羽化的柔焦光感。
          </p>
        </section>
      </div>
    </div>
  );
}

export function renderMilestoneDoc() {
  return (
    <div className="space-y-6 text-zinc-300 leading-relaxed max-w-4xl">
      <div className="border-b border-zinc-800 pb-4 mb-6">
        <span className="px-2.5 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs rounded-full font-mono font-medium">{"docs / milestones.md"}</span>
        <h1 className="text-2xl lg:text-3xl font-bold text-white font-serif mt-3">AI彩妆及美学摄影项目推进里程碑路线图</h1>
        <p className="text-zinc-500 text-xs mt-1">{"Classification: 规划文档 / 里程碑文档"}</p>
      </div>

      <div className="relative border-l-2 border-zinc-800 pl-6 ml-4 space-y-8 py-3">
        {/* Phase 1 */}
        <div className="relative">
          <span className="absolute -left-[31px] top-1 p-1 bg-zinc-950 border-2 border-zinc-800 text-zinc-400 rounded-full">
            <Milestone className="w-3 h-3 text-zinc-500" />
          </span>
          <h3 className="text-sm font-bold text-zinc-200">Phase 1：核心创意底座建设 <span className="text-[10px] text-emerald-400 px-1.5 py-0.5 bg-emerald-950/30 rounded ml-2">已100%达成</span></h3>
          <p className="text-xs text-zinc-500 mt-1">2026年6月初落幕</p>
          <ul className="list-disc pl-5 text-xs text-zinc-400 mt-2 space-y-1">
            <li>确立摄影创意策划画布（Photo Canvas Blueprint）1.0。</li>
            <li>搭建 2D 雷达二维布光。</li>
            <li>搭建电影感镜位分镜轴 timeline 及 URL 参考登记。</li>
          </ul>
        </div>

        {/* Phase 2 */}
        <div className="relative">
          <span className="absolute -left-[31px] top-1 p-1 bg-zinc-950 border-2 border-amber-500 text-amber-400 rounded-full animate-pulse">
            <Milestone className="w-3 h-3" />
          </span>
          <h3 className="text-sm font-bold text-amber-400">Phase 2：操控体验深化与架构整理 <span className="text-[10px] text-amber-400 px-1.5 py-0.5 bg-amber-950/30 rounded ml-2">当前正实施</span></h3>
          <p className="text-xs text-zinc-500 mt-1">2026年6月中旬</p>
          <ul className="list-disc pl-5 text-xs text-zinc-400 mt-2 space-y-1">
            <li><strong>2D 布光控制防瞬移、防脱滑、防瞬间deselect彻底重构</strong>。</li>
            <li>导入<strong>拖曳光源时自动向心对准模特</strong>的几何智能对焦。</li>
            <li><strong>一比一完美大纲整合：</strong>提供一解折叠、层层下展的 VSCode 级目录大纲面板。</li>
          </ul>
        </div>

        {/* Phase 3 */}
        <div className="relative">
          <span className="absolute -left-[31px] top-1 p-1 bg-zinc-950 border-2 border-zinc-800 text-zinc-500 rounded-full">
            <Milestone className="w-3 h-3 text-zinc-500" />
          </span>
          <h3 className="text-sm font-bold text-zinc-500">Phase 3：AI 彩妆选色与高保真选品 <span className="text-[10px] text-zinc-600 px-1.5 py-0.5 bg-zinc-900 rounded ml-2">规划中</span></h3>
          <p className="text-xs text-zinc-500 mt-1">2026年7月</p>
          <ul className="list-disc pl-5 text-xs text-zinc-500 mt-2 space-y-1">
            <li>通过 AI 推荐契合色温和服饰调性的口红与彩妆单品（Lips Color Picker）。</li>
            <li>结合 Kelvin 色温变化对眼影等色彩在影棚光照下的演变做出预测。</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export function renderSystemPanel(plansLength: number, cacheSize: string) {
  return (
    <div className="space-y-6 text-zinc-300 leading-relaxed max-w-4xl">
      <div className="border-b border-zinc-800 pb-4 mb-6">
        <span className="px-2.5 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs rounded-full font-mono font-medium">{"system / diagnostics"}</span>
        <h1 className="text-2xl lg:text-3xl font-bold text-white font-serif mt-3">_系统 Diagnostics 诊断与引擎状态</h1>
        <p className="text-zinc-500 text-xs mt-1">Active Architecture: Collimator Grid Engine 1.1</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-zinc-900/60 p-4 border border-zinc-800 rounded-xl">
          <div className="text-zinc-500 text-[10px] uppercase font-mono font-bold">本地策划储存量</div>
          <div className="text-2xl font-bold text-white mt-1">{plansLength} <span className="text-xs text-zinc-400">份策划画布</span></div>
          <div className="text-[10px] text-zinc-400 mt-1">存储在 localStorage</div>
        </div>

        <div className="bg-zinc-900/60 p-4 border border-zinc-800 rounded-xl">
          <div className="text-zinc-500 text-[10px] uppercase font-mono font-bold">自适应计算容器</div>
          <div className="text-xl font-bold text-emerald-400 mt-1">300x300 <span className="text-xs font-sans text-zinc-300">Collimator Viewport</span></div>
          <div className="text-[10px] text-zinc-400 mt-1">SVG Vector Scaling</div>
        </div>

        <div className="bg-zinc-900/60 p-4 border border-zinc-800 rounded-xl">
          <div className="text-zinc-500 text-[10px] uppercase font-mono font-bold">后端 API 端口网关</div>
          <div className="text-xl font-bold text-sky-400 mt-1">Port 3000</div>
          <div className="text-[10px] text-zinc-400 mt-1">{"Express Server / Nginx proxy"}</div>
        </div>
      </div>

      <div className="bg-zinc-900/20 border border-zinc-800 p-5 rounded-2xl space-y-3 mt-6">
        <h3 className="font-bold text-sm text-zinc-200 flex items-center gap-2">
          <Settings className="w-4 h-4 text-amber-500" />
          系统硬重置应急阻尼
        </h3>
        <p className="text-xs text-zinc-500 leading-relaxed">
          若浏览器中的 Local Storage 缓存由于极端解析破坏异常，可能会导致画布加载故障（空白或闪烁）。此重置按钮能物理级清空本地缓存，恢复系统的出厂状态默认演示数据。
        </p>
        <button
          onClick={() => {
            if (confirm("你确定要彻底清除当前全部数据并重设出厂最初策划案吗？")) {
              localStorage.removeItem("photo_canvas_blueprints");
              window.location.reload();
            }
          }}
          className="px-3.5 py-1.5 bg-red-950/40 hover:bg-red-950/65 border border-red-800/50 text-red-400 text-xs font-bold rounded-lg transition-all"
        >
          物理核清理 - 重刷初版数据
        </button>
      </div>
    </div>
  );
}

export function renderPrdDoc() {
  return (
    <div className="space-y-6 text-zinc-300 leading-relaxed max-w-4xl">
      <div className="border-b border-zinc-800 pb-4 mb-6">
        <span className="px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs rounded-full font-mono font-medium">{"docs / PRD_integration.md"}</span>
        <h1 className="text-2xl lg:text-3xl font-bold text-white font-serif mt-3">摄影美学与智能布光系统 - Agent 对接 PRD 规约</h1>
        <p className="text-zinc-500 text-xs mt-1">{"Version: 1.1 | Mode: Agent-to-Agent Integration Spec"}</p>
      </div>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2 border-l-2 border-emerald-500 pl-3">
          <Compass className="w-4 h-4 text-emerald-400" />
          1. 总体架构与开发边界 (Core Boundaries)
        </h2>
        <p className="text-sm">
          系统定位为独立的 <strong>无状态前端创意画布 + 本地持久化 (localStorage) + 双轨数据备份 + 智能美学后驱 (Gemini API)</strong>。
        </p>
        <ul className="list-disc pl-5 text-xs text-zinc-400 space-y-1">
          <li><strong>分辨率限定</strong>: 2D Canvas 内部逻辑坐标锁定为 300x300 的 Collimator Viewport 矢量网格。</li>
          <li><strong>绝对物理心坐标</strong>: (150, 150) 为拍摄模特 (Model) 固定原点，无法删除或拖拽。</li>
          <li><strong>相机锚定线</strong>: (150, 260) 为主力相机，用以标定镜头中轴线。</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2 border-l-2 border-emerald-500 pl-3">
          <Terminal className="w-4 h-4 text-emerald-400" />
          2. 智能向心备向算法数学公式 (Auto-Angling Math)
        </h2>
        <p className="text-sm text-zinc-400">
          任何人机在拖曳雷达里的灯具、反光板时，角度自动瞄准模特中心 (150, 150)。
        </p>
        <div className="bg-zinc-900 p-3.5 rounded font-mono text-xs text-amber-300 space-y-1">
          <p>{"dx = 150 - targetX;"}</p>
          <p>{"dy = 150 - targetY;"}</p>
          <p>{"radian = Math.atan2(dy, dx);"}</p>
          <p>{"angle = Math.round((radian * 180) / Math.PI);"}</p>
          <p>{"if (angle < 0) angle += 360;"}</p>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2 border-l-2 border-emerald-500 pl-3">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          3. 数据对接矩阵及 TypeScript 定义 (Schema Mapping)
        </h2>
        <p className="text-sm">
          所有策划画布数据被打包在 <code>CustomPlan</code> 对象内。AI 生成策划文案需输出以下标准的 JSONSchema。
        </p>
        <div className="bg-zinc-950 p-4 border border-zinc-850 rounded-xl">
          <pre className="text-[11px] font-mono text-zinc-405 overflow-x-auto whitespace-pre-wrap leading-relaxed">
{`interface CustomPlan {
  id: string; // 唯一方案编号
  title: string; // 摄影主题名称
  keywords: string[]; // 创意标签
  concept: string; // 美学创意内核
  weatherGuide: string; // 自然天气、时辰与日光状态说明
  wardrobeGuide: string; // 衣服款式面料色彩调性
  propsGuide: string; // 物理道具及持道具姿体要求
  locationGuide: string; // 棚内人工搭景/户外踩点推荐
  equipmentGuide: string; // 推荐镜头焦段与滤镜控制
  scheduleGuide: string; // 拍摄现场执行时间表
  lightingInstructions: string; // 控光总思路说明
  lightingSetup: LightingDevice[]; // 2D雷达打光推荐相对坐标
}`}
          </pre>
        </div>
      </section>
    </div>
  );
}
