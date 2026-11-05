/**
 * CLI Command: fix
 * Auto-patches AST nodes to human layout & synthesizes domain-accurate copy
 * Supports single files and recursive directory traversal with --dry-run and --write.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fixSource, LintResult } from '@aether-kernel/ast-critic';
import { formatHeader, ANSI } from '../output/terminal-formatter.js';

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
        entry.name !== '.turbo' &&
        entry.name !== 'build'
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

function generateUnifiedDiff(filename: string, original: string, modified: string): string {
  const origLines = original.split('\n');
  const modLines = modified.split('\n');
  const diffLines: string[] = [];
  diffLines.push(`${ANSI.bold}diff --git a/${filename} b/${filename}${ANSI.reset}`);
  diffLines.push(`${ANSI.red}--- a/${filename}${ANSI.reset}`);
  diffLines.push(`${ANSI.green}+++ b/${filename}${ANSI.reset}`);

  let changedCount = 0;
  const maxLen = Math.max(origLines.length, modLines.length);

  for (let i = 0; i < maxLen; i++) {
    const o = origLines[i];
    const m = modLines[i];
    if (o !== m) {
      if (o !== undefined && o.trim() !== '') {
        diffLines.push(`${ANSI.red}- ${o}${ANSI.reset}`);
        changedCount++;
      }
      if (m !== undefined && m.trim() !== '') {
        diffLines.push(`${ANSI.green}+ ${m}${ANSI.reset}`);
        changedCount++;
      }
    }
  }

  return changedCount > 0 ? diffLines.join('\n') : '';
}

export interface RunFixOptions {
  target?: string;
  dryRun?: boolean;
  write?: boolean;
}

export async function runFix(options: RunFixOptions = {}): Promise<number> {
  const target = options.target ? path.resolve(options.target) : process.cwd();
  const isDryRun = Boolean(options.dryRun);

  console.log(formatHeader());
  console.log(`Analyzing target for auto-fixing: ${target} [${isDryRun ? 'DRY-RUN' : 'WRITE-MODE'}] ...\n`);

  if (!fs.existsSync(target)) {
    console.error(`${ANSI.red}Error: Target path not found: ${target}${ANSI.reset}`);
    return 1;
  }

  const files = findTargetFiles(target);
  if (files.length === 0) {
    console.log('No matching UI components (.tsx, .jsx, .html, .vue, .svelte) found.');
    return 0;
  }

  let patchedFilesCount = 0;
  const totalComponents = files.length;

  for (const filePath of files) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const relPath = path.relative(process.cwd(), filePath);
    const result: LintResult = fixSource(content, { filename: relPath });

    if (result.fixedSource && result.fixedSource !== content) {
      patchedFilesCount++;

      if (isDryRun) {
        console.log(`${ANSI.yellow}[PROPOSED PATCH]${ANSI.reset} ${relPath} (${result.diagnostics.length} transformations):`);
        const diff = generateUnifiedDiff(relPath, content, result.fixedSource);
        if (diff) {
          console.log(diff + '\n');
        }
      } else {
        fs.writeFileSync(filePath, result.fixedSource, 'utf-8');
        console.log(`${ANSI.green}✓ Successfully patched:${ANSI.reset} ${relPath} (${result.diagnostics.length} transformations applied)`);
      }
    }
  }

  console.log(`${ANSI.dim}─────────────────────────────────────────────────────────────${ANSI.reset}`);
  if (isDryRun) {
    console.log(`${ANSI.cyan}✓ Proposed patches for ${patchedFilesCount} files across ${totalComponents} total components.${ANSI.reset}`);
  } else {
    console.log(`${ANSI.green}✓ Successfully patched ${patchedFilesCount} files across ${totalComponents} total components.${ANSI.reset}`);
  }

  return 0;
}
