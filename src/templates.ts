import type {
  Asset, Background, BgType, DecoSet, DecoShape, DeviceKind, DeviceLayer, FitMode,
  PatternKind, PosPreset, Project, ScreenRect, ShadowPreset, TextBlock,
} from './types';

/* ---------------- utils ---------------- */
export const uid = () => Math.random().toString(36).slice(2, 9) + Date.now().toString(36).slice(-3);

export function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const pick = <T,>(r: () => number, a: T[]): T => a[Math.floor(r() * a.length)];
const rngRange = (r: () => number, min: number, max: number) => min + r() * (max - min);

export function clamp(v: number, min: number, max: number) { return Math.min(max, Math.max(min, v)); }

export function shade(hex: string, amt: number): string {
  const n = parseInt(hex.replace('#', ''), 16);
  const c = (v: number) => clamp(Math.round(v + amt), 0, 255);
  const r = c((n >> 16) & 255), g = c((n >> 8) & 255), b = c(n & 255);
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

export function luminance(hex: string): number {
  const n = parseInt(hex.replace('#', ''), 16);
  const r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
  return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
}
export const textOn = (hex: string) => (luminance(hex) > 0.56 ? '#15171c' : '#f2f0ea');

/* ---------------- devices ---------------- */
export const DEVICE_META: Record<DeviceKind, { label: string; aspect: number; defFw: number; colors: { name: string; hex: string }[] }> = {
  laptop:  { label: 'Laptop',  aspect: 1.56, defFw: 0.62, colors: [
    { name: 'Graphite', hex: '#33363c' }, { name: 'Silver', hex: '#d8dade' }, { name: 'Midnight', hex: '#20242c' }, { name: 'Sand', hex: '#c9b8a3' }] },
  phone:   { label: 'Phone',   aspect: 0.485, defFw: 0.16, colors: [
    { name: 'Black', hex: '#1a1c20' }, { name: 'Silver', hex: '#dfe1e6' }, { name: 'Gold', hex: '#e3cfa8' }, { name: 'Deep Blue', hex: '#2e4057' }, { name: 'Forest', hex: '#2f4a3e' }] },
  tablet:  { label: 'Tablet',  aspect: 1.38, defFw: 0.30, colors: [
    { name: 'Space Gray', hex: '#33363c' }, { name: 'Silver', hex: '#dcdfe4' }, { name: 'Slate Blue', hex: '#3d4a5c' }] },
  browser: { label: 'Browser', aspect: 1.47, defFw: 0.55, colors: [
    { name: 'Dark', hex: '#22262d' }, { name: 'Light', hex: '#eef0f3' }] },
  monitor: { label: 'Monitor', aspect: 1.68, defFw: 0.56, colors: [
    { name: 'Charcoal', hex: '#23262b' }, { name: 'Silver', hex: '#d3d6db' }] },
};

/** Screen opening inside a device box of size w×h — shared by preview AND export renderer. */
export function deviceGeometry(kind: DeviceKind, w: number, h: number): ScreenRect {
  switch (kind) {
    case 'laptop': {
      const baseH = h * 0.062;
      const lidH = h - baseH;
      const x = w * 0.062, y = lidH * 0.06;
      return { x, y, w: w - x * 2, h: lidH - y - lidH * 0.055, r: Math.min(w, h) * 0.014 };
    }
    case 'phone': {
      const pad = w * 0.052;
      return { x: pad, y: pad * 1.12, w: w - pad * 2, h: h - pad * 2.24, r: w * 0.088 };
    }
    case 'tablet': {
      const pad = Math.min(w, h) * 0.048;
      return { x: pad, y: pad, w: w - pad * 2, h: h - pad * 2, r: Math.min(w, h) * 0.035 };
    }
    case 'browser': {
      const chrome = Math.max(h * 0.09, 26);
      return { x: 0, y: chrome, w, h: h - chrome, r: Math.min(w, h) * 0.02 };
    }
    case 'monitor': {
      const standH = h * 0.15;
      const screenH = h - standH;
      const pad = screenH * 0.028;
      return { x: pad, y: pad, w: w - pad * 2, h: screenH - pad * 2, r: Math.min(w, h) * 0.01 };
    }
  }
}

/** Where the screenshot image lands inside the screen rect (fit + zoom + pan). */
export function computeFit(s: ScreenRect, iw: number, ih: number, fit: FitMode, zoom: number, panX: number, panY: number) {
  let dw: number, dh: number;
  if (fit === 'stretch') { dw = s.w; dh = s.h; }
  else {
    const sc = fit === 'cover' ? Math.max(s.w / iw, s.h / ih) : Math.min(s.w / iw, s.h / ih);
    dw = iw * sc; dh = ih * sc;
  }
  dw *= zoom; dh *= zoom;
  const cx = s.x + s.w / 2 + (panX * s.w) / 2;
  const cy = s.y + s.h / 2 + (panY * s.h) / 2;
  return { dx: cx - dw / 2, dy: cy - dh / 2, dw, dh };
}

/* ---------------- presets ---------------- */
export const CANVAS_PRESETS = [
  { label: 'Showcase', w: 1600, h: 1000 },
  { label: 'MacBook', w: 1440, h: 900 },
  { label: 'Portfolio', w: 1200, h: 800 },
  { label: 'LinkedIn', w: 1200, h: 628 },
  { label: 'Square', w: 1080, h: 1080 },
  { label: 'IG Portrait', w: 1080, h: 1350 },
  { label: 'Story', w: 1080, h: 1920 },
  { label: 'Full HD', w: 1920, h: 1080 },
];

export const PROJECT_TYPES = ['Website', 'Web App', 'Mobile App', 'Dashboard', 'Landing Page', 'E-commerce', 'Portfolio', 'Desktop App', 'Custom'];

export interface BgPreset {
  id: string; name: string; sw: [string, string];
  bg: Background;
}
const bg = (type: BgType, c1: string, c2: string, c3: string, angle: number, pattern: PatternKind, po: number): Background =>
  ({ type, c1, c2, c3, angle, pattern, patternOpacity: po });

export const BG_PRESETS: BgPreset[] = [
  { id: 'studio-dark', name: 'Studio Dark', sw: ['#17191e', '#17191e'], bg: bg('solid', '#17191e', '#17191e', '#17191e', 0, 'grid', 0.05) },
  { id: 'paper', name: 'Paper', sw: ['#f4f4f1', '#f4f4f1'], bg: bg('solid', '#f4f4f1', '#f4f4f1', '#f4f4f1', 0, 'none', 0) },
  { id: 'porcelain', name: 'Porcelain Grid', sw: ['#fbfbf9', '#fbfbf9'], bg: bg('solid', '#fbfbf9', '#fbfbf9', '#fbfbf9', 0, 'grid', 0.08) },
  { id: 'slate', name: 'Slate', sw: ['#2b313b', '#2b313b'], bg: bg('solid', '#2b313b', '#2b313b', '#2b313b', 0, 'noise', 0.05) },
  { id: 'ink', name: 'Ink Noise', sw: ['#101114', '#101114'], bg: bg('solid', '#101114', '#101114', '#101114', 0, 'noise', 0.09) },
  { id: 'ember', name: 'Ember Fade', sw: ['#1c1d22', '#3a241b'], bg: bg('linear', '#1c1d22', '#3a241b', '#3a241b', 135, 'none', 0) },
  { id: 'tide', name: 'Deep Tide', sw: ['#0f1c22', '#1d4149'], bg: bg('linear', '#0f1c22', '#1d4149', '#1d4149', 120, 'none', 0) },
  { id: 'glacier', name: 'Glacier', sw: ['#eaf2f5', '#c9dde5'], bg: bg('linear', '#eaf2f5', '#c9dde5', '#c9dde5', 160, 'none', 0) },
  { id: 'dawn', name: 'Soft Dawn', sw: ['#fdf3e7', '#f3d9c6'], bg: bg('linear', '#fdf3e7', '#f3d9c6', '#f3d9c6', 145, 'none', 0) },
  { id: 'mint', name: 'Mint Wash', sw: ['#ecf5ef', '#d2e7db'], bg: bg('linear', '#ecf5ef', '#d2e7db', '#d2e7db', 150, 'none', 0) },
  { id: 'spotlight', name: 'Spotlight', sw: ['#262a32', '#101216'], bg: bg('radial', '#262a32', '#101216', '#101216', 0, 'none', 0) },
  { id: 'halo', name: 'Warm Halo', sw: ['#2a2118', '#120f0c'], bg: bg('radial', '#2a2118', '#120f0c', '#120f0c', 0, 'noise', 0.05) },
  { id: 'deepmesh', name: 'Deep Mesh', sw: ['#0e1116', '#1d3a38'], bg: bg('mesh', '#0e1116', '#ff6b3d', '#45d6c8', 0, 'none', 0) },
  { id: 'solar-mesh', name: 'Solar Mesh', sw: ['#f6f1e8', '#ffd9c4'], bg: bg('mesh', '#f6f1e8', '#ff8a5c', '#7fd8cd', 0, 'none', 0) },
  { id: 'terminal', name: 'Terminal', sw: ['#0b0f0d', '#0b0f0d'], bg: bg('solid', '#0b0f0d', '#0b0f0d', '#0b0f0d', 0, 'grid', 0.07) },
  { id: 'blueprint', name: 'Blueprint', sw: ['#0f2036', '#0f2036'], bg: bg('solid', '#0f2036', '#0f2036', '#0f2036', 0, 'grid', 0.1) },
];

export const PATTERNS: { id: PatternKind; label: string }[] = [
  { id: 'none', label: 'None' }, { id: 'dots', label: 'Dots' }, { id: 'grid', label: 'Grid' },
  { id: 'rings', label: 'Rings' }, { id: 'diag', label: 'Diag' }, { id: 'noise', label: 'Noise' },
];

export const TECH_BADGES = [
  'React', 'TypeScript', 'Node.js', 'Next.js', 'MongoDB', 'PostgreSQL', 'Tailwind', 'Express',
  'Python', 'Firebase', 'Supabase', 'Flutter', 'Figma', 'GraphQL', 'Docker', 'AWS', 'Vite', 'Redux',
];

export const SHADOWS: { id: ShadowPreset; label: string; dx: number; dy: number; blur: number; alpha: number }[] = [
  { id: 'none', label: 'None', dx: 0, dy: 0, blur: 0, alpha: 0 },
  { id: 'soft', label: 'Soft', dx: 0, dy: 22, blur: 55, alpha: 0.38 },
  { id: 'hard', label: 'Hard', dx: 14, dy: 18, blur: 3, alpha: 0.42 },
  { id: 'float', label: 'Float', dx: 0, dy: 44, blur: 90, alpha: 0.48 },
  { id: 'glow', label: 'Glow', dx: 0, dy: 12, blur: 70, alpha: 0.5 },
];

export const FIT_MODES: { id: FitMode; label: string }[] = [
  { id: 'cover', label: 'Cover' }, { id: 'contain', label: 'Contain' }, { id: 'stretch', label: 'Stretch' },
];

export const POSITIONS: PosPreset[] = [
  'top-left', 'top-center', 'top-right', 'center-left', 'center', 'center-right', 'bottom-left', 'bottom-center', 'bottom-right',
];

export const DECO_SETS: { id: DecoSet; label: string }[] = [
  { id: 'none', label: 'None' }, { id: 'orbs', label: 'Orbs' }, { id: 'rings', label: 'Rings' },
  { id: 'grid', label: 'Dot field' }, { id: 'sparkles', label: 'Sparkles' }, { id: 'waves', label: 'Waves' },
];

export const LAYOUTS: { id: string; label: string; desc: string; devices: { kind: DeviceKind; fx: number; fy: number; fw: number }[] }[] = [
  { id: 'single', label: 'Hero device', desc: 'One device, centered', devices: [{ kind: 'laptop', fx: 0.19, fy: 0.17, fw: 0.62 }] },
  { id: 'duo', label: 'Laptop + Phone', desc: 'Web + mobile combo', devices: [{ kind: 'laptop', fx: 0.11, fy: 0.16, fw: 0.6 }, { kind: 'phone', fx: 0.66, fy: 0.3, fw: 0.135 }] },
  { id: 'responsive', label: 'Responsive trio', desc: 'Desktop · tablet · phone', devices: [{ kind: 'laptop', fx: 0.07, fy: 0.13, fw: 0.55 }, { kind: 'tablet', fx: 0.58, fy: 0.34, fw: 0.25 }, { kind: 'phone', fx: 0.79, fy: 0.4, fw: 0.115 }] },
  { id: 'compare', label: 'Before / After', desc: 'Two browsers side by side', devices: [{ kind: 'browser', fx: 0.05, fy: 0.22, fw: 0.43 }, { kind: 'browser', fx: 0.52, fy: 0.22, fw: 0.43 }] },
  { id: 'phonepair', label: 'Phone pair', desc: 'Two floating phones', devices: [{ kind: 'phone', fx: 0.26, fy: 0.09, fw: 0.19 }, { kind: 'phone', fx: 0.55, fy: 0.2, fw: 0.19 }] },
];

export const EXPORT_PRESETS = [
  { id: 'original', label: 'Original', w: 0, h: 0 },
  { id: 'portfolio', label: 'Portfolio', w: 1200, h: 800 },
  { id: 'linkedin', label: 'LinkedIn', w: 1200, h: 627 },
  { id: 'upwork', label: 'Upwork', w: 1280, h: 960 },
  { id: 'square', label: 'Square', w: 1080, h: 1080 },
  { id: 'portrait', label: 'IG Portrait', w: 1080, h: 1350 },
  { id: 'story', label: 'Story', w: 1080, h: 1920 },
  { id: 'hd', label: 'Full HD', w: 1920, h: 1080 },
];

/* ---------------- decoration generator (shared preview + export) ---------------- */
export function getDecoShapes(set: DecoSet, seed: number, w: number, h: number, intensity: number, c1: string, c2: string): DecoShape[] {
  if (set === 'none') return [];
  const rnd = mulberry32(seed);
  const out: DecoShape[] = [];
  const min = Math.min(w, h);
  const colors = [c1, c2, '#f2f0ea'];
  const edgePos = () => {
    // keep shapes near the edges so devices stay clean
    const side = Math.floor(rnd() * 4);
    const m = 0.16;
    if (side === 0) return { x: rngRange(rnd, -0.04, m), y: rngRange(rnd, 0.02, 0.98) };
    if (side === 1) return { x: rngRange(rnd, 1 - m, 1.04), y: rngRange(rnd, 0.02, 0.98) };
    if (side === 2) return { x: rngRange(rnd, 0.02, 0.98), y: rngRange(rnd, -0.04, m * 0.7) };
    return { x: rngRange(rnd, 0.02, 0.98), y: rngRange(rnd, 1 - m * 0.7, 1.04) };
  };
  const n = Math.round((set === 'sparkles' ? 10 : 6) * intensity);
  for (let i = 0; i < n; i++) {
    const p = edgePos();
    const color = colors[i % colors.length];
    const o = rngRange(rnd, 0.25, 0.7) * Math.min(1, intensity);
    if (set === 'orbs') out.push({ t: 'circle', x: p.x * w, y: p.y * h, r: rngRange(rnd, 0.03, 0.13) * min * intensity, color, o: o * 0.55, rot: 0 });
    else if (set === 'rings') out.push({ t: 'ring', x: p.x * w, y: p.y * h, r: rngRange(rnd, 0.04, 0.15) * min * intensity, color, o, rot: 0 });
    else if (set === 'grid') out.push({ t: 'dots', x: p.x * w, y: p.y * h, r: rngRange(rnd, 0.05, 0.11) * min, color, o: o * 0.8, rot: rngRange(rnd, -0.3, 0.3) });
    else if (set === 'sparkles') out.push({ t: i % 3 === 0 ? 'plus' : 'sparkle', x: p.x * w, y: p.y * h, r: rngRange(rnd, 0.012, 0.03) * min * intensity, color, o, rot: rngRange(rnd, 0, 0.8) });
    else if (set === 'waves') out.push({ t: 'line', x: p.x * w, y: p.y * h, r: rngRange(rnd, 0.08, 0.2) * min, color, o: o * 0.7, rot: rngRange(rnd, -0.5, 0.5) });
  }
  return out;
}

/* ---------------- palettes for randomizer ---------------- */
const PALETTES: { c1: string; c2: string; c3: string; type: BgType; angle: number; pattern: PatternKind; po: number; a1: string; a2: string }[] = [
  { c1: '#17191e', c2: '#3a241b', c3: '#3a241b', type: 'linear', angle: 135, pattern: 'grid', po: 0.05, a1: '#ff6b3d', a2: '#ffd166' },
  { c1: '#0f1c22', c2: '#1d4149', c3: '#1d4149', type: 'linear', angle: 120, pattern: 'none', po: 0, a1: '#45d6c8', a2: '#f2f0ea' },
  { c1: '#0e1116', c2: '#ff6b3d', c3: '#45d6c8', type: 'mesh', angle: 0, pattern: 'noise', po: 0.05, a1: '#ff6b3d', a2: '#45d6c8' },
  { c1: '#f4f4f1', c2: '#f4f4f1', c3: '#f4f4f1', type: 'solid', angle: 0, pattern: 'grid', po: 0.09, a1: '#1d1f24', a2: '#ff6b3d' },
  { c1: '#fbfbf9', c2: '#e8eef1', c3: '#e8eef1', type: 'linear', angle: 160, pattern: 'dots', po: 0.35, a1: '#2e4057', a2: '#ff6b3d' },
  { c1: '#262a32', c2: '#101216', c3: '#101216', type: 'radial', angle: 0, pattern: 'none', po: 0, a1: '#ffd166', a2: '#f2f0ea' },
  { c1: '#101114', c2: '#101114', c3: '#101114', type: 'solid', angle: 0, pattern: 'noise', po: 0.09, a1: '#ff6b3d', a2: '#45d6c8' },
  { c1: '#fdf3e7', c2: '#f3d9c6', c3: '#f3d9c6', type: 'linear', angle: 145, pattern: 'none', po: 0, a1: '#b4552d', a2: '#2e4057' },
  { c1: '#0f2036', c2: '#0f2036', c3: '#0f2036', type: 'solid', angle: 0, pattern: 'grid', po: 0.1, a1: '#45d6c8', a2: '#f2f0ea' },
  { c1: '#1c1d22', c2: '#2a1e2e', c3: '#2a1e2e', type: 'linear', angle: 115, pattern: 'rings', po: 0.06, a1: '#f4a3b5', a2: '#ffd166' },
  { c1: '#ecf5ef', c2: '#d2e7db', c3: '#d2e7db', type: 'linear', angle: 150, pattern: 'none', po: 0, a1: '#2f4a3e', a2: '#ff6b3d' },
  { c1: '#2b313b', c2: '#2b313b', c3: '#2b313b', type: 'solid', angle: 0, pattern: 'noise', po: 0.06, a1: '#ff6b3d', a2: '#f2f0ea' },
];

/** Rule-based variation generator — deterministic, no AI. */
export function randomizeProject(p: Project): Project {
  const seed = (Date.now() ^ Math.floor(Math.random() * 1e9)) >>> 0;
  const rnd = mulberry32(seed);
  const pal = pick(rnd, PALETTES);
  const tilts = [-6, -4, -2, 0, 0, 2, 4, 6];
  const shadows: ShadowPreset[] = ['soft', 'soft', 'float', 'hard', 'glow'];
  const decos: DecoSet[] = ['orbs', 'rings', 'grid', 'sparkles', 'waves', 'none'];
  const textPos: PosPreset[] = ['bottom-left', 'bottom-center', 'top-left', 'top-center'];
  const logoPos: PosPreset[] = ['top-right', 'top-left', 'bottom-right', 'bottom-left'];
  return {
    ...p,
    updatedAt: Date.now(),
    background: { type: pal.type, c1: pal.c1, c2: pal.c2, c3: pal.c3, angle: pal.angle + Math.floor(rngRange(rnd, -20, 20)), pattern: pal.pattern, patternOpacity: pal.po },
    decoration: { set: pick(rnd, decos), seed: Math.floor(rnd() * 1e9), intensity: rngRange(rnd, 0.7, 1.2) },
    text: { ...p.text, position: pick(rnd, textPos) },
    logo: { ...p.logo, position: p.logo.enabled ? pick(rnd, logoPos) : p.logo.position },
    devices: p.devices.map((d, i) => ({ ...d, tilt: pick(rnd, tilts) + (i % 2 === 0 ? 0 : pick(rnd, [-2, 2])), shadow: pick(rnd, shadows) })),
    accents: { a1: pal.a1, a2: pal.a2 },
  };
}

/* ---------------- factories ---------------- */
export function makeDevice(kind: DeviceKind, cw: number, ch: number, assetId: string | null, index: number): DeviceLayer {
  const meta = DEVICE_META[kind];
  const w = cw * meta.defFw;
  const h = w / meta.aspect;
  return {
    id: uid(), kind, name: `${meta.label} ${index + 1}`,
    x: (cw - w) / 2, y: (ch - h) / 2, w,
    tilt: 0, color: meta.colors[0].hex, assetId, fit: 'cover',
    zoom: 1, panX: 0, panY: 0, shadow: 'soft',
    url: 'yourapp.com', visible: true,
  };
}

export function applyLayoutPositions(p: Project, layoutId: string): Project {
  const layout = LAYOUTS.find(l => l.id === layoutId);
  if (!layout) return p;
  const { w: cw, h: ch } = p.canvas;
  const assets = p.assets;
  const devices: DeviceLayer[] = layout.devices.map((d, i) => {
    const meta = DEVICE_META[d.kind];
    const w = cw * d.fw;
    const h = w / meta.aspect;
    const prev = p.devices[i];
    return {
      ...makeDevice(d.kind, cw, ch, assets[i]?.id ?? null, i),
      x: cw * d.fx, y: ch * d.fy, w,
      assetId: assets[i]?.id ?? prev?.assetId ?? null,
      color: prev?.color ?? meta.colors[0].hex,
    };
  });
  return { ...p, devices, updatedAt: Date.now() };
}

export function makeDefaultProject(name: string, type: string, cw: number, ch: number): Project {
  const preset = BG_PRESETS[0];
  const text: TextBlock = {
    enabled: true, title: '', subtitle: '', showBadges: false, badges: ['React', 'TypeScript', 'Tailwind'],
    position: 'bottom-left', scale: 1, color: '#f2f0ea', autoColor: true,
  };
  return {
    id: uid(), name, type, createdAt: Date.now(), updatedAt: Date.now(),
    canvas: { w: cw, h: ch },
    assets: [],
    devices: [makeDevice('laptop', cw, ch, null, 0)],
    background: { ...preset.bg },
    text,
    logo: { enabled: false, assetId: null, position: 'top-right', size: 0.08, opacity: 0.9 },
    decoration: { set: 'orbs', seed: Math.floor(Math.random() * 1e9), intensity: 1 },
    accents: { a1: '#ff6b3d', a2: '#45d6c8' },
    thumbnail: null,
    exportCount: 0,
  };
}
