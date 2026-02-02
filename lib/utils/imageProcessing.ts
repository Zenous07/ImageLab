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
