/**
 * Visual Center of Mass (VCoM) Vector Physics Engine
 * Calculates visual tension, centroid coordinates, and flags center-stack stagnation.
 */

export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface VisualNode {
  id?: string;
  box: BoundingBox;
  luminanceContrast: number; // 0..1 (difference against viewport canvas)
  edgeComplexity?: number; // 0..1 (high-frequency contours, iconography, glyphs)
  isText?: boolean;
}

export interface VCoMResult {
  centerOfMass: { x: number; y: number };
  geometricCenter: { x: number; y: number };
  tensionVector: { dx: number; dy: number; magnitude: number; angleDeg: number };
  totalVisualMass: number;
  isStagnantCenterStack: boolean;
  isBalancedAsymmetric: boolean;
}

/**
 * Calculates node visual mass from area, luminance contrast, and edge complexity.
 */
export function calculateNodeMass(node: VisualNode): number {
  const area = Math.max(1, node.box.width * node.box.height);
  const contrastFactor = Math.pow(Math.max(0.05, node.luminanceContrast), 1.25);
  const complexity = 1.0 + 0.4 * (node.edgeComplexity ?? (node.isText ? 0.6 : 0.2));
  return area * contrastFactor * complexity;
}

/**
 * Computes the Visual Center of Mass (VCoM) for a collection of layout nodes
 * within a bounding viewport (e.g. 1440x900).
 */
export function calculateVCoM(
  nodes: VisualNode[],
  viewport: { width: number; height: number }
): VCoMResult {
  const geomCenterX = viewport.width / 2;
  const geomCenterY = viewport.height / 2;

  if (nodes.length === 0) {
    return {
      centerOfMass: { x: geomCenterX, y: geomCenterY },
      geometricCenter: { x: geomCenterX, y: geomCenterY },
      tensionVector: { dx: 0, dy: 0, magnitude: 0, angleDeg: 0 },
      totalVisualMass: 0,
      isStagnantCenterStack: true,
      isBalancedAsymmetric: false,
    };
  }

  let totalMass = 0;
  let weightedX = 0;
  let weightedY = 0;

  for (const node of nodes) {
    const mass = calculateNodeMass(node);
    const nodeCenterX = node.box.x + node.box.width / 2;
    const nodeCenterY = node.box.y + node.box.height / 2;

    totalMass += mass;
    weightedX += mass * nodeCenterX;
    weightedY += mass * nodeCenterY;
  }

  const vcomX = totalMass > 0 ? weightedX / totalMass : geomCenterX;
  const vcomY = totalMass > 0 ? weightedY / totalMass : geomCenterY;

  // Normalized displacement vector from viewport center [-1..+1]
  const dx = (vcomX - geomCenterX) / geomCenterX;
  const dy = (vcomY - geomCenterY) / geomCenterY;
  const magnitude = Math.sqrt(dx * dx + dy * dy);
  const angleDeg = (Math.atan2(dy, dx) * 180) / Math.PI;

  // An interface is a stagnant center stack if elements are clustered along the central vertical spine
  const isHorizontallyCentered = Math.abs(dx) < 0.04;
  const allNodesCentered = nodes.every(n => {
    const cx = n.box.x + n.box.width / 2;
    return Math.abs(cx - geomCenterX) / geomCenterX < 0.05;
  });
  const isStagnantCenterStack =
    (isHorizontallyCentered && allNodesCentered && nodes.length >= 3) ||
    (magnitude < 0.04 && nodes.length >= 3);

  // Ergonomic dynamic balance sits within [0.08 .. 0.35]
  const isBalancedAsymmetric = !isStagnantCenterStack && magnitude >= 0.08 && magnitude <= 0.35;

  return {
    centerOfMass: {
      x: Math.round(vcomX * 10) / 10,
      y: Math.round(vcomY * 10) / 10,
    },
    geometricCenter: {
      x: geomCenterX,
      y: geomCenterY,
    },
    tensionVector: {
      dx: Math.round(dx * 1000) / 1000,
      dy: Math.round(dy * 1000) / 1000,
      magnitude: Math.round(magnitude * 1000) / 1000,
      angleDeg: Math.round(angleDeg * 10) / 10,
    },
    totalVisualMass: Math.round(totalMass),
    isStagnantCenterStack,
    isBalancedAsymmetric,
  };
}
