import { useRef, useState } from 'react';
import type { DragEvent } from 'react';
import { useStudio } from '../store';
import { BG_PRESETS, DEVICE_META, LAYOUTS } from '../templates';
import type { DeviceKind } from '../types';
import { bgStyle } from './StagePreview';
import { loadDemoAssets } from '../sampleScreens';
import { Section } from './ui';
import {
  IcBrowser, IcDevice, IcImage, IcLaptop, IcMonitor, IcPhone, IcPlus, IcSpin, IcTablet, IcTrash, IcUpload, IcWand,
} from '../icons';

const DEVICE_ICONS: Record<DeviceKind, (p: { size?: number }) => JSX.Element> = {
  laptop: IcLaptop, phone: IcPhone, tablet: IcTablet, browser: IcBrowser, monitor: IcMonitor,
};

type Tab = 'screens' | 'devices' | 'background';

export function LeftPanel() {
  const [tab, setTab] = useState<Tab>('screens');
  const tabs: { id: Tab; label: string; icon: (p: { size?: number }) => JSX.Element }[] = [
    { id: 'screens', label: 'Screens', icon: IcImage },
    { id: 'devices', label: 'Devices', icon: IcDevice },
    { id: 'background', label: 'Backdrop', icon: IcWand },
  ];
  return (
    <div className="w-[264px] shrink-0 border-r border-line2 bg-panel flex flex-col">
      <div className="flex border-b border-line2 px-2 pt-2 gap-1">
        {tabs.map(t => {
          const Icon = t.icon;
          const on = tab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className="flex items-center gap-1.5 px-3 py-2 text-[12px] font-medium transition-all duration-150"
              style={{
                borderRadius: '7px 7px 0 0',
                color: on ? 'var(--color-fg)' : 'var(--color-dim)',
                background: on ? 'var(--color-ink)' : 'transparent',
                boxShadow: on ? 'inset 0 2px 0 var(--color-acc)' : 'none',
              }}
            >
              <Icon size={14} />
              {t.label}
            </button>
          );
        })}
      </div>
      <div className="flex-1 overflow-y-auto bg-ink">
        {tab === 'screens' && <ScreensTab />}
        {tab === 'devices' && <DevicesTab />}
        {tab === 'background' && <BackgroundTab />}
      </div>
    </div>
  );
}

/* ---------------- screens ---------------- */
function ScreensTab() {
  const project = useStudio(s => s.project)!;
  const addFiles = useStudio(s => s.addFiles);
  const removeAsset = useStudio(s => s.removeAsset);
  const addAsset = useStudio(s => s.addAsset);
  const toast = useStudio(s => s.toast);
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [loadingDemo, setLoadingDemo] = useState(false);

  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    setDragging(false);
    void addFiles(e.dataTransfer.files);
  };

  return (
    <>
      <div className="p-3">
        <div
          className="transition-all duration-150 cursor-pointer text-center py-6 px-3"
          style={{
            border: `1.5px dashed ${dragging ? 'var(--color-acc)' : 'var(--color-line)'}`,
            borderRadius: 10,
            background: dragging ? 'rgba(255,107,61,0.06)' : 'var(--color-panel)',
          }}
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
        >
          <IcUpload size={20} />
          <div className="text-[12.5px] font-medium mt-1.5" style={{ color: dragging ? 'var(--color-acc)' : 'var(--color-fg)' }}>
            {dragging ? 'Drop to add' : 'Drop screenshots here'}
          </div>
          <div className="text-[10.5px] mt-0.5" style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-dim)' }}>
            browse · or Ctrl+V to paste
          </div>
          <input
            ref={inputRef} type="file" hidden multiple accept="image/png,image/jpeg,image/webp,image/svg+xml"
            onChange={(e) => { if (e.target.files) void addFiles(e.target.files); e.target.value = ''; }}
          />
        </div>

        <button
          className="btn btn-ghost w-full justify-center mt-2 text-[12px]"
          disabled={loadingDemo}
          onClick={async () => {
            setLoadingDemo(true);
            try {
              const assets = await loadDemoAssets();
              for (const a of assets) addAsset(a);
              toast('Sample screens inserted');
            } catch { toast('Could not load samples', 'err'); }
            setLoadingDemo(false);
          }}
        >
          {loadingDemo ? <IcSpin size={14} /> : <IcPlus size={14} />}
          {loadingDemo ? 'Loading samples…' : 'Insert sample screens'}
        </button>
      </div>

      <Section title={`Screenshots · ${project.assets.length}`}>
        {project.assets.length === 0 && (
          <p className="text-[11.5px] leading-relaxed" style={{ color: 'var(--color-dim)' }}>
            No screenshots yet. They auto-attach to devices as you add them.
          </p>
        )}
        <div className="space-y-1.5">
          {project.assets.map((a, i) => {
            const used = project.devices.some(d => d.assetId === a.id) || project.logo.assetId === a.id;
            return (
              <div key={a.id} className="group flex items-center gap-2.5 p-1.5 rounded-lg border border-transparent hover:border-line transition-colors">
                <img src={a.dataUrl} alt={a.name} className="w-[52px] h-9 object-cover rounded-md border border-line2" />
                <div className="flex-1 min-w-0">
                  <div className="text-[12px] font-medium truncate">{a.name}</div>
                  <div className="text-[10px]" style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-dim)' }}>
                    {a.w}×{a.h}{used && <span style={{ color: 'var(--color-acc2)' }}> · in use</span>}
                  </div>
                </div>
                <button className="icon-btn opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => removeAsset(a.id)} title="Remove">
                  <IcTrash size={13} />
                </button>
                <span className="text-[10px] pr-1" style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-dim)' }}>{String(i + 1).padStart(2, '0')}</span>
              </div>
            );
          })}
        </div>
      </Section>
    </>
  );
}

