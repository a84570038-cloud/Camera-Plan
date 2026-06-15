# 摄影美学一键分发策划系统 (Photo Canvas Blueprint) - PRD 与 Agent 对接规约

本规划对接文档（Product Requirement Document）旨在指导 AI Agent 与敏捷开发者对「摄影创意一键全案策划画布」系统进行更深度的功能开发、接口契合、以及状态拓展。

---

## 1. 系统总体架构与边界 (System Architecture & Boundary)

系统定位为以**一键式摄影创意全案生成**（精确包括拍摄场地环境制景、精致妆造发型设计、日光自然天气与黄金时辰、特定手势道具清单、特配服装面料色彩、摄影器材定焦搭配与执行排期进度表多要素）为绝对重心的前端灵感策划平台。同时，2D互动辅助打光雷达与姿势线稿并轨结合，形成全能型摄影推演画板。

```
                       +------------------------------------------+
                       |              Client UI (SPA)             |
                       +--------------------+---------------------+
                                            |
         +----------------------------------+----------------------------------+
         |                                  |                                  |
         v                                  v                                  v
+--------+--------+               +---------+--------+               +---------+--------+
|   2D Canvas     |               |  Directory Tree  |               |  A4 PDF Report   |
|  SVG Viewport   |               | Folder System    |               | Print System     |
+--------+--------+               +------------------+               +------------------+
         |
         v
+--------+--------+
|  向心对焦算法    |
|  Atan2 Angle    |
+-----------------+
```

### 1.1 核心约束
*   **分辨率锁定**: 2D 布光 Canvas 内部坐标系虚拟锁定为统一标准的 `300 x 300` px 网格。
*   **绝对物理心**: 中央位置 `(150, 150)` 恒定绑定在拍攝主体模特（MODEL）上，不可被拖拽或删除。
*   **初始机位点**: 底部相对中轴位置 `(150, 260)` 绑定为拍摄主力镜头（CAMERA），确定镜头光照黄金轴线，不能删除。

---

## 2. 数据实体与数据传输协议 (Data Payload & Schema)

所有数据的交互、导入、导出、及 AI 自动填充，必须遵循以下标准的 `CustomPlan` 实质体。

### 2.1 整体方案的 TypeScript 定义
```typescript
export enum DeviceType {
  MODEL = "model",
  CAMERA = "camera",
  STROBE = "strobe",     // 裸闪光灯
  SOFTBOX = "softbox",   // 柔光箱
  SPOTLIGHT = "spotlight", // 聚光灯
  NATURAL = "natural",   // 自然窗光
  REFLECTOR = "reflector" // 反光板
}

export interface LightingDevice {
  id: string;
  type: DeviceType;
  x: number;          // 0 - 300 的整数 (限幅 [15, 285])
  y: number;          // 0 - 300 的整数 (限幅 [15, 285])
  angle: number;      // 0 - 360 的整数 (指向偏心角)
  power: number;      // 0 - 100% 的输出功率 (常亮/闪光输出比率)
  colorTemp: number;  // 2700 - 8000 (Kelvin 色温值)
  label: string;      // 设备具体牌号自命名，例如: "神牛AD600Pro" / "爱玲珑柔光罩"
}

export interface StoryboardElement {
  id: string;
  shotType: string;       // 景别，如: "特写", "中景", "全景"
  cameraAngle: string;    // 镜位俯仰，如: "平拍", "仰角", "俯拍"
  lens: string;           // 推荐镜头，如: "85mm f/1.4", "50mm f/1.2"
  poseDescription: string;// 身体力道控制或动作指引
  lightingMood: string;   // 此镜位下强调的光敏度/色彩基调
}

export interface InspirationLink {
  id: string;
  title: string;
  url: string;            // 合规的原始视效参照外联链接 (规避本地侵权图片)
  note: string;           // 学习要点笔记
}

export interface CustomPlan {
  id: string;             // 唯一方案编号, 字母数字缩写加时间戳
  title: string;          // 拍摄策划项目名称
  createdAt: string;      // 创建时间
  keywords: string[];     // 美学灵感标签词云
  sceneDetails: string;   // 场地布景/色影主调文字指引
  concept: string;        // 核心美学概念描述
  weatherGuide: string;    // 自然天气、时辰与日光状态环境条件
  wardrobeGuide: string;  // 服饰面料材质、搭配、及剪裁风格
  propsGuide: string;     // 场景搭建/持道具动作特色道具清单
  locationGuide: string;  // 多场地勘景与寻找场地制景方案
  equipmentGuide: string; // 推荐拍摄器材、机身、定焦焦段搭配及辅助特殊滤镜 (如黑柔)
  scheduleGuide: string;  // 黄金执行现场拍摄排班时间进度段
  lightingInstructions: string; // 灯光雷达辅助调试描述与光比描述
  lightingSetup: LightingDevice[]; // 二维雷达设备的即时二维排兵布阵矩阵
  storyboard: StoryboardElement[]; // 分镜 timeline
  inspirations: InspirationLink[]; // 意象参考格子
}
```

---

## 3. 2D 布光引擎动力学公式规约 (Mathematical Formulas for Agent AI)

AI Agent 在调整任何灯光状态、位置或计算路径时，必须尊重以下底层动力学公式。

### 3.1 极速向心精准备向算法 (Auto Angle Pointer Back-Prop)
重构后的 `handlePointerMove` 在变动设备 `x` 和 `y` 的同时，会**自动纠偏角度**指向模特。
$$\Delta x = 150 - x_{device}$$
$$\Delta y = 150 - y_{device}$$
$$\text{radian} = \text{atan2}(\Delta y, \Delta x)$$
$$\theta_{deg} = \text{round}\left( \text{radian} \times \frac{180}{\pi} \right)$$
$$\text{if } \theta_{deg} < 0 \implies \theta_{deg} = \theta_{deg} + 360$$

### 3.2 离轴溢出阻击 (Boundary Lock Limit)
灯具在通过鼠标或移动端拖曳时，边缘极值边界需进行物理硬限幅。
$$x_{clamped} = \min(285, \max(15, x))$$
$$y_{clamped} = \min(285, \max(15, y))$$

---

## 4. 后端 API 网关对接规范 (Express Bridge API Specifications)

进行 AI 自动美学推演时，Agent 需向上游 API 节点发起标准的 JSON 生成调用：

*   **API 挂载入口**: `POST /api/generate-plan`
*   **请求参数格式 (JSON Payload)**:
    ```json
    {
      "prompt": "例如：想要一套王家卫风格、昏黄暗调、清冷唇色的室外私房拍摄策划"
    }
    ```
*   **返回参数格式 (Schema 强保证)**:
    返回数据中必须保障包含 `recommendedDevices` 数组，用以自动翻译在 2D 雷达中各设备推荐摆放的 $X/Y$ 几何原点。

---

## 5. UI 排版与 A4 Print 标准 (A4 Output Guidelines)

所有生成的视觉组件，必须支持完美的 `A4 打印报告` 渲染。
*   **CSS 样式表指令**: 利用 `@media print` 机制对非打印元素（左侧目录树、右上角操作工具栏、底座网格网线、调试 diagnostics）进行屏蔽 (`display: none !important`)。
*   **纸张样式优化**: 高对比度白底墨黑字色，实现零耗材无缝快打。
