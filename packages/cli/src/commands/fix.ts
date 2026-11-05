/**
 * CLI Command: fix
 * Auto-patches AST nodes to human layout & synthesizes domain-accurate copy
 */

import fs from 'node:fs';
import path from 'node:path';
import { fixSource } from '@aether-kernel/ast-critic';
import { formatHeader, ANSI } from '../output/terminal-formatter.js';

export async function runFix(args: { file?: string; targetDir?: string }): Promise<number> {
  console.log(formatHeader());

  if (args.file) {
    if (!fs.existsSync(args.file)) {
      console.error(`${ANSI.red}Error: File not found: ${args.file}${ANSI.reset}`);
      return 1;
    }
    const content = fs.readFileSync(args.file, 'utf-8');
    const result = fixSource(content, { filename: path.basename(args.file) });

    if (result.fixedSource && result.fixedSource !== content) {
      fs.writeFileSync(args.file, result.fixedSource, 'utf-8');
      console.log(`${ANSI.green}✓ Successfully patched:${ANSI.reset} ${args.file} (${result.diagnostics.length} transformations applied)`);
    } else {
      console.log(`${ANSI.dim}No changes needed for ${args.file}${ANSI.reset}`);
    }
    return 0;
  }

  console.log('Please specify a file to patch via --file <path>');
  return 0;
}
