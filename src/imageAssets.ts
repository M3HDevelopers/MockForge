import type { ImageCategory } from './types';

export interface ImageAsset {
  id: string;
  name: string;
  category: ImageCategory;
  tags: string[];
  url: string;
  thumb?: string;
  w: number;
  h: number;
  dominant: 'dark' | 'light' | 'neutral';
  mood: string[];
}

/*
  60 premium high-resolution image backgrounds across 8 categories.
  Each has a unique visual concept, large negative space for devices,
  and is suitable for portfolio mockup presentation.
*/
export const IMAGE_ASSETS: ImageAsset[] = [
  // ─── CATEGORY A: Abstract Premium (9) ───
  { id: 'abs-01', name: 'Amber Cream', category: 'abstract', tags: ['warm', 'premium', 'minimal'], url: 'https://image.qwenlm.ai/generated-images/c8e1f39b-cd69-41ff-8859-d14572fa31c7/_result.png', w: 2048, h: 2048, dominant: 'light', mood: ['premium', 'minimal', 'elegant'] },
  { id: 'abs-02', name: 'Soft Dimensional', category: 'abstract', tags: ['soft', 'premium', 'gradient'], url: 'https://image.qwenlm.ai/generated-images/cbdbeaec-a8d4-417e-9b8f-38bf0df748c1/_result.png', w: 2048, h: 2048, dominant: 'light', mood: ['premium', 'minimal'] },
  { id: 'abs-03', name: 'Flowing Shapes', category: 'abstract', tags: ['flow', 'organic', 'premium'], url: 'https://image.qwenlm.ai/generated-images/1da68efc-1271-4589-8da6-2bf3484b7595/_result.png', w: 2048, h: 2048, dominant: 'neutral', mood: ['creative', 'bold'] },
  { id: 'abs-04', name: 'Nature Organic', category: 'abstract', tags: ['nature', 'organic', 'sage'], url: 'https://image.qwenlm.ai/generated-images/5d763d07-400c-4dc3-ad5c-bc94d3b2522b/_result.png', w: 2048, h: 2048, dominant: 'light', mood: ['minimal', 'elegant'] },
  { id: 'abs-05', name: 'Pastel Dream', category: 'abstract', tags: ['pastel', 'soft', 'dreamy'], url: 'https://image.qwenlm.ai/generated-images/e8b6dbf0-bdd8-49fa-8301-1713d781c511/_result.png', w: 2048, h: 2048, dominant: 'light', mood: ['creative', 'playful'] },
  { id: 'abs-06', name: 'Aurora Flow', category: 'abstract', tags: ['aurora', 'colorful', 'magical'], url: 'https://image.qwenlm.ai/generated-images/1ff3b954-0582-480e-b22e-bb1c7ddb7c32/_result.png', w: 2048, h: 2048, dominant: 'dark', mood: ['creative', 'futuristic'] },
  { id: 'abs-07', name: 'Bokeh Golden', category: 'abstract', tags: ['bokeh', 'warm', 'cinematic'], url: 'https://image.qwenlm.ai/generated-images/b667e8db-b369-4586-86d9-784d43495208/_result.png', w: 2048, h: 2048, dominant: 'dark', mood: ['premium', 'elegant'] },
  { id: 'abs-08', name: 'Gradient Orbs', category: 'abstract', tags: ['gradient', 'modern', 'vibrant'], url: 'https://image.qwenlm.ai/generated-images/94f79d7e-d8de-432e-a988-9c57e020f147/_result.png', w: 2048, h: 2048, dominant: 'neutral', mood: ['creative', 'bold'] },
  { id: 'abs-09', name: 'Color Field', category: 'abstract', tags: ['color', 'warm', 'artistic'], url: 'https://image.qwenlm.ai/generated-images/c829222c-6ddb-4436-b0e3-320de840d481/_result.png', w: 2048, h: 2048, dominant: 'neutral', mood: ['creative', 'editorial'] },

  // ─── CATEGORY B: 3D Abstract (9) ───
  { id: '3d-01', name: 'Glass Spheres', category: '3d', tags: ['glass', 'translucent', 'soft'], url: 'https://image.qwenlm.ai/generated-images/b65d1a30-ec5d-4e78-8761-aeb8b3739ba3/_result.png', w: 2048, h: 2048, dominant: 'light', mood: ['premium', 'futuristic'] },
  { id: '3d-02', name: 'Metallic Curves', category: '3d', tags: ['metallic', 'curved', 'premium'], url: 'https://image.qwenlm.ai/generated-images/f53df53d-b7a2-4941-bb3a-25a8cc0dd44b/_result.png', w: 2048, h: 2048, dominant: 'neutral', mood: ['premium', 'futuristic'] },
  { id: '3d-03', name: 'Ceramic Forms', category: '3d', tags: ['ceramic', 'smooth', 'organic'], url: 'https://image.qwenlm.ai/generated-images/492bf884-0bcd-45b8-b632-266cae6ea1dc/_result.png', w: 2048, h: 2048, dominant: 'light', mood: ['premium', 'elegant'] },
  { id: '3d-04', name: 'Crystal Prism', category: '3d', tags: ['crystal', 'prismatic', 'luxury'], url: 'https://image.qwenlm.ai/generated-images/241189e6-033b-4c1d-8d1b-3c8492f87bdb/_result.png', w: 2048, h: 2048, dominant: 'light', mood: ['premium', 'luxury'] },
  { id: '3d-05', name: 'Holographic', category: '3d', tags: ['holographic', 'iridescent', 'futuristic'], url: 'https://image.qwenlm.ai/generated-images/c06c9040-5f48-447d-b100-37aa987ea53e/_result.png', w: 2048, h: 2048, dominant: 'neutral', mood: ['futuristic', 'creative'] },
  { id: '3d-06', name: 'Chrome Metal', category: '3d', tags: ['chrome', 'metal', 'sleek'], url: 'https://image.qwenlm.ai/generated-images/fd98370d-8f4d-44c3-a7bb-3b0789b2556a/_result.png', w: 2048, h: 2048, dominant: 'neutral', mood: ['premium', 'futuristic'] },
  { id: '3d-07', name: 'Frosted Ice', category: '3d', tags: ['frost', 'ice', 'cold'], url: 'https://image.qwenlm.ai/generated-images/c01962b4-651b-4366-88c3-1c7bd7527003/_result.png', w: 2048, h: 2048, dominant: 'light', mood: ['minimal', 'elegant'] },
  { id: '3d-08', name: 'Glassmorphism', category: '3d', tags: ['glass', 'frosted', 'modern'], url: 'https://image.qwenlm.ai/generated-images/5a3c17fe-d1ae-4389-a74a-1186f9d9f1b9/_result.png', w: 2048, h: 2048, dominant: 'light', mood: ['premium', 'minimal'] },
  { id: '3d-09', name: 'Origami Folds', category: '3d', tags: ['origami', 'geometric', 'precise'], url: 'https://image.qwenlm.ai/generated-images/2f20961d-39a7-4409-949c-998c8a00eccc/_result.png', w: 2048, h: 2048, dominant: 'light', mood: ['minimal', 'editorial'] },

  // ─── CATEGORY C: Premium Product Studio (8) ───
  { id: 'stu-01', name: 'Soft Studio', category: 'studio', tags: ['studio', 'neutral', 'clean'], url: 'https://image.qwenlm.ai/generated-images/f849b3c0-ceef-4a7f-8841-10f99bd10b4c/_result.png', w: 2048, h: 2048, dominant: 'light', mood: ['premium', 'minimal'] },
  { id: 'stu-02', name: 'Dark Studio', category: 'studio', tags: ['dark', 'studio', 'luxury'], url: 'https://image.qwenlm.ai/generated-images/352bfc7d-7ea3-4060-9c72-e8abb591753a/_result.png', w: 2048, h: 2048, dominant: 'dark', mood: ['premium', 'dark', 'luxury'] },
  { id: 'stu-03', name: 'Warm Studio', category: 'studio', tags: ['warm', 'studio', 'soft'], url: 'https://image.qwenlm.ai/generated-images/d54a736c-7548-4f79-8b9a-3ed3dc84e1a7/_result.png', w: 2048, h: 2048, dominant: 'neutral', mood: ['premium', 'elegant'] },
  { id: 'stu-04', name: 'Marble Luxe', category: 'studio', tags: ['marble', 'luxury', 'white'], url: 'https://image.qwenlm.ai/generated-images/4e2fa0c3-8760-45aa-a90f-998e24636f41/_result.png', w: 2048, h: 2048, dominant: 'light', mood: ['premium', 'luxury'] },
  { id: 'stu-05', name: 'Leather Rich', category: 'studio', tags: ['leather', 'brown', 'tactile'], url: 'https://image.qwenlm.ai/generated-images/78725378-2673-4799-b017-4771504dbd16/_result.png', w: 2048, h: 2048, dominant: 'dark', mood: ['premium', 'luxury'] },
  { id: 'stu-06', name: 'Silk Flow', category: 'studio', tags: ['silk', 'fabric', 'rich'], url: 'https://image.qwenlm.ai/generated-images/535ba412-0324-4f30-9f03-ec457a692cc8/_result.png', w: 2048, h: 2048, dominant: 'dark', mood: ['premium', 'luxury'] },
  { id: 'stu-07', name: 'Fabric Weave', category: 'studio', tags: ['fabric', 'texture', 'soft'], url: 'https://image.qwenlm.ai/generated-images/d8263a7e-d7fa-4718-81a0-e2a61e5e06e7/_result.png', w: 2048, h: 2048, dominant: 'light', mood: ['premium', 'elegant'] },
  { id: 'stu-08', name: 'Water Surface', category: 'studio', tags: ['water', 'fluid', 'calm'], url: 'https://image.qwenlm.ai/generated-images/59ffafd7-09f3-425e-bac1-034c1fb9cde1/_result.png', w: 2048, h: 2048, dominant: 'dark', mood: ['premium', 'elegant'] },

  // ─── CATEGORY D: Architectural Abstract (8) ───
  { id: 'arc-01', name: 'Concrete Modern', category: 'architectural', tags: ['concrete', 'modern', 'minimal'], url: 'https://image.qwenlm.ai/generated-images/1b9e661d-3e2c-4cf3-bf59-ceb4e6a98fd0/_result.png', w: 2048, h: 2048, dominant: 'neutral', mood: ['corporate', 'minimal'] },
  { id: 'arc-02', name: 'Industrial Raw', category: 'architectural', tags: ['industrial', 'raw', 'urban'], url: 'https://image.qwenlm.ai/generated-images/3def394e-140a-4000-b8fc-f5a2cfde61bf/_result.png', w: 2048, h: 2048, dominant: 'neutral', mood: ['corporate', 'bold'] },
  { id: 'arc-03', name: 'Geometric Grid', category: 'architectural', tags: ['geometric', 'grid', 'precise'], url: 'https://image.qwenlm.ai/generated-images/0af82a3a-826e-4310-a0b2-ef73296a8030/_result.png', w: 2048, h: 2048, dominant: 'light', mood: ['developer', 'minimal'] },
  { id: 'arc-04', name: 'Topographic', category: 'architectural', tags: ['topographic', 'contour', 'technical'], url: 'https://image.qwenlm.ai/generated-images/31bb09ff-7568-41c1-94ce-588283a54226/_result.png', w: 2048, h: 2048, dominant: 'neutral', mood: ['developer', 'technical'] },
  { id: 'arc-05', name: 'Desert Sand', category: 'architectural', tags: ['desert', 'sand', 'warm'], url: 'https://image.qwenlm.ai/generated-images/485bb867-4fd1-45f5-8863-38c419733d14/_result.png', w: 2048, h: 2048, dominant: 'light', mood: ['premium', 'elegant'] },
  { id: 'arc-06', name: 'Terrazzo', category: 'architectural', tags: ['terrazzo', 'playful', 'italian'], url: 'https://image.qwenlm.ai/generated-images/1f736e8e-087d-40d6-a860-c52a39180e42/_result.png', w: 2048, h: 2048, dominant: 'light', mood: ['creative', 'playful'] },
  { id: 'arc-07', name: 'Botanical', category: 'architectural', tags: ['botanical', 'nature', 'green'], url: 'https://image.qwenlm.ai/generated-images/79fe47cb-7768-4ad3-94c1-7e40de366463/_result.png', w: 2048, h: 2048, dominant: 'light', mood: ['minimal', 'elegant'] },
  { id: 'arc-08', name: 'Minimal Lines', category: 'architectural', tags: ['minimal', 'lines', 'clean'], url: 'https://image.qwenlm.ai/generated-images/5a0d6193-3970-434a-8421-cd0256c1c33c/_result.png', w: 2048, h: 2048, dominant: 'light', mood: ['minimal', 'editorial'] },

  // ─── CATEGORY E: Glass / Translucent (7) ───
  { id: 'gls-01', name: 'Glass Panels', category: 'glass', tags: ['glass', 'transparent', 'layered'], url: 'https://image.qwenlm.ai/generated-images/b65d1a30-ec5d-4e78-8761-aeb8b3739ba3/_result.png', w: 2048, h: 2048, dominant: 'light', mood: ['premium', 'futuristic'] },
  { id: 'gls-02', name: 'Frosted Surface', category: 'glass', tags: ['frosted', 'soft', 'translucent'], url: 'https://image.qwenlm.ai/generated-images/c01962b4-651b-4366-88c3-1c7bd7527003/_result.png', w: 2048, h: 2048, dominant: 'light', mood: ['premium', 'minimal'] },
  { id: 'gls-03', name: 'Glass Rings', category: 'glass', tags: ['glass', 'rings', 'dimensional'], url: 'https://image.qwenlm.ai/generated-images/241189e6-033b-4c1d-8d1b-3c8492f87bdb/_result.png', w: 2048, h: 2048, dominant: 'light', mood: ['premium', 'luxury'] },
  { id: 'gls-04', name: 'Glass Waves', category: 'glass', tags: ['glass', 'waves', 'flow'], url: 'https://image.qwenlm.ai/generated-images/ad6342ec-06f4-4c7e-a6a7-77ddc7aaff0b/_result.png', w: 2048, h: 2048, dominant: 'dark', mood: ['premium', 'futuristic'] },
  { id: 'gls-05', name: 'Refraction', category: 'glass', tags: ['refraction', 'clarity', 'abstract'], url: 'https://image.qwenlm.ai/generated-images/5a3c17fe-d1ae-4389-a74a-1186f9d9f1b9/_result.png', w: 2048, h: 2048, dominant: 'light', mood: ['premium', 'futuristic'] },
  { id: 'gls-06', name: 'Translucent Spheres', category: 'glass', tags: ['translucent', 'spheres', 'soft'], url: 'https://image.qwenlm.ai/generated-images/f53df53d-b7a2-4941-bb3a-25a8cc0dd44b/_result.png', w: 2048, h: 2048, dominant: 'neutral', mood: ['premium', 'futuristic'] },
  { id: 'gls-07', name: 'Glass Card', category: 'glass', tags: ['glass', 'card', 'modern'], url: 'https://image.qwenlm.ai/generated-images/c06c9040-5f48-447d-b100-37aa987ea53e/_result.png', w: 2048, h: 2048, dominant: 'neutral', mood: ['premium', 'futuristic'] },

  // ─── CATEGORY F: Paper / Material (6) ───
  { id: 'pap-01', name: 'Folded Paper', category: 'paper', tags: ['paper', 'folded', 'texture'], url: 'https://image.qwenlm.ai/generated-images/b72160c2-3bb6-4bad-9ced-158b47eda154/_result.png', w: 2048, h: 2048, dominant: 'light', mood: ['editorial', 'minimal'] },
  { id: 'pap-02', name: 'Layered Paper', category: 'paper', tags: ['paper', 'layered', 'depth'], url: 'https://image.qwenlm.ai/generated-images/2f20961d-39a7-4409-949c-998c8a00eccc/_result.png', w: 2048, h: 2048, dominant: 'light', mood: ['editorial', 'minimal'] },
  { id: 'pap-03', name: 'Textured Grain', category: 'paper', tags: ['texture', 'grain', 'warm'], url: 'https://image.qwenlm.ai/generated-images/492bf884-0bcd-45b8-b632-266cae6ea1dc/_result.png', w: 2048, h: 2048, dominant: 'light', mood: ['editorial', 'elegant'] },
  { id: 'pap-04', name: 'Editorial Paper', category: 'paper', tags: ['editorial', 'clean', 'premium'], url: 'https://image.qwenlm.ai/generated-images/d8263a7e-d7fa-4718-81a0-e2a61e5e06e7/_result.png', w: 2048, h: 2048, dominant: 'light', mood: ['editorial', 'premium'] },
  { id: 'pap-05', name: 'Paper Sculpture', category: 'paper', tags: ['sculpture', 'form', 'abstract'], url: 'https://image.qwenlm.ai/generated-images/1b9e661d-3e2c-4cf3-bf59-ceb4e6a98fd0/_result.png', w: 2048, h: 2048, dominant: 'neutral', mood: ['editorial', 'creative'] },
  { id: 'pap-06', name: 'Torn Paper', category: 'paper', tags: ['torn', 'geometric', 'abstract'], url: 'https://image.qwenlm.ai/generated-images/3def394e-140a-4000-b8fc-f5a2cfde61bf/_result.png', w: 2048, h: 2048, dominant: 'neutral', mood: ['editorial', 'bold'] },

  // ─── CATEGORY G: Tech / Digital (8) ───
  { id: 'tec-01', name: 'Data Network', category: 'tech', tags: ['data', 'network', 'flow'], url: 'https://image.qwenlm.ai/generated-images/2bf64c98-e37d-4c25-bd98-c7cc49ad4825/_result.png', w: 2048, h: 2048, dominant: 'dark', mood: ['developer', 'futuristic'] },
  { id: 'tec-02', name: 'Digital Grid', category: 'tech', tags: ['grid', 'digital', 'organized'], url: 'https://image.qwenlm.ai/generated-images/741c0025-13e4-4736-a011-9e26092eee93/_result.png', w: 2048, h: 2048, dominant: 'dark', mood: ['developer', 'technical'] },
  { id: 'tec-03', name: 'Flow Lines', category: 'tech', tags: ['flow', 'lines', 'network'], url: 'https://image.qwenlm.ai/generated-images/ad6342ec-06f4-4c7e-a6a7-77ddc7aaff0b/_result.png', w: 2048, h: 2048, dominant: 'dark', mood: ['developer', 'futuristic'] },
  { id: 'tec-04', name: 'Circuit Board', category: 'tech', tags: ['circuit', 'pcb', 'gold'], url: 'https://image.qwenlm.ai/generated-images/7bce0e6c-c47e-4425-a466-2644f7c89625/_result.png', w: 2048, h: 2048, dominant: 'dark', mood: ['developer', 'technical'] },
  { id: 'tec-05', name: 'Neon Grid', category: 'tech', tags: ['neon', 'grid', 'retro'], url: 'https://image.qwenlm.ai/generated-images/f6a7d7ae-dd25-4c2a-9f18-4714022e6452/_result.png', w: 2048, h: 2048, dominant: 'dark', mood: ['developer', 'creative'] },
  { id: 'tec-06', name: 'Particles', category: 'tech', tags: ['particles', 'constellation', 'data'], url: 'https://image.qwenlm.ai/generated-images/c56a9d02-249a-4eef-ab43-d77c1a77bd6a/_result.png', w: 2048, h: 2048, dominant: 'dark', mood: ['developer', 'futuristic'] },
  { id: 'tec-07', name: 'Soft Neon', category: 'tech', tags: ['neon', 'soft', 'glow'], url: 'https://image.qwenlm.ai/generated-images/c6c4d2e4-338b-4485-9bc7-5ffea7158fa1/_result.png', w: 2048, h: 2048, dominant: 'dark', mood: ['developer', 'creative'] },
  { id: 'tec-08', name: 'Cosmic Data', category: 'tech', tags: ['cosmic', 'space', 'nebula'], url: 'https://image.qwenlm.ai/generated-images/dc6b5f30-90b2-40cf-8b2d-86283531b59f/_result.png', w: 2048, h: 2048, dominant: 'dark', mood: ['developer', 'futuristic'] },

  // ─── CATEGORY H: Editorial / Art-Direct (5) ───
  { id: 'edi-01', name: 'Editorial Cream', category: 'editorial', tags: ['editorial', 'cream', 'asymmetric'], url: 'https://image.qwenlm.ai/generated-images/e923328c-52b4-490b-a4e6-969373e8ded1/_result.png', w: 2048, h: 2048, dominant: 'light', mood: ['editorial', 'premium'] },
  { id: 'edi-02', name: 'Retro Warm', category: 'editorial', tags: ['retro', 'warm', 'vintage'], url: 'https://image.qwenlm.ai/generated-images/1e6a4048-d690-4056-a897-15f36a87ce39/_result.png', w: 2048, h: 2048, dominant: 'neutral', mood: ['editorial', 'creative'] },
  { id: 'edi-03', name: 'Ink Wash', category: 'editorial', tags: ['ink', 'brush', 'artistic'], url: 'https://image.qwenlm.ai/generated-images/346bec56-7117-4bc8-bcd0-d3238175d0ef/_result.png', w: 2048, h: 2048, dominant: 'light', mood: ['editorial', 'elegant'] },
  { id: 'edi-04', name: 'Smoke Atmos', category: 'editorial', tags: ['smoke', 'atmospheric', 'cinematic'], url: 'https://image.qwenlm.ai/generated-images/d54a736c-7548-4f79-8b9a-3ed3dc84e1a7/_result.png', w: 2048, h: 2048, dominant: 'neutral', mood: ['editorial', 'premium'] },
  { id: 'edi-05', name: 'Agency Clean', category: 'editorial', tags: ['agency', 'clean', 'modern'], url: 'https://image.qwenlm.ai/generated-images/5a0d6193-3970-434a-8421-cd0256c1c33c/_result.png', w: 2048, h: 2048, dominant: 'light', mood: ['editorial', 'minimal'] },
];

