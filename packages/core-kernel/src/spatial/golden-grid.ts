/**
 * Fibonacci & Golden Ratio (Phi) Spatial Layout Grammar
 */

export const PHI = 1.618033988749895;
export const INV_PHI = 0.618033988749895;

export interface GoldenSection {
  major: number;
  minor: number;
  ratio: number;
}

export interface GoldenScale {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  xxl: number;
}

/**
 * Splits a dimension into major (61.8%) and minor (38.2%) asymmetric sections
 */
export function goldenSplit(totalDimension: number): GoldenSection {
  const major = Math.round(totalDimension * INV_PHI);
  const minor = totalDimension - major;
  return {
    major,
    minor,
    ratio: major / (minor || 1),
  };
}

/**
 * Computes non-linear modular Fibonacci spacing scale based on a root pixel unit (e.g. 16px)
 */
export function generateGoldenSpacingScale(baseUnit: number = 16): GoldenScale {
  return {
    xs: Math.round(baseUnit / PHI / PHI), // ~6px
    sm: Math.round(baseUnit / PHI),       // ~10px
    md: baseUnit,                         // 16px
    lg: Math.round(baseUnit * PHI),       // ~26px
    xl: Math.round(baseUnit * PHI * PHI), // ~42px
    xxl: Math.round(baseUnit * Math.pow(PHI, 3)), // ~68px
  };
}

/**
 * Returns asymmetric CSS grid column proportions for human-grade layouts
 * (rejects homogeneous 1:1:1 3-column splits)
 */
export function getAsymmetricGridTemplate(variant: 'hero' | 'telemetry' | 'editorial' | 'master-detail'): string {
  switch (variant) {
    case 'hero':
      // 61.8% narrative / 38.2% technical artifact
      return 'minmax(0, 1.618fr) minmax(0, 1fr)';
    case 'telemetry':
      // 38.2% primary instrument / 61.8% stream ledger
      return 'minmax(0, 1fr) minmax(0, 1.618fr)';
    case 'editorial':
      // Asymmetric 3-column: 1fr index / 2.618fr reading plane / 1fr annotations
      return 'minmax(0, 1fr) minmax(0, 2.618fr) minmax(0, 1fr)';
    case 'master-detail':
      // Golden split master list & inspect pane
      return 'minmax(280px, 1fr) minmax(0, 1.618fr)';
  }
}
