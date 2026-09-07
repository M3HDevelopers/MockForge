import { useMemo, useState } from 'react';
import { useStudio } from '../store';
import type { DesignSnapshot, GenLocks, Mood, SurpriseMode } from '../types';
import { scoreDesign } from '../engine';
import { Section } from './ui';
import { IcClose, IcCompare, IcDice, IcGrid, IcHeart, IcLock, IcSpin, IcStar, IcTrash, IcUnlock, IcWand, IcLayers, IcRefresh } from '../icons';

const MOODS: Mood[] = ['auto', 'minimal', 'premium', 'creative', 'developer', 'dark', 'light', 'editorial', 'bold', 'elegant', 'futuristic', 'playful', 'corporate'];
const MODES: { id: SurpriseMode; label: string; desc: string }[] = [
  { id: 'all', label: 'Surprise me', desc: 'Full composition' },
  { id: 'background', label: 'Background', desc: 'Backdrop only' },
  { id: 'layout', label: 'Layout', desc: 'Arrangement only' },
  { id: 'devices', label: 'Devices', desc: 'Device set & fit' },
  { id: 'colors', label: 'Colors', desc: 'Palette only' },
  { id: 'decor', label: 'Decorations', desc: 'Accents only' },
];
const LOCK_LABELS: { k: keyof GenLocks; label: string }[] = [
  { k: 'devices', label: 'Devices' }, { k: 'background', label: 'Background' },
  { k: 'decoration', label: 'Decor' }, { k: 'text', label: 'Text' }, { k: 'logo', label: 'Logo' },
];

type Tab = 'generate' | 'variations' | 'library';

export function GeneratePanel() {
  const open = useStudio(s => s.genOpen);
  const setOpen = useStudio(s => s.setGenOpen);
  const [tab, setTab] = useState<Tab>('generate');
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center anim-fade-in" style={{ background: 'rgba(8,9,11,0.72)', backdropFilter: 'blur(6px)' }} onPointerDown={() => setOpen(false)}>
      <div
        className="anim-pop w-[920px] max-w-[95vw] max-h-[88vh] flex flex-col rounded-2xl border border-line bg-panel shadow-[0_40px_120px_rgba(0,0,0,0.6)] overflow-hidden"
        onPointerDown={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-line2">
          <div className="flex items-center gap-2.5">
            <span className="text-acc"><IcWand size={18} /></span>
            <span style={{ fontFamily: 'var(--font-disp)', fontWeight: 700, fontSize: 16 }}>Design Engine</span>
            <span className="label-mono">procedural · no AI</span>
          </div>
          <div className="flex items-center gap-1">
            {(['generate', 'variations', 'library'] as Tab[]).map(t => (
              <button key={t} onClick={() => setTab(t)} className={`px-3.5 py-1.5 rounded-lg text-[12.5px] font-medium capitalize transition-colors ${tab === t ? 'bg-panel3 text-fg' : 'text-dim hover:text-mut'}`}>
                {t}
              </button>
            ))}
            <button className="icon-btn ml-2" onClick={() => setOpen(false)}><IcClose size={15} /></button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {tab === 'generate' && <GenerateTab />}
          {tab === 'variations' && <VariationsTab />}
          {tab === 'library' && <LibraryTab />}
        </div>
      </div>
    </div>
  );
}

