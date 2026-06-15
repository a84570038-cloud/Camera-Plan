import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini SDK safely
let ai: GoogleGenAI | null = null;
const apiKey = process.env.GEMINI_API_KEY;

if (apiKey && apiKey !== "MY_GEMINI_API_KEY") {
  try {
    ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
    console.log("✅ Gemini SDK successfully initialized.");
  } catch (error) {
    console.error("❌ Failed to initialize Gemini SDK:", error);
  }
} else {
  console.warn("⚠️ GEMINI_API_KEY is not configured or still a placeholder. AI features will be unavailable or mocked.");
}

// Helper to provide standard default mock plans in case AI is offline or key is missing
function getMockPlan(keywords: string[], sceneDetails: string): any {
  return {
    title: `「${keywords.join(" x ") || "无名"}」创意摄影策划案`,
    concept: `针对用户描述：“${sceneDetails || "经典肖像"}”，这套策划案主打一整套极具电影叙事感、强调光影立体度的主题拍摄。通过重组构图与强烈的冷暖色彩对比，传达出沉静而富有张力的情感共鸣。`,
    weatherGuide: "微雨后的多云天气，或者是下午 16:30 至 17:30 的黄金时刻（Golden Hour）带来的漫温和日光。此时阳光斜射角度在 15°-25°，自带天然戏剧感暖色，极其适合情绪胶片叙事。",
    wardrobeGuide: "复古挺括剪裁，如长款羊毛呢大衣或深棕色西装夹克，搭配一件浅杏色打底高领针织衫。采用棉麻、毛呢、皮革等粗糙与细致对比的面料，增加画面层次。",
    propsGuide: "一部复古牛皮纸笔记本、一架旧式双镜头反光相机，或者一盏散发暖黄色微光的手提经典马灯，为模特提供视线焦点与手部动作依托。",
    locationGuide: "城市老街、复古格调咖啡馆一角、雨后湿漉的站台、或者具有斑驳墙面的旧仓库室内。",
    equipmentGuide: "主机身：Sony A7R5 / Canon R5；首选定焦镜头：85mm f/1.4 (主控黄金比例面部大特写) 或 35mm f/1.4 (交代中景故事环境，提供边缘柔和虚化)。建议加载 Tiffen Black Pro-Mist 1/4 滤镜以软化高光，减少数码感。",
    scheduleGuide: "【15:00-16:00】室内场地细节布置、干花及道具摆盘、模特发型及精致妆造完工；【16:15-16:45】自然窗光试镜，捕获侧光阴影；【16:45-17:45】户外黄金时段抢拍逆光镜头；【17:50-18:30】冷调蓝调时刻夜景低速快门慢摇创作。",
    lightingInstructions: "使用偏侧方的硬朗主光（大尺寸柔光箱或硬直射加网格），勾勒出侧脸黄金三角。另一侧配合金黄色反光板或低瓦数常亮灯做暖光面部填充，再用微弱的蓝色背光将模特发丝、肩部从暗沉背景中完美剥离。",
    recommendedDevices: [
      { type: "model", x: 150, y: 150, angle: 180, power: 1, colorTemp: 5500, label: "模特 (Model)" },
      { type: "camera", x: 150, y: 260, angle: 90, power: 1, colorTemp: 5500, label: "相机 (Sony A7R5)" },
      { type: "softbox", x: 70, y: 120, angle: 310, power: 8, colorTemp: 5600, label: "主侧光 (Key Light)" },
      { type: "reflector", x: 230, y: 140, angle: 210, power: 3, colorTemp: 3200, label: "补光 (Fill Board)" },
      { type: "strobe", x: 150, y: 50, angle: 90, power: 4, colorTemp: 6500, label: "轮廓背景光 (Rim Light)" }
    ],
    storyboard: [
      {
        shotType: "特写 (Close-up)",
        cameraAngle: "微俯拍摄 (High Angle Hint)",
        lensName: "85mm f/1.4 Art",
        actionDescription: "模特侧面微低头，目光失焦地看向地上的落叶或手中的老相册，神态带着一丝抽离和思索，微卷的发丝遮掩住半侧颧骨。",
        lightDescription: "利用单侧斜上方的柔光产生浓郁的鼻子投影与眼神光，明暗过渡平滑，背景深黑模糊，面部线条立体深邃。",
        compositionGuide: "对角线视觉构图，将视线焦点集中在模特湿润明亮的眼睫上。"
      },
      {
        shotType: "中景 (Medium Shot)",
        cameraAngle: "平视微侧",
        lensName: "50mm f/1.2 GM",
        actionDescription: "模特半坐于木椅上，身体微微前倾，双臂交叠在腿上。眼神直接注视镜头，唇部保持微启，传达深层的人际张力。",
        lightDescription: "主光偏侧后，辅以银色反光板中和暗部细节，肩头处微露暖金色轮廓光，渲染浓郁故事氛围。",
        compositionGuide: "黄金分割点，右侧三分线，左侧留白作为创意外文排版区域。"
      },
      {
        shotType: "远景 (Wide Shot)",
        cameraAngle: "视线平拍",
        lensName: "35mm f/1.4 GM",
        actionDescription: "模特站立于空旷月台上，身披宽大风衣，单手插袋，背身微回眸，大背景里的铁轨与城市微光在细雨中延伸。",
        lightDescription: "大范围落日暖调环境光，伴随几盏远处路灯的点状逆光虚化形成美丽圆斑。",
        compositionGuide: "中心透视线汇聚，利用铁轨拉长空间景深并汇集于模特身上。"
      }
    ]
  };
}

