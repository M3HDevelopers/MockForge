import { useEffect, useRef } from 'react';
import type { CSSProperties, PointerEvent as RPointerEvent } from 'react';
import { useStudio } from '../store';
import type { Background, DeviceLayer, Project } from '../types';
import {
  clamp, computeFit, deviceGeometry, DEVICE_META, getDecoShapes, luminance, textOn,
} from '../templates';
import { patternColor, patternDataUri } from '../renderer';
import { DeviceFrame } from './DeviceFrame';

/* ---------- background → CSS ---------- */
export function bgStyle(b: Background): CSSProperties {
  if (b.type === 'solid') return { background: b.c1 };
  if (b.type === 'linear') return { background: `linear-gradient(${b.angle}deg, ${b.c1}, ${b.c2})` };
  if (b.type === 'radial') return { background: `radial-gradient(120% 120% at 50% 42%, ${b.c1}, ${b.c2})` };
  return {
    background: `radial-gradient(70% 70% at 82% 16%, ${b.c2}77, transparent 70%), radial-gradient(65% 65% at 14% 88%, ${b.c3}6e, transparent 70%), ${b.c1}`,
  };
}

/* ---------- decoration ---------- */
function DecoLayer({ p }: { p: Project }) {
  const shapes = getDecoShapes(p.decoration.set, p.decoration.seed, p.canvas.w, p.canvas.h, p.decoration.intensity, p.accents.a1, p.accents.a2);
  if (!shapes.length) return null;
  return (
    <svg className="absolute inset-0 pointer-events-none" width={p.canvas.w} height={p.canvas.h} viewBox={`0 0 ${p.canvas.w} ${p.canvas.h}`}>
      {shapes.map((s, i) => {
        const common = { transform: `rotate(${(s.rot * 180) / Math.PI} ${s.x} ${s.y})`, opacity: s.o };
        if (s.t === 'circle') return <circle key={i} cx={s.x} cy={s.y} r={s.r} fill={s.color} {...common} />;
        if (s.t === 'ring') return <circle key={i} cx={s.x} cy={s.y} r={s.r} fill="none" stroke={s.color} strokeWidth={Math.max(1.5, s.r * 0.12)} {...common} />;
        if (s.t === 'plus') return (
          <g key={i} {...common} stroke={s.color} strokeWidth={Math.max(2, s.r * 0.4)} strokeLinecap="round">
            <line x1={s.x - s.r} y1={s.y} x2={s.x + s.r} y2={s.y} />
            <line x1={s.x} y1={s.y - s.r} x2={s.x} y2={s.y + s.r} />
          </g>
        );
        if (s.t === 'sparkle') {
          const d = `M ${s.x} ${s.y - s.r} Q ${s.x + s.r * 0.16} ${s.y - s.r * 0.16} ${s.x + s.r} ${s.y} Q ${s.x + s.r * 0.16} ${s.y + s.r * 0.16} ${s.x} ${s.y + s.r} Q ${s.x - s.r * 0.16} ${s.y + s.r * 0.16} ${s.x - s.r} ${s.y} Q ${s.x - s.r * 0.16} ${s.y - s.r * 0.16} ${s.x} ${s.y - s.r} Z`;
          return <path key={i} d={d} fill={s.color} {...common} />;
        }
        if (s.t === 'line') {
          let d = '';
          for (let k = 0; k <= 40; k++) {
            const x = s.x - s.r + (k / 40) * s.r * 2;
            const y = s.y + Math.sin((k / 40) * Math.PI * 3) * s.r * 0.22;
            d += (k === 0 ? 'M' : 'L') + x.toFixed(1) + ' ' + y.toFixed(1) + ' ';
          }
          return <path key={i} d={d} fill="none" stroke={s.color} strokeWidth={2} strokeLinecap="round" {...common} />;
        }
        const step = s.r * 0.42;
        return (
          <g key={i} {...common} fill={s.color}>
            {Array.from({ length: 25 }).map((_, k) => (
              <circle key={k} cx={s.x - s.r + (k % 5) * step} cy={s.y - s.r + Math.floor(k / 5) * step} r={Math.max(1.2, s.r * 0.07)} />
            ))}
          </g>
        );
      })}
    </svg>
  );
}

