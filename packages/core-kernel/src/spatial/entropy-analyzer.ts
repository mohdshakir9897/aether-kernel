/**
 * Layout Density & Shannon Spatial Entropy Analyzer
 */

import { VisualNode } from './tension.js';

export interface LayoutEntropyReport {
  shannonEntropy: number; // in bits (higher = richer informational distribution)
  densityVariance: number;
  whiteSpaceRatio: number; // 0..1
  isAestheticSlop: boolean;
  convergenceProbability: number; // 0..1 (likelihood of uncurated generic AI generation)
  diagnostics: string[];
}

/**
 * Quantizes the viewport into an M x N spatial grid and measures
 * the probability distribution of visual mass across cells.
 */
export function analyzeLayoutEntropy(
  nodes: VisualNode[],
  viewport: { width: number; height: number },
  gridCols: number = 4,
  gridRows: number = 4
): LayoutEntropyReport {
  const totalCells = gridCols * gridRows;
  const cellWidth = viewport.width / gridCols;
  const cellHeight = viewport.height / gridRows;

  const cellMasses = new Array(totalCells).fill(0);
  let totalAreaOccupied = 0;

  for (const node of nodes) {
    const area = node.box.width * node.box.height;
    totalAreaOccupied += area;

    const centerX = node.box.x + node.box.width / 2;
    const centerY = node.box.y + node.box.height / 2;

    const col = Math.max(0, Math.min(gridCols - 1, Math.floor(centerX / cellWidth)));
    const row = Math.max(0, Math.min(gridRows - 1, Math.floor(centerY / cellHeight)));
    const idx = row * gridCols + col;

    const mass = area * Math.max(0.1, node.luminanceContrast);
    cellMasses[idx] += mass;
  }

  const totalMass = cellMasses.reduce((acc, m) => acc + m, 0);
  let shannonEntropy = 0;

  if (totalMass > 0) {
    for (const mass of cellMasses) {
      if (mass > 0) {
        const p = mass / totalMass;
        shannonEntropy -= p * Math.log2(p);
      }
    }
  }

  // Measure density variance across active cells
  const meanMass = totalMass / totalCells;
  const variance =
    cellMasses.reduce((acc, m) => acc + Math.pow(m - meanMass, 2), 0) / totalCells;

  const totalViewportArea = viewport.width * viewport.height;
  const whiteSpaceRatio = Math.max(0, 1.0 - totalAreaOccupied / totalViewportArea);

  const diagnostics: string[] = [];

  // Generic AI layouts often cluster all weight into a narrow vertical band in the middle
  const middleColsMass = cellMasses
    .filter((_, idx) => {
      const c = idx % gridCols;
      return c === 1 || c === 2;
    })
    .reduce((a, b) => a + b, 0);

  const middleConcentration = totalMass > 0 ? middleColsMass / totalMass : 0;
  let convergenceProbability = 0;

  if (middleConcentration > 0.82) {
    convergenceProbability += 0.45;
    diagnostics.push('Excessive center-column mass concentration (>80% visual weight in narrow column).');
  }

  if (shannonEntropy < 1.8 && nodes.length >= 4) {
    convergenceProbability += 0.35;
    diagnostics.push('Extremely low spatial Shannon entropy; layout lacks dynamic visual rhythm.');
  }

  if (whiteSpaceRatio < 0.25) {
    convergenceProbability += 0.20;
    diagnostics.push('Critical spatial crowding: inadequate negative space for ocular rest.');
  }

  const isAestheticSlop = convergenceProbability >= 0.65;

  return {
    shannonEntropy: Math.round(shannonEntropy * 100) / 100,
    densityVariance: Math.round(variance),
    whiteSpaceRatio: Math.round(whiteSpaceRatio * 100) / 100,
    isAestheticSlop,
    convergenceProbability: Math.min(1.0, Math.round(convergenceProbability * 100) / 100),
    diagnostics,
  };
}
