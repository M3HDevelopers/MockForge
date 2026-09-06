import { create } from 'zustand';
import type { Asset, DeviceKind, Project, Selection, Toast } from './types';
import {
  applyLayoutPositions, clamp, DEVICE_META, makeDefaultProject, makeDevice,
  randomizeProject, uid,
} from './templates';

const LS_PROJECTS = 'mockforge.projects.v1';
const LS_STATS = 'mockforge.stats.v1';

/* ---------- image helpers ---------- */
export function fileToAsset(file: File): Promise<Asset> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      try {
        const max = 1600;
        const sc = Math.min(1, max / Math.max(img.naturalWidth, img.naturalHeight));
        const w = Math.max(1, Math.round(img.naturalWidth * sc));
        const h = Math.max(1, Math.round(img.naturalHeight * sc));
        const c = document.createElement('canvas');
        c.width = w; c.height = h;
        const ctx = c.getContext('2d')!;
        ctx.drawImage(img, 0, 0, w, h);
        const isPng = file.type === 'image/png' || file.type === 'image/svg+xml';
        const dataUrl = isPng && file.size < 900_000 ? c.toDataURL('image/png') : c.toDataURL('image/jpeg', 0.86);
        resolve({ id: uid(), name: file.name.replace(/\.[^.]+$/, ''), dataUrl, w, h });
      } catch (e) { reject(e); }
      URL.revokeObjectURL(url);
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('Could not read image')); };
    img.src = url;
  });
}

export function urlToAsset(url: string, name: string): Promise<Asset> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        const max = 1600;
        const sc = Math.min(1, max / Math.max(img.naturalWidth, img.naturalHeight));
        const w = Math.max(1, Math.round(img.naturalWidth * sc));
        const h = Math.max(1, Math.round(img.naturalHeight * sc));
        const c = document.createElement('canvas');
        c.width = w; c.height = h;
        c.getContext('2d')!.drawImage(img, 0, 0, w, h);
        resolve({ id: uid(), name, dataUrl: c.toDataURL('image/jpeg', 0.88), w, h });
      } catch (e) { reject(e); }
    };
    img.onerror = () => reject(new Error('fetch failed'));
    img.src = url;
  });
}

/* ---------- stats ---------- */
function loadStats(): { totalExports: number } {
  try { return JSON.parse(localStorage.getItem(LS_STATS) || '{"totalExports":0}'); }
  catch { return { totalExports: 0 }; }
}

let saveTimer: ReturnType<typeof setTimeout> | null = null;

interface StudioState {
  booted: boolean;
  view: 'dashboard' | 'editor';
  projects: Project[];
  project: Project | null;
  selection: Selection | null;
  past: Project[];
  future: Project[];
  dirty: boolean;
  savedAt: number | null;
  saving: boolean;
  zoom: number;
  exportOpen: boolean;
  toasts: Toast[];
  totalExports: number;

  boot: () => void;
  goto: (v: 'dashboard' | 'editor') => void;
  toast: (msg: string, tone?: Toast['tone']) => void;
  dismissToast: (id: number) => void;

  createProject: (name: string, type: string, cw: number, ch: number, quickKind?: DeviceKind) => void;
  openProject: (id: string) => void;
  closeEditor: () => void;
  deleteProject: (id: string) => void;
  duplicateProject: (id: string) => void;
  importProject: (p: Project) => void;

  checkpoint: () => void;
  update: (fn: (p: Project) => Project, history?: boolean) => void;
  undo: () => void;
  redo: () => void;

  addFiles: (files: FileList | File[]) => Promise<void>;
  addAsset: (a: Asset) => void;
  removeAsset: (id: string) => void;

  addDevice: (kind: DeviceKind) => void;
  applyLayout: (id: string) => void;
  removeDevice: (id: string) => void;
  duplicateDevice: (id: string) => void;
  reorderDevice: (id: string, dir: -1 | 1) => void;

  randomize: () => void;
  save: (silent?: boolean) => void;
  setZoom: (z: number) => void;
  setSelection: (s: Selection | null) => void;
  setExportOpen: (v: boolean) => void;
  trackExport: () => void;
}

