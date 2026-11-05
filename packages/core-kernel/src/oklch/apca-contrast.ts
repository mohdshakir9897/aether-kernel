/**
 * APCA (Accessible Perceptual Contrast Algorithm) Implementation
 * Based on W3C Silver / WCAG 3 Candidate guidelines by Andrew Somers.
 */

export interface RGB {
  r: number; // 0..255
  g: number; // 0..255
  b: number; // 0..255
  a?: number; // 0..1
}

export interface APCAResult {
  contrastLc: number; // -108 .. +106
  absLc: number;
  polarity: 'positive' | 'negative'; // 'positive' = dark text on light bg, 'negative' = light text on dark bg
  isCompliant: boolean;
  minLcRequired: number;
}

// APCA 0.98G Constants
const MAIN_TRC = 2.4;
const R_COEFF = 0.2126729;
const G_COEFF = 0.7151522;
const B_COEFF = 0.0721750;

// Power law exponents
const NORM_BG = 0.56;
const NORM_TXT = 0.62;
const REV_BG = 0.65;
const REV_TXT = 0.57;

// Soft clipping constants
const BLK_THRESH = 0.022;
const BLK_CLMP = 1.414;
const SCALE_BOOST = 1.14154;

/**
 * Converts sRGB channel (0..255) to linear luminance
 */
export function sRGBtoLinear(val: number): number {
  const norm = Math.max(0, Math.min(255, val)) / 255;
  return norm <= 0.04045 ? norm / 12.92 : Math.pow((norm + 0.055) / 1.055, MAIN_TRC);
}

/**
 * Computes photopic linear luminance Y for an sRGB triplet
 */
export function rgbToLuminance(rgb: RGB): number {
  const rLin = sRGBtoLinear(rgb.r);
  const gLin = sRGBtoLinear(rgb.g);
  const bLin = sRGBtoLinear(rgb.b);
  return R_COEFF * rLin + G_COEFF * gLin + B_COEFF * bLin;
}

/**
 * Parse hex, rgb, rgba string to RGB object
 */
export function parseColorToRGB(color: string | RGB): RGB {
  if (typeof color !== 'string') {
    return color;
  }
  const str = color.trim().toLowerCase();

  // Hex format #rgb, #rrggbb, #rgba, #rrggbbaa
  if (str.startsWith('#')) {
    const raw = str.slice(1);
    if (raw.length === 3 || raw.length === 4) {
      const r = parseInt(raw[0] + raw[0], 16);
      const g = parseInt(raw[1] + raw[1], 16);
      const b = parseInt(raw[2] + raw[2], 16);
      return { r, g, b, a: raw.length === 4 ? parseInt(raw[3] + raw[3], 16) / 255 : 1 };
    }
    if (raw.length === 6 || raw.length === 8) {
      const r = parseInt(raw.slice(0, 2), 16);
      const g = parseInt(raw.slice(2, 4), 16);
      const b = parseInt(raw.slice(4, 6), 16);
      return { r, g, b, a: raw.length === 8 ? parseInt(raw.slice(6, 8), 16) / 255 : 1 };
    }
  }

  // rgb(...) or rgba(...)
  const rgbMatch = str.match(/rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)(?:\s*,\s*([\d.]+))?\s*\)/);
  if (rgbMatch) {
    return {
      r: parseFloat(rgbMatch[1]),
      g: parseFloat(rgbMatch[2]),
      b: parseFloat(rgbMatch[3]),
      a: rgbMatch[4] !== undefined ? parseFloat(rgbMatch[4]) : 1,
    };
  }

  // Named default fallbacks
  if (str === 'black' || str === '#000') return { r: 0, g: 0, b: 0, a: 1 };
  if (str === 'white' || str === '#fff') return { r: 255, g: 255, b: 255, a: 1 };

  // Default to neutral dark grey
  return { r: 30, g: 30, b: 30, a: 1 };
}

/**
 * Calculates APCA contrast (Lc) between text and background.
 * Returns signed Lc value:
 * - Positive Lc (+): Dark text on light background
 * - Negative Lc (-): Light text on dark background
 */
export function calcAPCA(textColor: string | RGB, backgroundColor: string | RGB): number {
  const txtRGB = parseColorToRGB(textColor);
  const bgRGB = parseColorToRGB(backgroundColor);

  let yTxt = rgbToLuminance(txtRGB);
  let yBg = rgbToLuminance(bgRGB);

  // Soft clip black clamp
  yTxt = yTxt > BLK_THRESH ? yTxt : yTxt + Math.pow(BLK_THRESH - yTxt, BLK_CLMP);
  yBg = yBg > BLK_THRESH ? yBg : yBg + Math.pow(BLK_THRESH - yBg, BLK_CLMP);

  if (Math.abs(yBg - yTxt) < 0.0005) {
    return 0.0;
  }

  let output = 0;
  if (yBg > yTxt) {
    // Positive polarity: Dark text on light background
    const sBg = Math.pow(yBg, NORM_BG);
    const sTxt = Math.pow(yTxt, NORM_TXT);
    const c = (sBg - sTxt) * SCALE_BOOST;
    output = c < 0.001 ? 0.0 : c * 100.0;
  } else {
    // Negative polarity: Light text on dark background
    const sBg = Math.pow(yBg, REV_BG);
    const sTxt = Math.pow(yTxt, REV_TXT);
    const c = (sBg - sTxt) * SCALE_BOOST;
    output = c > -0.001 ? 0.0 : c * 100.0;
  }

  return Math.round(output * 10) / 10;
}

/**
 * Lookup minimum APCA Lc required for given font size (pt/px) and weight (100..900)
 */
export function lookupMinLc(fontSizePx: number, fontWeight: number = 400): number {
  if (fontSizePx >= 36) {
    return fontWeight >= 700 ? 45 : 55;
  }
  if (fontSizePx >= 24) {
    return fontWeight >= 700 ? 55 : 60;
  }
  if (fontSizePx >= 18) {
    return fontWeight >= 700 ? 60 : 65;
  }
  if (fontSizePx >= 16) {
    return fontWeight >= 700 ? 65 : 75;
  }
  if (fontSizePx >= 14) {
    return fontWeight >= 700 ? 75 : 85;
  }
  return 90; // small caption / microcopy
}

/**
 * Complete evaluation of contrast conformance against APCA standards
 */
export function evaluateAPCA(
  textColor: string | RGB,
  backgroundColor: string | RGB,
  fontSizePx: number = 16,
  fontWeight: number = 400
): APCAResult {
  const lc = calcAPCA(textColor, backgroundColor);
  const absLc = Math.abs(lc);
  const minRequired = lookupMinLc(fontSizePx, fontWeight);

  return {
    contrastLc: lc,
    absLc,
    polarity: lc >= 0 ? 'positive' : 'negative',
    isCompliant: absLc >= minRequired,
    minLcRequired: minRequired,
  };
}
