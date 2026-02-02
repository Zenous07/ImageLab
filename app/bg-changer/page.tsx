"use client";


import { useState, useRef, useEffect } from "react";
import {
  hexToRgb,
  rgbToHex,
  colorDistance,
  replaceBackgroundColor,
  canvasToBlob,
  downloadBlob,
  RGBColor,
} from "@/lib/utils/imageProcessing";

export default function BgChangerPage() {
  const [image, setImage] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<RGBColor | null>(null);
  const [replacementColor, setReplacementColor] = useState<string>("#FFFFFF");
  const [tolerance, setTolerance] = useState(30);
  const [eyedropperMode, setEyedropperMode] = useState<"select" | "replace" | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const originalCanvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImage(event.target?.result as string);
        setSelectedColor(null);
        setImageLoaded(false);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    if (image && originalCanvasRef.current) {
      const img = new Image();
      img.onload = () => {
        const canvas = originalCanvasRef.current!;
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          setImageLoaded(true);
        }
      };
      img.src = image;
    }
  }, [image]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!originalCanvasRef.current || !imageLoaded) return;

    const rect = originalCanvasRef.current.getBoundingClientRect();
    const scaleX = originalCanvasRef.current.width / rect.width;
    const scaleY = originalCanvasRef.current.height / rect.height;

    const x = Math.floor((e.clientX - rect.left) * scaleX);
    const y = Math.floor((e.clientY - rect.top) * scaleY);

    const ctx = originalCanvasRef.current.getContext("2d");
    if (ctx) {
      const imageData = ctx.getImageData(x, y, 1, 1);
      const data = imageData.data;
      
      if (eyedropperMode === "select") {
        setSelectedColor({
          r: data[0],
          g: data[1],
          b: data[2],
        });
        setEyedropperMode(null);
      } else if (eyedropperMode === "replace") {
        const hex = rgbToHex({
          r: data[0],
          g: data[1],
          b: data[2],
        });
        setReplacementColor(hex);
        setEyedropperMode(null);
      } else if (eyedropperMode === null) {
        // Default behavior - select background color
        setSelectedColor({
          r: data[0],
          g: data[1],
          b: data[2],
        });
      }
    }
  };

  useEffect(() => {
    if (
      selectedColor &&
      canvasRef.current &&
      originalCanvasRef.current &&
      imageLoaded
    ) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const originalCanvas = originalCanvasRef.current;
      const originalCtx = originalCanvas.getContext("2d");
      if (!originalCtx) return;

      const imageData = originalCtx.getImageData(
        0,
        0,
        originalCanvas.width,
        originalCanvas.height
      );

      const result = replaceBackgroundColor(
        imageData,
        selectedColor,
        tolerance
      );

      canvas.width = originalCanvas.width;
      canvas.height = originalCanvas.height;
      ctx.putImageData(result, 0, 0);

      // Apply replacement color
      applyReplacementColor(canvas, replacementColor);
    }
  }, [selectedColor, tolerance, replacementColor, imageLoaded]);

  const applyReplacementColor = (canvas: HTMLCanvasElement, color: string) => {
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rgb = hexToRgb(color);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      if (data[i + 3] === 0) {
        data[i] = rgb.r;
        data[i + 1] = rgb.g;
        data[i + 2] = rgb.b;
        data[i + 3] = 255;
      }
    }

    ctx.putImageData(imageData, 0, 0);
  };

  const handleDownload = async () => {
    if (canvasRef.current) {
      const blob = await canvasToBlob(canvasRef.current, 0.95);
      downloadBlob(blob, "bg-changed-image.png");
    }
  };

  return (
    <main className="min-h-screen pb-16 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="mb-12 animate-fadeInDown">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
              <span className="text-gradient">Background Color Changer</span>
            </h1>
            <p className="text-xl text-white/70">
              Replace background colors with precision and adjustable tolerance
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Controls */}
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
                    className="w-full px-4 py-3 bg-white/10 border-2 border-white/20 rounded-lg cursor-pointer text-white/70 hover:border-blue-400/50 hover:bg-white/20 transition-all duration-300"
                  />
                  <p className="text-xs text-white/60 mt-3 font-medium">
                    💡 Click on the image to select background color
                  </p>
                </div>

                {image && (
                  <>
                    {/* Tolerance */}
                    <div className="mb-8">
                      <div className="flex justify-between mb-3">
                        <label className="text-sm font-bold text-white uppercase tracking-wide">
                          📊 Tolerance
                        </label>
                        <span className="text-sm font-bold gradient-warning text-gradient">
                          {tolerance}
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={tolerance}
                        onChange={(e) =>
                          setTolerance(parseInt(e.target.value))
                        }
                        className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                      />
                      <p className="text-xs text-white/60 mt-3 font-medium">
                        Higher values select more similar colors
                      </p>
                    </div>

                    {/* Selected Color Info */}
                    {selectedColor && (
                      <div className="mb-8 p-4 glass-effect rounded-lg border border-white/20">
                        <p className="text-sm font-bold text-white/80 mb-3 uppercase tracking-wide">
                          ✓ Selected Background Color
                        </p>
                        <div className="flex items-center gap-4 mb-4">
                          <div
                            className="w-16 h-16 rounded-lg border-2 border-white/30 shadow-lg"
                            style={{
                              backgroundColor: `rgb(${selectedColor.r}, ${selectedColor.g}, ${selectedColor.b})`,
                            }}
                          />
                          <div>
                            <p className="text-white font-bold font-mono text-lg">
                              {rgbToHex(selectedColor)}
                            </p>
                            <p className="text-white/60 text-sm">
                              RGB({selectedColor.r}, {selectedColor.g}, {selectedColor.b})
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => setEyedropperMode(eyedropperMode === "select" ? null : "select")}
                          className={`w-full px-3 py-2 rounded-lg font-bold text-sm transition-all duration-300 transform hover:scale-105 active:scale-95 ${
                            eyedropperMode === "select"
                              ? "gradient-primary text-white shadow-lg"
                              : "bg-white/10 text-white hover:bg-white/20 border border-white/20"
                          }`}
                        >
                          🔍 {eyedropperMode === "select" ? "Click image to select" : "Use Eye Dropper"}
                        </button>
                      </div>
                    )}

                    {/* Replacement Color */}
                    <div className="mb-8 p-4 glass-effect rounded-lg border border-white/20">
                      <label className="block text-sm font-bold text-white mb-4 uppercase tracking-wide">
                        🎨 Replacement Color
                      </label>
                      <div className="flex gap-3 items-center mb-3">
                        <input
                          type="color"
                          value={replacementColor}
                          onChange={(e) =>
                            setReplacementColor(e.target.value)
                          }
                          className="w-14 h-12 border-2 border-white/20 rounded-lg cursor-pointer hover:border-white/40 transition-all"
                        />
                        <input
                          type="text"
                          value={replacementColor}
                          onChange={(e) =>
                            setReplacementColor(e.target.value)
                          }
                          className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white/70 text-sm font-mono hover:border-white/40 transition-all"
                        />
                      </div>
                      <button
                        onClick={() => setEyedropperMode(eyedropperMode === "replace" ? null : "replace")}
                        className={`w-full px-3 py-2 rounded-lg font-bold text-sm transition-all duration-300 transform hover:scale-105 active:scale-95 ${
                          eyedropperMode === "replace"
                            ? "gradient-primary text-white shadow-lg"
                            : "bg-white/10 text-white hover:bg-white/20 border border-white/20"
                        }`}
                      >
                        🔍 {eyedropperMode === "replace" ? "Click image to pick" : "Pick from Image"}
                      </button>
                    </div>

                    {/* Download Button */}
                    {selectedColor && (
                      <button
                        onClick={handleDownload}
                        className="w-full px-4 py-3 gradient-primary text-white font-bold rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 uppercase tracking-wide"
                      >
                        📥 Download
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Preview */}
            <div className="lg:col-span-2 space-y-8 animate-slideInFromRight">
              {/* Original Image */}
              <div className="glass-effect rounded-2xl p-8 backdrop-blur-xl">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                  <span>📷</span> Original Image
                </h2>
                {image ? (
                  <div className={`flex justify-center items-center bg-gradient-to-br from-slate-900/50 to-slate-800/50 rounded-xl p-8 min-h-72 border transition-all ${
                    eyedropperMode ? "border-yellow-400 shadow-lg shadow-yellow-500/30 cursor-crosshair" : "border-white/10 hover:border-white/20 cursor-crosshair"
                  }`}>
                    <canvas
                      ref={originalCanvasRef}
                      onClick={handleCanvasClick}
                      className="max-w-full max-h-80 rounded-lg shadow-2xl"
                    />
                  </div>
                ) : (
                  <div className="flex flex-col justify-center items-center bg-gradient-to-br from-slate-900/50 to-slate-800/50 rounded-xl p-16 min-h-72 border-2 border-dashed border-white/20">
                    <div className="text-6xl mb-4">🖼️</div>
                    <p className="text-white/60 text-center">
                      Upload an image to start
                    </p>
                  </div>
                )}
              </div>

              {/* Result Image */}
              {selectedColor && (
                <div className="glass-effect rounded-2xl p-8 backdrop-blur-xl">
                  <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                    <span>✨</span> Result
                  </h2>
                  <div className="flex justify-center items-center bg-gradient-to-br from-slate-900/50 to-slate-800/50 rounded-xl p-8 min-h-72 border border-white/10 shadow-xl">
                    <canvas
                      ref={canvasRef}
                      className="max-w-full max-h-80 rounded-lg shadow-2xl"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
  );
}
