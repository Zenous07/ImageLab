"use client";


import { useState, useRef, useEffect } from "react";
import { rotateImage, flipImage, downloadImage } from "@/lib/utils/imageProcessing";

export default function RotatePage() {
  const [image, setImage] = useState<string | null>(null);
  const [rotation, setRotation] = useState(0);
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
        setRotation(0);
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
      };
      img.src = image;
    }
  }, [image]);

  useEffect(() => {
    if (previewCanvasRef.current && canvasRef.current && rotation !== 0) {
      const rotated = rotateImage(canvasRef.current, rotation);
      const previewCanvas = previewCanvasRef.current;
      const ctx = previewCanvas.getContext("2d");
      if (ctx) {
        previewCanvas.width = rotated.width;
        previewCanvas.height = rotated.height;
        ctx.drawImage(rotated, 0, 0);
      }
    } else if (previewCanvasRef.current && canvasRef.current) {
      const previewCanvas = previewCanvasRef.current;
      const ctx = previewCanvas.getContext("2d");
      if (ctx) {
        previewCanvas.width = canvasRef.current.width;
        previewCanvas.height = canvasRef.current.height;
        ctx.drawImage(canvasRef.current, 0, 0);
      }
    }
  }, [rotation]);

  const handleRotate = async () => {
    if (canvasRef.current && rotation !== 0) {
      const rotated = rotateImage(canvasRef.current, rotation);
      await downloadImage(rotated, "rotated-image", exportFormat);
    } else if (canvasRef.current) {
      await downloadImage(canvasRef.current, "image", exportFormat);
    }
  };

  const handleFlip = async (direction: "horizontal" | "vertical") => {
    if (canvasRef.current) {
      let result = canvasRef.current;
      if (rotation !== 0) {
        result = rotateImage(result, rotation);
      }
      const flipped = flipImage(result, direction);
      await downloadImage(flipped, `flipped-${direction}`, exportFormat);
    }
  };

  return (
    <main className="min-h-screen pb-16 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="mb-12 animate-fadeInDown">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
              <span className="text-gradient">Rotate & Flip</span>
            </h1>
            <p className="text-xl text-white/70">
              Rotate and flip your images with precision
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Controls */}
            <div className="lg:col-span-1 animate-slideInFromLeft">
              <div className="glass-effect rounded-2xl p-8 sticky top-20 backdrop-blur-xl">
                <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-2">
                  <span>🔄</span> Transform
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
                    {/* Rotation */}
                    <div className="mb-8 pb-8 border-b border-white/10">
                      <div className="flex justify-between mb-3 items-center">
                        <label className="text-sm font-bold text-white uppercase tracking-wide">
                          🔄 Rotation
                        </label>
                        <input
                          type="number"
                          min="-360"
                          max="360"
                          value={rotation}
                          onChange={(e) => setRotation(parseInt(e.target.value) || 0)}
                          className="w-20 px-2 py-1 bg-white/10 border border-white/20 rounded text-white text-sm text-center"
                        />
                      </div>
                      <input
                        type="range"
                        min="-360"
                        max="360"
                        value={rotation}
                        onChange={(e) => setRotation(parseInt(e.target.value))}
                        className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                      />
                      <div className="grid grid-cols-2 gap-2 mt-4">
                        {[
                          { label: "↻ 90°", angle: 90 },
                          { label: "↺ -90°", angle: -90 },
                          { label: "↻ 180°", angle: 180 },
                          { label: "Reset", angle: 0 },
                        ].map((btn) => (
                          <button
                            key={btn.angle}
                            onClick={() => setRotation(btn.angle)}
                            className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white font-bold rounded-lg transition-all text-sm"
                          >
                            {btn.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Flip Buttons */}
                    <div className="mb-8 pb-8 border-b border-white/10">
                      <label className="block text-sm font-bold text-white mb-4 uppercase tracking-wide">
                        🔀 Flip
                      </label>
                      <div className="space-y-2">
                        <button
                          onClick={() => handleFlip("horizontal")}
                          className="w-full px-4 py-3 bg-cyan-500/20 hover:bg-cyan-500/40 text-cyan-300 font-bold rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-95"
                        >
                          ↔️ Flip Horizontal
                        </button>
                        <button
                          onClick={() => handleFlip("vertical")}
                          className="w-full px-4 py-3 bg-blue-500/20 hover:bg-blue-500/40 text-blue-300 font-bold rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-95"
                        >
                          ↕️ Flip Vertical
                        </button>
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

                    {/* Download Button */}
                    <button
                      onClick={handleRotate}
                      className="w-full px-4 py-3 gradient-primary text-white font-bold rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg"
                    >
                      📥 Download
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Preview */}
            <div className="lg:col-span-2 space-y-8 animate-slideInFromRight">
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
                  <span>✨</span> Preview ({rotation}°)
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
