import type { ImageCategory } from './types';

export interface ImageAsset {
  id: string;
  name: string;
  category: ImageCategory;
  tags: string[];
  src: string; // URL or data URL
  thumbnail?: string;
  width: number;
  height: number;
  dark: boolean;
  busy: boolean;
  mood: string[];
}

/* =========================================================================
   IMAGE ASSET LIBRARY
   Data-driven registry. Add new images by appending to IMAGE_ASSETS array.
   Supports URLs, data URLs, and custom imports.
   ========================================================================= */

export const IMAGE_ASSETS: ImageAsset[] = [
  // CATEGORY A: Abstract Premium
  {
    id: 'abs-premium-01',
    name: 'Warm Dimensional',
    category: 'abstract',
    tags: ['warm', 'premium', 'minimal', 'cream'],
    src: '', // Placeholder - add actual image URL
    width: 2048,
    height: 2048,
    dark: false,
    busy: false,
    mood: ['premium', 'minimal', 'elegant'],
  },
  {
    id: 'abs-premium-02',
    name: 'Soft Flow',
    category: 'abstract',
    tags: ['soft', 'flowing', 'premium', 'light'],
    src: '',
    width: 2048,
    height: 2048,
    dark: false,
    busy: false,
    mood: ['premium', 'elegant'],
  },
  {
    id: 'abs-premium-03',
    name: 'Layered Depth',
    category: 'abstract',
    tags: ['layered', 'depth', 'premium', 'dark'],
    src: '',
    width: 2048,
    height: 2048,
    dark: true,
    busy: false,
    mood: ['premium', 'dark'],
  },

  // CATEGORY B: 3D Abstract
  {
    id: '3d-glass-01',
    name: 'Glass Spheres',
    category: '3d',
    tags: ['glass', 'spheres', 'translucent', 'premium'],
    src: '',
    width: 2048,
    height: 2048,
    dark: true,
    busy: true,
    mood: ['premium', 'futuristic'],
  },
  {
    id: '3d-metallic-01',
    name: 'Metallic Curves',
    category: '3d',
    tags: ['metallic', 'curves', 'premium', 'dark'],
    src: '',
    width: 2048,
    height: 2048,
    dark: true,
    busy: false,
    mood: ['premium', 'futuristic'],
  },
  {
    id: '3d-ceramic-01',
    name: 'Ceramic Forms',
    category: '3d',
    tags: ['ceramic', 'smooth', 'premium', 'light'],
    src: '',
    width: 2048,
    height: 2048,
    dark: false,
    busy: false,
    mood: ['premium', 'elegant'],
  },

  // CATEGORY C: Studio
  {
    id: 'studio-dark-01',
    name: 'Dark Studio',
    category: 'studio',
    tags: ['studio', 'dark', 'product', 'premium'],
    src: '',
    width: 2048,
    height: 2048,
    dark: true,
    busy: false,
    mood: ['premium', 'dark', 'luxury'],
  },
  {
    id: 'studio-light-01',
    name: 'Light Studio',
    category: 'studio',
    tags: ['studio', 'light', 'product', 'clean'],
    src: '',
    width: 2048,
    height: 2048,
    dark: false,
    busy: false,
    mood: ['premium', 'minimal'],
  },

  // CATEGORY D: Architectural
  {
    id: 'arch-concrete-01',
    name: 'Concrete Modern',
    category: 'architectural',
    tags: ['concrete', 'modern', 'minimal', 'neutral'],
    src: '',
    width: 2048,
    height: 2048,
    dark: false,
    busy: false,
    mood: ['corporate', 'minimal'],
  },
  {
    id: 'arch-geometric-01',
    name: 'Geometric Platforms',
    category: 'architectural',
    tags: ['geometric', 'platforms', 'modern', 'dark'],
    src: '',
    width: 2048,
    height: 2048,
    dark: true,
    busy: false,
    mood: ['corporate', 'futuristic'],
  },

  // CATEGORY E: Glass
  {
    id: 'glass-panels-01',
    name: 'Frosted Panels',
    category: 'glass',
    tags: ['glass', 'frosted', 'translucent', 'cool'],
    src: '',
    width: 2048,
    height: 2048,
    dark: false,
    busy: false,
    mood: ['premium', 'futuristic'],
  },
  {
    id: 'glass-rings-01',
    name: 'Glass Rings',
    category: 'glass',
    tags: ['glass', 'rings', 'dimensional', 'premium'],
    src: '',
    width: 2048,
    height: 2048,
    dark: true,
    busy: false,
    mood: ['premium', 'luxury'],
  },

  // CATEGORY F: Paper/Material
  {
    id: 'paper-folded-01',
    name: 'Folded Paper',
    category: 'paper',
    tags: ['paper', 'folded', 'texture', 'editorial'],
    src: '',
    width: 2048,
    height: 2048,
    dark: false,
    busy: false,
    mood: ['editorial', 'minimal'],
  },

  // CATEGORY G: Tech/Digital
  {
    id: 'tech-network-01',
    name: 'Data Network',
    category: 'tech',
    tags: ['tech', 'network', 'data', 'developer'],
    src: '',
    width: 2048,
    height: 2048,
    dark: true,
    busy: true,
    mood: ['developer', 'futuristic'],
  },
  {
    id: 'tech-grid-01',
    name: 'Digital Grid',
    category: 'tech',
    tags: ['tech', 'grid', 'digital', 'developer'],
    src: '',
    width: 2048,
    height: 2048,
    dark: true,
    busy: false,
    mood: ['developer', 'technical'],
  },

  // CATEGORY H: Editorial
  {
    id: 'editorial-asym-01',
    name: 'Asymmetric Editorial',
    category: 'editorial',
    tags: ['editorial', 'asymmetric', 'modern', 'creative'],
    src: '',
    width: 2048,
    height: 2048,
    dark: false,
    busy: false,
    mood: ['editorial', 'creative'],
  },
];

