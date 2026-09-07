/* ================= core enums ================= */
export type DeviceKind = 'laptop' | 'phone' | 'tablet' | 'browser' | 'monitor';
export type FitMode = 'cover' | 'contain' | 'stretch';
export type ShadowPreset = 'none' | 'soft' | 'hard' | 'float' | 'glow' | 'product' | 'cinematic' | 'long';
export type BgType = 'solid' | 'linear' | 'radial' | 'mesh';
export type PatternKind = 'none' | 'dots' | 'grid' | 'rings' | 'noise' | 'diag';
export type DecoSet = 'none' | 'orbs' | 'rings' | 'grid' | 'sparkles' | 'waves';
export type PosPreset =
  | 'top-left' | 'top-center' | 'top-right'
  | 'center-left' | 'center' | 'center-right'
  | 'bottom-left' | 'bottom-center' | 'bottom-right';

export type BgStyle = 'plain' | 'studio' | 'architectural' | 'abstract' | 'grid' | 'editorial' | 'tech' | 'glass';
export type LightType = 'none' | 'top' | 'bottom' | 'left' | 'right' | 'center' | 'ambient';
export type Material = 'matte' | 'glossy' | 'glass' | 'metallic';
export type DecoCat = 'geometric' | '3d' | 'abstract' | 'ui';
export type DecoPrim =
  | 'sphere' | 'ring' | 'disc' | 'blob' | 'ribbon' | 'dotgrid' | 'wave' | 'plus' | 'sparkle'
  | 'glasscard' | 'uipanel' | 'notification' | 'chart' | 'arc' | 'pill' | 'cube' | 'torus'
  | 'line' | 'square' | 'triangle' | 'orbit';
export type DecoDepth = 'back' | 'front';
export type Mood =
  | 'auto' | 'minimal' | 'premium' | 'creative' | 'developer' | 'dark' | 'light'
  | 'editorial' | 'bold' | 'elegant' | 'futuristic' | 'playful' | 'corporate';
export type SurpriseMode = 'all' | 'background' | 'layout' | 'colors' | 'decor' | 'devices' | 'image';

/* ---------- image background engine ---------- */
export type BackgroundKind = 'procedural' | 'image' | 'hybrid';
export type ImageFit = 'cover' | 'contain' | 'fill' | 'stretch' | 'center';
export type ImageColorFilter = 'original' | 'grayscale' | 'warm' | 'cool' | 'muted' | 'high' | 'soft' | 'dark' | 'light';
export type ImageOverlay = 'none' | 'color' | 'gradient' | 'black' | 'white' | 'noise' | 'vignette' | 'light';
export type ImageMask = 'none' | 'rounded' | 'circle' | 'radial' | 'gradient';
export type TextBackplate = 'none' | 'shadow' | 'glass' | 'blur' | 'solid' | 'gradient';
export type ImageCategory = 'abstract' | '3d' | 'studio' | 'glass' | 'tech' | 'editorial' | 'paper' | 'architectural' | 'custom';

export interface ImageBgState {
  kind: BackgroundKind;
  imageId: string | null;
  customSrc: string | null;
  fit: ImageFit;
  x: number;
  y: number;
  scale: number;
  rotation: number;
  opacity: number;
  brightness: number;
  contrast: number;
  saturation: number;
  blur: number;
  hue: number;
  colorFilter: ImageColorFilter;
  tint: string | null;
  tintOpacity: number;
  overlay: ImageOverlay;
  overlayColor: string;
  overlayOpacity: number;
  blend: GlobalCompositeOperation;
  mask: ImageMask;
}

/* ---------- icon system ---------- */
export type IconBg = 'none' | 'circle' | 'round' | 'glass' | 'orb' | 'badge';
export interface IconLayer {
  id: string;
  iconId: string;
  x: number;
  y: number;
  scale: number;
  rotation: number;
  opacity: number;
  color: string | null;
  bg: IconBg;
  bgFill: string | null;
}
export interface IconDef {
  id: string;
  name: string;
  category: string;
  tags: string[];
  d: string;
  style: 'outline' | 'filled' | 'duotone' | 'bold';
}

/* ================= interfaces ================= */
export interface Asset { id: string; name: string; dataUrl: string; w: number; h: number; }

export interface Lighting { type: LightType; intensity: number; }

export interface Background {
  type: BgType; c1: string; c2: string; c3: string; angle: number;
  pattern: PatternKind; patternOpacity: number;
  style: BgStyle; seed: number; light: Lighting; meshPoints: number;
  /* image engine (optional — normalized at render time) */
  kind?: BackgroundKind;
  image?: Partial<ImageBgState>;
}

export interface DeviceLayer {
  id: string; kind: DeviceKind; name: string;
  x: number; y: number; w: number; tilt: number; color: string;
  assetId: string | null; fit: FitMode; zoom: number; panX: number; panY: number;
  shadow: ShadowPreset; url: string; visible: boolean;
  brightness: number; reflection: number; radiusMul: number; opacity: number;
  material: Material; z: number;
}

export interface TextBlock {
  enabled: boolean; title: string; subtitle: string;
  showBadges: boolean; badges: string[];
  position: PosPreset; scale: number; color: string; autoColor: boolean;
  backplate?: TextBackplate;
}

export interface LogoState { enabled: boolean; assetId: string | null; position: PosPreset; size: number; opacity: number; }

export interface DecoLayer {
  id: string; preset: string; x: number; y: number; scale: number; rotation: number;
  opacity: number; blur: number; depth: DecoDepth; hue: string | null; seed: number;
}

export interface DecorationState { set: DecoSet; seed: number; intensity: number; density: number; layers: DecoLayer[]; }

export interface GenLocks { devices: boolean; background: boolean; decoration: boolean; text: boolean; logo: boolean; }

export interface Project {
  id: string; name: string; type: string; createdAt: number; updatedAt: number;
  canvas: { w: number; h: number };
  assets: Asset[]; devices: DeviceLayer[];
  background: Background; text: TextBlock; logo: LogoState;
  decoration: DecorationState; accents: { a1: string; a2: string };
  thumbnail: string | null; exportCount: number;
  decos: DecoLayer[]; mood: Mood;
  icons: IconLayer[];
}

/* ================= editor state ================= */
export interface Selection { kind: 'device' | 'text' | 'logo' | 'background' | 'deco' | 'icon'; id?: string; }
export interface Toast { id: number; msg: string; tone: 'ok' | 'err' | 'info'; }
export interface ScreenRect { x: number; y: number; w: number; h: number; r: number; }
export interface DecoShape { t: 'circle' | 'ring' | 'plus' | 'sparkle' | 'line' | 'dots'; x: number; y: number; r: number; color: string; o: number; rot: number; }

export interface DesignSnapshot {
  id: string; label: string; at: number; thumb: string; score: number;
  project: Omit<Project, 'assets'>;
}
