/**
 * Rule AETHER-001: Floating Pill Badge Elimination
 * Detects generic LLM floating pill badges (e.g. rounded-full border px-3 py-1 text-xs/sm centered above hero).
 */

import { ASTNode } from '../parsers/html-tailwind.js';

export interface CriticRuleResult {
  ruleId: string;
  severity: 'error' | 'warning';
  message: string;
  node: ASTNode;
  fixAvailable: boolean;
}

export function checkAether001(node: ASTNode): CriticRuleResult | null {
  const hasRoundedFull = node.classes.includes('rounded-full');
  const hasPadding = node.classes.some((c) => /^p[xy]?-[1234]$/.test(c));
  const hasBorder = node.classes.some((c) => c.startsWith('border'));
  const hasSmallText = node.classes.some((c) => c === 'text-xs' || c === 'text-sm');

  // Common badge text indicators
  const badgePhrases = ['introducing', 'announcing', 'new', 'v1.', 'v2.', 'just launched', 'beta', '✨', '🚀'];
  const lowerText = node.text.toLowerCase();
  const hasBadgeText = badgePhrases.some((phrase) => lowerText.includes(phrase));

  if (hasRoundedFull && hasPadding && (hasBorder || hasSmallText) && (hasBadgeText || lowerText.length < 40)) {
    return {
      ruleId: 'AETHER-001',
      severity: 'warning',
      message: `Detected generic AI floating pill badge: "${node.text}". Replace decorative hero pills with meaningful contextual data or integrated section headlines.`,
      node,
      fixAvailable: true,
    };
  }

  return null;
}
