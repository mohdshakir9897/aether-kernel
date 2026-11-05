/**
 * Automated AST Rewriter Engine & Node Patcher
 */

import { CriticRuleResult } from '../rules/AETHER-001-pill-badge.js';
import { synthesizeTechnicalCopy } from './copy-synthesizer.js';

export function patchSourceWithRules(source: string, diagnostics: CriticRuleResult[]): string {
  let patched = source;

  // Process diagnostics in reverse order or string replacement to preserve index validity
  for (const diag of diagnostics) {
    switch (diag.ruleId) {
      case 'AETHER-001': {
        // Transform floating pill badge into a discreet domain status indicator
        const rawNode = diag.node.raw;
        const replacement = rawNode
          .replace(/rounded-full/g, 'rounded-sm border-l-2 border-l-emerald-500')
          .replace(/mx-auto/g, '')
          .replace(/text-center/g, 'text-left');
        patched = patched.replace(rawNode, replacement);
        break;
      }

      case 'AETHER-002': {
        // Eliminate decorative blur blob entirely
        patched = patched.replace(diag.node.raw, '<!-- [AETHER-002]: Decorative blur blob removed -->');
        break;
      }

      case 'AETHER-003': {
        // Transform uniform 3-col grid into asymmetric golden ratio split
        const rawNode = diag.node.raw;
        const replacement = rawNode
          .replace(/grid-cols-3/g, 'grid-cols-1 lg:grid-cols-[1.618fr_1fr]')
          .replace(/md:grid-cols-3/g, 'lg:grid-cols-[1.618fr_1fr]');
        patched = patched.replace(rawNode, replacement);
        break;
      }

      case 'AETHER-004': {
        // Synthesize technical copy
        const rawNode = diag.node.raw;
        const modernized = synthesizeTechnicalCopy(rawNode);
        patched = patched.replace(rawNode, modernized);
        break;
      }

      case 'AETHER-005': {
        // Upgrade contrast class
        const rawNode = diag.node.raw;
        const replacement = rawNode
          .replace(/text-gray-400/g, 'text-gray-200')
          .replace(/text-gray-500/g, 'text-gray-100')
          .replace(/text-zinc-500/g, 'text-zinc-200')
          .replace(/text-neutral-500/g, 'text-neutral-200');
        patched = patched.replace(rawNode, replacement);
        break;
      }
    }
  }

  return patched;
}
