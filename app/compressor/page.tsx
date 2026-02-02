"use client";


import { useState, useRef, useEffect } from "react";
import {
  formatFileSize,
  compressImage,
  canvasToBlob,
  downloadBlob,
} from "@/lib/utils/imageProcessing";

export default function CompressorPage() {
  const [image, setImage] = useState<string | null>(null);
  const [quality, setQuality] = useState(80);
  const [maxWidth, setMaxWidth] = useState<number | null>(null);
  const [maxHeight, setMaxHeight] = useState<number | null>(null);
  const [originalSize, setOriginalSize] = useState(0);
  const [compressedSize, setCompressedSize] = useState(0);
  const originalCanvasRef = useRef<HTMLCanvasElement>(null);
  const compressedCanvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const originalFileRef = useRef<File | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      originalFileRef.current = file;
      setOriginalSize(file.size);
      setCompressedSize(0);

      const reader = new FileReader();
      reader.onload = (event) => {
        setImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    if (image && originalCanvasRef.current) {
      const img = new Image();
      img.onload = () => {
        const originalCanvas = originalCanvasRef.current!;
        originalCanvas.width = img.width;
        originalCanvas.height = img.height;
        const ctx = originalCanvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0);
        }

        // Create compressed version
        let compressedCanvas = originalCanvasRef.current;
        if (maxWidth || maxHeight) {
          compressedCanvas = compressImage(
            originalCanvasRef.current,
            quality,
            maxWidth || undefined,
            maxHeight || undefined
          );
        }

        const compressedCanv = compressedCanvasRef.current!;
        compressedCanv.width = compressedCanvas.width;
        compressedCanv.height = compressedCanvas.height;
        const compressedCtx = compressedCanv.getContext("2d");
        if (compressedCtx) {
          compressedCtx.drawImage(compressedCanvas, 0, 0);
        }

        // Calculate compressed file size
        updateCompressedSize(compressedCanv);
      };
      img.src = image;
    }
  }, [image]);

  useEffect(() => {
    if (originalCanvasRef.current && compressedCanvasRef.current) {
      let compressedCanvas = originalCanvasRef.current;
      if (maxWidth || maxHeight) {
        compressedCanvas = compressImage(
          originalCanvasRef.current,
          quality,
          maxWidth || undefined,
          maxHeight || undefined
        );
      }

      const compressedCanv = compressedCanvasRef.current;
      compressedCanv.width = compressedCanvas.width;
      compressedCanv.height = compressedCanvas.height;
      const ctx = compressedCanv.getContext("2d");
      if (ctx) {
        ctx.drawImage(compressedCanvas, 0, 0);
      }

      updateCompressedSize(compressedCanv);
    }
  }, [quality, maxWidth, maxHeight]);

  const updateCompressedSize = async (canvas: HTMLCanvasElement) => {
    const blob = await canvasToBlob(canvas, quality / 100);
    setCompressedSize(blob.size);
  };

  const handleDownload = async () => {
    if (compressedCanvasRef.current) {
      const blob = await canvasToBlob(
        compressedCanvasRef.current,
        quality / 100
      );
      downloadBlob(blob, "compressed-image.jpg");
    }
  };

  const compressionRatio = originalSize
    ? ((1 - compressedSize / originalSize) * 100).toFixed(1)
    : 0;

  return (
    <main className="min-h-screen pb-16 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="mb-12 animate-fadeInDown">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
              <span className="text-gradient">Image Compressor</span>
            </h1>
            <p className="text-xl text-white/70">
              Reduce file size while maintaining quality
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
                    className="w-full px-4 py-3 bg-white/10 border-2 border-white/20 rounded-lg cursor-pointer text-white/70 hover:border-green-400/50 hover:bg-white/20 transition-all duration-300"
                  />
                </div>

                {image && (
                  <>
                    {/* Quality */}
                    <div className="mb-8">
                      <div className="flex justify-between mb-3">
                        <label className="text-sm font-bold text-white uppercase tracking-wide">
                          ⭐ Quality
                        </label>
                        <span className="text-sm font-bold gradient-info text-gradient">
                          {quality}%
                        </span>
                      </div>
                      <input
                        type="range"
                        min="10"
                        max="100"
                        value={quality}
                        onChange={(e) => setQuality(parseInt(e.target.value))}
                        className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                      />
                      <p className="text-xs text-white/60 mt-3 font-medium">
                        Lower quality = smaller file size
                      </p>
                    </div>

                    {/* Max Width */}
                    <div className="mb-8">
                      <label className="block text-sm font-bold text-white mb-3 uppercase tracking-wide">
                        📏 Max Width
                      </label>
                      <input
                        type="number"
                        min="1"
                        placeholder="No limit"
                        value={maxWidth || ""}
                        onChange={(e) =>
                          setMaxWidth(
                            e.target.value ? parseInt(e.target.value) : null
                          )
                        }
                        className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 hover:border-white/40 transition-all"
                      />
                      <p className="text-xs text-white/60 mt-2 font-medium">pixels (optional)</p>
                    </div>

                    {/* Max Height */}
                    <div className="mb-8">
                      <label className="block text-sm font-bold text-white mb-3 uppercase tracking-wide">
                        📐 Max Height
                      </label>
                      <input
                        type="number"
                        min="1"
                        placeholder="No limit"
                        value={maxHeight || ""}
                        onChange={(e) =>
                          setMaxHeight(
                            e.target.value ? parseInt(e.target.value) : null
                          )
                        }
                        className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 hover:border-white/40 transition-all"
                      />
                      <p className="text-xs text-white/60 mt-2 font-medium">pixels (optional)</p>
                    </div>

                    {/* File Size Info */}
                    <div className="glass-effect rounded-xl p-6 mb-8 border border-white/20">
                      <div className="mb-4">
                        <p className="text-xs text-white/60 uppercase tracking-wider font-bold">
                          📦 Original Size
                        </p>
                        <p className="text-2xl font-bold text-white mt-1">
                          {formatFileSize(originalSize)}
                        </p>
                      </div>
                      <div className="mb-4">
                        <p className="text-xs text-white/60 uppercase tracking-wider font-bold">
                          📥 Compressed Size
                        </p>
                        <p className="text-2xl font-bold text-cyan-400 mt-1">
                          {formatFileSize(compressedSize)}
                        </p>
                      </div>
                      <div className="pt-4 border-t border-white/10">
                        <p className="text-xs text-white/60 uppercase tracking-wider font-bold">
                          ✅ Reduction
                        </p>
                        <p className="text-2xl font-bold text-emerald-400 mt-1">
                          {compressionRatio}%
                        </p>
                      </div>
                    </div>

                    {/* Download Button */}
                    <button
                      onClick={handleDownload}
                      className="w-full px-4 py-3 gradient-info text-white font-bold rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg shadow-green-500/30 hover:shadow-green-500/50 uppercase tracking-wide"
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
                  <span>🖼️</span> Original
                </h2>
                {image ? (
                  <div className="flex justify-center items-center bg-gradient-to-br from-slate-900/50 to-slate-800/50 rounded-xl p-8 min-h-72 border border-white/10 shadow-xl">
                    <canvas
                      ref={originalCanvasRef}
                      className="max-w-full max-h-80 rounded-lg shadow-2xl"
                    />
                  </div>
                ) : (
                  <div className="flex flex-col justify-center items-center bg-gradient-to-br from-slate-900/50 to-slate-800/50 rounded-xl p-16 min-h-72 border-2 border-dashed border-white/20">
                    <div className="text-6xl mb-4">📁</div>
                    <p className="text-white/60 text-center">
                      Upload an image to start
                    </p>
                  </div>
                )}
              </div>

              {/* Compressed */}
              {image && (
                <div className="glass-effect rounded-2xl p-8 backdrop-blur-xl">
                  <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                    <span>✨</span> Compressed
                  </h2>
                  <div className="flex justify-center items-center bg-gradient-to-br from-slate-900/50 to-slate-800/50 rounded-xl p-8 min-h-72 border border-white/10 shadow-xl">
                    <canvas
                      ref={compressedCanvasRef}
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
