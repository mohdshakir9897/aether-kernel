/**
 * Rule AETHER-003: Uniform 3-Column Card Grid Replacement
 * Detects identical homogeneous 3-column card grids (e.g. grid-cols-3 or md:grid-cols-3).
 */

import { ASTNode } from '../parsers/html-tailwind.js';
import { CriticRuleResult } from './AETHER-001-pill-badge.js';

export function checkAether003(node: ASTNode): CriticRuleResult | null {
  const isGrid = node.classes.includes('grid');
  const is3Cols = node.classes.some((c) => c === 'grid-cols-3' || c.endsWith('grid-cols-3'));

  if (isGrid && is3Cols) {
    return {
      ruleId: 'AETHER-003',
      severity: 'warning',
      message:
        'Detected uniform 3-column card grid cliché. Homogeneous feature cards destroy hierarchy. Recompile into an asymmetric golden ratio layout (e.g. 1.618fr hero + 1fr telemetry).',
      node,
      fixAvailable: true,
    };
  }

  return null;
}