/* ---------------- devices ---------------- */
function DevicesTab() {
  const addDevice = useStudio(s => s.addDevice);
  const applyLayout = useStudio(s => s.applyLayout);
  return (
    <>
      <Section title="Add device">
        <div className="grid grid-cols-2 gap-1.5">
          {(Object.keys(DEVICE_META) as DeviceKind[]).map(kind => {
            const Icon = DEVICE_ICONS[kind];
            return (
              <button
                key={kind}
                onClick={() => addDevice(kind)}
                className="flex flex-col items-center gap-1.5 py-3 rounded-lg border border-line bg-panel hover:border-[#4a4f5c] hover:bg-panel2 transition-all duration-150 cursor-pointer group"
              >
                <span className="text-mut group-hover:text-acc transition-colors"><Icon size={19} /></span>
                <span className="text-[11.5px] font-medium">{DEVICE_META[kind].label}</span>
              </button>
            );
          })}
          <button
            onClick={() => addDevice('phone')}
            className="flex flex-col items-center justify-center gap-1 py-3 rounded-lg border border-dashed border-line text-dim hover:text-acc hover:border-acc/50 transition-all duration-150 cursor-pointer"
            title="Add another phone"
          >
            <IcPlus size={17} />
            <span className="text-[10px]" style={{ fontFamily: 'var(--font-mono)' }}>more</span>
          </button>
        </div>
      </Section>

      <Section title="Quick layouts">
        <div className="space-y-1.5">
          {LAYOUTS.map(l => (
            <button
              key={l.id}
              onClick={() => applyLayout(l.id)}
              className="w-full flex items-center gap-3 p-2 rounded-lg border border-line bg-panel hover:border-[#4a4f5c] hover:bg-panel2 transition-all duration-150 cursor-pointer text-left group"
            >
              <LayoutGlyph id={l.id} />
              <div>
                <div className="text-[12px] font-medium group-hover:text-acc transition-colors">{l.label}</div>
                <div className="text-[10px]" style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-dim)' }}>{l.desc}</div>
              </div>
            </button>
          ))}
        </div>
        <p className="text-[10.5px] mt-2.5 leading-relaxed" style={{ color: 'var(--color-dim)', fontFamily: 'var(--font-mono)' }}>
          layouts auto-bind screenshots in upload order
        </p>
      </Section>
    </>
  );
}

function LayoutGlyph({ id }: { id: string }) {
  const s = { fill: 'none', stroke: 'var(--color-mut)', strokeWidth: 1.4 } as const;
  return (
    <svg width="46" height="30" viewBox="0 0 46 30" className="shrink-0">
      {id === 'single' && <rect x="8" y="6" width="30" height="18" rx="2" {...s} />}
      {id === 'duo' && (<><rect x="4" y="7" width="26" height="16" rx="2" {...s} /><rect x="32" y="10" width="8" height="15" rx="2" {...s} /></>)}
      {id === 'responsive' && (<><rect x="2" y="6" width="22" height="14" rx="2" {...s} /><rect x="26" y="11" width="11" height="13" rx="2" {...s} /><rect x="39" y="13" width="5.5" height="11" rx="1.5" {...s} /></>)}
      {id === 'compare' && (<><rect x="3" y="7" width="18" height="16" rx="2" {...s} /><rect x="25" y="7" width="18" height="16" rx="2" {...s} /></>)}
      {id === 'phonepair' && (<><rect x="11" y="4" width="10" height="21" rx="2.5" {...s} /><rect x="25" y="7" width="10" height="21" rx="2.5" {...s} /></>)}
    </svg>
  );
}

/* ---------------- background ---------------- */
function BackgroundTab() {
  const project = useStudio(s => s.project)!;
  const update = useStudio(s => s.update);
  const checkpoint = useStudio(s => s.checkpoint);
  return (
    <Section title={`Backgrounds · ${BG_PRESETS.length}`}>
      <div className="grid grid-cols-3 gap-1.5">
        {BG_PRESETS.map(bp => {
          const active = project.background.type === bp.bg.type && project.background.c1 === bp.bg.c1 && project.background.pattern === bp.bg.pattern;
          return (
            <button
              key={bp.id}
              onClick={() => { checkpoint(); update(p => ({ ...p, background: { ...bp.bg } }), false); }}
              className="group cursor-pointer"
              title={bp.name}
            >
              <div
                className="h-[52px] rounded-lg border transition-all duration-150 group-hover:scale-[1.03]"
                style={{
                  ...bgStyle(bp.bg),
                  borderColor: active ? 'var(--color-acc)' : 'var(--color-line)',
                  boxShadow: active ? '0 0 0 3px rgba(255,107,61,0.18)' : undefined,
                }}
              />
              <div className="text-[9.5px] mt-1 truncate" style={{ fontFamily: 'var(--font-mono)', color: active ? 'var(--color-acc)' : 'var(--color-dim)' }}>
                {bp.name}
              </div>
            </button>
          );
        })}
      </div>
      <p className="text-[10.5px] mt-3 leading-relaxed" style={{ color: 'var(--color-dim)', fontFamily: 'var(--font-mono)' }}>
        fine-tune type, colors, pattern & decor in the right panel
      </p>
    </Section>
  );
}
