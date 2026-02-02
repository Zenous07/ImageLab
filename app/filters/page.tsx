"use client";

import Navigation from "@/components/Navigation";
import { useState, useRef, useEffect } from "react";
import {
  FilterSettings,
  defaultFilterSettings,
  getFilterCSS,
  canvasToBlob,
  downloadBlob,
  filterPresets,
} from "@/lib/utils/imageProcessing";

export default function FiltersPage() {
  const [image, setImage] = useState<string | null>(null);
  const [settings, setSettings] = useState<FilterSettings>(defaultFilterSettings);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImage(event.target?.result as string);
        setSettings(defaultFilterSettings);
      };
      reader.readAsDataURL(file);
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

        // Apply filters
        const filterCSS = getFilterCSS(settings);
        ctx.filter = filterCSS;
        ctx.drawImage(img, 0, 0);
      };
      img.src = image;
    }
  }, [image, settings]);

  const handleDownload = async () => {
    if (canvasRef.current) {
      const blob = await canvasToBlob(canvasRef.current, 0.95);
      downloadBlob(blob, "filtered-image.jpg");
    }
  };

  const handleReset = () => {
    setSettings(defaultFilterSettings);
  };

  return (
    <>
      <Navigation />
      <main className="min-h-screen pb-16">
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
              <div className="glass-effect rounded-2xl p-8 sticky top-20 backdrop-blur-xl">
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
                    {/* Presets */}
                    <div className="mb-8 pb-8 border-b border-white/10">
                      <label className="block text-sm font-bold text-white/80 mb-4 uppercase tracking-wide">
                        ✨ Filter Presets
                      </label>
                      <div className="grid grid-cols-2 gap-3 max-h-64 overflow-y-auto">
                        {filterPresets.map((preset) => (
                          <button
                            key={preset.name}
                            onClick={() => setSettings(preset.settings)}
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

                    {/* Brightness */}
                    <div className="mb-8">
                      <div className="flex justify-between mb-3">
                        <label className="text-sm font-bold text-white uppercase tracking-wide">
                          ☀️ Brightness
                        </label>
                        <span className="text-sm font-bold gradient-primary text-gradient">
                          {settings.brightness}%
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="200"
                        value={settings.brightness}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            brightness: parseInt(e.target.value),
                          })
                        }
                        className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>

                    {/* Contrast */}
                    <div className="mb-8">
                      <div className="flex justify-between mb-3">
                        <label className="text-sm font-bold text-white uppercase tracking-wide">
                          ◆ Contrast
                        </label>
                        <span className="text-sm font-bold gradient-success text-gradient">
                          {settings.contrast}%
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="200"
                        value={settings.contrast}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            contrast: parseInt(e.target.value),
                          })
                        }
                        className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>

                    {/* Saturation */}
                    <div className="mb-8">
                      <div className="flex justify-between mb-3">
                        <label className="text-sm font-bold text-white uppercase tracking-wide">
                          🎨 Saturation
                        </label>
                        <span className="text-sm font-bold gradient-warning text-gradient">
                          {settings.saturation}%
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="200"
                        value={settings.saturation}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            saturation: parseInt(e.target.value),
                          })
                        }
                        className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>

                    {/* Blur */}
                    <div className="mb-8">
                      <div className="flex justify-between mb-3">
                        <label className="text-sm font-bold text-white uppercase tracking-wide">
                          💨 Blur
                        </label>
                        <span className="text-sm font-bold text-cyan-400">
                          {settings.blur}px
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="20"
                        value={settings.blur}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            blur: parseInt(e.target.value),
                          })
                        }
                        className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>

                    {/* Grayscale */}
                    <div className="mb-8">
                      <div className="flex justify-between mb-3">
                        <label className="text-sm font-bold text-white uppercase tracking-wide">
                          ⚪ Grayscale
                        </label>
                        <span className="text-sm font-bold text-gray-300">
                          {settings.grayscale}%
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={settings.grayscale}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            grayscale: parseInt(e.target.value),
                          })
                        }
                        className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>

                    {/* Sepia */}
                    <div className="mb-8">
                      <div className="flex justify-between mb-3">
                        <label className="text-sm font-bold text-white uppercase tracking-wide">
                          🟤 Sepia
                        </label>
                        <span className="text-sm font-bold text-amber-300">
                          {settings.sepia}%
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={settings.sepia}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            sepia: parseInt(e.target.value),
                          })
                        }
                        className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-4 mt-10 pt-8 border-t border-white/10">
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
    </>
  );
}
