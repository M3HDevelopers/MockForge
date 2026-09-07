import { useState, useRef, useEffect } from 'react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Project, DeviceKind, DeviceLayer, Asset, Selection, Background, Toast, ShadowPreset, DecoSet, PosPreset } from './types';
import { uid, DEVICE_META, CANVAS_PRESETS, PROJECT_TYPES, BG_PRESETS, makeDefaultProject, makeDevice, applyLayoutPositions, LAYOUTS, PALETTES, paletteToBg, pick, mulberry32, rngRange } from './templates';

// Randomize project (surprise me)
function randomizeProject(p: Project): Project {
  const seed = Date.now() ^ Math.floor(Math.random() * 1e9);
  const rnd = mulberry32(seed);
  const pal = pick(rnd, PALETTES);
  const tilts = [-6, -4, -2, 0, 0, 2, 4, 6];
  const shadows: ShadowPreset[] = ['soft', 'soft', 'float', 'product', 'cinematic', 'glow'];
  const decos: DecoSet[] = ['orbs', 'rings', 'grid', 'sparkles', 'waves', 'none'];
  const textPos: PosPreset[] = ['bottom-left', 'bottom-center', 'top-left', 'top-center'];
  return {
    ...p,
    updatedAt: Date.now(),
    background: paletteToBg(pal, Math.floor(rnd() * 1e9)),
    decoration: { ...p.decoration, set: pick(rnd, decos), seed: Math.floor(rnd() * 1e9), intensity: rngRange(rnd, 0.7, 1.2) },
    text: { ...p.text, position: pick(rnd, textPos) },
    devices: p.devices.map((d, i) => ({ ...d, tilt: pick(rnd, tilts) + (i % 2 === 0 ? 0 : pick(rnd, [-2, 2])), shadow: pick(rnd, shadows) })),
    accents: { a1: pal.a1, a2: pal.a2 },
  };
}
import { renderBackground } from './backgrounds';
import { IMAGE_BGS, IMAGE_CATEGORIES, imgOf, loadImageEl } from './images';
import { ICONS, ICON_CATEGORIES, findIcon } from './iconLibrary';

// ============ STORE ============
interface Store {
  view: 'dashboard' | 'editor';
  projects: Project[];
  current: Project | null;
  selection: Selection | null;
  toasts: Toast[];
  setView: (v: 'dashboard' | 'editor') => void;
  createProject: (name: string, type: string, w: number, h: number) => void;
  openProject: (id: string) => void;
  deleteProject: (id: string) => void;
  updateProject: (p: Project) => void;
  setSelection: (s: Selection | null) => void;
  addToast: (msg: string, tone?: 'ok' | 'err' | 'info') => void;
}

const useStore = create<Store>()(
  persist(
    (set, get) => ({
      view: 'dashboard',
      projects: [],
      current: null,
      selection: null,
      toasts: [],
      setView: (v) => set({ view: v }),
      createProject: (name, type, w, h) => {
        const p = makeDefaultProject(name || 'Untitled', type, w, h);
        set(s => ({ projects: [p, ...s.projects], current: p, view: 'editor' }));
      },
      openProject: (id) => {
        const p = get().projects.find(x => x.id === id);
        if (p) set({ current: { ...p }, view: 'editor' });
      },
      deleteProject: (id) => set(s => ({ projects: s.projects.filter(p => p.id !== id) })),
      updateProject: (p) => {
        set(s => ({
          current: p,
          projects: s.projects.map(x => x.id === p.id ? p : x),
        }));
      },
      setSelection: (s) => set({ selection: s }),
      addToast: (msg, tone = 'ok') => {
        const id = Date.now();
        set(s => ({ toasts: [...s.toasts, { id, msg, tone }] }));
        setTimeout(() => set(s => ({ toasts: s.toasts.filter(t => t.id !== id) })), 3000);
      },
    }),
    { name: 'mockforge-store' }
  )
);

