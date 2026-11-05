/**
 * Chromatic Budget & Retinal Fatigue Calculator
 * Computes ocular strain, chromostereopsis clash, and spectral entropy for UI palettes.
 */

export interface OKLCHColor {
  l: number; // 0..1 (Lightness)
  c: number; // 0..0.4 (Chroma)
  h: number; // 0..360 (Hue angle in degrees)
  alpha?: number;
}

export interface ChromaticBudgetReport {
  totalFatigueScore: number; // 0..100 (lower is calmer/more ergonomic)
  chromaticEntropy: number; // Shannon entropy of hue distribution
  hasChromostereopsisRisk: boolean; // Flags purple/cyan clash
  clashingPairs: Array<{ hueA: number; hueB: number; reason: string }>;
  isWithinBudget: boolean;
  recommendations: string[];
}

/**
 * Calculates spectral angular distance between two hues
 */
export function hueDistance(h1: number, h2: number): number {
  const diff = Math.abs(h1 - h2) % 360;
  return diff > 180 ? 360 - diff : diff;
}

/**
 * Evaluates whether two colors induce Chromostereopsis
 * (e.g. saturated blue/violet/purple ~270°-320° alongside saturated red or cyan ~160°-190°)
 */
export function checkChromostereopsis(c1: OKLCHColor, c2: OKLCHColor): boolean {
  // Only high chroma triggers severe ocular focal length divergence
  if (c1.c < 0.12 || c2.c < 0.12) return false;

  const isC1ShortWave = (c1.h >= 250 && c1.h <= 320); // Purple / deep blue
  const isC2CyanOrRed = (c2.h >= 160 && c2.h <= 200) || (c2.h >= 10 && c2.h <= 40); // Cyan or Red

  const isC2ShortWave = (c2.h >= 250 && c2.h <= 320);
  const isC1CyanOrRed = (c1.h >= 160 && c1.h <= 200) || (c1.h >= 10 && c1.h <= 40);

  return (isC1ShortWave && isC2CyanOrRed) || (isC2ShortWave && isC1CyanOrRed);
}

/**
 * Computes the Chromatic Budget and fatigue metrics for a given set of UI colors.
 */
export function calculateChromaticBudget(colors: OKLCHColor[]): ChromaticBudgetReport {
  if (colors.length === 0) {
    return {
      totalFatigueScore: 0,
      chromaticEntropy: 0,
      hasChromostereopsisRisk: false,
      clashingPairs: [],
      isWithinBudget: true,
      recommendations: [],
    };
  }

  let totalChroma = 0;
  let maxChroma = 0;
  let clashingPairs: Array<{ hueA: number; hueB: number; reason: string }> = [];
  let hasChromostereopsis = false;

  // Track hue bins for entropy calculation (12 bins of 30 degrees)
  const hueBins = new Array(12).fill(0);

  for (let i = 0; i < colors.length; i++) {
    const col = colors[i];
    totalChroma += col.c;
    if (col.c > maxChroma) maxChroma = col.c;

    if (col.c > 0.04) {
      const bin = Math.min(11, Math.floor(((col.h % 360) + 360) % 360 / 30));
      hueBins[bin]++;
    }

    for (let j = i + 1; j < colors.length; j++) {
      const colB = colors[j];
      if (checkChromostereopsis(col, colB)) {
        hasChromostereopsis = true;
        clashingPairs.push({
          hueA: col.h,
          hueB: colB.h,
          reason: `High-chroma shortwave hue (${Math.round(col.h)}°) juxtaposed with longwave/cyan hue (${Math.round(colB.h)}°) causes ciliary muscle accommodation spasm.`,
        });
      }
    }
  }

  // Calculate Shannon entropy of active hues
  const totalActiveHues = hueBins.reduce((a, b) => a + b, 0);
  let chromaticEntropy = 0;
  if (totalActiveHues > 0) {
    for (const count of hueBins) {
      if (count > 0) {
        const p = count / totalActiveHues;
        chromaticEntropy -= p * Math.log2(p);
      }
    }
  }

  // Calculate overall fatigue score [0..100]
  const avgChroma = totalChroma / colors.length;
  let fatigue = avgChroma * 150 + maxChroma * 50;
  if (hasChromostereopsis) fatigue += 35;
  if (chromaticEntropy > 2.8) fatigue += 20; // Hue chaos

  const finalFatigue = Math.min(100, Math.max(0, Math.round(fatigue)));
  const recommendations: string[] = [];

  if (hasChromostereopsis) {
    recommendations.push('Eliminate clashing purple-cyan saturated pairing; anchor to a single dominant brand wavelength.');
  }
  if (avgChroma > 0.15) {
    recommendations.push('Reduce average chroma across secondary surface tokens to lower retinal fatigue.');
  }
  if (chromaticEntropy > 2.5) {
    recommendations.push('Harmonize scattered hues into a deliberate analogous or monochromatic gamut.');
  }

  return {
    totalFatigueScore: finalFatigue,
    chromaticEntropy: Math.round(chromaticEntropy * 100) / 100,
    hasChromostereopsisRisk: hasChromostereopsis,
    clashingPairs,
    isWithinBudget: finalFatigue <= 45 && !hasChromostereopsis,
    recommendations,
  };
}
