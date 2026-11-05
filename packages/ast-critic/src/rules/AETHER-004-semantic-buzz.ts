/**
 * Rule AETHER-004: Semantic Buzzword & Fluff Copy Cleansing
 * Flags corporate AI placeholder slogans like "Supercharge your workflow", "Next-gen AI", etc.
 */

import { ASTNode } from '../parsers/html-tailwind.js';
import { CriticRuleResult } from './AETHER-001-pill-badge.js';

const BANNED_BUZZWORDS = [
  'supercharge your workflow',
  'unleash the power',
  'next-gen ai',
  'next-generation',
  'seamless integration',
  'all-in-one platform',
  'revolutionize',
  'game-changer',
  'paradigm shift',
  'empower your team',
  'effortless',
  'lightning-fast',
  'cutting-edge solution',
];

export function checkAether004(node: ASTNode): CriticRuleResult | null {
  if (!node.text || node.text.length < 5) return null;

  const lower = node.text.toLowerCase();
  for (const buzz of BANNED_BUZZWORDS) {
    if (lower.includes(buzz)) {
      return {
        ruleId: 'AETHER-004',
        severity: 'warning',
        message: `Detected vacuous AI marketing fluff: "${buzz}". Replace generic marketing clichés with verifiable domain entities, technical precision, or measurable latency/throughput values.`,
        node,
        fixAvailable: true,
      };
    }
  }

  return null;
}
