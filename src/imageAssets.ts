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
  // CATEGORY A: Abstract Premium (3 images)
  {
    id: 'abs-premium-01',
    name: 'Warm Dimensional',
    category: 'abstract',
    tags: ['warm', 'premium', 'minimal', 'cream', 'soft'],
    src: 'https://image.qwenlm.ai/generated-images/201e7b84-86f8-480d-a30c-39ccb28fcc0b/_result.png',
    width: 2048,
    height: 2048,
    dark: false,
    busy: false,
    mood: ['premium', 'minimal', 'elegant'],
  },
  {
    id: 'abs-premium-02',
    name: 'Vibrant Creative',
    category: 'abstract',
    tags: ['vibrant', 'creative', 'bold', 'purple', 'orange'],
    src: 'https://image.qwenlm.ai/generated-images/16ba7855-0cb9-4ee4-a596-4c5814c4cb18/_result.png',
    width: 2048,
    height: 2048,
    dark: false,
    busy: false,
    mood: ['creative', 'bold'],
  },
  {
    id: 'abs-premium-03',
    name: 'Nature Organic',
    category: 'abstract',
    tags: ['nature', 'organic', 'sage', 'green', 'calm'],
    src: 'https://image.qwenlm.ai/generated-images/93afa216-3b76-4f2b-9b73-f2efda5647d2/_result.png',
    width: 2048,
    height: 2048,
    dark: false,
    busy: false,
    mood: ['minimal', 'elegant'],
  },

  // CATEGORY B: 3D Abstract (2 images)
  {
    id: '3d-glass-01',
    name: '3D Glass Objects',
    category: '3d',
    tags: ['glass', '3d', 'translucent', 'blue', 'silver'],
    src: 'https://image.qwenlm.ai/generated-images/84278cc1-d790-4bb6-8776-dc04b2785329/_result.png',
    width: 2048,
    height: 2048,
    dark: true,
    busy: false,
    mood: ['premium', 'futuristic'],
  },
  {
    id: '3d-metallic-01',
    name: 'Dark Luxury',
    category: '3d',
    tags: ['dark', 'luxury', 'metallic', 'black', 'gold'],
    src: 'https://image.qwenlm.ai/generated-images/4cb466d9-7c20-4388-add8-2ef7bf95cd77/_result.png',
    width: 2048,
    height: 2048,
    dark: true,
    busy: false,
    mood: ['premium', 'luxury', 'dark'],
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
    name: 'Premium Studio',
    category: 'studio',
    tags: ['studio', 'product', 'clean', 'white', 'minimal'],
    src: 'https://image.qwenlm.ai/generated-images/712a3865-92b6-4c9b-8255-a482709eeab9/_result.png',
    width: 2048,
    height: 2048,
    dark: false,
    busy: false,
    mood: ['premium', 'minimal'],
  },

  // CATEGORY D: Architectural
  {
    id: 'arch-concrete-01',
    name: 'Architectural Modern',
    category: 'architectural',
    tags: ['concrete', 'modern', 'minimal', 'neutral', 'geometric'],
    src: 'https://image.qwenlm.ai/generated-images/4f9be771-77fc-4c7d-b398-a2b72842a0e5/_result.png',
    width: 2048,
    height: 2048,
    dark: false,
    busy: false,
    mood: ['corporate', 'minimal'],
  },

  // CATEGORY E: Glass
  {
    id: 'glass-panels-01',
    name: 'Glass Translucent',
    category: 'glass',
    tags: ['glass', 'frosted', 'translucent', 'cool', 'blue'],
    src: 'https://image.qwenlm.ai/generated-images/7977fae9-11aa-46ef-b006-b95036a7f837/_result.png',
    width: 2048,
    height: 2048,
    dark: false,
    busy: false,
    mood: ['premium', 'futuristic'],
  },

  // CATEGORY F: Paper/Material
  {
    id: 'paper-folded-01',
    name: 'Material Texture',
    category: 'paper',
    tags: ['paper', 'texture', 'editorial', 'warm', 'tactile'],
    src: 'https://image.qwenlm.ai/generated-images/321033be-ec4f-496b-806e-372629e05b7b/_result.png',
    width: 2048,
    height: 2048,
    dark: false,
    busy: false,
    mood: ['editorial', 'minimal'],
  },

  // CATEGORY G: Tech/Digital
  {
    id: 'tech-network-01',
    name: 'Tech Digital',
    category: 'tech',
    tags: ['tech', 'network', 'data', 'developer', 'navy', 'cyan'],
    src: 'https://image.qwenlm.ai/generated-images/6439bf1a-7951-48be-92fb-684f57845689/_result.png',
    width: 2048,
    height: 2048,
    dark: true,
    busy: false,
    mood: ['developer', 'futuristic'],
  },

  // CATEGORY H: Editorial (1 image)
  {
    id: 'editorial-asym-01',
    name: 'Editorial Modern',
    category: 'editorial',
    tags: ['editorial', 'asymmetric', 'modern', 'creative', 'cream', 'charcoal'],
    src: 'https://image.qwenlm.ai/generated-images/11db5e1d-7e9a-4fe4-b97d-8a6ae7d2efb2/_result.png',
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