// 1. Generate Custom Photography Plan Action
app.post("/api/generate-plan", async (req, res) => {
  const { keywords = [], sceneDetails = "", mood = "自然" } = req.body;

  if (!ai) {
    console.warn("⚠️ Gemini SDK is not configured, running mock planning simulation.");
    return res.json(getMockPlan(keywords, sceneDetails));
  }

  try {
    const prompt = `请作为最顶级的专业人像/时尚摄影创意策划与导演，根据以下信息为我制定一个极具视觉表现力、美学高度、可落地的一键式【摄影创意全案策划】。
    
    【核心企划与学术要求】：
    1. 你必须具备深厚的摄影美学功底，熟知各类流派（如王家卫复古港风、北欧侘寂冷淡、经典黄昏暗调，以及【日系空气感小清新】）。
    2. 特别专注于【日系小清新人像 (Japanese Fresh Portraiture)】的深度美学：
       - 若输入关键词或氛围包含“日系”、“小清新”、“温润”、“淡雅”、“治愈”、“空气感”、“滨田英明”或“清新微粉日系自然风”：
         - 【美学内核(concept)】：主打“空气感”与“日常里的微细光芒”。阴影部分应通透干净，避免死黑（不带浊感的半透明深青或低饱和灰），高光要带有温和粉蓝或乳白色散射。
         - 【天气光线(weatherGuide)】：推崇由薄云层带来的大自然超级慢漫反射柔化窗光，或清晨 07:30-09:30 清爽高亮天光，抑或下午 15:30-17:00 温柔斜射逆光冲光（Flared Light），杜绝对面部产生硬调割裂阴影的顶烈直射强光。
         - 【道具手势(propsGuide)】：清单重点是让模特保持行为自然。如复古磨砂手感波子汽水、带水雾的冰镇玻璃杯、日式透明雨伞、半切柠檬/多汁西瓜、日系单车、棉麻布袋或复古单反（Olympus OM-1, Pentax 67）。
         - 【服饰面料(wardrobeGuide)】：推荐纯白细棉、洗水淡蓝牛仔、米灰色天然亚麻等，不采用修身紧勒、繁复重金属装饰。
         - 【采风制景(locationGuide)】：建议有海滨防波石堤、绿野轨道旁、带木质榻榻米的日式阳台、或者挂有微透白色纱帘的夏日临窗长廊。
         - 【实拍器材(equipmentGuide)】：推荐使用能提供绝美虚化空气感的 Pentax 67 配 105mm f/2.4 镜头，或 120 胶片机配 Fuji Pro 400H 等清新胶卷风格；数码端推荐 35mm f/1.4 / 50mm f/1.2；强烈建议配置 1/8 White Mist (白柔焦滤镜) 或 Glimmerglass 滤镜以软化数码边缘、扩散高光并提亮暗部反差。
         - 【2D布光雷达设备矩阵(recommendedDevices)】：日系清新感需避免硬聚焦硬斑或背后大功率硬闪。推荐多以巨大的自然天光/窗光(natural)或温和后侧慢光为主，并在模特前方侧位(x: 150, y: 210等靠近相机的对角方向)配置巨幅白色反光板(reflector)进行柔和反射去红润暗角，使肤质纯洁无暇、光比控制在 1:2 或 1:1.5 之内。
    3. 其他风格（如复古电影港风、北欧留白）同样要维持极致对位的专业色彩原理、光学参数配置和极尽诗意的文字创意。

    输入信息:
    - 关键词/核心风格: ${keywords.join(", ") || "无主题"}
    - 场景描述与细节: ${sceneDetails || "未指定细节"}
    - 画面氛围/色调倾向: ${mood}

    请输出一个详尽的策划案，包含上述所有细节，以及通俗易懂的灯光总调性思路指南、2D布光雷达设备矩阵（在 300x300 的虚拟二维布罗坐标系中的推荐位置，x 与 y 都属于 50 到 250 之间。坐标系中心 150,150 默认是 模特‘model’，150, 260 为 相机‘camera’，请合理生成主光、侧光、背光、反光板等灯具的相对初始位置）。
    另外设计 3 个经典的电影感分镜镜头（Storyboard）以丰富该策划方案。

    请将这些内容严格按照 JSON 格式返回。`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: "拍摄案方案的艺术主题名称（中文，注重意境美）" },
            concept: { type: Type.STRING, description: "策划的核心美学理念、情绪内核及主色彩调性阐述" },
            weatherGuide: { type: Type.STRING, description: "天气、拍摄时辰(如黄昏、蓝调时刻)、自然日光状态(如漫反射、硬光斑、斜扫阳台)的拍摄环境自然光策划" },
            wardrobeGuide: { type: Type.STRING, description: "服装风格、裁剪色系、面料质感组合及饰品建议" },
            propsGuide: { type: Type.STRING, description: "营造画面张力、提供模特手部交互支点、眼神视线附着物的道具清单及用法" },
            locationGuide: { type: Type.STRING, description: "推荐的精准场地建议，无论是棚内人工制景还是自然界采风" },
            equipmentGuide: { type: Type.STRING, description: "实拍推荐器材，包含相机品牌型号推荐、特定定焦镜头(如35mm/85mm/50mm)及滤镜搭配(如白磨/黑柔)指引" },
            scheduleGuide: { type: Type.STRING, description: "建议的实地拍摄时序，包含妆发时间、各阶段实拍时间、蓝调及黄金时刻抢光时刻分配表" },
            lightingInstructions: { type: Type.STRING, description: "通俗易懂但极其专业的布光原理、思路、光比及控控光工具指引" },
            recommendedDevices: {
              type: Type.ARRAY,
              description: "建议添加的布光元素列表。画幅中央 150,150 是模特，150,260 是主相机，请推演周围灯具位置。",
              items: {
                type: Type.OBJECT,
                properties: {
                  type: { type: Type.STRING, description: "可选: model, camera, strobe, softbox, reflector, natural, spotlight" },
                  x: { type: Type.INTEGER, description: "50 到 250 之间的整数（像素坐标，中心为150,150）" },
                  y: { type: Type.INTEGER, description: "50 到 270 之间的整数（像素坐标，中心为150,150）" },
                  angle: { type: Type.INTEGER, description: "发光或面朝角度（度数 0-360，例如相机在模特正下方，其面向应指向150,150即大概270度或90度）" },
                  power: { type: Type.INTEGER, description: "推荐功率指数，通常为 1 到 10 之间" },
                  colorTemp: { type: Type.INTEGER, description: "推荐色温值（Kelvin），在 2700 到 8000 之间" },
                  label: { type: Type.STRING, description: "该灯光元素的中文作用，例如：‘主光 - 柔光箱’, ‘背光 - 硬束光’, ‘金色反光补光’" }
                },
                required: ["type", "x", "y", "angle", "power", "colorTemp", "label"]
              }
            },
            storyboard: {
              type: Type.ARRAY,
              description: "包含 3 个电影感分镜规划",
              items: {
                type: Type.OBJECT,
                properties: {
                  shotType: { type: Type.STRING, description: "镜头景别：特写、中景、全景等" },
                  cameraAngle: { type: Type.STRING, description: "相机运镜角度：平拍、仰拍、俯拍、倾斜视角等" },
                  lensName: { type: Type.STRING, description: "推荐焦段与光圈，如 85mm f/1.4, 35mm f/1.4" },
                  actionDescription: { type: Type.STRING, description: "模特的身姿、面部表情特征或动作提示内容" },
                  lightDescription: { type: Type.STRING, description: "此分镜的细节光效刻画（如：雨丝逆光亮边，微弱冷调眼神光）" },
                  compositionGuide: { type: Type.STRING, description: "构图导向手法：三等分、对称、前景遮挡等" }
                },
                required: ["shotType", "cameraAngle", "lensName", "actionDescription", "lightDescription", "compositionGuide"]
              }
            }
          },
          required: ["title", "concept", "weatherGuide", "wardrobeGuide", "propsGuide", "locationGuide", "equipmentGuide", "scheduleGuide", "lightingInstructions", "recommendedDevices", "storyboard"]
        }
      }
    });

    const parsedData = JSON.parse(response.text || "{}");
    res.json(parsedData);
  } catch (error: any) {
    console.error("❌ Error generating plan with Gemini:", error);
    res.status(500).json({ error: error.message || "AI 策划案生成失败，请稍后重试。" });
  }
});