/* ---------- screenshot inside a device ---------- */
function ScreenImage({ d, dataUrl, iw, ih }: { d: DeviceLayer; dataUrl: string; iw: number; ih: number }) {
  const h = d.w / DEVICE_META[d.kind].aspect;
  const g = deviceGeometry(d.kind, d.w, h);
  const f = computeFit(g, iw, ih, d.fit, d.zoom, d.panX, d.panY);
  return (
    <div className="absolute overflow-hidden" style={{ left: g.x, top: g.y, width: g.w, height: g.h, borderRadius: g.r }}>
      <img
        src={dataUrl} alt="" draggable={false}
        className="absolute select-none"
        style={{ left: f.dx - g.x, top: f.dy - g.y, width: f.dw, height: f.dh, pointerEvents: 'none' }}
      />
    </div>
  );
}

function PlaceholderScreen({ d }: { d: DeviceLayer }) {
  const h = d.w / DEVICE_META[d.kind].aspect;
  const g = deviceGeometry(d.kind, d.w, h);
  return (
    <div
      className="absolute flex items-center justify-center"
      style={{
        left: g.x, top: g.y, width: g.w, height: g.h, borderRadius: g.r,
        background: 'repeating-linear-gradient(45deg, #14161b 0 10px, #171a20 10px 20px)',
      }}
    >
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: clamp(g.w * 0.045, 10, 22), color: 'rgba(255,255,255,0.32)' }}>+ add screenshot</span>
    </div>
  );
}

