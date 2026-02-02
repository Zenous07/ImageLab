"use client";


import { useState, useRef, useEffect } from "react";
import { cropImage, canvasToBlob, downloadBlob, downloadImage } from "@/lib/utils/imageProcessing";

export default function CropperPage() {
  const [image, setImage] = useState<string | null>(null);
  const [cropStartX, setCropStartX] = useState(0);
  const [cropStartY, setCropStartY] = useState(0);
  const [cropWidth, setCropWidth] = useState(0);
  const [cropHeight, setCropHeight] = useState(0);
  const [isCropping, setIsCropping] = useState(false);
  const [aspectRatio, setAspectRatio] = useState<string>("free");
  const [exportFormat, setExportFormat] = useState<"jpg" | "png" | "webp">("jpg");
  const canvasRef = useRef<HTMLCanvasElement>(null);
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
        setCropWidth(Math.floor(img.width * 0.5));
        setCropHeight(Math.floor(img.height * 0.5));
      };
      img.src = image;
    }
  }, [image]);

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const scaleX = canvasRef.current.width / rect.width;
    const scaleY = canvasRef.current.height / rect.height;

    setCropStartX(Math.floor((e.clientX - rect.left) * scaleX));
    setCropStartY(Math.floor((e.clientY - rect.top) * scaleY));
    setIsCropping(true);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isCropping || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const scaleX = canvasRef.current.width / rect.width;
    const scaleY = canvasRef.current.height / rect.height;

    const currentX = Math.floor((e.clientX - rect.left) * scaleX);
    const currentY = Math.floor((e.clientY - rect.top) * scaleY);

    let newWidth = Math.abs(currentX - cropStartX);
    let newHeight = Math.abs(currentY - cropStartY);

    // Apply aspect ratio if selected
    if (aspectRatio !== "free") {
      const [w, h] = aspectRatio.split(":").map(Number);
      const ratio = w / h;
      if (newWidth / newHeight > ratio) {
        newHeight = Math.floor(newWidth / ratio);
      } else {
        newWidth = Math.floor(newHeight * ratio);
      }
    }

    setCropWidth(newWidth);
    setCropHeight(newHeight);
  };

  const handleMouseUp = () => {
    setIsCropping(false);
  };

  const handleCrop = async () => {
    if (canvasRef.current && cropWidth > 0 && cropHeight > 0) {
      const croppedCanvas = cropImage(canvasRef.current, cropStartX, cropStartY, cropWidth, cropHeight);
      const blob = await canvasToBlob(croppedCanvas, 0.95);
      downloadBlob(blob, "cropped-image.jpg");
    }
  };

  return (
    <main className="min-h-screen pb-16 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="mb-12 animate-fadeInDown">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
              <span className="text-gradient">Image Cropper</span>
            </h1>
            <p className="text-xl text-white/70">
              Crop your images with precise control and aspect ratio presets
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Controls */}
            <div className="lg:col-span-1 animate-slideInFromLeft">
              <div className="glass-effect rounded-2xl p-8 sticky top-20 backdrop-blur-xl">
                <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-2">
                  <span>✂️</span> Crop Settings
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
                    {/* Aspect Ratio */}
                    <div className="mb-8">
                      <label className="block text-sm font-bold text-white mb-3 uppercase tracking-wide">
                        📐 Aspect Ratio
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { label: "Free", value: "free" },
                          { label: "1:1", value: "1:1" },
                          { label: "16:9", value: "16:9" },
                          { label: "4:3", value: "4:3" },
                        ].map((option) => (
                          <button
                            key={option.value}
                            onClick={() => setAspectRatio(option.value)}
                            className={`px-3 py-2 rounded-lg font-bold text-sm transition-all ${
                              aspectRatio === option.value
                                ? "gradient-primary text-white shadow-lg"
                                : "bg-white/10 text-white hover:bg-white/20"
                            }`}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Crop Info */}
                    <div className="mb-8 p-4 glass-effect rounded-lg border border-white/20">
                      <p className="text-sm font-bold text-white/80 mb-3 uppercase tracking-wide">
                        📏 Crop Area
                      </p>
                      <div className="space-y-2 text-sm text-white/70">
                        <p>Width: <span className="text-white font-bold">{cropWidth}px</span></p>
                        <p>Height: <span className="text-white font-bold">{cropHeight}px</span></p>
                        <p>X: <span className="text-white font-bold">{cropStartX}px</span></p>
                        <p>Y: <span className="text-white font-bold">{cropStartY}px</span></p>
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

                    {/* Crop Button */}
                    <button
                      onClick={handleCrop}
                      className="w-full px-4 py-3 gradient-primary text-white font-bold rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg"
                    >
                      ✂️ Crop Image
                    </button>
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
                  <div className="flex justify-center items-center bg-gradient-to-br from-slate-900/50 to-slate-800/50 rounded-xl p-8 min-h-96 border border-white/10 shadow-xl overflow-auto">
                    <canvas
                      ref={canvasRef}
                      onMouseDown={handleMouseDown}
                      onMouseMove={handleMouseMove}
                      onMouseUp={handleMouseUp}
                      onMouseLeave={handleMouseUp}
                      className="max-w-full max-h-96 rounded-lg shadow-2xl cursor-crosshair"
                    />
                  </div>
                ) : (
                  <div className="flex flex-col justify-center items-center bg-gradient-to-br from-slate-900/50 to-slate-800/50 rounded-xl p-16 min-h-96 border-2 border-dashed border-white/20">
                    <div className="text-6xl mb-4">🖼️</div>
                    <p className="text-white/60 text-center text-lg">
                      Upload an image and drag to crop
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
