/**
 * Rule AETHER-005: APCA Legibility Failure Detection
 * Verifies foreground/background color combinations against W3C APCA minimum contrast Lc.
 */

import { ASTNode } from '../parsers/html-tailwind.js';
import { CriticRuleResult } from './AETHER-001-pill-badge.js';
import { calcAPCA, lookupMinLc } from '@aether-kernel/core-kernel';

// Approximate hex mappings for Tailwind utility classes
const TW_COLOR_MAP: Record<string, string> = {
  'bg-white': '#ffffff',
  'bg-black': '#000000',
  'bg-gray-900': '#111827',
  'bg-zinc-900': '#18181b',
  'bg-neutral-900': '#171717',
  'bg-slate-900': '#0f172a',
  'text-gray-400': '#9ca3af',
  'text-gray-500': '#6b7280',
  'text-gray-600': '#4b5563',
  'text-zinc-500': '#71717a',
  'text-zinc-600': '#52525b',
  'text-neutral-500': '#737373',
  'text-white': '#ffffff',
  'text-black': '#000000',
};

export function checkAether005(node: ASTNode): CriticRuleResult | null {
  const textClass = node.classes.find((c) => c.startsWith('text-') && !c.startsWith('text-sm') && !c.startsWith('text-lg') && !c.startsWith('text-center'));
  const bgClass = node.classes.find((c) => c.startsWith('bg-'));

  if (!textClass || !bgClass) return null;

  const fgHex = TW_COLOR_MAP[textClass];
  const bgHex = TW_COLOR_MAP[bgClass];

  if (fgHex && bgHex) {
    const lc = Math.abs(calcAPCA(fgHex, bgHex));
    const minRequired = lookupMinLc(14, 400); // Default to body size

    if (lc < minRequired) {
      return {
        ruleId: 'AETHER-005',
        severity: 'error',
        message: `APCA Contrast Failure: Pair (${textClass} on ${bgClass}) yields Lc = ${lc}, failing required minimum Lc = ${minRequired}. Ocular safety standard requires higher luminance contrast.`,
        node,
        fixAvailable: true,
      };
    }
  }

  return null;
}