// 2. Generate Pose Lineart Sketch Vector (AI Sketch Generator)
app.post("/api/generate-pose-lineart", async (req, res) => {
  const { description = "" } = req.body;

  if (!ai) {
    console.warn("⚠️ Gemini API is not initialized. Emulating a vector sketch response.");
    return res.json({
      title: "光影轮廓概念线稿 (AI Emulated)",
      description: `基于描述：“${description}”，AI 绘制的简易参考。`,
      paths: [
        "M 150 90 Q 150 60 130 60 Q 110 60 110 80 Q 110 100 130 110 L 150 120 Z", // face outline
        "M 130 110 Q 90 145 70 180 Q 50 215 40 230", // arm pose 1
        "M 140 120 L 180 160 Q 220 200 240 230", // arm pose 2 / torse bias
        "M 135 125 Q 130 150 140 190 Q 150 220 160 250", // body curve
        "M 150 95 L 148 100", // eye line
        "M 125 75 Q 135 85 145 75" // hair gesture
      ],
      annotations: [
        { x: 130, y: 50, label: "视线方向" },
        { x: 60, y: 160, label: "手部伸展，舒缓支撑" },
        { x: 195, y: 180, label: "躯干侧倾侧转 30°" }
      ]
    });
  }

  try {
    const prompt = `你是一个专业的摄影导演兼素描线稿大师。用户想要生成一幅用于理清拍摄画面姿态、构图线条的【姿势与构图简略线稿】。
    
    用户希望绘制的描述是: “${description}”
    
    请求你使用 SVG 路径代表一组精简、写意、高审美的概念轮廓（画板尺寸为 300x300，原点 0,0 在左上，最大 300）。
    线稿只需要 5-8 条平滑流畅极简的曲线（M, C, Q, L 组成的标准 SVG 路径段），用来优雅勾勒身体、头部转角、主要视线延伸以及肢体弯曲的精髓线，而无需精细写实细节（越写意，几何构成感越强，美学观感越好，就像时装设计图或光影构图解剖线稿）。
    此外，再提供 2-3 个关键标记点（x, y 坐标，以及文字批注如：“单手挽发”、“主轴线倾斜”、“侧脸45度”）来标注姿势细节。

    请将这些内容严格按照 JSON 格式返回。`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: "线稿草图名称" },
            description: { type: Type.STRING, description: "该姿态动作及光影意向的专业点拨" },
            paths: {
              type: Type.ARRAY,
              description: "可直接渲染在 300x300 坐标系内的 SVG 路径数据，尽量高质、写意并成组构成流畅线条",
              items: { type: Type.STRING }
            },
            annotations: {
              type: Type.ARRAY,
              description: "关于构图或动作细节在 300x300 空间内的辅助标签指示点",
              items: {
                type: Type.OBJECT,
                properties: {
                  x: { type: Type.INTEGER, description: "30 到 270 之间的 X 坐标" },
                  y: { type: Type.INTEGER, description: "30 到 270 之间的 Y 坐标" },
                  label: { type: Type.STRING, description: "指向性简短说明（如，‘下颌抬起投光区’、‘侧肩轮廓’）" }
                },
                required: ["x", "y", "label"]
              }
            }
          },
          required: ["title", "description", "paths", "annotations"]
        }
      }
    });

    const parsedData = JSON.parse(response.text || "{}");
    res.json(parsedData);
  } catch (error: any) {
    console.error("❌ Error generating sketch outline with Gemini:", error);
    res.status(500).json({ error: error.message || "线稿设计生成失败，请稍后重试。" });
  }
});

// Configure Vite or Static Serve Middleware
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    // Development server mapping Vite
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("⚡ Developed with live Vite middleware.");
  } else {
    // Production serving static files
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
    console.log("📁 Production serving static build.");
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Photography Planning App running on http://localhost:${PORT}`);
  });
}

startServer();
