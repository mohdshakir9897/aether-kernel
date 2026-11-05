/**
 * CLI Command: watch
 * Continuous daemon watching for file additions/edits made by AI coding agents
 * (Cursor, Windsurf, Claude Code, Copilot) and auto-compiling/patching them instantaneously.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fixSource, LintResult } from '@aether-kernel/ast-critic';
import { formatHeader, ANSI } from '../output/terminal-formatter.js';

const EXTENSIONS = new Set(['.html', '.jsx', '.tsx', '.vue', '.svelte']);

export async function runWatch(args: { targetDir?: string }): Promise<void> {
  const targetDir = args.targetDir ? path.resolve(args.targetDir) : process.cwd();

  console.log(formatHeader());
  console.log(`${ANSI.cyan}${ANSI.bold}[AETHER WATCH DAEMON ACTIVE]${ANSI.reset}`);
  console.log(`Monitoring directory: ${targetDir}`);
  console.log(`Auto-patching AI agent output instantaneously for [.tsx, .jsx, .html, .vue, .svelte]...`);
  console.log(`${ANSI.dim}Press Ctrl+C to terminate.${ANSI.reset}\n`);

  if (!fs.existsSync(targetDir)) {
    console.error(`${ANSI.red}Error: Target directory not found: ${targetDir}${ANSI.reset}`);
    process.exit(1);
  }

  // Debounce tracking to prevent re-entrant loops on in-place file write
  const debounceMap = new Map<string, number>();

  const processFile = (filePath: string) => {
    const ext = path.extname(filePath).toLowerCase();
    if (!EXTENSIONS.has(ext)) return;
    if (filePath.includes('node_modules') || filePath.includes('dist') || filePath.includes('.git')) return;

    const now = Date.now();
    const last = debounceMap.get(filePath) || 0;
    if (now - last < 500) return; // 500ms debounce
    debounceMap.set(filePath, now);

    try {
      if (!fs.existsSync(filePath)) return;
      const content = fs.readFileSync(filePath, 'utf-8');
      const relPath = path.relative(process.cwd(), filePath);
      const result: LintResult = fixSource(content, { filename: relPath });

      if (result.fixedSource && result.fixedSource !== content) {
        fs.writeFileSync(filePath, result.fixedSource, 'utf-8');
        const timestamp = new Date().toLocaleTimeString();
        console.log(
          `${ANSI.dim}[${timestamp}]${ANSI.reset} ${ANSI.green}⚡ [AETHER WATCH] Auto-patched:${ANSI.reset} ${relPath} ` +
          `(${result.diagnostics.length} transformations applied)`
        );
      }
    } catch {
      // Ignore temporary file read locks during agent write stream
    }
  };

  try {
    fs.watch(targetDir, { recursive: true }, (_eventType, filename) => {
      if (!filename) return;
      const fullPath = path.resolve(targetDir, filename);
      processFile(fullPath);
    });
  } catch (err) {
    console.error(`${ANSI.red}Error initiating file watcher:${ANSI.reset}`, err);
  }

  // Keep process alive indefinitely
  await new Promise(() => {});
}
