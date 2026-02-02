"use client";


import { useState, useRef, useEffect } from "react";
import {
  removeBackgroundColorBased,
  removeBackgroundClustering,
  removeBackgroundContrast,
  removeBackgroundHybrid,
  downloadImage,
} from "@/lib/utils/imageProcessing";

type Algorithm = "color" | "clustering" | "contrast" | "hybrid";

export default function BgRemoverPage() {
  const [image, setImage] = useState<string | null>(null);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<Algorithm>("hybrid");
  const [threshold, setThreshold] = useState(50);
  const [softness, setSoftness] = useState(0);
  const [clusterThreshold, setClusterThreshold] = useState(50);
  const [exportFormat, setExportFormat] = useState<"jpg" | "png" | "webp">("png");
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
    if (previewCanvasRef.current && canvasRef.current && image) {
      const originalCanvas = canvasRef.current;
      const ctx = originalCanvas.getContext("2d");
      if (!ctx) return;

      const imageData = ctx.getImageData(0, 0, originalCanvas.width, originalCanvas.height);
      let result = imageData;

      if (selectedAlgorithm === "color") {
        result = removeBackgroundColorBased(imageData, { r: 255, g: 255, b: 255 }, threshold, softness);
      } else if (selectedAlgorithm === "clustering") {
        result = removeBackgroundClustering(imageData, clusterThreshold, 5, softness);
      } else if (selectedAlgorithm === "contrast") {
        result = removeBackgroundContrast(imageData, threshold, softness);
      } else if (selectedAlgorithm === "hybrid") {
        result = removeBackgroundHybrid(imageData, threshold, threshold, softness);
      }

      const previewCanvas = previewCanvasRef.current;
      const previewCtx = previewCanvas.getContext("2d");
      if (previewCtx) {
        previewCanvas.width = originalCanvas.width;
        previewCanvas.height = originalCanvas.height;
        previewCtx.putImageData(result, 0, 0);
      }
    }
  }, [selectedAlgorithm, threshold, softness, clusterThreshold, image]);

  const handleDownload = async () => {
    if (previewCanvasRef.current) {
      await downloadImage(previewCanvasRef.current, "bg-removed", exportFormat);
    }
  };

  const algorithms = [
    {
      id: "color",
      name: "Color-Based",
      description: "Simple threshold removal. Fast and effective for solid backgrounds.",
      emoji: "🎨",
    },
    {
      id: "clustering",
      name: "Clustering",
      description: "Groups similar colors. Best for varied but uniform backgrounds.",
      emoji: "🔀",
    },
    {
      id: "contrast",
      name: "Contrast-Based",
      description: "Edge detection. Great for objects with sharp edges.",
      emoji: "⚡",
    },
    {
      id: "hybrid",
      name: "Hybrid (AI-like)",
      description: "Combines all methods. Most accurate for complex backgrounds.",
      emoji: "🧠",
    },
  ];

  return (
    <main className="min-h-screen pb-16 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="mb-12 animate-fadeInDown">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 font-[var(--font-space-grotesk)]">
              <span className="text-gradient">Background Remover</span>
            </h1>
            <p className="text-xl text-white/70 font-[var(--font-space-mono)]">
              Compare multiple AI-like algorithms to find the best removal method for your image
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Controls */}
            <div className="lg:col-span-1 animate-slideInFromLeft">
              <div className="glass-effect rounded-2xl p-8 sticky top-20 backdrop-blur-xl max-h-[85vh] overflow-y-auto">
                <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-2 font-[var(--font-space-grotesk)]">
                  <span>⚙️</span> Settings
                </h2>

                {/* Upload */}
                <div className="mb-8">
                  <label className="block text-sm font-bold text-white/80 mb-3 uppercase tracking-wide font-[var(--font-space-mono)]">
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
                    {/* Algorithm Selection */}
                    <div className="mb-8 pb-8 border-b border-white/10">
                      <label className="block text-sm font-bold text-white mb-4 uppercase tracking-wide font-[var(--font-space-mono)]">
                        🧪 Algorithm
                      </label>
                      <div className="space-y-2">
                        {algorithms.map((algo) => (
                          <button
                            key={algo.id}
                            onClick={() => setSelectedAlgorithm(algo.id as Algorithm)}
                            className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-300 ${
                              selectedAlgorithm === algo.id
                                ? "gradient-primary text-white shadow-lg"
                                : "bg-white/10 text-white hover:bg-white/20"
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <span className="text-xl">{algo.emoji}</span>
                              <div>
                                <p className="font-bold">{algo.name}</p>
                                <p className="text-xs text-white/70">{algo.description}</p>
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Threshold/Sensitivity */}
                    {selectedAlgorithm !== "clustering" && (
                      <div className="mb-6">
                        <div className="flex justify-between mb-3 items-center">
                          <label className="text-sm font-bold text-white uppercase tracking-wide font-[var(--font-space-mono)]">
                            🎯 Threshold
                          </label>
                          <input
                            type="number"
                            min="0"
                            max="255"
                            value={threshold}
                            onChange={(e) => setThreshold(parseInt(e.target.value) || 0)}
                            className="w-16 px-2 py-1 bg-white/10 border border-white/20 rounded text-white text-sm text-center"
                          />
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="255"
                          value={threshold}
                          onChange={(e) => setThreshold(parseInt(e.target.value))}
                          className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                        />
                        <p className="text-xs text-white/60 mt-2">Higher = more aggressive removal</p>
                      </div>
                    )}

                    {/* Cluster Threshold */}
                    {selectedAlgorithm === "clustering" && (
                      <div className="mb-6">
                        <div className="flex justify-between mb-3 items-center">
                          <label className="text-sm font-bold text-white uppercase tracking-wide font-[var(--font-space-mono)]">
                            🔀 Cluster Threshold
                          </label>
                          <input
                            type="number"
                            min="0"
                            max="255"
                            value={clusterThreshold}
                            onChange={(e) => setClusterThreshold(parseInt(e.target.value) || 0)}
                            className="w-16 px-2 py-1 bg-white/10 border border-white/20 rounded text-white text-sm text-center"
                          />
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="255"
                          value={clusterThreshold}
                          onChange={(e) => setClusterThreshold(parseInt(e.target.value))}
                          className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                        />
                        <p className="text-xs text-white/60 mt-2">Higher = more color variation removal</p>
                      </div>
                    )}

                    {/* Softness */}
                    <div className="mb-8">
                      <div className="flex justify-between mb-3 items-center">
                        <label className="text-sm font-bold text-white uppercase tracking-wide font-[var(--font-space-mono)]">
                          🌫️ Softness
                        </label>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={softness}
                          onChange={(e) => setSoftness(parseInt(e.target.value) || 0)}
                          className="w-16 px-2 py-1 bg-white/10 border border-white/20 rounded text-white text-sm text-center"
                        />
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={softness}
                        onChange={(e) => setSoftness(parseInt(e.target.value))}
                        className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                      />
                      <p className="text-xs text-white/60 mt-2">Softer edges = feathered transparency</p>
                    </div>

                    {/* Export Format */}
                    <div className="mb-8">
                      <label className="block text-sm font-bold text-white mb-3 uppercase tracking-wide font-[var(--font-space-mono)]">
                        💾 Format
                      </label>
                      <select
                        value={exportFormat}
                        onChange={(e) => setExportFormat(e.target.value as any)}
                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm"
                      >
                        <option value="png">PNG (Recommended)</option>
                        <option value="webp">WebP</option>
                        <option value="jpg">JPG</option>
                      </select>
                    </div>

                    {/* Download Button */}
                    <button
                      onClick={handleDownload}
                      className="w-full px-4 py-3 gradient-primary text-white font-bold rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg font-[var(--font-space-grotesk)]"
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
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2 font-[var(--font-space-grotesk)]">
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
                    <p className="text-white/60 text-center text-lg">Upload an image to start</p>
                  </div>
                )}
              </div>

              {/* Preview with Current Algorithm */}
              {image && (
                <div className="glass-effect rounded-2xl p-8 backdrop-blur-xl">
                  <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2 font-[var(--font-space-grotesk)]">
                    <span>✨</span> Result
                  </h2>
                  <p className="text-white/60 text-sm mb-4 font-[var(--font-space-mono)]">
                    {algorithms.find(a => a.id === selectedAlgorithm)?.name} - {algorithms.find(a => a.id === selectedAlgorithm)?.description}
                  </p>
                  <div className="flex justify-center items-center bg-gradient-to-br from-slate-900/50 to-slate-800/50 rounded-xl p-8 min-h-72 border border-white/10 shadow-xl overflow-auto">
                    <canvas
                      ref={previewCanvasRef}
                      className="max-w-full max-h-80 rounded-lg shadow-2xl"
                    />
                  </div>
                </div>
              )}

              {/* Algorithm Info */}
              <div className="glass-effect rounded-2xl p-8 backdrop-blur-xl">
                <h3 className="text-xl font-bold text-white mb-4 font-[var(--font-space-grotesk)]">📊 Algorithm Comparison</h3>
                <div className="space-y-3 text-sm text-white/80 font-[var(--font-space-mono)]">
                  <p><span className="font-bold text-purple-400">Color-Based:</span> Fast and simple, best for solid colors.</p>
                  <p><span className="font-bold text-pink-400">Clustering:</span> Groups similar colors, great for varied backgrounds.</p>
                  <p><span className="font-bold text-cyan-400">Contrast:</span> Uses edges, perfect for sharp objects.</p>
                  <p><span className="font-bold text-green-400">Hybrid:</span> Combines all methods for best results.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
  );
}
