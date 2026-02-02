"use client";


import { useState, useRef, useEffect } from "react";
import { resizeImage, canvasToBlob, downloadBlob, downloadImage } from "@/lib/utils/imageProcessing";

export default function ResizePage() {
  const [image, setImage] = useState<string | null>(null);
  const [originalWidth, setOriginalWidth] = useState(0);
  const [originalHeight, setOriginalHeight] = useState(0);
  const [newWidth, setNewWidth] = useState(0);
  const [newHeight, setNewHeight] = useState(0);
  const [maintainRatio, setMaintainRatio] = useState(true);
  const [exportFormat, setExportFormat] = useState<"jpg" | "png" | "webp">("jpg");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImage(event.target?.result as string);
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
        ctx.drawImage(img, 0, 0);
        setOriginalWidth(img.width);
        setOriginalHeight(img.height);
        setNewWidth(img.width);
        setNewHeight(img.height);
      };
      img.src = image;
    }
  }, [image]);

  useEffect(() => {
    if (previewCanvasRef.current && canvasRef.current && newWidth > 0 && newHeight > 0) {
      const resized = resizeImage(canvasRef.current, newWidth, newHeight);
      const previewCanvas = previewCanvasRef.current;
      const ctx = previewCanvas.getContext("2d");
      if (ctx) {
        previewCanvas.width = resized.width;
        previewCanvas.height = resized.height;
        ctx.drawImage(resized, 0, 0);
      }
    }
  }, [newWidth, newHeight]);

  const handleWidthChange = (value: number) => {
    setNewWidth(value);
    if (maintainRatio && originalWidth > 0) {
      setNewHeight(Math.round((value * originalHeight) / originalWidth));
    }
  };

  const handleHeightChange = (value: number) => {
    setNewHeight(value);
    if (maintainRatio && originalHeight > 0) {
      setNewWidth(Math.round((value * originalWidth) / originalHeight));
    }
  };

  const handleResize = async () => {
    if (canvasRef.current && newWidth > 0 && newHeight > 0) {
      const resized = resizeImage(canvasRef.current, newWidth, newHeight);
      await downloadImage(resized, "resized-image", exportFormat);
    }
  };

  const presets = [
    { name: "Small (400x300)", width: 400, height: 300 },
    { name: "Medium (800x600)", width: 800, height: 600 },
    { name: "Large (1280x720)", width: 1280, height: 720 },
    { name: "Full HD (1920x1080)", width: 1920, height: 1080 },
    { name: "50%", width: originalWidth / 2, height: originalHeight / 2 },
  ];

  return (
    <main className="min-h-screen pb-16 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="mb-12 animate-fadeInDown">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
              <span className="text-gradient">Image Resize</span>
            </h1>
            <p className="text-xl text-white/70">
              Resize your images with aspect ratio control
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Controls */}
            <div className="lg:col-span-1 animate-slideInFromLeft">
              <div className="glass-effect rounded-2xl p-8 sticky top-20 backdrop-blur-xl max-h-[85vh] overflow-y-auto">
                <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-2">
                  <span>📐</span> Resize Settings
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
                    className="w-full px-4 py-3 bg-white/10 border-2 border-white/20 rounded-lg cursor-pointer text-white/70 hover:border-cyan-400/50 hover:bg-white/20 transition-all duration-300"
                  />
                </div>

                {image && (
                  <>
                    {/* Original Size Info */}
                    <div className="mb-8 p-4 glass-effect rounded-lg border border-white/20">
                      <p className="text-sm font-bold text-white/80 mb-2 uppercase tracking-wide">
                        📏 Original Size
                      </p>
                      <p className="text-white">
                        {originalWidth} × {originalHeight} px
                      </p>
                    </div>

                    {/* Maintain Ratio */}
                    <div className="mb-8 flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={maintainRatio}
                        onChange={(e) => setMaintainRatio(e.target.checked)}
                        className="w-4 h-4 cursor-pointer"
                      />
                      <label className="text-sm font-bold text-white uppercase tracking-wide cursor-pointer">
                        🔗 Maintain Aspect Ratio
                      </label>
                    </div>

                    {/* Width */}
                    <div className="mb-6">
                      <div className="flex justify-between mb-3 items-center">
                        <label className="text-sm font-bold text-white uppercase tracking-wide">
                          📏 Width
                        </label>
                        <input
                          type="number"
                          value={newWidth}
                          onChange={(e) => handleWidthChange(parseInt(e.target.value) || 0)}
                          className="w-24 px-2 py-1 bg-white/10 border border-white/20 rounded text-white text-sm text-center"
                        />
                      </div>
                      <input
                        type="range"
                        min="10"
                        max="4000"
                        value={newWidth}
                        onChange={(e) => handleWidthChange(parseInt(e.target.value))}
                        className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>

                    {/* Height */}
                    <div className="mb-8">
                      <div className="flex justify-between mb-3 items-center">
                        <label className="text-sm font-bold text-white uppercase tracking-wide">
                          📏 Height
                        </label>
                        <input
                          type="number"
                          value={newHeight}
                          onChange={(e) => handleHeightChange(parseInt(e.target.value) || 0)}
                          className="w-24 px-2 py-1 bg-white/10 border border-white/20 rounded text-white text-sm text-center"
                        />
                      </div>
                      <input
                        type="range"
                        min="10"
                        max="4000"
                        value={newHeight}
                        onChange={(e) => handleHeightChange(parseInt(e.target.value))}
                        className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>

                    {/* Presets */}
                    <div className="mb-8 pb-8 border-b border-white/10">
                      <label className="block text-sm font-bold text-white/80 mb-3 uppercase tracking-wide">
                        ⭐ Size Presets
                      </label>
                      <div className="space-y-2">
                        {presets.map((preset, idx) => (
                          <button
                            key={idx}
                            onClick={() => {
                              setNewWidth(preset.width);
                              setNewHeight(preset.height);
                            }}
                            className="w-full px-3 py-2 bg-white/10 hover:bg-white/20 text-white font-bold rounded-lg transition-all text-sm text-left"
                          >
                            {preset.name}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Export Format */}
                    <div className="mb-8">
                      <label className="block text-sm font-bold text-white mb-3 uppercase tracking-wide">
                        💾 Format
                      </label>
                      <select
                        value={exportFormat}
                        onChange={(e) => setExportFormat(e.target.value as any)}
                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm"
                      >
                        <option value="jpg">JPG</option>
                        <option value="png">PNG</option>
                        <option value="webp">WebP</option>
                      </select>
                    </div>

                    {/* Resize Button */}
                    <button
                      onClick={handleResize}
                      className="w-full px-4 py-3 gradient-primary text-white font-bold rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg"
                    >
                      📥 Download Resized
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Preview */}
            <div className="lg:col-span-2 animate-slideInFromRight space-y-8">
              {/* Original */}
              <div className="glass-effect rounded-2xl p-8 backdrop-blur-xl">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                  <span>📷</span> Original
                </h2>
                {image ? (
                  <div className="flex justify-center items-center bg-gradient-to-br from-slate-900/50 to-slate-800/50 rounded-xl p-8 min-h-72 border border-white/10 shadow-xl overflow-auto">
                    <canvas
                      ref={canvasRef}
                      className="max-w-full max-h-80 rounded-lg shadow-2xl"
                    />
                  </div>
                ) : (
                  <div className="flex flex-col justify-center items-center bg-gradient-to-br from-slate-900/50 to-slate-800/50 rounded-xl p-16 min-h-72 border-2 border-dashed border-white/20">
                    <div className="text-6xl mb-4">🖼️</div>
                    <p className="text-white/60 text-center text-lg">Upload an image</p>
                  </div>
                )}
              </div>

              {/* Preview */}
              <div className="glass-effect rounded-2xl p-8 backdrop-blur-xl">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                  <span>✨</span> Preview ({newWidth} × {newHeight})
                </h2>
                <div className="flex justify-center items-center bg-gradient-to-br from-slate-900/50 to-slate-800/50 rounded-xl p-8 min-h-72 border border-white/10 shadow-xl overflow-auto">
                  {image ? (
                    <canvas
                      ref={previewCanvasRef}
                      className="max-w-full max-h-80 rounded-lg shadow-2xl"
                    />
                  ) : (
                    <p className="text-white/60">Preview will appear here</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
  );
}