// ============ DASHBOARD ============
function Dashboard() {
  const { projects, createProject, openProject, deleteProject, setView } = useStore();
  const [showNew, setShowNew] = useState(false);
  const [name, setName] = useState('');
  const [type, setType] = useState('Website');
  const [preset, setPreset] = useState(CANVAS_PRESETS[0]);

  const handleCreate = () => {
    createProject(name, type, preset.w, preset.h);
    setShowNew(false);
    setName('');
  };

  return (
    <div className="min-h-screen bg-ink text-fg">
      <header className="border-b border-line2 bg-panel sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-acc to-acc2 flex items-center justify-center text-ink font-bold">M</div>
            <span className="font-semibold text-lg">MockForge</span>
            <span className="text-xs text-mut font-mono">Portfolio Studio</span>
          </div>
          <button onClick={() => setShowNew(true)} className="btn btn-acc">
            <span>+</span> New Project
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-12">
          <h1 className="text-5xl font-bold mb-3" style={{ fontFamily: 'var(--font-disp)' }}>
            Create stunning <span className="text-acc">portfolio mockups</span>
          </h1>
          <p className="text-mut text-lg">Professional device mockups with unlimited design variations</p>
        </div>

        {projects.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🎨</div>
            <h2 className="text-2xl font-semibold mb-2">No projects yet</h2>
            <p className="text-mut mb-6">Create your first portfolio mockup</p>
            <button onClick={() => setShowNew(true)} className="btn btn-acc btn-lg">
              <span>+</span> Create Project
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map(p => (
              <div key={p.id} className="card card-hover group">
                <div className="aspect-video bg-panel2 rounded-t-lg overflow-hidden relative">
                  {p.thumbnail ? (
                    <img src={p.thumbnail} alt={p.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-dim">
                      <span className="text-4xl">📱</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-4 gap-2">
                    <button onClick={() => openProject(p.id)} className="btn btn-sm">Open</button>
                    <button onClick={() => deleteProject(p.id)} className="btn btn-sm btn-ghost">Delete</button>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold mb-1">{p.name}</h3>
                  <div className="flex items-center gap-2 text-xs text-mut">
                    <span>{p.type}</span>
                    <span>·</span>
                    <span>{p.canvas.w}×{p.canvas.h}</span>
                    <span>·</span>
                    <span>{p.devices.length} devices</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {showNew && (
        <div className="fixed inset-0 bg-ink/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowNew(false)}>
          <div className="card max-w-md w-full p-6" onClick={e => e.stopPropagation()}>
            <h2 className="text-2xl font-bold mb-6">New Project</h2>
            <div className="space-y-4">
              <div>
                <label className="label-mono mb-2 block">Project Name</label>
                <input value={name} onChange={e => setName(e.target.value)} placeholder="My Portfolio" className="input" />
              </div>
              <div>
                <label className="label-mono mb-2 block">Project Type</label>
                <select value={type} onChange={e => setType(e.target.value)} className="input">
                  {PROJECT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="label-mono mb-2 block">Canvas Size</label>
                <div className="grid grid-cols-2 gap-2">
                  {CANVAS_PRESETS.map(p => (
                    <button key={p.label} onClick={() => setPreset(p)} className={`btn btn-sm ${preset === p ? 'btn-acc' : ''}`}>
                      {p.label} <span className="text-xs opacity-60">{p.w}×{p.h}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-2 pt-4">
                <button onClick={() => setShowNew(false)} className="btn flex-1">Cancel</button>
                <button onClick={handleCreate} className="btn btn-acc flex-1">Create</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ============ EDITOR ============
function Editor() {
  const { current, updateProject, selection, setSelection, setView, addToast } = useStore();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [zoom, setZoom] = useState(0.5);
  const [tab, setTab] = useState<'devices' | 'background' | 'text' | 'export'>('devices');

  if (!current) return null;

  const renderCanvas = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = current.canvas.w;
    canvas.height = current.canvas.h;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    await renderBackground(ctx, current.background, current.canvas.w, current.canvas.h, current.accents);
    // TODO: Render devices, text, logos, decorations
  };

  useEffect(() => { renderCanvas(); }, [current]);

  const addDevice = (kind: DeviceKind) => {
    const d = makeDevice(kind, current.canvas.w, current.canvas.h, null, current.devices.length);
    updateProject({ ...current, devices: [...current.devices, d] });
    setSelection({ kind: 'device', id: d.id });
  };

  const applyLayout = (id: string) => {
    const p = applyLayoutPositions(current, id);
    updateProject(p);
    addToast('Layout applied');
  };

  const surpriseMe = () => {
    const p = randomizeProject(current);
    updateProject(p);
    addToast('Surprise! ✨');
  };

  return (
    <div className="h-screen flex flex-col bg-ink text-fg">
      {/* Top bar */}
      <header className="h-14 border-b border-line2 bg-panel flex items-center px-4 gap-4">
        <button onClick={() => setView('dashboard')} className="icon-btn">←</button>
        <input
          value={current.name}
          onChange={e => updateProject({ ...current, name: e.target.value })}
          className="bg-transparent border-none outline-none font-semibold text-lg flex-1"
        />
        <button onClick={surpriseMe} className="btn">
          <span>🎲</span> Surprise Me
        </button>
        <button onClick={() => setTab('export')} className="btn btn-acc">
          <span>⬇</span> Export
        </button>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Left panel */}
        <aside className="w-72 border-r border-line2 bg-panel overflow-y-auto">
          <div className="flex border-b border-line2">
            {(['devices', 'background', 'text', 'export'] as const).map(t => (
              <button key={t} onClick={() => setTab(t)} className={`flex-1 py-3 text-sm font-medium capitalize ${tab === t ? 'text-acc border-b-2 border-acc' : 'text-mut'}`}>
                {t}
              </button>
            ))}
          </div>

          <div className="p-4">
            {tab === 'devices' && (
              <div className="space-y-6">
                <div>
                  <h3 className="label-mono mb-3">Add Device</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {(Object.keys(DEVICE_META) as DeviceKind[]).map(kind => (
                      <button key={kind} onClick={() => addDevice(kind)} className="btn btn-sm">
                        {DEVICE_META[kind].label}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="label-mono mb-3">Quick Layouts</h3>
                  <div className="space-y-2">
                    {LAYOUTS.map(l => (
                      <button key={l.id} onClick={() => applyLayout(l.id)} className="btn btn-sm w-full justify-start">
                        {l.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {tab === 'background' && (
              <div className="space-y-6">
                <div>
                  <h3 className="label-mono mb-3">Procedural Backgrounds</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {BG_PRESETS.map(bp => (
                      <button
                        key={bp.id}
                        onClick={() => updateProject({ ...current, background: { ...bp.bg, kind: 'procedural' } })}
                        className="aspect-video rounded-lg border-2 overflow-hidden relative"
                        style={{ borderColor: current.background.kind === 'procedural' && current.background.c1 === bp.bg.c1 ? 'var(--color-acc)' : 'var(--color-line)' }}
                      >
                        <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${bp.sw[0]}, ${bp.sw[1]})` }} />
                        <div className="absolute inset-0 flex items-end p-2">
                          <span className="text-xs font-medium text-white drop-shadow">{bp.name}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="label-mono mb-3">Image Backgrounds</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {IMAGE_BGS.slice(0, 8).map(img => (
                      <button
                        key={img.id}
                        onClick={() => updateProject({ ...current, background: { ...current.background, kind: 'image', image: { ...imgOf(current.background), kind: 'image', imageId: img.id } } })}
                        className="aspect-video rounded-lg border-2 overflow-hidden relative"
                        style={{ borderColor: current.background.kind === 'image' && current.background.image?.imageId === img.id ? 'var(--color-acc)' : 'var(--color-line)' }}
                      >
                        <img src={img.src} alt={img.name} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 flex items-end p-2 bg-gradient-to-t from-black/60 to-transparent">
                          <span className="text-xs font-medium text-white">{img.name}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {tab === 'text' && (
              <div className="space-y-4">
                <div>
                  <label className="label-mono mb-2 block">Title</label>
                  <input
                    value={current.text.title}
                    onChange={e => updateProject({ ...current, text: { ...current.text, title: e.target.value, enabled: true } })}
                    placeholder="Project Name"
                    className="input"
                  />
                </div>
                <div>
                  <label className="label-mono mb-2 block">Subtitle</label>
                  <input
                    value={current.text.subtitle}
                    onChange={e => updateProject({ ...current, text: { ...current.text, subtitle: e.target.value } })}
                    placeholder="Brief description"
                    className="input"
                  />
                </div>
                <div>
                  <label className="label-mono mb-2 block">Position</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['top-left', 'top-center', 'top-right', 'center-left', 'center', 'center-right', 'bottom-left', 'bottom-center', 'bottom-right'].map(pos => (
                      <button
                        key={pos}
                        onClick={() => updateProject({ ...current, text: { ...current.text, position: pos as any } })}
                        className={`btn btn-sm text-xs ${current.text.position === pos ? 'btn-acc' : ''}`}
                      >
                        {pos.replace('-', ' ')}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {tab === 'export' && (
              <div className="space-y-4">
                <button onClick={() => {
                  const canvas = canvasRef.current;
                  if (!canvas) return;
                  canvas.toBlob(blob => {
                    if (!blob) return;
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `${current.name}.png`;
                    a.click();
                    URL.revokeObjectURL(url);
                    addToast('Exported! 🎉');
                  });
                }} className="btn btn-acc w-full">
                  Download PNG
                </button>
              </div>
            )}
          </div>
        </aside>

        {/* Canvas */}
        <main className="flex-1 overflow-auto bg-panel2 p-8">
          <div className="flex items-center justify-center min-h-full">
            <div style={{ transform: `scale(${zoom})`, transformOrigin: 'center' }}>
              <canvas ref={canvasRef} className="shadow-2xl rounded-lg" />
            </div>
          </div>
        </main>

        {/* Right panel */}
        <aside className="w-72 border-l border-line2 bg-panel overflow-y-auto p-4">
          <h3 className="label-mono mb-3">Layers</h3>
          <div className="space-y-2">
            {current.devices.map(d => (
              <div key={d.id} className={`p-3 rounded-lg border cursor-pointer ${selection?.id === d.id ? 'border-acc bg-acc/10' : 'border-line hover:border-mut'}`} onClick={() => setSelection({ kind: 'device', id: d.id })}>
                <div className="flex items-center justify-between">
                  <span className="font-medium text-sm">{d.name}</span>
                  <span className="text-xs text-mut">{d.kind}</span>
                </div>
              </div>
            ))}
          </div>

          {selection?.kind === 'device' && (() => {
            const d = current.devices.find(x => x.id === selection.id);
            if (!d) return null;
            return (
              <div className="mt-6 space-y-4">
                <h3 className="label-mono">Device Properties</h3>
                <div>
                  <label className="text-xs text-mut mb-1 block">Width</label>
                  <input type="range" min="100" max="1200" value={d.w} onChange={e => {
                    const w = +e.target.value;
                    updateProject({ ...current, devices: current.devices.map(x => x.id === d.id ? { ...x, w } : x) });
                  }} className="w-full" />
                </div>
                <div>
                  <label className="text-xs text-mut mb-1 block">Tilt</label>
                  <input type="range" min="-45" max="45" value={d.tilt} onChange={e => {
                    const tilt = +e.target.value;
                    updateProject({ ...current, devices: current.devices.map(x => x.id === d.id ? { ...x, tilt } : x) });
                  }} className="w-full" />
                </div>
                <div>
                  <label className="text-xs text-mut mb-2 block">Color</label>
                  <div className="flex gap-2 flex-wrap">
                    {DEVICE_META[d.kind].colors.map(c => (
                      <button key={c.hex} onClick={() => updateProject({ ...current, devices: current.devices.map(x => x.id === d.id ? { ...x, color: c.hex } : x) })} className="w-8 h-8 rounded-lg border-2" style={{ background: c.hex, borderColor: d.color === c.hex ? 'var(--color-acc)' : 'var(--color-line)' }} />
                    ))}
                  </div>
                </div>
              </div>
            );
          })()}
        </aside>
      </div>

      {/* Zoom controls */}
      <div className="absolute bottom-4 right-4 flex gap-2 bg-panel border border-line2 rounded-lg p-2">
        <button onClick={() => setZoom(z => Math.max(0.1, z - 0.1))} className="icon-btn">-</button>
        <span className="text-sm px-2">{Math.round(zoom * 100)}%</span>
        <button onClick={() => setZoom(z => Math.min(2, z + 0.1))} className="icon-btn">+</button>
      </div>
    </div>
  );
}

// ============ APP ============
export default function App() {
  const { view, toasts } = useStore();
  return (
    <>
      {view === 'dashboard' ? <Dashboard /> : <Editor />}
      <div className="fixed bottom-4 left-4 space-y-2 z-50">
        {toasts.map(t => (
          <div key={t.id} className={`px-4 py-2 rounded-lg shadow-lg text-sm font-medium ${t.tone === 'err' ? 'bg-danger text-white' : t.tone === 'info' ? 'bg-panel border border-line2' : 'bg-acc text-ink'}`}>
            {t.msg}
          </div>
        ))}
      </div>
    </>
  );
}