export const useStudio = create<StudioState>((set, get) => ({
  booted: false,
  view: 'dashboard',
  projects: [],
  project: null,
  selection: null,
  past: [],
  future: [],
  dirty: false,
  savedAt: null,
  saving: false,
  zoom: 0.5,
  exportOpen: false,
  toasts: [],
  totalExports: loadStats().totalExports,

  boot: () => {
    if (get().booted) return;
    let projects: Project[] = [];
    try { projects = JSON.parse(localStorage.getItem(LS_PROJECTS) || '[]'); } catch { /* corrupted */ }
    set({ projects, booted: true });
  },

  goto: (v) => {
    if (v === 'dashboard' && get().project) get().save(true);
    set({ view: v, ...(v === 'editor' ? {} : { project: null, selection: null, past: [], future: [] }) });
  },

  toast: (msg, tone = 'ok') => {
    const id = Date.now() + Math.random();
    set(s => ({ toasts: [...s.toasts, { id, msg, tone }] }));
    setTimeout(() => get().dismissToast(id), 3600);
  },
  dismissToast: (id) => set(s => ({ toasts: s.toasts.filter(t => t.id !== id) })),

  createProject: (name, type, cw, ch, quickKind) => {
    const p = makeDefaultProject(name || 'Untitled project', type, cw, ch);
    if (quickKind) {
      const { w, h } = p.canvas;
      p.devices = [makeDevice(quickKind, w, h, null, 0)];
    }
    set(s => ({ projects: [p, ...s.projects], project: p, view: 'editor', selection: { kind: 'device', id: p.devices[0]?.id }, past: [], future: [], dirty: false, savedAt: null, zoom: 0.5 }));
  },

  openProject: (id) => {
    const p = get().projects.find(x => x.id === id);
    if (!p) return;
    set({ project: JSON.parse(JSON.stringify(p)), view: 'editor', selection: { kind: 'device', id: p.devices[0]?.id }, past: [], future: [], dirty: false, savedAt: p.updatedAt, zoom: 0.5 });
  },

  closeEditor: () => { get().save(true); get().goto('dashboard'); },

  deleteProject: (id) => {
    set(s => ({ projects: s.projects.filter(p => p.id !== id) }));
    persist(get().projects);
    get().toast('Project deleted', 'info');
  },

  duplicateProject: (id) => {
    const p = get().projects.find(x => x.id === id);
    if (!p) return;
    const copy: Project = JSON.parse(JSON.stringify(p));
    copy.id = uid(); copy.name = `${p.name} copy`; copy.createdAt = Date.now(); copy.updatedAt = Date.now();
    set(s => ({ projects: [copy, ...s.projects] }));
    persist(get().projects);
    get().toast('Project duplicated');
  },

  importProject: (p) => {
    set(s => ({ projects: [{ ...p, id: uid() }, ...s.projects] }));
    persist(get().projects);
    get().toast('Project imported');
  },

  checkpoint: () => {
    const p = get().project;
    if (!p) return;
    // history snapshots exclude heavy asset payloads (merged back on undo/redo)
    const snap = JSON.parse(JSON.stringify({ ...p, assets: [], thumbnail: null }));
    set(s => ({ past: [...s.past.slice(-59), snap], future: [] }));
  },

  update: (fn, history = true) => {
    const cur = get().project;
    if (!cur) return;
    if (history) get().checkpoint();
    const next = { ...fn(cur), updatedAt: Date.now() };
    set({ project: next, dirty: true });
    if (saveTimer) clearTimeout(saveTimer);
    saveTimer = setTimeout(() => get().save(true), 1400);
  },

  undo: () => {
    const { past, project } = get();
    if (!past.length || !project) return;
    const prev = past[past.length - 1];
    set(s => ({
      past: s.past.slice(0, -1),
      future: [...s.future, JSON.parse(JSON.stringify({ ...project, thumbnail: null }))],
      project: { ...prev, assets: project.assets },
      dirty: true,
    }));
    if (saveTimer) clearTimeout(saveTimer);
    saveTimer = setTimeout(() => get().save(true), 1400);
  },

  redo: () => {
    const { future, project } = get();
    if (!future.length || !project) return;
    const next = future[future.length - 1];
    set(s => ({
      future: s.future.slice(0, -1),
      past: [...s.past, JSON.parse(JSON.stringify({ ...project, thumbnail: null }))],
      project: { ...next, assets: project.assets },
      dirty: true,
    }));
    if (saveTimer) clearTimeout(saveTimer);
    saveTimer = setTimeout(() => get().save(true), 1400);
  },

  addFiles: async (files) => {
    const list = Array.from(files).filter(f => f.type.startsWith('image/'));
    if (!list.length) { get().toast('Only image files are supported', 'err'); return; }
    const cur = get().project;
    if (!cur) return;
    let p = cur;
    let added: Asset[] = [];
    for (const f of list) {
      try {
        const a = await fileToAsset(f);
        added = [...added, a];
        p = { ...p, assets: [...p.assets, a] };
      } catch { get().toast(`Could not read ${f.name}`, 'err'); }
    }
    // auto-assign to devices without screenshots
    let ai = 0;
    p = {
      ...p,
      devices: p.devices.map(d => d.assetId ? d : (added[ai] ? { ...d, assetId: added[ai++]!.id } : d)),
    };
    set({ project: { ...p, updatedAt: Date.now() }, dirty: true });
    if (added.length) get().toast(`${added.length} screenshot${added.length > 1 ? 's' : ''} added`);
    get().save(true);
  },

  addAsset: (a) => {
    get().checkpoint();
    get().update(p => {
      let ai = 0;
      const devices = p.devices.map(d => d.assetId ? d : (ai++ === 0 ? { ...d, assetId: a.id } : d));
      return { ...p, assets: [...p.assets, a], devices };
    }, false);
  },

  removeAsset: (id) => {
    get().update(p => ({
      ...p,
      assets: p.assets.filter(a => a.id !== id),
      devices: p.devices.map(d => d.assetId === id ? { ...d, assetId: null } : d),
      logo: p.logo.assetId === id ? { ...p.logo, assetId: null, enabled: false } : p.logo,
    }), false);
    get().toast('Asset removed', 'info');
  },

  addDevice: (kind) => {
    get().update(p => {
      const d = makeDevice(kind, p.canvas.w, p.canvas.h, p.assets.find(a => !p.devices.some(dd => dd.assetId === a.id))?.id ?? null, p.devices.length);
      const offset = p.devices.length * 24;
      d.x = clamp(d.x + offset, 0, p.canvas.w - d.w);
      d.y = clamp(d.y + offset, 0, p.canvas.h - d.w / DEVICE_META[kind].aspect);
      return { ...p, devices: [...p.devices, d] };
    });
    const p = get().project!;
    set({ selection: { kind: 'device', id: p.devices[p.devices.length - 1].id } });
    get().toast(`${DEVICE_META[kind].label} added`);
  },

  applyLayout: (id) => {
    get().checkpoint();
    set(s => s.project ? { project: applyLayoutPositions(s.project, id), dirty: true, selection: null } : s);
    get().toast('Layout applied');
    get().save(true);
  },

  removeDevice: (id) => {
    get().update(p => ({ ...p, devices: p.devices.filter(d => d.id !== id) }));
    set(s => s.selection?.id === id ? { selection: null } : s);
  },

  duplicateDevice: (id) => {
    get().update(p => {
      const d = p.devices.find(x => x.id === id);
      if (!d) return p;
      const copy = { ...d, id: uid(), name: `${d.name} copy`, x: d.x + 28, y: d.y + 28 };
      return { ...p, devices: [...p.devices, copy] };
    });
    const p = get().project!;
    set({ selection: { kind: 'device', id: p.devices[p.devices.length - 1].id } });
  },

  reorderDevice: (id, dir) => {
    get().update(p => {
      const i = p.devices.findIndex(d => d.id === id);
      const j = i + dir;
      if (i < 0 || j < 0 || j >= p.devices.length) return p;
      const arr = [...p.devices];
      [arr[i], arr[j]] = [arr[j], arr[i]];
      return { ...p, devices: arr };
    });
  },

  randomize: () => {
    get().update(p => randomizeProject(p));
    get().toast('Variation generated — hit it again for more', 'info');
  },

  save: (silent = false) => {
    const { project } = get();
    if (!project) return;
    set({ saving: true });
    const next = get().projects.some(x => x.id === project.id)
      ? get().projects.map(x => x.id === project.id ? { ...project, thumbnail: x.thumbnail } : x)
      : [project, ...get().projects];
    const ok = persist(next);
    if (ok) {
      set(s => ({ projects: next, dirty: false, savedAt: Date.now(), saving: false, project: s.project ? { ...s.project } : null }));
      if (!silent) get().toast('Project saved');
    } else {
      set({ saving: false });
      get().toast('Storage is full — export your work or delete old projects', 'err');
    }
  },

  setZoom: (z) => set({ zoom: clamp(z, 0.1, 2) }),
  setSelection: (sel) => set({ selection: sel }),
  setExportOpen: (v) => set({ exportOpen: v }),

  trackExport: () => {
    const { project } = get();
    const total = get().totalExports + 1;
    localStorage.setItem(LS_STATS, JSON.stringify({ totalExports: total }));
    if (project) {
      const next = get().projects.map(x => x.id === project.id ? { ...x, exportCount: x.exportCount + 1 } : x);
      persist(next);
      set(s => ({ projects: next, project: s.project ? { ...s.project, exportCount: s.project.exportCount + 1 } : null }));
    }
    set({ totalExports: total });
  },
}));

function persist(projects: Project[]): boolean {
  try {
    localStorage.setItem(LS_PROJECTS, JSON.stringify(projects));
    return true;
  } catch {
    return false;
  }
}
