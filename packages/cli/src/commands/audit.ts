/**
 * CLI Command: audit
 * Scans files or workspace for AI aesthetic clichés & APCA violations
 */

import fs from 'node:fs';
import path from 'node:path';
import { lintSource, LintResult } from '@aether-ui/ast-critic';
import { formatHeader, formatLintResult, formatSummary } from '../output/terminal-formatter.js';

const EXTENSIONS = new Set(['.html', '.jsx', '.tsx', '.vue', '.svelte']);

function findTargetFiles(target: string, fileList: string[] = []): string[] {
  if (!fs.existsSync(target)) return fileList;
  const stat = fs.statSync(target);
  if (stat.isFile()) {
    const ext = path.extname(target).toLowerCase();
    if (EXTENSIONS.has(ext)) {
      fileList.push(target);
    }
    return fileList;
  }

  const entries = fs.readdirSync(target, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(target, entry.name);
    if (entry.isDirectory()) {
      if (
        entry.name !== 'node_modules' &&
        entry.name !== 'dist' &&
        entry.name !== '.git' &&
        entry.name !== '.turbo'
      ) {
        findTargetFiles(fullPath, fileList);
      }
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name).toLowerCase();
      if (EXTENSIONS.has(ext)) {
        fileList.push(fullPath);
      }
    }
  }

  return fileList;
}

export async function runAudit(args: { targetDir?: string; strict?: boolean }): Promise<number> {
  const targetDir = args.targetDir ? path.resolve(args.targetDir) : process.cwd();
  console.log(formatHeader());
  console.log(`Scanning target: ${targetDir} ...\n`);

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
    const relPath = path.relative(process.cwd(), filePath);
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
