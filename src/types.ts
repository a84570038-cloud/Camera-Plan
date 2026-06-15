export enum DeviceType {
  MODEL = "model",
  CAMERA = "camera",
  STROBE = "strobe", // Standard Strobe/Flash
  SOFTBOX = "softbox", // Diffused light
  REFLECTOR = "reflector", // Reflector board
  NATURAL = "natural", // Windows / Sun
  SPOTLIGHT = "spotlight", // Hard beam spotlight
}

export interface LightingDevice {
  id: string;
  type: DeviceType;
  x: number;
  y: number;
  angle: number; // in degrees (0 - 360)
  power: number; // intensity (e.g. 1 to 10)
  colorTemp: number; // color temperature in Kelvin (2700 - 8000)
  label: string;
  beamWidth?: number; // Spread / Coverage angle in degrees (e.g., 10 to 120)
}

export interface InspirationLink {
  id: string;
  title: string;
  photographer: string;
  url: string;
  notes?: string;
}

export interface FinalPhoto {
  id: string;
  url: string; // base64 or preview url
  title: string;
  notes?: string;
  rating: number; // 1-5 stars
}

export interface StoryboardElement {
  id: string;
  shotType: string; // e.g., "特写 (Close-up)", "中景 (Medium)", "远景 (Wide)"
  cameraAngle: string; // e.g., "平视", "俯视", "微仰"
  lensName: string; // e.g., "85mm f/1.4", "35mm f/1.8"
  actionDescription: string; // Pose/Action description
  lightDescription: string; // Lighting intent
  aiSketchUrl?: string; // Generated lineart sketch data or SVG code
  compositionGuide?: string; // e.g. "三分法", "对角线", "黄金分割"
}

export interface CustomPlan {
  id: string;
  title: string;
  createdAt: string;
  keywords: string[];
  sceneDetails: string;
  concept: string;
  weatherGuide: string; // Weather & natural lighting conditions
  wardrobeGuide: string;
  propsGuide: string;
  locationGuide: string;
  equipmentGuide: string; // Camera and Lens specifications
  scheduleGuide: string; // Shooting schedule/timeframe
  lightingInstructions: string;
  lightingSetup: LightingDevice[];
  storyboard: StoryboardElement[];
  inspirations: InspirationLink[];
  finalPhotos: FinalPhoto[];
}
