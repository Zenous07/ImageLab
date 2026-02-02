// Image Processing Utilities

export interface FilterSettings {
  brightness: number;
  contrast: number;
  saturation: number;
  blur: number;
  grayscale: number;
  sepia: number;
}

export interface FilterPreset {
  name: string;
  emoji: string;
  settings: FilterSettings;
}

export const defaultFilterSettings: FilterSettings = {
  brightness: 100,
  contrast: 100,
  saturation: 100,
  blur: 0,
  grayscale: 0,
  sepia: 0,
};

export const filterPresets: FilterPreset[] = [
  {
    name: "Original",
    emoji: "🔄",
    settings: defaultFilterSettings,
  },
  {
    name: "Vintage",
    emoji: "📼",
    settings: {
      brightness: 105,
      contrast: 95,
      saturation: 80,
      blur: 0,
      grayscale: 0,
      sepia: 40,
    },
  },
  {
    name: "Cool Blue",
    emoji: "❄️",
    settings: {
      brightness: 100,
      contrast: 115,
      saturation: 90,
      blur: 0,
      grayscale: 0,
      sepia: 0,
    },
  },
  {
    name: "Warm Sunset",
    emoji: "🌅",
    settings: {
      brightness: 110,
      contrast: 105,
      saturation: 130,
      blur: 0,
      grayscale: 0,
      sepia: 30,
    },
  },
  {
    name: "B&W Classic",
    emoji: "⚪",
    settings: {
      brightness: 100,
      contrast: 120,
      saturation: 100,
      blur: 0,
      grayscale: 100,
      sepia: 0,
    },
  },
  {
    name: "Noir",
    emoji: "🖤",
    settings: {
      brightness: 85,
      contrast: 140,
      saturation: 100,
      blur: 0,
      grayscale: 100,
      sepia: 0,
    },
  },
  {
    name: "Vivid",
    emoji: "🌈",
    settings: {
      brightness: 100,
      contrast: 120,
      saturation: 150,
      blur: 0,
      grayscale: 0,
      sepia: 0,
    },
  },
  {
    name: "Soft Focus",
    emoji: "🎬",
    settings: {
      brightness: 105,
      contrast: 95,
      saturation: 100,
      blur: 2,
      grayscale: 0,
      sepia: 0,
    },
  },
  {
    name: "Dream",
    emoji: "✨",
    settings: {
      brightness: 115,
      contrast: 80,
      saturation: 120,
      blur: 1,
      grayscale: 0,
      sepia: 0,
    },
  },
];

export function getFilterCSS(settings: FilterSettings): string {
  return `
    brightness(${settings.brightness}%)
    contrast(${settings.contrast}%)
    saturate(${settings.saturation}%)
    blur(${settings.blur}px)
    grayscale(${settings.grayscale}%)
    sepia(${settings.sepia}%)
  `.trim().replace(/\s+/g, ' ');
}

export async function canvasToBlob(
  canvas: HTMLCanvasElement,
  quality: number = 0.9
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error("Failed to convert canvas to blob"));
        }
      },
      "image/jpeg",
      quality
    );
  });
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
}

export interface RGBColor {
  r: number;
  g: number;
  b: number;
}

export function hexToRgb(hex: string): RGBColor {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) {
    return { r: 255, g: 255, b: 255 };
  }
  return {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
  };
}

export function rgbToHex(color: RGBColor): string {
  return (
    "#" +
    [color.r, color.g, color.b]
      .map((x) => {
        const hex = x.toString(16);
        return hex.length === 1 ? "0" + hex : hex;
      })
      .join("")
      .toUpperCase()
  );
}

export function colorDistance(c1: RGBColor, c2: RGBColor): number {
  const dr = c1.r - c2.r;
  const dg = c1.g - c2.g;
  const db = c1.b - c2.b;
  return Math.sqrt(dr * dr + dg * dg + db * db);
}

export function replaceBackgroundColor(
  imageData: ImageData,
  targetColor: RGBColor,
  tolerance: number
): ImageData {
  const data = imageData.data;
  const result = new ImageData(
    new Uint8ClampedArray(data),
    imageData.width,
    imageData.height
  );
  const resultData = result.data;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const a = data[i + 3];

    const pixelColor: RGBColor = { r, g, b };
    const distance = colorDistance(pixelColor, targetColor);

    if (distance < tolerance) {
      resultData[i + 3] = 0; // Make transparent
    }
  }

  return result;
}

export function applyFilterToCanvas(
  canvas: HTMLCanvasElement,
  settings: FilterSettings
): void {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const filterCSS = getFilterCSS(settings);
  ctx.filter = filterCSS;
  ctx.drawImage(canvas, 0, 0);
}

