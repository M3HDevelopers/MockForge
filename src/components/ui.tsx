import type { ReactNode } from 'react';
import type { PosPreset } from '../types';
import { POSITIONS } from '../templates';

export function Section({ title, right, children }: { title: string; right?: ReactNode; children: ReactNode }) {
  return (
    <div className="px-4 py-3.5 border-b border-line2">
      <div className="flex items-center justify-between mb-2.5">
        <span className="label-mono">{title}</span>
        {right}
      </div>
      {children}
    </div>
  );
}

export function SliderRow({ label, value, min, max, step = 1, fmt, onChange, onStart }: {
  label: string; value: number; min: number; max: number; step?: number;
  fmt?: (v: number) => string; onChange: (v: number) => void; onStart?: () => void;
}) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div className="mb-2 last:mb-0">
      <div className="flex items-center justify-between mb-0.5">
        <span className="text-[12px] text-mut">{label}</span>
        <span className="text-[11px] text-dim" style={{ fontFamily: 'var(--font-mono)' }}>{fmt ? fmt(value) : value}</span>
      </div>
      <input
        type="range" className="slider" min={min} max={max} step={step} value={value}
        style={{ ['--fill' as string]: `${pct}%` }}
        onPointerDown={onStart}
        onChange={(e) => onChange(parseFloat(e.target.value))}
      />
    </div>
  );
}

export function Seg<T extends string>({ options, value, onChange }: {
  options: { id: T; label: string }[]; value: T; onChange: (v: T) => void;
}) {
  return (
    <div className="seg">
      {options.map(o => (
        <button key={o.id} className={o.id === value ? 'on' : ''} onClick={() => onChange(o.id)}>{o.label}</button>
      ))}
    </div>
  );
}

export function Toggle({ on, onChange, label }: { on: boolean; onChange: (v: boolean) => void; label?: string }) {
  return (
    <button
      className="flex items-center gap-2 group"
      onClick={() => onChange(!on)}
    >
      <span
        className="relative inline-block transition-colors duration-150"
        style={{ width: 32, height: 18, borderRadius: 999, background: on ? 'var(--color-acc)' : '#2c3038' }}
      >
        <span
          className="absolute top-[2px] transition-all duration-150"
          style={{ left: on ? 16 : 2, width: 14, height: 14, borderRadius: 999, background: on ? '#1a0e08' : '#9aa1ad' }}
        />
      </span>
      {label && <span className="text-[12px] text-mut group-hover:text-fg transition-colors">{label}</span>}
    </button>
  );
}

export function PosGrid({ value, onChange }: { value: PosPreset; onChange: (v: PosPreset) => void }) {
  return (
    <div className="grid grid-cols-3 gap-1.5" style={{ width: 104 }}>
      {POSITIONS.map(pos => (
        <button
          key={pos}
          onClick={() => onChange(pos)}
          className="transition-all duration-120"
          style={{
            height: 22, borderRadius: 5,
            border: `1px solid ${value === pos ? 'var(--color-acc)' : 'var(--color-line)'}`,
            background: value === pos ? 'rgba(255,107,61,0.16)' : 'var(--color-ink)',
            cursor: 'pointer',
          }}
          title={pos}
        >
          <span
            className="inline-block"
            style={{ width: 8, height: 5, borderRadius: 1.5, background: value === pos ? 'var(--color-acc)' : '#3a3f4b' }}
          />
        </button>
      ))}
    </div>
  );
}

export function ColorInput({ value, onChange, label }: { value: string; onChange: (v: string) => void; label?: string }) {
  return (
    <label className="flex items-center gap-2 cursor-pointer">
      <input type="color" className="swatch-input" value={value} onChange={(e) => onChange(e.target.value)} />
      {label && <span className="text-[11px] text-mut" style={{ fontFamily: 'var(--font-mono)' }}>{label}</span>}
    </label>
  );
}
