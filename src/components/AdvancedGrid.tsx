import { useEffect, useState } from 'react';

interface DistanceGuide {
  type: 'horizontal' | 'vertical';
  position: number;
  distance: number;
  label: string;
}

interface AdvancedGridProps {
  canvasWidth: number;
  canvasHeight: number;
  zoom: number;
  selectedObject?: {
    x: number;
    y: number;
    width: number;
    height: number;
  } | null;
  otherObjects?: Array<{
    x: number;
    y: number;
    width: number;
    height: number;
  }>;
}

export function AdvancedGrid({ canvasWidth, canvasHeight, zoom, selectedObject, otherObjects = [] }: AdvancedGridProps) {
  const [guides, setGuides] = useState<DistanceGuide[]>([]);

  useEffect(() => {
    if (!selectedObject) {
      setGuides([]);
      return;
    }

    const newGuides: DistanceGuide[] = [];
    const interval = 20; // Show guides every 20px
    const maxDistance = 200; // Only show guides within 200px

    // Calculate distances from canvas edges
    const leftDist = selectedObject.x;
    const rightDist = canvasWidth - (selectedObject.x + selectedObject.width);
    const topDist = selectedObject.y;
    const bottomDist = canvasHeight - (selectedObject.y + selectedObject.height);

    // Add edge distance guides
    if (leftDist > 0 && leftDist <= maxDistance) {
      for (let d = interval; d <= leftDist; d += interval) {
        newGuides.push({
          type: 'vertical',
          position: selectedObject.x - d,
          distance: d,
          label: `${d}px`
        });
      }
    }

    if (rightDist > 0 && rightDist <= maxDistance) {
      for (let d = interval; d <= rightDist; d += interval) {
        newGuides.push({
          type: 'vertical',
          position: selectedObject.x + selectedObject.width + d,
          distance: d,
          label: `${d}px`
        });
      }
    }

    if (topDist > 0 && topDist <= maxDistance) {
      for (let d = interval; d <= topDist; d += interval) {
        newGuides.push({
          type: 'horizontal',
          position: selectedObject.y - d,
          distance: d,
          label: `${d}px`
        });
      }
    }

    if (bottomDist > 0 && bottomDist <= maxDistance) {
      for (let d = interval; d <= bottomDist; d += interval) {
        newGuides.push({
          type: 'horizontal',
          position: selectedObject.y + selectedObject.height + d,
          distance: d,
          label: `${d}px`
        });
      }
    }

    // Calculate distances from other objects
    otherObjects.forEach(obj => {
      // Horizontal distances
      const hDist1 = Math.abs(selectedObject.x - (obj.x + obj.width));
      const hDist2 = Math.abs((selectedObject.x + selectedObject.width) - obj.x);
      
      if (hDist1 > 0 && hDist1 <= maxDistance) {
        for (let d = interval; d <= hDist1; d += interval) {
          const pos = selectedObject.x - d;
          if (pos >= 0 && pos <= canvasWidth) {
            newGuides.push({
              type: 'vertical',
              position: pos,
              distance: d,
              label: `${d}px`
            });
          }
        }
      }

      if (hDist2 > 0 && hDist2 <= maxDistance) {
        for (let d = interval; d <= hDist2; d += interval) {
          const pos = selectedObject.x + selectedObject.width + d;
          if (pos >= 0 && pos <= canvasWidth) {
            newGuides.push({
              type: 'vertical',
              position: pos,
              distance: d,
              label: `${d}px`
            });
          }
        }
      }

      // Vertical distances
      const vDist1 = Math.abs(selectedObject.y - (obj.y + obj.height));
      const vDist2 = Math.abs((selectedObject.y + selectedObject.height) - obj.y);
      
      if (vDist1 > 0 && vDist1 <= maxDistance) {
        for (let d = interval; d <= vDist1; d += interval) {
          const pos = selectedObject.y - d;
          if (pos >= 0 && pos <= canvasHeight) {
            newGuides.push({
              type: 'horizontal',
              position: pos,
              distance: d,
              label: `${d}px`
            });
          }
        }
      }

      if (vDist2 > 0 && vDist2 <= maxDistance) {
        for (let d = interval; d <= vDist2; d += interval) {
          const pos = selectedObject.y + selectedObject.height + d;
          if (pos >= 0 && pos <= canvasHeight) {
            newGuides.push({
              type: 'horizontal',
              position: pos,
              distance: d,
              label: `${d}px`
            });
          }
        }
      }

      // Center alignment guides
      const selectedCenterX = selectedObject.x + selectedObject.width / 2;
      const objCenterX = obj.x + obj.width / 2;
      const selectedCenterY = selectedObject.y + selectedObject.height / 2;
      const objCenterY = obj.y + obj.height / 2;

      if (Math.abs(selectedCenterX - objCenterX) < 5) {
        newGuides.push({
          type: 'vertical',
          position: objCenterX,
          distance: 0,
          label: 'center'
        });
      }

      if (Math.abs(selectedCenterY - objCenterY) < 5) {
        newGuides.push({
          type: 'horizontal',
          position: objCenterY,
          distance: 0,
          label: 'center'
        });
      }
    });

    // Canvas center guides
    const canvasCenterX = canvasWidth / 2;
    const canvasCenterY = canvasHeight / 2;
    const selectedCenterX = selectedObject.x + selectedObject.width / 2;
    const selectedCenterY = selectedObject.y + selectedObject.height / 2;

    if (Math.abs(selectedCenterX - canvasCenterX) < 5) {
      newGuides.push({
        type: 'vertical',
        position: canvasCenterX,
        distance: 0,
        label: 'center'
      });
    }

    if (Math.abs(selectedCenterY - canvasCenterY) < 5) {
      newGuides.push({
        type: 'horizontal',
        position: canvasCenterY,
        distance: 0,
        label: 'center'
      });
    }

    setGuides(newGuides);
  }, [selectedObject, otherObjects, canvasWidth, canvasHeight]);

  if (guides.length === 0) return null;

  return (
    <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 1000 }}>
      {guides.map((guide, idx) => {
        if (guide.type === 'vertical') {
          return (
            <div key={idx} className="absolute top-0 bottom-0" style={{ left: guide.position }}>
              <div 
                className="w-px h-full" 
                style={{ 
                  background: guide.distance === 0 ? 'var(--color-acc2)' : 'var(--color-acc)',
                  opacity: guide.distance === 0 ? 0.8 : 0.4
                }} 
              />
              {guide.distance > 0 && (
                <div 
                  className="absolute top-2 -translate-x-1/2 px-1.5 py-0.5 rounded text-[9px] font-mono"
                  style={{ 
                    background: 'rgba(255,107,61,0.9)', 
                    color: 'white',
                    left: '50%'
                  }}
                >
                  {guide.label}
                </div>
              )}
            </div>
          );
        } else {
          return (
            <div key={idx} className="absolute left-0 right-0" style={{ top: guide.position }}>
              <div 
                className="h-px w-full" 
                style={{ 
                  background: guide.distance === 0 ? 'var(--color-acc2)' : 'var(--color-acc)',
                  opacity: guide.distance === 0 ? 0.8 : 0.4
                }} 
              />
              {guide.distance > 0 && (
                <div 
                  className="absolute left-2 -translate-y-1/2 px-1.5 py-0.5 rounded text-[9px] font-mono"
                  style={{ 
                    background: 'rgba(255,107,61,0.9)', 
                    color: 'white',
                    top: '50%'
                  }}
                >
                  {guide.label}
                </div>
              )}
            </div>
          );
        }
      })}
    </div>
  );
}
