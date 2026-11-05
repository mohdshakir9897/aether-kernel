/**
 * Terminal Formatter for Aether UI CLI
 */

import { LintResult } from '@aether-kernel/ast-critic';

export const ANSI = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  italic: '\x1b[3m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  bgRed: '\x1b[41m',
  bgGreen: '\x1b[42m',
  bgYellow: '\x1b[43m',
};

export function formatHeader(): string {
  return `
${ANSI.cyan}${ANSI.bold}▲ AETHER UI // PERCEPTUAL ANTI-CONVERGENCE KERNEL${ANSI.reset}
${ANSI.dim}─────────────────────────────────────────────────────────────${ANSI.reset}`;
}

export function formatLintResult(result: LintResult): string {
  if (result.diagnostics.length === 0) {
    return `${ANSI.green}✓${ANSI.reset} ${result.filename} ${ANSI.dim}(0 violations, APCA compliant)${ANSI.reset}`;
  }

  const lines: string[] = [];
  lines.push(`\n${ANSI.bold}${result.filename}${ANSI.reset}`);

  for (const diag of result.diagnostics) {
    const badge =
      diag.severity === 'error'
        ? `${ANSI.red}${ANSI.bold}[ERROR ${diag.ruleId}]${ANSI.reset}`
        : `${ANSI.yellow}${ANSI.bold}[WARN  ${diag.ruleId}]${ANSI.reset}`;

    lines.push(`  ${badge} ${diag.message}`);
    lines.push(`    ${ANSI.dim}Snippet: ${diag.node.raw.slice(0, 70).replace(/\n/g, ' ')}...${ANSI.reset}`);
  }

  return lines.join('\n');
}

export function formatSummary(totalFiles: number, totalErrors: number, totalWarnings: number): string {
  const statusColor = totalErrors > 0 ? ANSI.red : totalWarnings > 0 ? ANSI.yellow : ANSI.green;
  const statusText = totalErrors > 0 ? 'FAILED' : totalWarnings > 0 ? 'PASSED WITH WARNINGS' : 'PASSED';

  return `
${ANSI.dim}─────────────────────────────────────────────────────────────${ANSI.reset}
${ANSI.bold}Audit Summary:${ANSI.reset} ${statusColor}${statusText}${ANSI.reset}
  Files scanned:   ${totalFiles}
  Errors:          ${totalErrors > 0 ? ANSI.red + totalErrors + ANSI.reset : 0}
  Warnings:        ${totalWarnings > 0 ? ANSI.yellow + totalWarnings + ANSI.reset : 0}
`;
}