function GenerateTab() {
  const mood = useStudio(s => s.mood);
  const setMood = useStudio(s => s.setMood);
  const locks = useStudio(s => s.locks);
  const toggleLock = useStudio(s => s.toggleLock);
  const generate = useStudio(s => s.generate);
  const setOpen = useStudio(s => s.setGenOpen);
  const score = useStudio(s => s.project ? scoreDesign(s.project).total : 0);
  
  // Element configuration state
  const [bgType, setBgType] = useState<'auto' | 'vector' | 'image' | 'hybrid'>('auto');
  const [includeIcons, setIncludeIcons] = useState(true);
  const [includeDeco, setIncludeDeco] = useState(true);
  const [includeText, setIncludeText] = useState(true);
  const [iconCount, setIconCount] = useState(3);
  const [decoIntensity, setDecoIntensity] = useState(50);

  return (
    <div className="grid grid-cols-[1fr_300px] gap-0">
      <div className="p-5 space-y-5">
        <Section title="Design mood">
          <div className="flex flex-wrap gap-1.5">
            {MOODS.map(m => (
              <button key={m} onClick={() => setMood(m)} className={`chip capitalize ${mood === m ? 'on' : ''}`}>{m}</button>
            ))}
          </div>
        </Section>

        <Section title="Background type">
          <div className="grid grid-cols-4 gap-2">
            {(['auto', 'vector', 'image', 'hybrid'] as const).map(type => (
              <button
                key={type}
                onClick={() => setBgType(type)}
                className={`p-3 rounded-lg border transition-all ${bgType === type ? 'border-acc bg-acc/10' : 'border-line hover:border-line2'}`}
              >
                <div className="text-[12px] font-medium capitalize">{type}</div>
                <div className="text-[10px] text-dim mt-0.5">
                  {type === 'auto' && 'Smart selection'}
                  {type === 'vector' && 'Procedural only'}
                  {type === 'image' && 'Image backgrounds'}
                  {type === 'hybrid' && 'Vector + Image'}
                </div>
              </button>
            ))}
          </div>
        </Section>

        <Section title="Elements to include">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[12px] font-medium">Icons</div>
                <div className="text-[10px] text-dim">Add tech icons around devices</div>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={includeIcons}
                  onChange={(e) => setIncludeIcons(e.target.checked)}
                  className="w-4 h-4 accent-acc"
                />
                {includeIcons && (
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-dim">Count:</span>
                    <input
                      type="range"
                      min="1"
                      max="8"
                      value={iconCount}
                      onChange={(e) => setIconCount(parseInt(e.target.value))}
                      className="w-20"
                    />
                    <span className="text-[11px] font-mono w-4">{iconCount}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="text-[12px] font-medium">Decorations</div>
                <div className="text-[10px] text-dim">Add decorative shapes</div>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={includeDeco}
                  onChange={(e) => setIncludeDeco(e.target.checked)}
                  className="w-4 h-4 accent-acc"
                />
                {includeDeco && (
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-dim">Intensity:</span>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={decoIntensity}
                      onChange={(e) => setDecoIntensity(parseInt(e.target.value))}
                      className="w-20"
                    />
                    <span className="text-[11px] font-mono w-6">{decoIntensity}%</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="text-[12px] font-medium">Text & Badges</div>
                <div className="text-[10px] text-dim">Add title and tech badges</div>
              </div>
              <input
                type="checkbox"
                checked={includeText}
                onChange={(e) => setIncludeText(e.target.checked)}
                className="w-4 h-4 accent-acc"
              />
            </div>
          </div>
        </Section>

        <Section title="What to randomize">
          <div className="grid grid-cols-3 gap-1.5">
            {MODES.map(m => (
              <button
                key={m.id}
                onClick={() => { generate(m.id); }}
                className="flex flex-col items-start gap-0.5 p-3 rounded-lg border border-line bg-ink hover:border-acc/50 hover:bg-panel2 transition-all text-left group"
              >
                <span className="text-[12.5px] font-medium group-hover:text-acc transition-colors">{m.label}</span>
                <span className="text-[10px]" style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-dim)' }}>{m.desc}</span>
              </button>
            ))}
          </div>
        </Section>

        <Section title="Locks — protected while generating">
          <div className="flex flex-wrap gap-1.5">
            {LOCK_LABELS.map(l => (
              <button key={l.k} onClick={() => toggleLock(l.k)} className={`chip ${locks[l.k] ? 'on' : ''}`}>
                {locks[l.k] ? <IcLock size={11} /> : <IcUnlock size={11} />}
                {l.label}
              </button>
            ))}
          </div>
        </Section>
      </div>

      <div className="border-l border-line2 p-5 flex flex-col">
        <div className="label-mono mb-2">Current composition</div>
        <ScoreRing score={score} />
        <div className="flex-1" />
        <button
          className="btn btn-acc w-full justify-center !py-3 !text-[14px]"
          onClick={() => { generate('all'); setOpen(false); }}
        >
          <IcDice size={16} />
          Surprise me
        </button>
      </div>
    </div>
  );
}

function ScoreRing({ score }: { score: number }) {
  const r = 52, c = 2 * Math.PI * r;
  const col = score >= 80 ? 'var(--color-acc2)' : score >= 60 ? 'var(--color-gold)' : 'var(--color-acc)';
  return (
    <div className="flex flex-col items-center py-3">
      <svg width="130" height="130" viewBox="0 0 130 130">
        <circle cx="65" cy="65" r={r} fill="none" stroke="var(--color-line)" strokeWidth="9" />
        <circle
          cx="65" cy="65" r={r} fill="none" stroke={col} strokeWidth="9" strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={c * (1 - score / 100)}
          transform="rotate(-90 65 65)"
          style={{ transition: 'stroke-dashoffset .6s cubic-bezier(.2,.7,.3,1)' }}
        />
        <text x="65" y="60" textAnchor="middle" style={{ font: '700 34px "Space Grotesk"', fill: 'var(--color-fg)' }}>{score}</text>
        <text x="65" y="82" textAnchor="middle" style={{ font: '500 9px "JetBrains Mono"', fill: 'var(--color-dim)', letterSpacing: '0.12em' }}>COMPOSITION</text>
      </svg>
    </div>
  );
}

function VariationsTab() {
  const variations = useStudio(s => s.variations);
  const makeVariations = useStudio(s => s.makeVariations);
  const applyVariation = useStudio(s => s.applyVariation);
  const [busy, setBusy] = useState(false);

  const gen = async () => {
    setBusy(true);
    await makeVariations();
    setBusy(false);
  };

  return (
    <div className="p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div style={{ fontFamily: 'var(--font-disp)', fontWeight: 700, fontSize: 15 }}>Generate 10 variations</div>
          <div className="text-[11px] mt-0.5" style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-dim)' }}>scored best-first · click one to apply</div>
        </div>
        <button className="btn btn-acc" onClick={gen} disabled={busy}>
          {busy ? <IcSpin size={14} /> : <IcRefresh size={14} />}
          {variations.length ? 'Generate more' : 'Generate 10'}
        </button>
      </div>

      {variations.length === 0 && !busy && (
        <div className="py-16 text-center">
          <div className="mx-auto mb-3 w-fit text-dim"><IcGrid size={30} /></div>
          <p className="text-[12.5px] text-mut">No variations yet. Generate a batch to explore directions.</p>
        </div>
      )}
      {busy && (
        <div className="grid grid-cols-5 gap-3">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="aspect-[8/5] rounded-lg" style={{ background: 'linear-gradient(90deg,#1d1f24,#262932,#1d1f24)', backgroundSize: '400px 100%', animation: 'shimmer 1.2s infinite linear' }} />
          ))}
        </div>
      )}
      {!busy && variations.length > 0 && (
        <div className="grid grid-cols-5 gap-3 stagger">
          {variations.map(v => (
            <button key={v.id} onClick={() => applyVariation(v.id)} className="group text-left">
              <div className="relative rounded-lg overflow-hidden border border-line group-hover:border-acc transition-colors">
                <img src={v.thumb} alt={v.label} className="w-full aspect-[8/5] object-cover" />
                <div className="absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded-md text-[10px] font-semibold" style={{ fontFamily: 'var(--font-mono)', background: 'rgba(10,11,13,0.7)', color: 'var(--color-acc2)' }}>
                  {v.score}
                </div>
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center" style={{ background: 'rgba(10,11,13,0.4)' }}>
                  <span className="px-2.5 py-1 rounded-md text-[11px] font-semibold" style={{ background: 'var(--color-acc)', color: '#1a0e08' }}>Apply</span>
                </div>
              </div>
              <div className="text-[10.5px] mt-1.5" style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-dim)' }}>{v.label}</div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function LibraryTab() {
  const favorites = useStudio(s => s.favorites);
  const history = useStudio(s => s.history);
  const unfavorite = useStudio(s => s.unfavorite);
  const applySnapshot = useStudio(s => s.applySnapshot);
  const restoreHistory = useStudio(s => s.restoreHistory);
  const deleteHistory = useStudio(s => s.deleteHistory);
  const compare = useStudio(s => s.compare);
  const setCompare = useStudio(s => s.setCompare);
  const compareOpen = useStudio(s => s.compareOpen);
  const setCompareOpen = useStudio(s => s.setCompareOpen);
  const [picking, setPicking] = useState(false);

  const all = useMemo(() => [
    ...favorites.map(f => ({ ...f, src: 'fav' as const })),
    ...history.map(h => ({ ...h, src: 'hist' as const })),
  ], [favorites, history]);

  const onPick = (s: DesignSnapshot & { src: 'fav' | 'hist' }) => {
    if (!picking) return;
    const [a, b] = useStudio.getState().compare;
    if (!a) {
      setCompare(0, s);
      if (b) { setCompareOpen(true); setPicking(false); }
    } else if (!b) {
      setCompare(1, s);
      setCompareOpen(true);
      setPicking(false);
    } else {
      setCompare(0, s);
      setCompare(1, null);
    }
  };

  return (
    <div className="p-5">
      <div className="flex items-center justify-between mb-4">
        <div style={{ fontFamily: 'var(--font-disp)', fontWeight: 700, fontSize: 15 }}>My library</div>
        <button className={`btn ${picking ? 'btn-acc' : ''}`} onClick={() => { setPicking(!picking); setCompare(0, null); setCompare(1, null); }}>
          <IcCompare size={14} />
          {picking ? 'Pick two…' : 'Compare'}
        </button>
      </div>

      {all.length === 0 && (
        <div className="py-16 text-center">
          <div className="mx-auto mb-3 w-fit text-dim"><IcStar size={30} /></div>
          <p className="text-[12.5px] text-mut">Favorites and generated designs you keep will appear here.</p>
        </div>
      )}

      <div className="grid grid-cols-4 gap-3 stagger">
        {all.map(s => (
          <div key={s.id + s.src} className="group relative rounded-lg overflow-hidden border border-line hover:border-[#4a4f5c] transition-colors">
            <button className="block w-full" onClick={() => (picking ? onPick(s) : applySnapshot(s))}>
              <img src={s.thumb} alt={s.label} className="w-full aspect-[8/5] object-cover" />
            </button>
            <div className="absolute inset-x-0 bottom-0 p-2 flex items-center justify-between" style={{ background: 'linear-gradient(transparent, rgba(8,9,11,0.85))' }}>
              <span className="text-[10px] truncate" style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-mut)' }}>
                {s.src === 'fav' ? '★ ' : '· '}{s.label}
              </span>
              <span className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {s.src === 'fav'
                  ? <button className="icon-btn !w-6 !h-6" onClick={() => unfavorite(s.id)}><IcTrash size={11} /></button>
                  : <button className="icon-btn !w-6 !h-6" onClick={() => { restoreHistory(s.id); }}><IcLayers size={11} /></button>}
                {s.src === 'hist' && <button className="icon-btn !w-6 !h-6" onClick={() => deleteHistory(s.id)}><IcTrash size={11} /></button>}
              </span>
            </div>
            {((compare[0]?.id === s.id) || (compare[1]?.id === s.id)) && (
              <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded-md text-[10px] font-bold" style={{ background: 'var(--color-acc)', color: '#1a0e08' }}>
                {compare[0]?.id === s.id ? 'A' : 'B'}
              </div>
            )}
          </div>
        ))}
      </div>

      {compareOpen && <CompareModal />}
    </div>
  );
}

function CompareModal() {
  const compare = useStudio(s => s.compare);
  const setCompareOpen = useStudio(s => s.setCompareOpen);
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center anim-fade-in" style={{ background: 'rgba(8,9,11,0.8)' }} onPointerDown={() => setCompareOpen(false)}>
      <div className="anim-pop w-[1000px] max-w-[96vw] rounded-2xl border border-line bg-panel p-5" onPointerDown={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <span style={{ fontFamily: 'var(--font-disp)', fontWeight: 700, fontSize: 15 }}>Design compare</span>
          <button className="icon-btn" onClick={() => setCompareOpen(false)}><IcClose size={15} /></button>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {[0, 1].map(i => {
            const s = compare[i as 0 | 1];
            return (
              <div key={i}>
                <div className="label-mono mb-2">Design {i === 0 ? 'A' : 'B'} {s && <span style={{ color: 'var(--color-acc2)' }}>· score {s.score}</span>}</div>
                {s ? (
                  <img src={s.thumb} alt={s.label} className="w-full rounded-lg border border-line" />
                ) : (
                  <div className="w-full aspect-[8/5] rounded-lg border border-dashed border-line flex items-center justify-center text-dim text-[12px]">select a design</div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
