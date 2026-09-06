export type DeviceKind = 'laptop' | 'phone' | 'tablet' | 'browser' | 'monitor';
export type FitMode = 'cover' | 'contain' | 'stretch';
export type ShadowPreset = 'none' | 'soft' | 'hard' | 'float' | 'glow';
export type BgType = 'solid' | 'linear' | 'radial' | 'mesh';
export type PatternKind = 'none' | 'dots' | 'grid' | 'rings' | 'noise' | 'diag';
export type DecoSet = 'none' | 'orbs' | 'rings' | 'grid' | 'sparkles' | 'waves';
export type PosPreset =
  | 'top-left' | 'top-center' | 'top-right'
  | 'center-left' | 'center' | 'center-right'
  | 'bottom-left' | 'bottom-center' | 'bottom-right';

export interface Asset {
  id: string;
  name: string;
  dataUrl: string;
  w: number;
  h: number;
}

export interface DeviceLayer {
  id: string;
  kind: DeviceKind;
  name: string;
  x: number; // px on canvas
  y: number;
  w: number;
  tilt: number; // deg
  color: string;
  assetId: string | null;
  fit: FitMode;
  zoom: number; // 1..2.5
  panX: number; // -1..1
  panY: number; // -1..1
  shadow: ShadowPreset;
  url: string;
  visible: boolean;
}

export interface Background {
  type: BgType;
  c1: string;
  c2: string;
  c3: string;
  angle: number;
  pattern: PatternKind;
  patternOpacity: number; // 0..1
}

export interface TextBlock {
  enabled: boolean;
  title: string;
  subtitle: string;
  showBadges: boolean;
  badges: string[];
  position: PosPreset;
  scale: number; // 0.6..1.6
  color: string;
  autoColor: boolean;
}

export interface LogoState {
  enabled: boolean;
  assetId: string | null;
  position: PosPreset;
  size: number; // fraction of canvas width 0.04..0.25
  opacity: number; // 0..1
}

export interface DecorationState {
  set: DecoSet;
  seed: number;
  intensity: number; // 0.4..1.4
}

export interface Project {
  id: string;
  name: string;
  type: string;
  createdAt: number;
  updatedAt: number;
  canvas: { w: number; h: number };
  assets: Asset[];
  devices: DeviceLayer[];
  background: Background;
  text: TextBlock;
  logo: LogoState;
  decoration: DecorationState;
  accents: { a1: string; a2: string };
  thumbnail: string | null;
  exportCount: number;
}

export interface Selection {
  kind: 'device' | 'text' | 'logo' | 'background';
  id?: string;
}

export interface Toast {
  id: number;
  msg: string;
  tone: 'ok' | 'err' | 'info';
}

export interface ScreenRect {
  x: number;
  y: number;
  w: number;
  h: number;
  r: number;
}

export interface DecoShape {
  t: 'circle' | 'ring' | 'plus' | 'sparkle' | 'line' | 'dots';
  x: number;
  y: number;
  r: number;
  color: string;
  o: number;
  rot: number;
}
