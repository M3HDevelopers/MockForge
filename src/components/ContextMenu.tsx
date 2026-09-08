import { useEffect, useRef, useState } from 'react';
import { useStudio } from '../store';
import { IcCopy, IcTrash, IcLock, IcUnlock, IcEye, IcEyeOff, IcArrowL, IcArrowR, IcLayers, IcType } from '../icons';

interface ContextMenuProps {
  x: number;
  y: number;
  onClose: () => void;
}

export function ContextMenu({ x, y, onClose }: ContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const selection = useStudio(s => s.selection);
  const project = useStudio(s => s.project)!;
  const update = useStudio(s => s.update);
  const checkpoint = useStudio(s => s.checkpoint);
  const removeDevice = useStudio(s => s.removeDevice);
  const duplicateDevice = useStudio(s => s.duplicateDevice);
  const toast = useStudio(s => s.toast);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  const menuItemClass = "flex items-center gap-2 px-3 py-2 text-[12px] cursor-pointer hover:bg-panel2 transition-colors";

  const handleDuplicate = () => {
    if (selection?.kind === 'device' && selection.id) {
      checkpoint();
      duplicateDevice(selection.id);
      toast('Duplicated');
    }
    onClose();
  };

  const handleDelete = () => {
    if (selection?.kind === 'device' && selection.id) {
      checkpoint();
      removeDevice(selection.id);
      toast('Deleted');
    }
    onClose();
  };

  const handleBringForward = () => {
    if (selection?.kind === 'device' && selection.id) {
      checkpoint();
      update(p => ({
        ...p,
        devices: p.devices.map(d => {
          if (d.id === selection.id) {
            const currentIndex = p.devices.findIndex(dev => dev.id === d.id);
            if (currentIndex < p.devices.length - 1) {
              const newDevices = [...p.devices];
              [newDevices[currentIndex], newDevices[currentIndex + 1]] = [newDevices[currentIndex + 1], newDevices[currentIndex]];
              return newDevices;
            }
          }
          return d;
        }).flat()
      }));
      toast('Brought forward');
    }
    onClose();
  };

  const handleSendBackward = () => {
    if (selection?.kind === 'device' && selection.id) {
      checkpoint();
      update(p => ({
        ...p,
        devices: p.devices.map(d => {
          if (d.id === selection.id) {
            const currentIndex = p.devices.findIndex(dev => dev.id === d.id);
            if (currentIndex > 0) {
              const newDevices = [...p.devices];
              [newDevices[currentIndex], newDevices[currentIndex - 1]] = [newDevices[currentIndex - 1], newDevices[currentIndex]];
              return newDevices;
            }
          }
          return d;
        }).flat()
      }));
      toast('Sent backward');
    }
    onClose();
  };

  if (!selection || selection.kind === 'background') {
    return (
      <div
        ref={menuRef}
        className="fixed z-[9999] bg-panel border border-line rounded-lg shadow-2xl py-1 min-w-[200px] anim-pop"
        style={{ left: x, top: y }}
      >
        <div className={menuItemClass} style={{ color: 'var(--color-dim)' }}>
          <IcLayers size={14} />
          <span>Background selected</span>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={menuRef}
      className="fixed z-[9999] bg-panel border border-line rounded-lg shadow-2xl py-1 min-w-[200px] anim-pop"
      style={{ left: x, top: y }}
    >
      {selection.kind === 'device' && (
        <>
          <div className={menuItemClass} onClick={handleDuplicate}>
            <IcCopy size={14} />
            <span>Duplicate</span>
            <span className="ml-auto text-[10px]" style={{ color: 'var(--color-dim)' }}>Ctrl+D</span>
          </div>
          <div className={menuItemClass} onClick={handleDelete}>
            <IcTrash size={14} />
            <span>Delete</span>
            <span className="ml-auto text-[10px]" style={{ color: 'var(--color-dim)' }}>Del</span>
          </div>
          <div className="h-px bg-line my-1" />
          <div className={menuItemClass} onClick={handleBringForward}>
            <IcArrowR size={14} className="rotate-90" />
            <span>Bring Forward</span>
            <span className="ml-auto text-[10px]" style={{ color: 'var(--color-dim)' }}>Ctrl+]</span>
          </div>
          <div className={menuItemClass} onClick={handleSendBackward}>
            <IcArrowL size={14} className="rotate-90" />
            <span>Send Backward</span>
            <span className="ml-auto text-[10px]" style={{ color: 'var(--color-dim)' }}>Ctrl+[</span>
          </div>
          <div className="h-px bg-line my-1" />
          <div className={menuItemClass} style={{ color: 'var(--color-dim)' }}>
            <IcType size={14} />
            <span>Edit Properties</span>
          </div>
        </>
      )}

      {selection.kind === 'icon' && (
        <>
          <div className={menuItemClass} style={{ color: 'var(--color-dim)' }}>
            <IcType size={14} />
            <span>Edit Icon</span>
          </div>
          <div className={menuItemClass} style={{ color: 'var(--color-dim)' }}>
            <IcTrash size={14} />
            <span>Delete Icon</span>
          </div>
        </>
      )}

      {selection.kind === 'textbox' && (
        <>
          <div className={menuItemClass} style={{ color: 'var(--color-dim)' }}>
            <IcType size={14} />
            <span>Edit Text</span>
          </div>
          <div className={menuItemClass} style={{ color: 'var(--color-dim)' }}>
            <IcTrash size={14} />
            <span>Delete Text</span>
          </div>
        </>
      )}

      {selection.kind === 'deco' && (
        <>
          <div className={menuItemClass} style={{ color: 'var(--color-dim)' }}>
            <IcType size={14} />
            <span>Edit Decoration</span>
          </div>
          <div className={menuItemClass} style={{ color: 'var(--color-dim)' }}>
            <IcTrash size={14} />
            <span>Delete Decoration</span>
          </div>
        </>
      )}
    </div>
  );
}
