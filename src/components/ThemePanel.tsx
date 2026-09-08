import { useState } from 'react';
import { extractColorsFromImage, generateThemeVariations, type ExtractedColor, type ThemeVariation } from '../utils/colorExtraction';
import { useStudio } from '../store';

export function ThemePanel() {
  const project = useStudio(s => s.project);
  const update = useStudio(s => s.update);
  const setStoreThemeVariations = useStudio(s => s.setThemeVariations);
  const [extractedColors, setExtractedColors] = useState<ExtractedColor[]>([]);
  const [themeVariations, setThemeVariations] = useState<ThemeVariation[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>('');

  const handleExtractColors = async () => {
    if (!selectedDeviceId || !project) return;

    const device = project.devices.find(d => d.id === selectedDeviceId);
    if (!device || !device.assetId) return;

    const asset = project.assets.find(a => a.id === device.assetId);
    if (!asset) return;

    setLoading(true);
    try {
      const colors = await extractColorsFromImage(asset.dataUrl, 5);
      setExtractedColors(colors);
      
      const variations = generateThemeVariations(colors);
      setThemeVariations(variations);
      
      // Save to store so variations can use them
      setStoreThemeVariations(variations);
    } catch (error) {
      console.error('Failed to extract colors:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyTheme = (variation: ThemeVariation) => {
    if (!project) return;

    update(p => ({
      ...p,
      background: {
        ...p.background,
        c1: variation.background,
        c2: variation.accent,
      },
      accents: {
        a1: variation.accent,
        a2: variation.colors[0] || variation.accent,
      },
    }));
  };

  if (!project) return null;

  const devicesWithScreenshots = project.devices.filter(d => d.assetId);

  return (
    <div className="p-4 space-y-4">
      <div>
        <h3 className="text-sm font-semibold mb-2">Smart Theme Generator</h3>
        <p className="text-xs text-muted-foreground mb-3">
          Extract colors from your screenshot and generate harmonious theme variations
        </p>
      </div>

      {devicesWithScreenshots.length > 0 ? (
        <>
          <div>
            <label className="text-xs font-medium mb-1.5 block">Select Device</label>
            <select
              value={selectedDeviceId}
              onChange={(e) => setSelectedDeviceId(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-border rounded-md bg-background"
            >
              <option value="">Choose a device...</option>
              {devicesWithScreenshots.map(device => {
                const asset = project.assets.find(a => a.id === device.assetId);
                return (
                  <option key={device.id} value={device.id}>
                    {device.name} - {asset?.name || 'Screenshot'}
                  </option>
                );
              })}
            </select>
          </div>

          <button
            onClick={handleExtractColors}
            disabled={!selectedDeviceId || loading}
            className="w-full px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Extracting...' : 'Extract Colors & Generate Themes'}
          </button>

          {extractedColors.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold mb-2">Extracted Colors</h4>
              <div className="flex gap-2">
                {extractedColors.map((color, idx) => (
                  <div key={idx} className="flex flex-col items-center">
                    <div
                      className="w-12 h-12 rounded-md border border-border"
                      style={{ backgroundColor: color.hex }}
                    />
                    <span className="text-[10px] mt-1 text-muted-foreground">
                      {color.percentage.toFixed(0)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {themeVariations.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold mb-2">Theme Variations</h4>
              <div className="grid grid-cols-2 gap-2">
                {themeVariations.map((variation, idx) => (
                  <button
                    key={idx}
                    onClick={() => applyTheme(variation)}
                    className="p-3 rounded-md border border-border hover:border-primary transition-colors text-left"
                  >
                    <div className="flex gap-1 mb-2">
                      {variation.colors.slice(0, 4).map((color, cidx) => (
                        <div
                          key={cidx}
                          className="w-6 h-6 rounded-sm border border-border"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                    <div className="text-xs font-medium">{variation.name}</div>
                    <div className="text-[10px] text-muted-foreground capitalize">
                      {variation.type}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-8">
          <p className="text-sm text-muted-foreground">
            Add a screenshot to a device to extract colors
          </p>
        </div>
      )}
    </div>
  );
}