export function compressImage(
  canvas: HTMLCanvasElement,
  quality: number,
  maxWidth?: number,
  maxHeight?: number
): HTMLCanvasElement {
  const compressed = document.createElement("canvas");
  let width = canvas.width;
  let height = canvas.height;

  if (maxWidth && width > maxWidth) {
    height = Math.round((height * maxWidth) / width);
    width = maxWidth;
  }

  if (maxHeight && height > maxHeight) {
    width = Math.round((width * maxHeight) / height);
    height = maxHeight;
  }

  compressed.width = width;
  compressed.height = height;

  const ctx = compressed.getContext("2d");
  if (ctx) {
    ctx.drawImage(canvas, 0, 0, width, height);
  }

  return compressed;
}

// Crop image
export function cropImage(
  canvas: HTMLCanvasElement,
  x: number,
  y: number,
  width: number,
  height: number
): HTMLCanvasElement {
  const cropped = document.createElement("canvas");
  cropped.width = width;
  cropped.height = height;
  const ctx = cropped.getContext("2d");
  if (ctx) {
    ctx.drawImage(canvas, x, y, width, height, 0, 0, width, height);
  }
  return cropped;
}

// Resize image
export function resizeImage(
  canvas: HTMLCanvasElement,
  width: number,
  height: number
): HTMLCanvasElement {
  const resized = document.createElement("canvas");
  resized.width = width;
  resized.height = height;
  const ctx = resized.getContext("2d");
  if (ctx) {
    ctx.drawImage(canvas, 0, 0, width, height);
  }
  return resized;
}

// Rotate image
export function rotateImage(
  canvas: HTMLCanvasElement,
  degrees: number
): HTMLCanvasElement {
  const radians = (degrees * Math.PI) / 180;
  const cos = Math.cos(radians);
  const sin = Math.sin(radians);

  const width = Math.abs(canvas.width * cos) + Math.abs(canvas.height * sin);
  const height = Math.abs(canvas.width * sin) + Math.abs(canvas.height * cos);

  const rotated = document.createElement("canvas");
  rotated.width = width;
  rotated.height = height;

  const ctx = rotated.getContext("2d");
  if (ctx) {
    ctx.translate(width / 2, height / 2);
    ctx.rotate(radians);
    ctx.drawImage(canvas, -canvas.width / 2, -canvas.height / 2);
  }

  return rotated;
}

// Flip image
export function flipImage(
  canvas: HTMLCanvasElement,
  direction: "horizontal" | "vertical"
): HTMLCanvasElement {
  const flipped = document.createElement("canvas");
  flipped.width = canvas.width;
  flipped.height = canvas.height;

  const ctx = flipped.getContext("2d");
  if (ctx) {
    if (direction === "horizontal") {
      ctx.scale(-1, 1);
      ctx.drawImage(canvas, -canvas.width, 0);
    } else {
      ctx.scale(1, -1);
      ctx.drawImage(canvas, 0, -canvas.height);
    }
  }

  return flipped;
}

// Add watermark text
export function addWatermark(
  canvas: HTMLCanvasElement,
  text: string,
  x: number,
  y: number,
  fontSize: number,
  color: string,
  opacity: number
): HTMLCanvasElement {
  const watermarked = document.createElement("canvas");
  watermarked.width = canvas.width;
  watermarked.height = canvas.height;

  const ctx = watermarked.getContext("2d");
  if (ctx) {
    ctx.drawImage(canvas, 0, 0);
    ctx.globalAlpha = opacity / 100;
    ctx.font = `bold ${fontSize}px Arial`;
    ctx.fillStyle = color;
    ctx.textAlign = "start";
    ctx.fillText(text, x, y);
  }

  return watermarked;
}

// Download with specific format
export async function downloadImage(
  canvas: HTMLCanvasElement,
  filename: string,
  format: "png" | "jpg" | "webp" = "jpg",
  quality: number = 0.95
): Promise<void> {
  const mimeType = format === "png" ? "image/png" : format === "jpg" ? "image/jpeg" : "image/webp";
  const extension = format === "jpg" ? "jpg" : format;

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `${filename}.${extension}`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
          resolve();
        } else {
          reject(new Error("Failed to download image"));
        }
      },
      mimeType,
      quality
    );
  });
}

// Background Removal Algorithms

// 1. Color-based removal (simple threshold)
export function removeBackgroundColorBased(
  imageData: ImageData,
  targetColor: RGBColor,
  threshold: number,
  softness: number = 0
): ImageData {
  const data = imageData.data;
  const result = new ImageData(
    new Uint8ClampedArray(data),
    imageData.width,
    imageData.height
  );
  const resultData = result.data;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    const pixelColor: RGBColor = { r, g, b };
    const distance = colorDistance(pixelColor, targetColor);

    if (distance < threshold) {
      const alpha = Math.max(0, 255 - (distance / threshold) * 255 * (1 + softness / 100));
      resultData[i + 3] = Math.floor(alpha);
    }
  }

  return result;
}