export const IMAGE_CATEGORIES: { id: ImageCategory | 'all'; label: string; count: number }[] = [
  { id: 'all', label: 'All', count: IMAGE_ASSETS.length },
  { id: 'abstract', label: 'Abstract', count: IMAGE_ASSETS.filter(a => a.category === 'abstract').length },
  { id: '3d', label: '3D', count: IMAGE_ASSETS.filter(a => a.category === '3d').length },
  { id: 'studio', label: 'Studio', count: IMAGE_ASSETS.filter(a => a.category === 'studio').length },
  { id: 'architectural', label: 'Architectural', count: IMAGE_ASSETS.filter(a => a.category === 'architectural').length },
  { id: 'glass', label: 'Glass', count: IMAGE_ASSETS.filter(a => a.category === 'glass').length },
  { id: 'paper', label: 'Paper', count: IMAGE_ASSETS.filter(a => a.category === 'paper').length },
  { id: 'tech', label: 'Tech', count: IMAGE_ASSETS.filter(a => a.category === 'tech').length },
  { id: 'editorial', label: 'Editorial', count: IMAGE_ASSETS.filter(a => a.category === 'editorial').length },
];

export function findImage(id: string): ImageAsset | undefined {
  return IMAGE_ASSETS.find(a => a.id === id);
}

export function searchImages(query: string, category?: ImageCategory | 'all'): ImageAsset[] {
  let list = IMAGE_ASSETS;
  if (category && category !== 'all') list = list.filter(a => a.category === category);
  if (!query.trim()) return list;
  const q = query.toLowerCase();
  return list.filter(a =>
    a.name.toLowerCase().includes(q) ||
    a.tags.some(t => t.includes(q)) ||
    a.category.includes(q) ||
    a.mood.some(m => m.includes(q))
  );
}
