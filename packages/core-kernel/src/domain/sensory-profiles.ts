/**
 * Operator Sensory Profiles & Physical Environmental Models
 */

export interface SensoryProfile {
  deviceCategory: 'mobile-handheld' | 'desktop-workstation' | 'wall-scada-dashboard';
  nominalViewingDistanceCm: number;
  ambientLux: number; // 20 (dark) .. 500 (office) .. 10000 (direct sunlight)
  meanGazeFixationMs: number; // Typical eye dwell time
  recommendedMinFontSizePx: number;
  recommendedMinLc: number;
}

export const SENSORY_PRESETS: Record<string, SensoryProfile> = {
  mobile: {
    deviceCategory: 'mobile-handheld',
    nominalViewingDistanceCm: 32,
    ambientLux: 400,
    meanGazeFixationMs: 300,
    recommendedMinFontSizePx: 14,
    recommendedMinLc: 75,
  },
  workstation: {
    deviceCategory: 'desktop-workstation',
    nominalViewingDistanceCm: 65,
    ambientLux: 350,
    meanGazeFixationMs: 1200,
    recommendedMinFontSizePx: 13,
    recommendedMinLc: 70,
  },
  wallDisplay: {
    deviceCategory: 'wall-scada-dashboard',
    nominalViewingDistanceCm: 250,
    ambientLux: 150,
    meanGazeFixationMs: 400,
    recommendedMinFontSizePx: 28,
    recommendedMinLc: 85,
  },
};

/**
 * Calculates visual angle subtended on retina by an interface element in arcminutes:
 * $\theta = 2 \cdot \arctan\left(\frac{h}{2d}\right) \cdot \frac{180 \cdot 60}{\pi}$
 */
export function calculateRetinalVisualAngle(elementHeightMm: number, distanceCm: number): number {
  const distanceMm = distanceCm * 10;
  const radians = 2 * Math.atan(elementHeightMm / (2 * distanceMm));
  return (radians * 180 * 60) / Math.PI;
}
