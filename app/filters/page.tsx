"use client";


import { useState, useRef, useEffect } from "react";
import {
  FilterSettings,
  defaultFilterSettings,
  getFilterCSS,
  canvasToBlob,
  downloadBlob,
  downloadImage,
  filterPresets,
} from "@/lib/utils/imageProcessing";

interface HistoryState {
  settings: FilterSettings;
}

export default function FiltersPage() {
  const [image, setImage] = useState<string | null>(null);
  const [settings, setSettings] = useState<FilterSettings>(defaultFilterSettings);
  const [history, setHistory] = useState<HistoryState[]>([{ settings: defaultFilterSettings }]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [customPresets, setCustomPresets] = useState<Record<string, FilterSettings>>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('customFilterPresets');
      return saved ? JSON.parse(saved) : {};
    }
    return {};
  });
  const [presetName, setPresetName] = useState("");
  const [exportFormat, setExportFormat] = useState<"jpg" | "png" | "webp">("jpg");
  const [exportQuality, setExportQuality] = useState(95);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImage(event.target?.result as string);
        setSettings(defaultFilterSettings);
        setHistory([{ settings: defaultFilterSettings }]);
        setHistoryIndex(0);
      };
      reader.readAsDataURL(file);
    }
  };

  const updateSettings = (newSettings: FilterSettings) => {
    setSettings(newSettings);
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push({ settings: newSettings });
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const undo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setSettings(history[newIndex].settings);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setSettings(history[newIndex].settings);
    }
  };

  useEffect(() => {
    if (image && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const img = new Image();
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;

        const filterCSS = getFilterCSS(settings);
        ctx.filter = filterCSS;
        ctx.drawImage(img, 0, 0);
      };
      img.src = image;
    }
  }, [image, settings]);

  const handleDownload = async () => {
    if (canvasRef.current) {
      await downloadImage(canvasRef.current, "filtered-image", exportFormat, exportQuality / 100);
    }
  };

  const handleReset = () => {
    updateSettings(defaultFilterSettings);
  };

  const savePreset = () => {
    if (presetName.trim()) {
      const updated = { ...customPresets, [presetName]: settings };
      setCustomPresets(updated);
      localStorage.setItem('customFilterPresets', JSON.stringify(updated));
      setPresetName("");
    }
  };

  const loadPreset = (preset: FilterSettings) => {
    updateSettings(preset);
  };

  const deletePreset = (name: string) => {
    const updated = { ...customPresets };
    delete updated[name];
    setCustomPresets(updated);
    localStorage.setItem('customFilterPresets', JSON.stringify(updated));
  };

  return (
    <main className="min-h-screen pb-16 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="mb-12 animate-fadeInDown">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
              <span className="text-gradient">Image Filters</span>
            </h1>
            <p className="text-xl text-white/70">
              Enhance your images with professional filters in real-time
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Controls Panel */}
            <div className="lg:col-span-1 animate-slideInFromLeft">
              <div className="glass-effect rounded-2xl p-8 sticky top-20 backdrop-blur-xl max-h-[85vh] overflow-y-auto">
                <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-2">
                  <span>⚙️</span> Controls
                </h2>

                {/* Upload */}
                <div className="mb-8">
                  <label className="block text-sm font-bold text-white/80 mb-3 uppercase tracking-wide">
                    📁 Upload Image
                  </label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="w-full px-4 py-3 bg-white/10 border-2 border-white/20 rounded-lg cursor-pointer text-white/70 hover:border-purple-400/50 hover:bg-white/20 transition-all duration-300 placeholder-white/50"
                  />
                </div>

                {image && (
                  <>
                    {/* Undo/Redo */}
                    <div className="mb-8 flex gap-2">
                      <button
                        onClick={undo}
                        disabled={historyIndex === 0}
                        className="flex-1 px-3 py-2 bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-lg transition-all duration-300 text-sm"
                      >
                        ↶ Undo
                      </button>
                      <button
                        onClick={redo}
                        disabled={historyIndex === history.length - 1}
                        className="flex-1 px-3 py-2 bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-lg transition-all duration-300 text-sm"
                      >
                        ↷ Redo
                      </button>
                    </div>

                    {/* Presets */}
                    <div className="mb-8 pb-8 border-b border-white/10">
                      <label className="block text-sm font-bold text-white/80 mb-4 uppercase tracking-wide">
                        ✨ Filter Presets
                      </label>
                      <div className="grid grid-cols-2 gap-3 max-h-64 overflow-y-auto">
                        {filterPresets.map((preset) => (
                          <button
                            key={preset.name}
                            onClick={() => updateSettings(preset.settings)}
                            className={`px-3 py-2 rounded-lg font-bold text-sm transition-all duration-300 transform hover:scale-105 active:scale-95 ${
                              JSON.stringify(settings) === JSON.stringify(preset.settings)
                                ? "gradient-primary text-white shadow-lg shadow-purple-500/50 border border-purple-400"
                                : "bg-white/10 text-white hover:bg-white/20 border border-white/20"
                            }`}
                          >
                            <span className="mr-1">{preset.emoji}</span>
                            {preset.name}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Custom Presets */}
                    <div className="mb-8 pb-8 border-b border-white/10">
                      <label className="block text-sm font-bold text-white/80 mb-3 uppercase tracking-wide">
                        ⭐ My Presets
                      </label>
                      <div className="flex gap-2 mb-3">
                        <input
                          type="text"
                          value={presetName}
                          onChange={(e) => setPresetName(e.target.value)}
                          placeholder="Preset name"
                          className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white/70 text-sm placeholder-white/40"
                        />
                        <button
                          onClick={savePreset}
                          className="px-3 py-2 gradient-primary text-white font-bold rounded-lg transition-all duration-300 text-sm"
                        >
                          Save
                        </button>
                      </div>
                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        {Object.entries(customPresets).map(([name, preset]) => (
                          <div key={name} className="flex gap-2 items-center">
                            <button
                              onClick={() => loadPreset(preset)}
                              className="flex-1 px-3 py-2 bg-white/10 hover:bg-white/20 text-white font-bold rounded-lg transition-all text-sm text-left truncate"
                            >
                              {name}
                            </button>
                            <button
                              onClick={() => deletePreset(name)}
                              className="px-3 py-2 bg-red-500/20 hover:bg-red-500/40 text-red-300 font-bold rounded-lg transition-all text-sm"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Brightness */}
                    <div className="mb-6">
                      <div className="flex justify-between mb-3 items-center">
                        <label className="text-sm font-bold text-white uppercase tracking-wide">
                          ☀️ Brightness
                        </label>
                        <input
                          type="number"
                          min="0"
                          max="200"
                          value={settings.brightness}
                          onChange={(e) =>
                            updateSettings({
                              ...settings,
                              brightness: parseInt(e.target.value) || 100,
                            })
                          }
                          className="w-16 px-2 py-1 bg-white/10 border border-white/20 rounded text-white text-sm text-center"
                        />
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="200"
                        value={settings.brightness}
                        onChange={(e) =>
                          updateSettings({
                            ...settings,
                            brightness: parseInt(e.target.value),
                          })
                        }
                        className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>

                    {/* Contrast */}
                    <div className="mb-6">
                      <div className="flex justify-between mb-3 items-center">
                        <label className="text-sm font-bold text-white uppercase tracking-wide">
                          ◆ Contrast
                        </label>
                        <input
                          type="number"
                          min="0"
                          max="200"
                          value={settings.contrast}
                          onChange={(e) =>
                            updateSettings({
                              ...settings,
                              contrast: parseInt(e.target.value) || 100,
                            })
                          }
                          className="w-16 px-2 py-1 bg-white/10 border border-white/20 rounded text-white text-sm text-center"
                        />
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="200"
                        value={settings.contrast}
                        onChange={(e) =>
                          updateSettings({
                            ...settings,
                            contrast: parseInt(e.target.value),
                          })
                        }
                        className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>

                    {/* Saturation */}
                    <div className="mb-6">
                      <div className="flex justify-between mb-3 items-center">
                        <label className="text-sm font-bold text-white uppercase tracking-wide">
                          🎨 Saturation
                        </label>
                        <input
                          type="number"
                          min="0"
                          max="200"
                          value={settings.saturation}
                          onChange={(e) =>
                            updateSettings({
                              ...settings,
                              saturation: parseInt(e.target.value) || 100,
                            })
                          }
                          className="w-16 px-2 py-1 bg-white/10 border border-white/20 rounded text-white text-sm text-center"
                        />
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="200"
                        value={settings.saturation}
                        onChange={(e) =>
                          updateSettings({
                            ...settings,
                            saturation: parseInt(e.target.value),
                          })
                        }
                        className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>

                    {/* Blur */}
                    <div className="mb-6">
                      <div className="flex justify-between mb-3 items-center">
                        <label className="text-sm font-bold text-white uppercase tracking-wide">
                          💨 Blur
                        </label>
                        <input
                          type="number"
                          min="0"
                          max="20"
                          value={settings.blur}
                          onChange={(e) =>
                            updateSettings({
                              ...settings,
                              blur: parseInt(e.target.value) || 0,
                            })
                          }
                          className="w-16 px-2 py-1 bg-white/10 border border-white/20 rounded text-white text-sm text-center"
                        />
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="20"
                        value={settings.blur}
                        onChange={(e) =>
                          updateSettings({
                            ...settings,
                            blur: parseInt(e.target.value),
                          })
                        }
                        className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>

                    {/* Grayscale */}
                    <div className="mb-6">
                      <div className="flex justify-between mb-3 items-center">
                        <label className="text-sm font-bold text-white uppercase tracking-wide">
                          ⚪ Grayscale
                        </label>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={settings.grayscale}
                          onChange={(e) =>
                            updateSettings({
                              ...settings,
                              grayscale: parseInt(e.target.value) || 0,
                            })
                          }
                          className="w-16 px-2 py-1 bg-white/10 border border-white/20 rounded text-white text-sm text-center"
                        />
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={settings.grayscale}
                        onChange={(e) =>
                          updateSettings({
                            ...settings,
                            grayscale: parseInt(e.target.value),
                          })
                        }
                        className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>

                    {/* Sepia */}
                    <div className="mb-8">
                      <div className="flex justify-between mb-3 items-center">
                        <label className="text-sm font-bold text-white uppercase tracking-wide">
                          🟤 Sepia
                        </label>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={settings.sepia}
                          onChange={(e) =>
                            updateSettings({
                              ...settings,
                              sepia: parseInt(e.target.value) || 0,
                            })
                          }
                          className="w-16 px-2 py-1 bg-white/10 border border-white/20 rounded text-white text-sm text-center"
                        />
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={settings.sepia}
                        onChange={(e) =>
                          updateSettings({
                            ...settings,
                            sepia: parseInt(e.target.value),
                          })
                        }
                        className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>

                    {/* Export Options */}
                    <div className="mb-8 pb-8 border-b border-white/10">
                      <label className="block text-sm font-bold text-white mb-3 uppercase tracking-wide">
                        💾 Export Options
                      </label>
                      <div className="space-y-3">
                        <select
                          value={exportFormat}
                          onChange={(e) => setExportFormat(e.target.value as any)}
                          className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm"
                        >
                          <option value="jpg">JPG (Smaller size)</option>
                          <option value="png">PNG (Lossless)</option>
                          <option value="webp">WebP (Best quality)</option>
                        </select>
                        <div>
                          <div className="flex justify-between mb-2 text-sm">
                            <label className="font-bold text-white">Quality</label>
                            <span className="text-white/60">{exportQuality}%</span>
                          </div>
                          <input
                            type="range"
                            min="10"
                            max="100"
                            value={exportQuality}
                            onChange={(e) => setExportQuality(parseInt(e.target.value))}
                            className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-4">
                      <button
                        onClick={handleReset}
                        className="flex-1 px-4 py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-95 border border-white/20 hover:border-white/40"
                      >
                        🔄 Reset
                      </button>
                      <button
                        onClick={handleDownload}
                        className="flex-1 px-4 py-3 gradient-primary text-white font-bold rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50"
                      >
                        📥 Download
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Preview */}
            <div className="lg:col-span-2 animate-slideInFromRight">
              <div className="glass-effect rounded-2xl p-8 backdrop-blur-xl">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                  <span>👁️</span> Preview
                </h2>
                {image ? (
                  <div className="flex justify-center items-center bg-gradient-to-br from-slate-900/50 to-slate-800/50 rounded-xl p-8 min-h-96 border border-white/10 shadow-xl">
                    <canvas
                      ref={canvasRef}
                      className="max-w-full max-h-96 rounded-lg shadow-2xl"
                    />
                  </div>
                ) : (
                  <div className="flex flex-col justify-center items-center bg-gradient-to-br from-slate-900/50 to-slate-800/50 rounded-xl p-16 min-h-96 border-2 border-dashed border-white/20">
                    <div className="text-6xl mb-4">🖼️</div>
                    <p className="text-white/60 text-center text-lg">
                      Upload an image to start editing
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
  );
}
