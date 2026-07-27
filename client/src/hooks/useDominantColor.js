import { useEffect, useRef, useState } from "react";

const SAMPLE_SIZE = 8; // small canvas keeps pixel averaging cheap
const colorCache = new Map();

function extractAverageColor(imageUrl) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = SAMPLE_SIZE;
        canvas.height = SAMPLE_SIZE;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, SAMPLE_SIZE, SAMPLE_SIZE);
        const { data } = ctx.getImageData(0, 0, SAMPLE_SIZE, SAMPLE_SIZE);

        let r = 0;
        let g = 0;
        let b = 0;
        const pixelCount = data.length / 4;
        for (let i = 0; i < data.length; i += 4) {
          r += data[i];
          g += data[i + 1];
          b += data[i + 2];
        }
        resolve({
          r: Math.round(r / pixelCount),
          g: Math.round(g / pixelCount),
          b: Math.round(b / pixelCount),
        });
      } catch (err) {
        // Tainted canvas (CORS) or decode failure - caller falls back to defaults.
        reject(err);
      }
    };
    img.onerror = reject;
    img.src = imageUrl;
  });
}

// Maps a {r,g,b} color (or falsy) to the CSS custom properties consumed by
// BottomControlsStyle.css's input[type="range"] rules. Shared so every
// range-input consumer (Seekbar, the volume bar, ...) themes identically.
export function getArtworkThemeStyle(dominantColor) {
  if (!dominantColor) return undefined;
  const { r, g, b } = dominantColor;
  return {
    "--seekbar-color-start": `rgba(${r}, ${g}, ${b}, 0.5)`,
    "--seekbar-color-end": `rgb(${r}, ${g}, ${b})`,
  };
}

// Returns the average color of an image ({r,g,b}) or null while unavailable.
// Keeps the previous value on URL change instead of resetting to null, so
// callers don't flash back to a fallback color between song changes.
export default function useDominantColor(imageUrl) {
  const [color, setColor] = useState(null);
  const latestUrlRef = useRef(imageUrl);

  useEffect(() => {
    latestUrlRef.current = imageUrl;
    if (!imageUrl) return;

    const cached = colorCache.get(imageUrl);
    if (cached) {
      setColor(cached);
      return;
    }

    extractAverageColor(imageUrl)
      .then((rgb) => {
        colorCache.set(imageUrl, rgb);
        // Discard if a newer URL was requested while this one was in flight.
        if (latestUrlRef.current === imageUrl) setColor(rgb);
      })
      .catch(() => {
        // Leave color as-is; consumer falls back to its CSS default.
      });
  }, [imageUrl]);

  return color;
}
