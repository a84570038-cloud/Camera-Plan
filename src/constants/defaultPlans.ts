import { CustomPlan, DeviceType } from "../types";

export const INITIAL_PLANS: CustomPlan[] = [
  {
    id: "plan-vintage-mood",
    title: "「重温王家卫」港风复古情绪人像",
    createdAt: "2026-06-15T09:20:00Z",
    keywords: ["王家卫", "复古港风", "极高对比度", "暖调颗粒色散"],
    sceneDetails: "夜市霓虹街角、微湿的柏油路、昏黄的路灯、弥漫着烟雾与微凉空气的墨绿色老式电话亭。",
    concept: "重现上世纪90年代香港电影的迷幻美学。通过高饱和低亮度、强烈冷暖对比色调和中焦段大光圈特写，表达时间流逝、都市男女的寂寞与情感拉扯。",
    wardrobeGuide: "深色修身暗花刺绣旗袍，外搭挺括剪裁的黑色西装夹克；或酒红色系吊带裙。质感强调反光的丝绸、天鹅绒，以及皮衣与毛呢的搭配。",
    propsGuide: "一部绿黄双色的老式塑料胶片机，绿壳点火打火机，微微点燃的手卷烟，一瓶深色玻璃可乐瓶配红白吸管。",
    locationGuide: "城市老旧巷道（红蓝霓虹灯招牌密集处）、红木装潢港式茶餐厅或复古黑胶阁楼。",
    weatherGuide: "室内夜景或户外微湿雨夜。依靠低照度下的城市霓虹色彩，营造冷暖高反差的漫反射故事感。",
    equipmentGuide: "Sony A7R5 搭配 50mm f/1.2 或 85mm f/1.4 大光圈定焦。建议配备 1/4 黑柔滤镜，使霓虹高光边缘产生柔美散焦晕化。",
    scheduleGuide: "18:00 - 19:15 | 港风复古浓郁妆造、港服高挑搭配及鬓角发丝定型\n19:15 - 20:00 | 现场环境搭景，点燃道具烟雾，校准红绿对比灯位与色温\n20:00 - 22:30 | 主体电话亭情感拉扯、侧脸特写、大光圈虚化流光连拍\n22:30 - 23:00 | 导片并基于柯达胶片颗粒做美学基础润色",
    lightingInstructions: "在街角侧后方布置一万向闪光灯（接黄色滤色片模拟霓虹，色温 3200K），对准模特后发丝。前方 45 度侧面使用大口径柔光箱作为温和主光（色温 5500K），另加一部蓝色滤光片的补光灯微微打亮背景绿板，实现经典的红绿高反差撞色布光法。",
    lightingSetup: [
      { id: "model-1", type: DeviceType.MODEL, x: 150, y: 150, angle: 180, power: 1, colorTemp: 5500, label: "模特 - 港风红唇" },
      { id: "camera-1", type: DeviceType.CAMERA, x: 150, y: 260, angle: 270, power: 1, colorTemp: 5500, label: "Sony A7R5 + 50mm f/1.2" },
      { id: "softbox-key", type: DeviceType.SOFTBOX, x: 90, y: 190, angle: 330, power: 7, colorTemp: 5500, label: "右侧 45° 主光" },
      { id: "strobe-back", type: DeviceType.STROBE, x: 190, y: 90, angle: 210, power: 8, colorTemp: 3200, label: "逆光霓虹黄 (Rim Light)" },
      { id: "spot-bg", type: DeviceType.SPOTLIGHT, x: 260, y: 170, angle: 160, power: 4, colorTemp: 7500, label: "背景蓝幽环境光 (Ambient Teal)" }
    ],
    storyboard: [
      {
        id: "st-1",
        shotType: "特写 (Close-up)",
        cameraAngle: "微俯平视",
        lensName: "85mm f/1.4 GM",
        actionDescription: "侧身伏在墨绿公用电话亭玻璃上，单手拿着话筒，双眼微闭，嘴唇微启。指甲涂有深红色，背景有流失的红色车灯光晕。",
        lightDescription: "利用电话亭外部微黄街灯偏光斜打在玻璃上，反射出的颗粒光芒与右侧发丝反光交织。",
        compositionGuide: "框式构图。电话亭窗口金属框架作为物理框景，视线聚焦点在眼角和晶莹的泪滴上。"
      },
      {
        id: "st-2",
        shotType: "中景 (Medium Shot)",
        cameraAngle: "平移视角",
        lensName: "50mm f/1.2 S",
        actionDescription: "主角在昏黄色雨伞下回头，单手夹烟，发丝微湿。眼神带有挑衅与失落，看向镜头一侧偏上 15 度。",
        lightDescription: "雨丝在侧后硬闪光的作用下形成一根根金亮晶莹的斜线。正面伞下由反光板将暖光微反在脸庞上。",
        compositionGuide: "三分法构图 + 前景微糊伞边缘，制造第三人称偷窥视角的电影感。"
      }
    ],
    inspirations: [
      {
        id: "insp-1",
        title: "《花样年华》苏丽珍经典旗袍窗台侧写",
        photographer: "杜可风 (Christopher Doyle)",
        url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80",
        notes: "学习其利用自然冷调窗光配合明艳暖红旗袍的高对比美感搭配。"
      },
      {
        id: "insp-2",
        title: "《重庆森林》王菲金黄灯影迷幻街头",
        photographer: "刘伟强",
        url: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80",
        notes: "经典的快门拖延（慢速同步闪光）拍摄流光人像手法。"
      }
    ],
    finalPhotos: [
      {
        id: "ph-1",
        url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
        title: "港风实拍测试 - 1/50s 暖调试片",
        notes: "在冷绿底的斑驳小路，快门拖延，模特微微颤动身体。实测高感噪粒极好。",
        rating: 5
      }
    ]
  },
  {
    id: "plan-scandinavian-minimal",
    title: "「北欧冷感」日光留白高级肖像",
    createdAt: "2026-06-15T09:25:00Z",
    keywords: ["侘寂", "北欧极简", "大片留白", "柔白影调"],
    sceneDetails: "空旷的混凝土美术馆展厅、大面积落地格子窗，或有一盆孤立垂死多肉植物的白色摄影棚。",
    concept: "强调形式服务于精简。利用巨大的自然环境光照，配合柔和甚至几乎不可见的阴影，注重服装几何线条的质感与模特纯粹、慵懒、不带修饰的情感流露。",
    wardrobeGuide: "极其宽大挺括的亚麻或羊绒长衫，颜色为主米色、浅灰、水泥色和纯白。衣服没有多余拉链，极简拼接设计。",
    propsGuide: "一枝枯竭的尤加利叶、白瓷几何花瓶或一个无明显文字纹理的牛皮纸信封，极力避免过于扎眼的色彩干扰。",
    locationGuide: "清水混凝土墙、美术馆顶烈日柔光厅、落地大窗卧室。",
    weatherGuide: "温和的多云阴天或清晨北向温润柔天光，切忌直射烈日，保证影调明度分布的极高均匀柔和性。",
    equipmentGuide: "中画幅相机（如哈苏 X2D）配合 90mm (等效 70mm f/2.5) 极高解像率原厂定焦。无需任何特殊折射滤镜，力求展现纯净天然肌理。",
    scheduleGuide: "09:30 - 11:00 | 透明裸感极简底妆打造、亚麻质感大宽外套蒸汽熨平\n11:00 - 13:30 | 摄影棚落地巨格子窗前大面积水泥墙留白机位模特大画幅情绪抓拍\n13:30 - 14:30| 空白特写、枯尤加利叶与手艺静物留白捕捉\n14:30 - 15:00 | 挑选样片、底色亮度微提并导出洁净灰度格式",
    lightingInstructions: "完全依靠侧窗巨大的自然柔光。可在模特另一侧稍远位置设置一块白色发泡反光板作为反射，整体光比控制在 1:2 以内，保证阴影极致干净柔软。",
    lightingSetup: [
      { id: "model-1", type: DeviceType.MODEL, x: 150, y: 150, angle: 180, power: 1, colorTemp: 5500, label: "模特 - 极简北欧" },
      { id: "camera-1", type: DeviceType.CAMERA, x: 150, y: 250, angle: 270, power: 1, colorTemp: 5500, label: "中焦 85mm 黄金视角" },
      { id: "natural-window", type: DeviceType.NATURAL, x: 60, y: 150, angle: 0, power: 9, colorTemp: 5600, label: "巨大北向自然天窗" },
      { id: "reflector-fill", type: DeviceType.REFLECTOR, x: 230, y: 150, angle: 180, power: 4, colorTemp: 5500, label: "白反光板柔和过渡" }
    ],
    storyboard: [
      {
        id: "st-scand-1",
        shotType: "全景 (Wide Shot)",
        cameraAngle: "极低平视角",
        lensName: "35mm f/1.8 Compact",
        actionDescription: "模特整个人蜷缩在巨大清水混凝土角落的沙发一端，头部靠向靠枕。全身舒展放空，目光看向右下角地板。",
        lightDescription: "高调冷白光，面部几乎无粗糙阴影。整体色调呈高级的灰白过渡，背景有温和的渐变明暗线。",
        compositionGuide: "大面积极致留白。模特仅占画幅右下四分之一，其余全是静止、诗意的无暇墙面。"
      }
    ],
    inspirations: [
      {
        id: "insp-scand-1",
        title: "Celine 2010 精工极简风格大片",
        photographer: "Juergen Teller",
        url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80",
        notes: "学习其原汁原味的、不畏惧闪光折射和真实暗部的极简街拍质感。"
      }
    ],
    finalPhotos: []
  },
  {
    id: "plan-japanese-fresh",
    title: "「夏日熏风」经典日系小清新人像",
    createdAt: "2026-06-15T09:30:00Z",
    keywords: ["日系小清新", "高明度低反差", "胶片日记", "空气感温润"],
    sceneDetails: "通透的木质日式室内阳台、微风拂过的绿色草坡、镰仓般的临海电车轨道旁，或是带有青蓝色格纹窗帘的夏日教室。",
    concept: "汲取滨田英明(Hideaki Hamada)与川内伦子(Rinko Kawauchi)式的美学：注重“空气感”与“日常里的微光”。画面追求明亮通透、低饱和、高光带有微弱粉蓝调性，阴影呈现不带浊感的半透明深青，传达出一种清凉、纯真、带有温润呼吸感的生活碎片。",
    wardrobeGuide: "纯棉或细亚麻质地的白衬衫/连衣裙、带有天蓝色防晒薄开衫、浅灰蓝水手制服。衣服轮廓宽松自然，摒弃刻意的修身剪裁，材质富有透光度与轻盈感。",
    propsGuide: "复古玻璃瓶波子汽水（带冰镇雾气与透亮气泡）、透明日式雨伞、半切开的柠檬或西瓜、一辆带有藤编车筐的绿色复古单车，以及随时随身用于手部交互的复古胶片相机（如 Olympus OM-1）。",
    locationGuide: "海滨防波堤道、阳光充足的老式木地板平房、草木扶疏的开放式公园，或光影清澈的临窗长廊。",
    weatherGuide: "清晨 07:30-09:30 的纯净北向天空散射光，或午后 16:00-17:30 斜照的柔和逆光。忌直射烈日以防御面部高强度死白刺影，极力推崇微风徐徐的淡云天气，借助淡白云层作为巨大的天然漫反射柔光箱。",
    equipmentGuide: "Pentax 67 搭配 SMC 105mm f/2.4 经典中画幅镜头（呈现极富立体感的美妙空气感 bokeh 与通透肤色）；数码端推荐 Sony A7C2 搭配 55mm f/1.8 定焦。加载 1/8 White Mist (白柔滤镜) 或 Glimmerglass 滤镜以温和扩散高光，降低直方图黑色部分的反差，还原柔和银盐颗粒质地。",
    scheduleGuide: "07:00 - 08:30 | 清凉底妆与松散微卷麻花辫打造，换上轻量透光白纱短袖、整理拍摄道具；\n08:30 - 10:30 | 选点在绿草坡与电车防波堤进行，抢抓清透北向淡雅柔和天光，借助微风抓拍发丝与波子汽水的水雾；\n15:30 - 17:00 | 转移至带有木地板的斑驳光影阳台，模拟午后慵懒生活，透过大光圈逆光营造漫天尘埃微亮微冲光的浪漫画面；\n17:00 - 18:00 | 进行精选、阴影部分微提暗角、高光压低并辅以淡淡的青绿色蓝白色胶片质感基调渲染。",
    lightingInstructions: "在拍摄中应尽可能以自然晨光或透窗逆光为主。布光方案上，在模特后方约 120° 到 150° 的位置模拟或者引入巨大的柔和透白光束（如柔光纸或自然柔天光），形成高亮发丝的边缘。而在模特正前方 45° 设置一块银白双面反光板（或辅以超大无阴影软质深空柔光箱，功率极低设为 2-3，以抵消阴影反差），让皮肤受光极其平整透亮、清透红润，眼瞳中留有温和温润的月牙形眼神光。",
    lightingSetup: [
      { id: "model-1", type: DeviceType.MODEL, x: 150, y: 150, angle: 180, power: 1, colorTemp: 5500, label: "模特 - 日系清新感" },
      { id: "camera-1", type: DeviceType.CAMERA, x: 150, y: 260, angle: 270, power: 1, colorTemp: 5500, label: "Pentax 67 + 105/2.4" },
      { id: "natural-sky", type: DeviceType.NATURAL, x: 120, y: 60, angle: 100, power: 9, colorTemp: 5800, label: "晨曦窗外温润散射天光" },
      { id: "reflector-front", type: DeviceType.REFLECTOR, x: 150, y: 215, angle: 90, power: 6, colorTemp: 5500, label: "巨幅银白色反光板" },
      { id: "softbox-fill", type: DeviceType.SOFTBOX, x: 70, y: 180, angle: 330, power: 3, colorTemp: 5400, label: "左侧 45° 辅助灯" }
    ],
    storyboard: [
      {
        id: "st-jp-1",
        shotType: "中特写 (Medium Close-up)",
        cameraAngle: "视平高度微仰",
        lensName: "105mm f/2.4 Pentax",
        actionDescription: "模特双手捧着冰凉的汽水瓶，将瓶身轻贴在柔嫩的面颊旁，双眼微闭作感受凉意状，额前发丝在海风下俏皮扬起，嘴角勾起一抹满足笑意。",
        lightDescription: "大面积背景逆光让波子汽水折射出清凉耀眼的钻石般星芒，正面利用巨大的银白色反射板为面部注入平滑、极度细腻的通透自然光，眼神中留有明亮清澈的露珠眼神光。",
        compositionGuide: "精典三分法构图。模特视线延伸处（右侧）留有纯白、纯绿的环境空间，让人感受到画外夏蝉鸣叫的呼吸张力。"
      },
      {
        id: "st-jp-2",
        shotType: "大远景 (Wide Shot)",
        cameraAngle: "俯角极简海景",
        lensName: "45mm f/4.0 Wide",
        actionDescription: "模特高举透明雨伞，雀跃地在空无一人的滨海碎石公路上奔跑，白裙衣角借着微风扬溢开来，与远处的蔚蓝色海浪连成一片。",
        lightDescription: "阴天漫反射。整体影调处于极高的亮度水平，灰度极度平滑，伞面折射天空柔和的苍白微光，消冰了任何刚烈的沉重投影。",
        compositionGuide: "中心平行线三分布局。将模特白裙融入中央，海平线偏下，创造自由放空、天高海阔的清新治愈绘本即视感。"
      }
    ],
    inspirations: [
      {
        id: "insp-jp-1",
        title: "「Haru and Mina」经典呼吸感日常纪实",
        photographer: "滨田英明 (Hideaki Hamada)",
        url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
        notes: "理解其采用 120 画幅、在多云微阴天气下进行漫射曝光以控制阴影柔和度的非凡技法，主创高明度清新画卷。"
      },
      {
        id: "insp-jp-2",
        title: "「Utatane」诗般脆弱夏日物语",
        photographer: "川内伦子 (Rinko Kawauchi)",
        url: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80",
        notes: "学习其运用细腻微弱过曝、高反差闪光漫射、玻璃气泡与微小生活细节烘托诗歌般意识流的独到美感。"
      }
    ],
    finalPhotos: []
  }
];
