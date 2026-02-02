"use client";

import Navigation from "@/components/Navigation";
import { useState, useRef, useEffect } from "react";
import { addWatermark, downloadImage } from "@/lib/utils/imageProcessing";

export default function WatermarkPage() {
  const [image, setImage] = useState<string | null>(null);
  const [text, setText] = useState("Watermark");
  const [fontSize, setFontSize] = useState(48);
  const [color, setColor] = useState("#FFFFFF");
  const [opacity, setOpacity] = useState(70);
  const [positionX, setPositionX] = useState(50);
  const [positionY, setPositionY] = useState(50);
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
      };
      img.src = image;
    }
  }, [image]);

  useEffect(() => {
    if (previewCanvasRef.current && canvasRef.current && text) {
      const x = (positionX / 100) * canvasRef.current.width;
      const y = (positionY / 100) * canvasRef.current.height;
      const watermarked = addWatermark(canvasRef.current, text, x, y, fontSize, color, opacity);
      
      const previewCanvas = previewCanvasRef.current;
      const ctx = previewCanvas.getContext("2d");
      if (ctx) {
        previewCanvas.width = watermarked.width;
        previewCanvas.height = watermarked.height;
        ctx.drawImage(watermarked, 0, 0);
      }
    }
  }, [text, fontSize, color, opacity, positionX, positionY]);

  const handleAddWatermark = async () => {
    if (canvasRef.current && text) {
      const x = (positionX / 100) * canvasRef.current.width;
      const y = (positionY / 100) * canvasRef.current.height;
      const watermarked = addWatermark(canvasRef.current, text, x, y, fontSize, color, opacity);
      await downloadImage(watermarked, "watermarked-image", exportFormat);
    }
  };

  const positions = [
    { label: "↖️ Top Left", x: 20, y: 30 },
    { label: "↑ Top Center", x: 50, y: 30 },
    { label: "↗️ Top Right", x: 80, y: 30 },
    { label: "← Center Left", x: 20, y: 50 },
    { label: "⊙ Center", x: 50, y: 50 },
    { label: "→ Center Right", x: 80, y: 50 },
    { label: "↙️ Bottom Left", x: 20, y: 70 },
    { label: "↓ Bottom Center", x: 50, y: 70 },
    { label: "↘️ Bottom Right", x: 80, y: 70 },
  ];

  return (
    <>
      <Navigation />
      <main className="min-h-screen pb-16">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="mb-12 animate-fadeInDown">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
              <span className="text-gradient">Watermark & Text</span>
            </h1>
            <p className="text-xl text-white/70">
              Add text overlays to protect and personalize your images
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Controls */}
            <div className="lg:col-span-1 animate-slideInFromLeft">
              <div className="glass-effect rounded-2xl p-8 sticky top-20 backdrop-blur-xl max-h-[85vh] overflow-y-auto">
                <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-2">
                  <span>📝</span> Text Settings
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
                    {/* Text Input */}
                    <div className="mb-6">
                      <label className="block text-sm font-bold text-white mb-3 uppercase tracking-wide">
                        📝 Text
                      </label>
                      <input
                        type="text"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 text-sm"
                        placeholder="Enter watermark text"
                      />
                    </div>

                    {/* Font Size */}
                    <div className="mb-6">
                      <div className="flex justify-between mb-3 items-center">
                        <label className="text-sm font-bold text-white uppercase tracking-wide">
                          🔤 Size
                        </label>
                        <input
                          type="number"
                          min="10"
                          max="200"
                          value={fontSize}
                          onChange={(e) => setFontSize(parseInt(e.target.value) || 48)}
                          className="w-16 px-2 py-1 bg-white/10 border border-white/20 rounded text-white text-sm text-center"
                        />
                      </div>
                      <input
                        type="range"
                        min="10"
                        max="200"
                        value={fontSize}
                        onChange={(e) => setFontSize(parseInt(e.target.value))}
                        className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>

                    {/* Color */}
                    <div className="mb-6">
                      <label className="block text-sm font-bold text-white mb-3 uppercase tracking-wide">
                        🎨 Color
                      </label>
                      <div className="flex gap-3 items-center">
                        <input
                          type="color"
                          value={color}
                          onChange={(e) => setColor(e.target.value)}
                          className="w-14 h-10 border-2 border-white/20 rounded-lg cursor-pointer hover:border-white/40 transition-all"
                        />
                        <input
                          type="text"
                          value={color}
                          onChange={(e) => setColor(e.target.value)}
                          className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white/70 text-sm font-mono"
                        />
                      </div>
                    </div>

                    {/* Opacity */}
                    <div className="mb-8">
                      <div className="flex justify-between mb-3 items-center">
                        <label className="text-sm font-bold text-white uppercase tracking-wide">
                          🌫️ Opacity
                        </label>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={opacity}
                          onChange={(e) => setOpacity(parseInt(e.target.value) || 70)}
                          className="w-16 px-2 py-1 bg-white/10 border border-white/20 rounded text-white text-sm text-center"
                        />
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={opacity}
                        onChange={(e) => setOpacity(parseInt(e.target.value))}
                        className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>

                    {/* Position */}
                    <div className="mb-8 pb-8 border-b border-white/10">
                      <label className="block text-sm font-bold text-white mb-4 uppercase tracking-wide">
                        📍 Position
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {positions.map((pos) => (
                          <button
                            key={pos.label}
                            onClick={() => {
                              setPositionX(pos.x);
                              setPositionY(pos.y);
                            }}
                            className={`px-2 py-2 rounded-lg font-bold text-xs transition-all ${
                              positionX === pos.x && positionY === pos.y
                                ? "gradient-primary text-white shadow-lg"
                                : "bg-white/10 text-white hover:bg-white/20"
                            }`}
                          >
                            {pos.label}
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

                    {/* Download Button */}
                    <button
                      onClick={handleAddWatermark}
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

              {/* Preview with Watermark */}
              <div className="glass-effect rounded-2xl p-8 backdrop-blur-xl">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                  <span>✨</span> Preview
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
    </>
  );
}
