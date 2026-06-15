# 摄影创意一键全案策划画布 (Photo Canvas Blueprint) - Spec 规格说明书

## 1. 项目背景与定位
「摄影创意一键全案策划画布」是以<strong>一键式生成高规格摄影全案策划书</strong>为绝对生产力重心的专业协同系统（包含具体场地场地、精致妆容、自然天气变化日光条件、特色辅景道具、特选服饰面料、摄影器材镜头搭配及拍摄进度进度表）。打通**一键式方案策划（One-Click Planning）**、**写意姿态参考（Pose Sketcher）**、**二维打光图谱（2D Lighting Simulator）**以及**电影级机位分镜（Storyboard）**的全生命执行周期。

---

## 2. 核心功能规格说明

### 2.1 顶级场景 2D 二维布光方案模拟器
*   **交互机制**:
    *   中心原点 `(150, 150)` 恒定绑定为拍摄对象（Model - 模特）。
    *   初始机位 `(150, 260)` 绑定为主力相机，用以标定镜头轴线。
    *   用户可通过左侧控制板，加入多种高仿真光源（Strobe裸闪光灯、Softbox柔光箱、Spotlight聚光灯、Natural自然窗光、Reflector反光板）。
    *   **高平滑拖放 (Smooth Drag & Drop)**: 像素级无延迟触控移动，并增加边距溢出锁定约束（限制在 `[15, 285]` 范围内）。
    *   **智能对焦 (Smart Auto-Angling)**: 移动光源时，系统将通过三角函数实时逆向推演当前坐标指向中心原点 `(150, 150)` 的精准正切角，自动旋转灯芯束光偏角指向模特，极大简化微调操作。
    *   **光照光束渲染**: 依靠 SVG 的 `radialGradient` 径向辐射渐变和张切角扇形路径组合，逼真呈现不同色温（2700K - 8000K）与输出功率对应的扩散光斑阴影效果。
*   **属性校准**:
    *   名称与标注的快速改写。
    *   利用朝向偏角滑尺完成 360° 自定义束光偏斜设定。
    *   色温滑尺（Kelvin 暖黄至冰蓝）及指数型常亮/闪光输出比率。

### 2.2 写意轮廓姿态设计器 (AI Pose Sketcher)
*   **写意线稿绘制**: 接入 `PoseSketcher`，创作者可键入期待的姿势细节，系统通过 Gemini API 计算、清洗动作，并下发由 5-8 组平滑二阶贝塞尔曲线（Q/C 路径）组成的写意构图草图，优雅指导模特发力。
*   **空间批注**: 实时渲染 2-3 组关键的三维坐标文字云（如：“下颌微抬”、“重心倾斜 15°”），协助创作者和模特同步默契。

### 2.3 电影感镜位分镜轴 (Visual Storyboard)
*   **多维参数**: 包含景别（特写/全景）、机位（俯角/仰角/平拍）、镜头类型（如 85mm f/1.4 等专业焦段）、身体张力动作描述以及此机位下的光影特质刻画。
*   **全功能流管理**: 支持对分镜记录进行无限增加、一键抹除以及字段无缝保存。

### 2.4 参考意图索引登记
*   **规避版权争议**: 拒绝在本地非合规存储高精商业大盘例图，倡导对小红书、Pinterest、豆瓣等外联帖子进行合规 **URL 文字索引** 登记，配合美学提炼点拨，既护航法律合规，又保留原始视效参照入口。

---

## 3. 数据持久层结构 (Local State Map)
基于 `CustomPlan` 定义，数据整体以 JSON 格式存储缓存于浏览器的 `localStorage` 中：
```typescript
interface CustomPlan {
  id: string; // 唯一策划案编号
  title: string; // 拍摄主题名称
  createdAt: string; // 生成时间戳
  keywords: string[]; // 美学标签
  sceneDetails: string; // 背景情境及姿势描述
  concept: string; // 视觉内核阐述
  weatherGuide: string; // 自然天气、时辰与日光状态说明
  wardrobeGuide: string; // 服饰面料材质、色彩与裁剪风格
  propsGuide: string; // 场景特色辅景实体道具与持持手势
  locationGuide: string; // 多场地优劣勘景及场地制景建言
  equipmentGuide: string; // 推荐拍摄器材镜头焦段及特殊滤镜
  scheduleGuide: string; // 全天现场执行拍摄timeline时间进度排期表
  lightingInstructions: string; // 详细雷达布光辅光报告说明
  lightingSetup: LightingDevice[]; // 二维灯具与反光板矩阵数据
  storyboard: StoryboardElement[]; // 分镜 timeline
  inspirations: InspirationLink[]; // 意向参考帖子
  finalPhotos: FinalPhoto[]; // 拍摄成果或样片比对卡片
}
```

---

## 4. 输出标准规格 (Export Standard)
*   **打印级纸质排版 A4 Print Sheet**: 应用包含针对 print 介质优化的 CSS 媒体查询布局，使用户直接调用 `ctrl+p` 或点击「导出 PDF 美学报告」时，渲染成剔除了功能杂项、极富画廊画册美感的高清印刷排版报告，能直接带去影棚及妆造前台执行。