// 2. Clustering-based removal (groups similar colors)
export function removeBackgroundClustering(
  imageData: ImageData,
  clusterThreshold: number,
  iterations: number = 5,
  softness: number = 0
): ImageData {
  const data = imageData.data;
  const width = imageData.width;
  const height = imageData.height;

  const result = new ImageData(
    new Uint8ClampedArray(data),
    width,
    height
  );
  const resultData = result.data;

  // Find the most common color (background)
  const colorMap: Record<string, number> = {};
  for (let i = 0; i < data.length; i += 4) {
    const key = `${data[i]},${data[i + 1]},${data[i + 2]}`;
    colorMap[key] = (colorMap[key] || 0) + 1;
  }

  const bgColor = Object.entries(colorMap).reduce((a, b) => (b[1] > a[1] ? b : a))[0].split(",").map(Number);
  const backgroundColor: RGBColor = { r: bgColor[0], g: bgColor[1], b: bgColor[2] };

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    const pixelColor: RGBColor = { r, g, b };
    const distance = colorDistance(pixelColor, backgroundColor);

    if (distance < clusterThreshold) {
      const alpha = Math.max(0, 255 - (distance / clusterThreshold) * 255 * (1 + softness / 100));
      resultData[i + 3] = Math.floor(alpha);
    }
  }

  return result;
}

// 3. Contrast-based removal (edge detection)
export function removeBackgroundContrast(
  imageData: ImageData,
  contrastThreshold: number,
  softness: number = 0
): ImageData {
  const data = imageData.data;
  const width = imageData.width;
  const height = imageData.height;

  const result = new ImageData(
    new Uint8ClampedArray(data),
    width,
    height
  );
  const resultData = result.data;

  // Calculate edges and contrast
  for (let i = 0; i < height; i++) {
    for (let j = 0; j < width; j++) {
      const idx = (i * width + j) * 4;

      let contrast = 0;
      let count = 0;

      // Check neighbors
      for (let di = -1; di <= 1; di++) {
        for (let dj = -1; dj <= 1; dj++) {
          if (di === 0 && dj === 0) continue;
          const ni = i + di;
          const nj = j + dj;

          if (ni >= 0 && ni < height && nj >= 0 && nj < width) {
            const nidx = (ni * width + nj) * 4;
            const diff = Math.abs(data[idx] - data[nidx]) +
                        Math.abs(data[idx + 1] - data[nidx + 1]) +
                        Math.abs(data[idx + 2] - data[nidx + 2]);
            contrast += diff;
            count++;
          }
        }
      }

      contrast = count > 0 ? contrast / count / 3 : 0;

      if (contrast < contrastThreshold) {
        const alpha = Math.max(0, 255 - (contrastThreshold - contrast) / contrastThreshold * 255 * (1 + softness / 100));
        resultData[idx + 3] = Math.floor(alpha);
      }
    }
  }

  return result;
}

// 4. Hybrid/AI-like removal (combines all methods)
export function removeBackgroundHybrid(
  imageData: ImageData,
  colorThreshold: number,
  contrastThreshold: number,
  softness: number = 0
): ImageData {
  const data = imageData.data;
  const width = imageData.width;
  const height = imageData.height;

  const result = new ImageData(
    new Uint8ClampedArray(data),
    width,
    height
  );
  const resultData = result.data;

  // Find background color
  const colorMap: Record<string, number> = {};
  for (let i = 0; i < data.length; i += 4) {
    const key = `${data[i]},${data[i + 1]},${data[i + 2]}`;
    colorMap[key] = (colorMap[key] || 0) + 1;
  }

  const bgColor = Object.entries(colorMap).reduce((a, b) => (b[1] > a[1] ? b : a))[0].split(",").map(Number);
  const backgroundColor: RGBColor = { r: bgColor[0], g: bgColor[1], b: bgColor[2] };

  // Apply hybrid detection
  for (let i = 0; i < height; i++) {
    for (let j = 0; j < width; j++) {
      const idx = (i * width + j) * 4;

      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];
      const pixelColor: RGBColor = { r, g, b };
      const colorDist = colorDistance(pixelColor, backgroundColor);

      // Calculate contrast
      let contrast = 0;
      let count = 0;
      for (let di = -1; di <= 1; di++) {
        for (let dj = -1; dj <= 1; dj++) {
          if (di === 0 && dj === 0) continue;
          const ni = i + di;
          const nj = j + dj;

          if (ni >= 0 && ni < height && nj >= 0 && nj < width) {
            const nidx = (ni * width + nj) * 4;
            const diff = Math.abs(data[idx] - data[nidx]) +
                        Math.abs(data[idx + 1] - data[nidx + 1]) +
                        Math.abs(data[idx + 2] - data[nidx + 2]);
            contrast += diff;
            count++;
          }
        }
      }
      contrast = count > 0 ? contrast / count / 3 : 0;

      // Combine both methods
      const colorScore = colorDist < colorThreshold ? 1 - (colorDist / colorThreshold) : 0;
      const contrastScore = contrast < contrastThreshold ? 1 - (contrast / contrastThreshold) : 0;
      const combined = (colorScore + contrastScore) / 2;

      if (combined > 0.3) {
        const alpha = 255 * (1 - combined) * (1 + softness / 100);
        resultData[idx + 3] = Math.floor(Math.max(0, Math.min(255, alpha)));
      }
    }
  }

  return result;
}
