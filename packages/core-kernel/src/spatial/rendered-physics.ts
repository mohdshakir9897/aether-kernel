/**
 * Rendered Spatial Physics & Slop Discriminator Evaluator
 * Evaluates live rendered element bounding boxes against spatial entropy, VCoM symmetry, and energy.
 */

export interface ElementBox {
  left: number;
  top: number;
  width: number;
  height: number;
}

export interface PhysicsEvaluationResult {
  isSlop: boolean;
  energy: number;
  entropy: number;
  symmetry: number;
  violations: string[];
}

export function evaluateRenderedPhysics(boundingBoxes: ElementBox[]): PhysicsEvaluationResult {
  const violations: string[] = [];

  if (!boundingBoxes || boundingBoxes.length === 0) {
    return { isSlop: false, energy: 0, entropy: 0, symmetry: 0, violations };
  }

  // Filter valid positive area boxes to prevent NaN when box area is 0 or negative
  const validBoxes = boundingBoxes.filter((box) => box.width > 0 && box.height > 0);
  const totalArea = validBoxes.reduce((acc, box) => acc + box.width * box.height, 0);

  if (totalArea <= 0) {
    return { isSlop: false, energy: 0, entropy: 0, symmetry: 0, violations: ['Total layout render area is zero or non-positive'] };
  }

  // 1. Calculate Spatial Distribution Entropy: H(X) = -Σ P(x) * log2(P(x))
  // Explicitly guard against NaN when p <= 0
  let entropy = 0;
  for (const box of validBoxes) {
    const area = box.width * box.height;
    if (area > 0) {
      const p = area / totalArea;
      if (p > 0) {
        entropy -= p * Math.log2(p);
      }
    }
  }

  // Guard against numerical underflow
  entropy = Math.max(0, entropy);

  // 2. Calculate Visual Center of Mass (VCoM)
  let weightedX = 0;
  for (const box of validBoxes) {
    const area = box.width * box.height;
    const centerX = box.left + box.width / 2;
    weightedX += centerX * area;
  }
  const vcomX = weightedX / totalArea;

  // Normalized horizontal symmetry (assuming coordinate space 0.0 to 1.0 or canvas midpoint 0.5)
  // Distance from center line (0.5)
  const symmetry = Math.max(0, Math.min(1.0, 1.0 - Math.abs(vcomX - 0.5) * 2));

  // 3. Mathematical slop discriminator threshold
  // Generic AI layouts exhibit minimal entropy variance (equal boxes) AND near-perfect central symmetry
  const isSlop = symmetry > 0.94 && entropy < 1.8 && validBoxes.length >= 3;

  if (isSlop) {
    violations.push('Aesthetic Convergence detected: High symmetry (>0.94) coupled with low layout entropy (<1.8).');
  }

  const energy = symmetry + 1 / (entropy + 0.01);

  return {
    isSlop,
    energy: Math.round(energy * 1000) / 1000,
    entropy: Math.round(entropy * 1000) / 1000,
    symmetry: Math.round(symmetry * 1000) / 1000,
    violations,
  };
}
