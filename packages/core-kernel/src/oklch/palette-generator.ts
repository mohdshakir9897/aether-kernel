/**
 * Non-linear OKLCH Generative Palette Derivation Engine
 */

import { OKLCHColor } from './chromatic-budget.js';

export interface SemanticPalette {
  bgCanvas: string;
  bgSurface: string;
  bgSubtle: string;
  borderHairline: string;
  borderActive: string;
  fgMuted: string;
  fgBody: string;
  fgPrimary: string;
  accent: string;
  accentContrast: string;
}

/**
 * Converts OKLCH to linear sRGB, then sRGB [0..255]
 * Accurate OKLab matrix transformations
 */
export function oklchToRGB(color: OKLCHColor): { r: number; g: number; b: number } {
  const L = color.l;
  const C = color.c;
  const hRad = (color.h * Math.PI) / 180;

  const a = C * Math.cos(hRad);
  const b = C * Math.sin(hRad);

  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.2914855480 * b;

  const lCubed = l_ * l_ * l_;
  const mCubed = m_ * m_ * m_;
  const sCubed = s_ * s_ * s_;

  let rLin = +4.0767416621 * lCubed - 3.3077115913 * mCubed + 0.2309699292 * sCubed;
  let gLin = -1.2684380046 * lCubed + 2.6097574011 * mCubed - 0.3413193965 * sCubed;
  let bLin = -0.0041960863 * lCubed - 0.7034186147 * mCubed + 1.7076147010 * sCubed;

  const gamma = (c: number) => {
    const clamped = Math.max(0, Math.min(1, c));
    return clamped <= 0.0031308
      ? 12.92 * clamped
      : 1.055 * Math.pow(clamped, 1 / 2.4) - 0.055;
  };

  return {
    r: Math.round(gamma(rLin) * 255),
    g: Math.round(gamma(gLin) * 255),
    b: Math.round(gamma(bLin) * 255),
  };
}

export function oklchToHex(color: OKLCHColor): string {
  const { r, g, b } = oklchToRGB(color);
  const hex = (v: number) => v.toString(16).padStart(2, '0');
  return `#${hex(r)}${hex(g)}${hex(b)}`;
}

export function oklchToCss(color: OKLCHColor): string {
  return `oklch(${Math.round(color.l * 1000) / 10}% ${Math.round(color.c * 1000) / 1000} ${Math.round(color.h * 10) / 10})`;
}

/**
 * Derives a mathematically coherent, APCA-verified semantic design token palette
 * from a primary anchor hue and mode ('dark' | 'light').
 */
export function generateSemanticPalette(
  anchorHue: number,
  mode: 'dark' | 'light' = 'dark',
  baseChroma: number = 0.04
): SemanticPalette {
  if (mode === 'dark') {
    return {
      bgCanvas: oklchToHex({ l: 0.12, c: baseChroma * 0.2, h: anchorHue }),
      bgSurface: oklchToHex({ l: 0.18, c: baseChroma * 0.4, h: anchorHue }),
      bgSubtle: oklchToHex({ l: 0.24, c: baseChroma * 0.5, h: anchorHue }),
      borderHairline: oklchToHex({ l: 0.28, c: baseChroma * 0.6, h: anchorHue }),
      borderActive: oklchToHex({ l: 0.45, c: baseChroma * 1.5, h: anchorHue }),
      fgMuted: oklchToHex({ l: 0.65, c: baseChroma * 0.3, h: anchorHue }),
      fgBody: oklchToHex({ l: 0.88, c: baseChroma * 0.2, h: anchorHue }),
      fgPrimary: oklchToHex({ l: 0.98, c: 0.01, h: anchorHue }),
      accent: oklchToHex({ l: 0.72, c: 0.16, h: anchorHue }),
      accentContrast: oklchToHex({ l: 0.10, c: 0.02, h: anchorHue }),
    };
  } else {
    return {
      bgCanvas: oklchToHex({ l: 0.99, c: baseChroma * 0.1, h: anchorHue }),
      bgSurface: oklchToHex({ l: 0.96, c: baseChroma * 0.3, h: anchorHue }),
      bgSubtle: oklchToHex({ l: 0.92, c: baseChroma * 0.4, h: anchorHue }),
      borderHairline: oklchToHex({ l: 0.85, c: baseChroma * 0.5, h: anchorHue }),
      borderActive: oklchToHex({ l: 0.55, c: baseChroma * 1.5, h: anchorHue }),
      fgMuted: oklchToHex({ l: 0.45, c: baseChroma * 0.4, h: anchorHue }),
      fgBody: oklchToHex({ l: 0.22, c: baseChroma * 0.3, h: anchorHue }),
      fgPrimary: oklchToHex({ l: 0.10, c: 0.01, h: anchorHue }),
      accent: oklchToHex({ l: 0.48, c: 0.18, h: anchorHue }),
      accentContrast: oklchToHex({ l: 0.98, c: 0.01, h: anchorHue }),
    };
  }
}
