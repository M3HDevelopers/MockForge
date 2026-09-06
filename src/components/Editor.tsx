import { useCallback, useEffect } from 'react';
import { useStudio } from '../store';
import { makeThumbnail } from '../renderer';
import { LeftPanel } from './LeftPanel';
import { RightPanel } from './RightPanel';
import { StagePreview } from './StagePreview';
import { ExportModal } from './ExportModal';
import { clamp } from '../templates';
import {
  IcArrowL, IcDice, IcExport, IcFit, IcRedo, IcSave, IcUndo, IcZoomIn, IcZoomOut, LogoMark,
} from '../icons';

export function Editor() {
  const project = useStudio(s => s.project)!;
  const update = useStudio(s => s.update);
  const undo = useStudio(s => s.undo);
  const redo = useStudio(s => s.redo);
  const canUndo = useStudio(s => s.past.length > 0);
  const canRedo = useStudio(s => s.future.length > 0);
  const randomize = useStudio(s => s.randomize);
  const save = useStudio(s => s.save);
  const dirty = useStudio(s => s.dirty);
  const closeEditor = useStudio(s => s.closeEditor);
  const setExportOpen = useStudio(s => s.setExportOpen);
  const addFiles = useStudio(s => s.addFiles);
  const selection = useStudio(s => s.selection);
  const setSelection = useStudio(s => s.setSelection);
  const removeDevice = useStudio(s => s.removeDevice);
  const duplicateDevice = useStudio(s => s.duplicateDevice);
  const checkpoint = useStudio(s => s.checkpoint);
  const zoom = useStudio(s => s.zoom);
  const setZoom = useStudio(s => s.setZoom);
  const toast = useStudio(s => s.toast);

  const saveNow = useCallback(async (silent = false) => {
    const p = useStudio.getState().project;
    if (!p) return;
    try {
      const thumb = await makeThumbnail(p);
      update(pp => ({ ...pp, thumbnail: thumb }), false);
    } catch { /* thumbnail best-effort */ }
    useStudio.getState().save(silent);
  }, [update]);

  /* keyboard shortcuts */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement;
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.isContentEditable) return;
      const mod = e.ctrlKey || e.metaKey;
      if (mod && e.key.toLowerCase() === 'z') { e.preventDefault(); e.shiftKey ? redo() : undo(); }
      else if (mod && e.key.toLowerCase() === 'y') { e.preventDefault(); redo(); }
      else if (mod && e.key.toLowerCase() === 's') { e.preventDefault(); void saveNow(false); }
      else if (mod && e.key.toLowerCase() === 'd') {
        if (selection?.kind === 'device' && selection.id) { e.preventDefault(); duplicateDevice(selection.id); }
      }
      else if ((e.key === 'Delete' || e.key === 'Backspace') && selection?.kind === 'device' && selection.id) {
        e.preventDefault(); removeDevice(selection.id);
      }
      else if (e.key === 'Escape') setSelection(null);
      else if (e.key.startsWith('Arrow') && selection?.kind === 'device' && selection.id) {
        e.preventDefault();
        const step = e.shiftKey ? 20 : 4;
        const dx = e.key === 'ArrowLeft' ? -step : e.key === 'ArrowRight' ? step : 0;
        const dy = e.key === 'ArrowUp' ? -step : e.key === 'ArrowDown' ? step : 0;
        checkpoint();
        update(p => ({ ...p, devices: p.devices.map(d => d.id === selection.id ? { ...d, x: d.x + dx, y: d.y + dy } : d) }), false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [undo, redo, saveNow, selection, duplicateDevice, removeDevice, setSelection, checkpoint, update]);

  /* paste screenshots */
  useEffect(() => {
    const onPaste = (e: ClipboardEvent) => {
      const files = Array.from(e.clipboardData?.files ?? []).filter(f => f.type.startsWith('image/'));
      if (files.length) { e.preventDefault(); void addFiles(files); }
    };
    window.addEventListener('paste', onPaste);
    return () => window.removeEventListener('paste', onPaste);
  }, [addFiles]);

  const fitZoom = () => {
    const availW = window.innerWidth - 264 - 292 - 120;
    const availH = window.innerHeight - 48 - 70;
    setZoom(clamp(Math.min(availW / project.canvas.w, availH / project.canvas.h), 0.1, 2));
  };

  useEffect(() => { fitZoom(); /* on mount */ // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="h-full flex flex-col anim-fade-in">
      {/* top bar */}
      <div className="h-12 shrink-0 flex items-center gap-2 px-3 border-b border-line2 bg-panel relative z-20">
        <button className="icon-btn" onClick={closeEditor} title="Back to dashboard"><IcArrowL size={16} /></button>
        <LogoMark size={19} />
        <input
          className="bg-transparent outline-none border border-transparent hover:border-line focus:border-acc rounded-md px-2 py-1 transition-colors w-[220px]"
          style={{ fontFamily: 'var(--font-disp)', fontWeight: 600, fontSize: 14 }}
          value={project.name}
          onChange={(e) => update(p => ({ ...p, name: e.target.value }), false)}
          onFocus={() => checkpoint()}
        />
        <span className="flex items-center gap-1.5 text-[10px]" style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-dim)' }}>
          <span style={{ width: 7, height: 7, borderRadius: 99, background: dirty ? 'var(--color-gold)' : 'var(--color-acc2)', animation: dirty ? 'pulseDot 1.4s infinite' : undefined }} />
          {dirty ? 'unsaved' : 'saved'}
        </span>

        <div className="flex-1" />

        <button className="icon-btn" disabled={!canUndo} onClick={undo} title="Undo (Ctrl+Z)"><IcUndo size={15} /></button>
        <button className="icon-btn" disabled={!canRedo} onClick={redo} title="Redo (Ctrl+Shift+Z)"><IcRedo size={15} /></button>

        <div className="w-px h-5 bg-line mx-1" />

        <button className="btn" onClick={randomize} title="Rule-based variation — backgrounds, tilts, shadows, decor">
          <IcDice size={14} />
          <span>Surprise me</span>
        </button>
        <button className="btn" onClick={() => void saveNow(false)}>
          <IcSave size={14} />
          <span>Save</span>
        </button>
        <button className="btn btn-acc" onClick={() => setExportOpen(true)}>
          <IcExport size={14} />
          <span>Export</span>
        </button>
      </div>

      {/* body */}
      <div className="flex-1 flex min-h-0">
        <LeftPanel />
        <div className="flex-1 flex flex-col min-w-0">
          <StagePreview />
          {/* status bar */}
          <div className="h-9 shrink-0 border-t border-line2 bg-panel flex items-center justify-between px-3">
            <span className="text-[10.5px] hidden md:block" style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-dim)' }}>
              drag to move · corner handle to resize · ctrl+scroll to zoom · ctrl+v paste screenshot
            </span>
            <div className="flex items-center gap-1">
              <button className="icon-btn !w-7 !h-7" onClick={() => setZoom(zoom * 0.85)}><IcZoomOut size={13} /></button>
              <span className="text-[10.5px] w-10 text-center" style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-mut)' }}>{Math.round(zoom * 100)}%</span>
              <button className="icon-btn !w-7 !h-7" onClick={() => setZoom(zoom * 1.18)}><IcZoomIn size={13} /></button>
              <button className="icon-btn !w-7 !h-7" onClick={fitZoom} title="Fit to screen"><IcFit size={13} /></button>
            </div>
          </div>
        </div>
        <RightPanel />
      </div>

      <ExportModal />
      {project.devices.length === 0 && project.assets.length === 0 && (
        <FirstRunHint onPick={() => toast('Add a device or drop a screenshot to begin', 'info')} />
      )}
    </div>
  );
}

function FirstRunHint({ onPick }: { onPick: () => void }) {
  return (
    <button
      onClick={onPick}
      className="fixed bottom-14 left-1/2 -translate-x-1/2 z-30 anim-fade-up flex items-center gap-2 px-4 py-2 rounded-full border border-line bg-panel2 shadow-xl cursor-pointer hover:border-[#4a4f5c] transition-colors"
      style={{ animationDelay: '.6s' }}
    >
      <span style={{ width: 7, height: 7, borderRadius: 99, background: 'var(--color-acc)', animation: 'pulseDot 1.6s infinite' }} />
      <span className="text-[12px] text-mut">
        Start: drop a screenshot, or try <span className="text-fg font-medium">Insert sample screens</span> in the Screens tab
      </span>
    </button>
  );
}
