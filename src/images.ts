import type { ImageBgState, ImageCategory, Mood } from './types';

/* =========================================================================
   IMAGE BACKGROUND ENGINE — data-driven manifest.
   Adding the 9th / 60th / 500th image = append to IMAGE_BGS. No core changes.
   Bundled assets are remote high-res URLs; user imports become dataURLs.
   ========================================================================= */

export interface ImageBgDef {
  id: string;
  name: string;
  category: ImageCategory;
  tags: string[];
  src: string;
  w: number; h: number;
  dark: boolean;   // hint for text/contrast compatibility
  busy: boolean;   // hint: busy => avoid dense decorations
}

const U = (id: string) => `https://image.qwenlm.ai/generated-images/${id}/_result.png`;

export const IMAGE_BGS: ImageBgDef[] = [
  { id: 'img-silk-navy', name: 'Liquid Silk', category: 'abstract', tags: ['abstract', 'premium', 'dark', 'blue', 'flowing', 'silk'], src: U('34d88f7a-4c8f-42b0-a7a4-cb679385a9f0'), w: 2048, h: 1280, dark: true, busy: false },
  { id: 'img-cream-dim', name: 'Soft Dimensional', category: 'abstract', tags: ['abstract', 'premium', 'light', 'cream', 'minimal', 'soft'], src: U('59b4fb7f-e2f7-4d72-bbc7-bdf8521635c9'), w: 2048, h: 1280, dark: false, busy: false },
  { id: 'img-glass-orbs', name: 'Glass Orbit', category: '3d', tags: ['3d', 'glass', 'dark', 'spheres', 'premium', 'blue'], src: U('2ebe25ca-f0e5-4759-8074-d4ffc8f1946c'), w: 2048, h: 1280, dark: true, busy: true },
  { id: 'img-studio-dark', name: 'Studio Noir', category: 'studio', tags: ['studio', 'dark', 'product', 'minimal', 'premium'], src: U('bc91c15a-1b26-4153-90b6-b2c6b1593596'), w: 2048, h: 1280, dark: true, busy: false },
  { id: 'img-studio-light', name: 'Studio Ivory', category: 'studio', tags: ['studio', 'light', 'product', 'minimal', 'clean'], src: U('185b44aa-535e-4024-8bdf-759698e15838'), w: 2048, h: 1280, dark: false, busy: false },
  { id: 'img-glass-panels', name: 'Frosted Panels', category: 'glass', tags: ['glass', 'translucent', 'cool', 'blue', 'minimal', 'light'], src: U('1575d00e-859e-4b4f-9a72-c0eadfd0d1ab'), w: 2048, h: 1280, dark: false, busy: false },
  { id: 'img-tech-network', name: 'Data Current', category: 'tech', tags: ['tech', 'digital', 'dark', 'blue', 'network', 'saas', 'developer'], src: U('ea461a19-8966-44d7-b02a-0d0a82f8a5aa'), w: 2048, h: 1280, dark: true, busy: true },
  { id: 'img-editorial-paper', name: 'Editorial Paper', category: 'editorial', tags: ['editorial', 'paper', 'warm', 'light', 'creative', 'material'], src: U('3d5fbeaa-0040-4cf8-9fa8-468790581cf9'), w: 2048, h: 1280, dark: false, busy: false },
];

export const IMAGE_CATEGORIES: { id: ImageCategory | 'all'; label: string }[] = [
  { id: 'all', label: 'All' }, { id: 'abstract', label: 'Abstract' }, { id: '3d', label: '3D' },
  { id: 'studio', label: 'Studio' }, { id: 'glass', label: 'Glass' }, { id: 'tech', label: 'Tech' },
  { id: 'editorial', label: 'Editorial' }, { id: 'paper', label: 'Paper' }, { id: 'custom', label: 'My Images' },
];

/* ---------------- defaults & normalization ---------------- */
export const DEFAULT_IMAGE_BG: ImageBgState = {
  kind: 'procedural', imageId: null, customSrc: null,
  fit: 'cover', x: 0, y: 0, scale: 1, rotation: 0, opacity: 1,
  brightness: 1, contrast: 1, saturation: 1, blur: 0, hue: 0,
  colorFilter: 'original', tint: null, tintOpacity: 0,
  overlay: 'vignette', overlayColor: '#000000', overlayOpacity: 0.28,
  blend: 'source-over', mask: 'none',
};
export function imgOf(b: { kind?: string; image?: Partial<ImageBgState> }): ImageBgState {
  return { ...DEFAULT_IMAGE_BG, ...(b.image || {}), kind: (b.kind || (b.image?.kind) || 'procedural') as ImageBgState['kind'] };
}

/* ---------------- mood → category mapping ---------------- */
export const MOOD_TO_IMAGE_CATS: Record<Mood, ImageCategory[]> = {
  auto: ['abstract', 'studio', '3d', 'glass', 'tech', 'editorial'],
  minimal: ['studio', 'abstract'],
  premium: ['studio', 'glass', '3d', 'abstract'],
  creative: ['editorial', 'abstract', 'paper'],
  developer: ['tech', 'abstract'],
  dark: ['studio', 'tech', '3d', 'abstract'],
  light: ['studio', 'abstract', 'glass', 'editorial'],
  editorial: ['editorial', 'paper', 'abstract'],
  bold: ['abstract', '3d'],
  elegant: ['studio', 'glass'],
  futuristic: ['3d', 'glass', 'tech'],
  playful: ['abstract', 'glass'],
  corporate: ['studio', 'abstract'],
};

/* ---------------- image loader with in-memory cache ---------------- */
const elCache = new Map<string, HTMLImageElement>();
export function loadImageEl(src: string): Promise<HTMLImageElement> {
  const hit = elCache.get(src);
  if (hit && hit.complete && hit.naturalWidth) return Promise.resolve(hit);
  return new Promise((resolve, reject) => {
    const img = new Image();
    if (/^https?:/.test(src)) img.crossOrigin = 'anonymous';
    const t = setTimeout(() => reject(new Error('image load timeout')), 12000);
    img.onload = () => { clearTimeout(t); elCache.set(src, img); resolve(img); };
    img.onerror = () => { clearTimeout(t); reject(new Error('image load failed')); };
    img.src = src;
  });
}

/* resolve a background image source from state (bundled def or custom) */
export function resolveImageSrc(b: ImageBgState): string | null {
  if (b.customSrc) return b.customSrc;
  if (b.imageId) {
    const def = IMAGE_BGS.find(d => d.id === b.imageId);
    return def ? def.src : null;
  }
  return null;
}

export function imageDefOf(b: ImageBgState): ImageBgDef | null {
  return b.imageId ? IMAGE_BGS.find(d => d.id === b.imageId) ?? null : null;
}

/* ---------------- thumbnail generator (library perf) ---------------- */
export async function imageThumb(src: string, maxW = 320): Promise<string> {
  const img = await loadImageEl(src);
  const sc = Math.min(1, maxW / img.naturalWidth);
  const c = document.createElement('canvas');
  c.width = Math.round(img.naturalWidth * sc);
  c.height = Math.round(img.naturalHeight * sc);
  c.getContext('2d')!.drawImage(img, 0, 0, c.width, c.height);
  return c.toDataURL('image/jpeg', 0.8);
}
