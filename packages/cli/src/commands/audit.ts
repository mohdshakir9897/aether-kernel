/**
 * CLI Command: audit
 * Scans files or workspace for AI aesthetic clichés & APCA violations
 */

import fs from 'node:fs';
import path from 'node:path';
import { lintSource, LintResult } from '@aether-kernel/ast-critic';
import { formatHeader, formatLintResult, formatSummary, ANSI } from '../output/terminal-formatter.js';
import { findTargetFiles, getWorkspaceDisplayName } from '../utils/file-discovery.js';

export interface RunAuditOptions {
  targetDir?: string;
  strict?: boolean;
}

export async function runAudit(args: RunAuditOptions = {}): Promise<number> {
  const isDefaultWorkspace = !args.targetDir || path.resolve(args.targetDir) === process.cwd();
  const targetDir = args.targetDir ? path.resolve(args.targetDir) : process.cwd();
  const rawDisplay = isDefaultWorkspace
    ? getWorkspaceDisplayName(targetDir)
    : path.relative(process.cwd(), targetDir) || targetDir;
  const displayName = rawDisplay.replace(/\\/g, '/');

  const titlePrefix = `${ANSI.cyan}${ANSI.bold}▲ AETHER KERNEL${ANSI.reset}`;
  const headerSubtitle = isDefaultWorkspace
    ? `Scanning workspace: ${displayName} ...`
    : `Scanning target: ${displayName} ...`;

  console.log(formatHeader(`${titlePrefix} // ${headerSubtitle}`));
  console.log('');

  if (!fs.existsSync(targetDir)) {
    console.error(`${ANSI.red}Error: Target path not found: ${targetDir}${ANSI.reset}`);
    return 1;
  }

  const files = findTargetFiles(targetDir);
  if (files.length === 0) {
    console.log('No UI template files (.html, .jsx, .tsx, .vue, .svelte) found to audit.');
    return 0;
  }

  let totalErrors = 0;
  let totalWarnings = 0;
  const results: LintResult[] = [];

  for (const filePath of files) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const relPath = path.relative(process.cwd(), filePath).replace(/\\/g, '/');
    const result = lintSource(content, { filename: relPath });

    results.push(result);
    totalErrors += result.errorCount;
    totalWarnings += result.warningCount;

    console.log(formatLintResult(result));
  }

  console.log(formatSummary(files.length, totalErrors, totalWarnings));

  if (totalErrors > 0) return 1;
  if (args.strict && totalWarnings > 0) return 1;
  return 0;
}
