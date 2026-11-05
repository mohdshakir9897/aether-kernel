/**
 * CLI Command: watch
 * Continuous daemon watching for file additions/edits made by AI coding agents
 * (Cursor, Windsurf, Claude Code, Copilot) and auto-compiling/patching them instantaneously.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fixSource, LintResult } from '@aether-kernel/ast-critic';
import { formatHeader, ANSI } from '../output/terminal-formatter.js';
import {
  getWorkspaceDisplayName,
  loadGitIgnoreRules,
  isIgnored,
  SUPPORTED_EXTENSIONS,
} from '../utils/file-discovery.js';

export interface RunWatchOptions {
  targetDir?: string;
}

export async function runWatch(args: RunWatchOptions = {}): Promise<void> {
  const isDefaultWorkspace = !args.targetDir || path.resolve(args.targetDir) === process.cwd();
  const targetDir = args.targetDir ? path.resolve(args.targetDir) : process.cwd();
  const rawDisplay = isDefaultWorkspace
    ? getWorkspaceDisplayName(targetDir)
    : path.relative(process.cwd(), targetDir) || targetDir;
  const displayName = rawDisplay.replace(/\\/g, '/');

  const titlePrefix = `${ANSI.cyan}${ANSI.bold}▲ AETHER KERNEL${ANSI.reset}`;
  console.log(formatHeader(`${titlePrefix} // Watch daemon active: ${displayName}`));
  console.log(`Monitoring directory: ${targetDir}`);
  console.log(`Auto-patching AI agent output instantaneously for [.tsx, .jsx, .html, .vue, .svelte]...`);
  console.log(`${ANSI.dim}Press Ctrl+C to terminate.${ANSI.reset}\n`);

  if (!fs.existsSync(targetDir)) {
    console.error(`${ANSI.red}Error: Target directory not found: ${targetDir}${ANSI.reset}`);
    process.exit(1);
  }

  const rules = loadGitIgnoreRules(targetDir);
  // Debounce tracking to prevent re-entrant loops on in-place file write
  const debounceMap = new Map<string, number>();

  const processFile = (filePath: string) => {
    const ext = path.extname(filePath).toLowerCase();
    if (!SUPPORTED_EXTENSIONS.has(ext)) return;
    if (isIgnored(filePath, false, rules)) return;

    const now = Date.now();
    const last = debounceMap.get(filePath) || 0;
    if (now - last < 500) return; // 500ms debounce
    debounceMap.set(filePath, now);

    try {
      if (!fs.existsSync(filePath)) return;
      const content = fs.readFileSync(filePath, 'utf-8');
      const relPath = path.relative(process.cwd(), filePath).replace(/\\/g, '/');
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