/* ---------- text overlay ---------- */
function TextOverlay({ p }: { p: Project }) {
  const t = p.text;
  if (!t.enabled || (!t.title && !t.subtitle && !(t.showBadges && t.badges.length))) return null;
  const { w: cw, h: ch } = p.canvas;
  const M = Math.round(Math.min(cw, ch) * 0.055);
  const ts = clamp(cw * 0.037, 24, 58) * t.scale;
  const k = clamp(ts / 40, 0.7, 1.4);
  const color = t.autoColor ? textOn(p.background.c1) : t.color;
  const selected = useStudio(s => s.selection?.kind === 'text');
  const setSelection = useStudio(s => s.setSelection);

  const align = t.position.includes('left') ? 'flex-start' : t.position.includes('right') ? 'flex-end' : 'center';
  const justify = t.position.startsWith('top') ? 'flex-start' : t.position.startsWith('bottom') ? 'flex-end' : 'center';

  return (
    <div className="absolute inset-0 flex flex-col pointer-events-none" style={{ padding: M, alignItems: align, justifyContent: justify }}>
      <div
        className={`flex flex-col cursor-default pointer-events-auto ${selected ? 'sel-ring' : ''}`}
        style={{ alignItems: align, maxWidth: '92%' }}
        onPointerDown={(e) => { e.stopPropagation(); setSelection({ kind: 'text' }); }}
      >
        {t.title && (
          <div style={{ fontFamily: 'var(--font-disp)', fontWeight: 700, fontSize: ts, lineHeight: 1.1, color, textAlign: align === 'center' ? 'center' : align === 'flex-end' ? 'right' : 'left' }}>
            {t.title}
          </div>
        )}
        {t.subtitle && (
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: ts * 0.34, letterSpacing: 1.6 * k, textTransform: 'uppercase', color, opacity: 0.72, marginTop: t.title ? ts * 0.34 : 0 }}>
            {t.subtitle}
          </div>
        )}
        {t.showBadges && t.badges.length > 0 && (
          <div className="flex flex-wrap gap-[8px]" style={{ marginTop: (t.title || t.subtitle) ? ts * 0.42 : 0, justifyContent: align === 'center' ? 'center' : align }}>
            {t.badges.map(b => {
              const lightText = luminance(color) > 0.5;
              return (
                <span
                  key={b}
                  style={{
                    fontFamily: 'var(--font-mono)', fontSize: 12.5 * k, color,
                    padding: `${5 * k}px ${12 * k}px`, borderRadius: 999,
                    background: lightText ? 'rgba(255,255,255,0.1)' : 'rgba(21,23,28,0.07)',
                    border: `1px solid ${lightText ? 'rgba(255,255,255,0.18)' : 'rgba(21,23,28,0.16)'}`,
                  }}
                >
                  {b}
                </span>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------- logo overlay ---------- */
function LogoOverlay({ p }: { p: Project }) {
  const setSelection = useStudio(s => s.setSelection);
  const selected = useStudio(s => s.selection?.kind === 'logo');
  if (!p.logo.enabled || !p.logo.assetId) return null;
  const asset = p.assets.find(a => a.id === p.logo.assetId);
  if (!asset) return null;
  const M = Math.round(Math.min(p.canvas.w, p.canvas.h) * 0.055);
  const lw = p.logo.size * p.canvas.w;
  const lh = lw * (asset.h / asset.w);
  const pos = p.logo.position;
  const x = pos.includes('left') ? M : pos.includes('right') ? p.canvas.w - M - lw : (p.canvas.w - lw) / 2;
  const y = pos.startsWith('top') ? M : pos.startsWith('bottom') ? p.canvas.h - M - lh : (p.canvas.h - lh) / 2;
  return (
    <img
      src={asset.dataUrl} alt="logo" draggable={false}
      className={`absolute cursor-default ${selected ? 'sel-ring' : ''}`}
      style={{ left: x, top: y, width: lw, height: lh, opacity: p.logo.opacity }}
      onPointerDown={(e) => { e.stopPropagation(); setSelection({ kind: 'logo' }); }}
    />
  );
}

/* ---------- device layer ---------- */
function DeviceNode({ d }: { d: DeviceLayer }) {
  const p = useStudio(s => s.project)!;
  const selected = useStudio(s => s.selection?.kind === 'device' && s.selection.id === d.id);
  const setSelection = useStudio(s => s.setSelection);
  const update = useStudio(s => s.update);
  const checkpoint = useStudio(s => s.checkpoint);
  const zoom = useStudio(s => s.zoom);
  const asset = p.assets.find(a => a.id === d.assetId);
  const h = d.w / DEVICE_META[d.kind].aspect;
  const dragRef = useRef<{ mode: 'move' | 'resize'; sx: number; sy: number; ox: number; oy: number; ow: number } | null>(null);

  const onDown = (e: RPointerEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setSelection({ kind: 'device', id: d.id });
    checkpoint();
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    dragRef.current = { mode: 'move', sx: e.clientX, sy: e.clientY, ox: d.x, oy: d.y, ow: d.w };
  };
  const onMove = (e: RPointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag) return;
    const dx = (e.clientX - drag.sx) / zoom;
    const dy = (e.clientY - drag.sy) / zoom;
    if (drag.mode === 'move') {
      update(dd => ({ ...dd, devices: dd.devices.map(x => x.id === d.id ? { ...x, x: drag.ox + dx, y: drag.oy + dy } : x) }), false);
    } else {
      const nw = clamp(drag.ow + dx, 90, p.canvas.w * 1.1);
      update(dd => ({ ...dd, devices: dd.devices.map(x => x.id === d.id ? { ...x, w: nw } : x) }), false);
    }
  };
  const onUp = () => { dragRef.current = null; };

  return (
    <div
      className="absolute cursor-move"
      style={{ left: d.x, top: d.y, width: d.w, height: h, transform: `rotate(${d.tilt}deg)`, display: d.visible ? undefined : 'none' }}
      onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp}
    >
      <DeviceFrame kind={d.kind} color={d.color} w={d.w} h={h} part="back" url={d.url} />
      {asset
        ? <ScreenImage d={d} dataUrl={asset.dataUrl} iw={asset.w} ih={asset.h} />
        : <PlaceholderScreen d={d} />}
      <DeviceFrame kind={d.kind} color={d.color} w={d.w} h={h} part="front" url={d.url} />

      {selected && (
        <>
          <svg className="absolute pointer-events-none" style={{ left: -7, top: -7, width: d.w + 14, height: h + 14 }}>
            <rect className="sel-ring-svg" x={1} y={1} width={d.w + 12} height={h + 12} rx={8} />
          </svg>
          <div
            className="absolute z-10"
            style={{ left: -7, top: -30, background: 'var(--color-acc)', color: '#1a0e08', fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 5, letterSpacing: '0.06em', whiteSpace: 'nowrap' }}
          >
            {d.name.toUpperCase()}
          </div>
          <div
            className="absolute z-10"
            style={{ right: -8, bottom: -8, width: 15, height: 15, background: 'var(--color-acc)', border: '2.5px solid #101114', borderRadius: 5, cursor: 'nwse-resize' }}
            onPointerDown={(e) => {
              e.stopPropagation();
              checkpoint();
              (e.target as HTMLElement).setPointerCapture(e.pointerId);
              dragRef.current = { mode: 'resize', sx: e.clientX, sy: e.clientY, ox: d.x, oy: d.y, ow: d.w };
            }}
          />
        </>
      )}
    </div>
  );
}

/* ---------- stage ---------- */
export function StagePreview() {
  const p = useStudio(s => s.project)!;
  const zoom = useStudio(s => s.zoom);
  const setZoom = useStudio(s => s.setZoom);
  const setSelection = useStudio(s => s.setSelection);
  const selection = useStudio(s => s.selection);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      if (!e.ctrlKey && !e.metaKey) return;
      e.preventDefault();
      setZoom(zoom * (e.deltaY < 0 ? 1.08 : 0.92));
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [zoom, setZoom]);

  const W = p.canvas.w * zoom, H = p.canvas.h * zoom;

  return (
    <div ref={wrapRef} className="workspace-bg relative flex-1 overflow-auto noise-overlay">
      <div className="min-h-full min-w-full flex items-center justify-center p-14 relative z-10" style={{ width: 'max-content', minWidth: '100%', minHeight: '100%' }}>
        <div
          className={`relative shadow-[0_30px_90px_rgba(0,0,0,0.55)] ${selection?.kind === 'background' ? 'sel-ring' : ''}`}
          style={{ width: W, height: H }}
          onPointerDown={() => setSelection({ kind: 'background' })}
        >
          <div className="absolute top-0 left-0 origin-top-left overflow-hidden" style={{ width: p.canvas.w, height: p.canvas.h, transform: `scale(${zoom})` }}>
            {/* background */}
            <div className="absolute inset-0" style={bgStyle(p.background)} />
            {p.background.pattern !== 'none' && p.background.patternOpacity > 0 && (
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: patternDataUri(p.background.pattern, patternColor(p.background.c1)),
                  opacity: p.background.patternOpacity,
                }}
              />
            )}
            <DecoLayer p={p} />
            {p.devices.map(d => <DeviceNode key={d.id} d={d} />)}
            <LogoOverlay p={p} />
            <TextOverlay p={p} />

            {p.devices.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="px-6 py-4 text-center" style={{ border: '1.5px dashed rgba(255,255,255,0.25)', borderRadius: 12 }}>
                  <div style={{ fontFamily: 'var(--font-disp)', fontWeight: 600, fontSize: 20, color: textOn(p.background.c1) }}>Canvas is empty</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: textOn(p.background.c1), opacity: 0.6, marginTop: 4 }}>add a device from the left panel</div>
                </div>
              </div>
            )}
          </div>

          {/* size tag */}
          <div className="absolute -bottom-7 left-0 flex items-center gap-2" style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, color: 'var(--color-dim)' }}>
            <span>{p.canvas.w} × {p.canvas.h}</span>
            <span style={{ color: '#3a3f4b' }}>·</span>
            <span>{p.devices.length} device{p.devices.length === 1 ? '' : 's'}</span>
            <span style={{ color: '#3a3f4b' }}>·</span>
            <span>{Math.round(zoom * 100)}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
