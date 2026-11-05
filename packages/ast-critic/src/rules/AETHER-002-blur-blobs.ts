/**
 * Rule AETHER-002: Radial Blur Blob Elimination
 * Detects generic LLM decorative purple/cyan/blue gradient blur blobs (e.g. blur-3xl rounded-full absolute -top-...).
 */

import { ASTNode } from '../parsers/html-tailwind.js';
import { CriticRuleResult } from './AETHER-001-pill-badge.js';

export function checkAether002(node: ASTNode): CriticRuleResult | null {
  const hasBlur = node.classes.some((c) => c.startsWith('blur-') || c === 'blur');
  const hasAbsolute = node.classes.includes('absolute') || node.classes.includes('fixed');
  const hasColorBlob = node.classes.some(
    (c) =>
      c.includes('purple-') ||
      c.includes('violet-') ||
      c.includes('cyan-') ||
      c.includes('indigo-') ||
      c.includes('pink-') ||
      c.includes('fuchsia-')
  );
  const isDecorative = node.text.trim().length === 0;

  if (hasBlur && hasColorBlob && (hasAbsolute || isDecorative)) {
    return {
      ruleId: 'AETHER-002',
      severity: 'error',
      message:
        'Detected generic AI decorative blur blob (purple/cyan gradient blur). Ocular safety policy strictly prohibits synthetic visual haze without functional context.',
      node,
      fixAvailable: true,
    };
  }

  return null;
}