export const IMAGE_CATEGORIES: { id: ImageCategory | 'all'; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'abstract', label: 'Abstract' },
  { id: '3d', label: '3D' },
  { id: 'studio', label: 'Studio' },
  { id: 'architectural', label: 'Architectural' },
  { id: 'glass', label: 'Glass' },
  { id: 'paper', label: 'Paper' },
  { id: 'tech', label: 'Tech' },
  { id: 'editorial', label: 'Editorial' },
];

export function findImage(id: string): ImageAsset | undefined {
  return IMAGE_ASSETS.find(a => a.id === id);
}

export function searchImages(query: string, category?: ImageCategory | 'all'): ImageAsset[] {
  let list = IMAGE_ASSETS;
  if (category && category !== 'all') {
    list = list.filter(a => a.category === category);
  }
  if (!query.trim()) return list;
  
  const q = query.toLowerCase();
  return list.filter(a =>
    a.name.toLowerCase().includes(q) ||
    a.tags.some(t => t.includes(q)) ||
    a.category.includes(q) ||
    a.mood.some(m => m.includes(q))
  );
}

export function getRandomImage(mood?: string): ImageAsset | null {
  let pool = IMAGE_ASSETS.filter(a => a.src); // Only images with actual sources
  if (mood) {
    const moodFiltered = pool.filter(a => a.mood.includes(mood));
    if (moodFiltered.length > 0) pool = moodFiltered;
  }
  if (pool.length === 0) return null;
  return pool[Math.floor(Math.random() * pool.length)];
}

export function getCompatibleImage(composition: { dark: boolean; busy: boolean }, mood?: string): ImageAsset | null {
  let pool = IMAGE_ASSETS.filter(a => a.src);
  
  // Filter by compatibility
  pool = pool.filter(a => {
    if (composition.dark && !a.dark) return false;
    if (!composition.dark && a.dark) return false;
    if (composition.busy && a.busy) return false;
    return true;
  });
  
  if (mood) {
    const moodFiltered = pool.filter(a => a.mood.includes(mood));
    if (moodFiltered.length > 0) pool = moodFiltered;
  }
  
  if (pool.length === 0) return null;
  return pool[Math.floor(Math.random() * pool.length)];
}
