#!/usr/bin/env node

/**
 * Aether Kernel CLI Entry Point
 */

import { runAudit } from '../src/commands/audit.js';
import { runFix } from '../src/commands/fix.js';
import { runWatch } from '../src/commands/watch.js';
import { runInit } from '../src/commands/init.js';
import { runCompileTokens } from '../src/commands/compile-tokens.js';
import { ANSI } from '../src/output/terminal-formatter.js';

const args = process.argv.slice(2);
const command = args[0] || 'audit';

function parseFlags(rawArgs: string[]) {
  const flags: Record<string, string | boolean> = {};
  for (let i = 0; i < rawArgs.length; i++) {
    const arg = rawArgs[i];
    if (arg.startsWith('--')) {
      const key = arg.slice(2);
      if (i + 1 < rawArgs.length && !rawArgs[i + 1].startsWith('--')) {
        flags[key] = rawArgs[i + 1];
        i++;
      } else {
        flags[key] = true;
      }
    } else if (arg.startsWith('-')) {
      const key = arg.slice(1);
      flags[key] = true;
    }
  }
  return flags;
}

const flags = parseFlags(args.slice(1));

async function main() {
  switch (command) {
    case 'audit': {
      const positionalDir = args.slice(1).find((a) => !a.startsWith('-'));
      const code = await runAudit({
        targetDir: typeof flags['dir'] === 'string' ? flags['dir'] : positionalDir,
        strict: Boolean(flags['strict']),
      });
      process.exit(code);
      break;
    }

    case 'fix': {
      const positionalTarget = args.slice(1).find((a) => !a.startsWith('-'));
      const target = typeof flags['file'] === 'string'
        ? flags['file']
        : typeof flags['dir'] === 'string'
        ? flags['dir']
        : positionalTarget;

      const isDryRun = Boolean(flags['dry-run']);
      const isWrite = Boolean(flags['write'] || flags['w'] || !isDryRun);

      const code = await runFix({
        target,
        dryRun: isDryRun,
        write: isWrite,
      });
      process.exit(code);
      break;
    }

    case 'watch': {
      const positionalDir = args.slice(1).find((a) => !a.startsWith('-'));
      const targetDir = typeof flags['dir'] === 'string' ? flags['dir'] : positionalDir;
      await runWatch({ targetDir });
      break;
    }

    case 'init': {
      const code = await runInit();
      process.exit(code);
      break;
    }

    case 'compile-tokens': {
      const code = await runCompileTokens({
        hue: typeof flags['hue'] === 'string' ? parseInt(flags['hue'], 10) : undefined,
        mode: flags['mode'] === 'light' ? 'light' : 'dark',
        out: typeof flags['out'] === 'string' ? flags['out'] : undefined,
      });
      process.exit(code);
      break;
    }

    case '--help':
    case '-h':
    case 'help': {
      console.log(`
${ANSI.cyan}${ANSI.bold}Aether Kernel CLI${ANSI.reset} - Deterministic Interface Compiler & Spatial Physics Kernel

${ANSI.bold}Usage:${ANSI.reset}
  npx aether-kernel <command> [target] [options]

${ANSI.bold}Commands:${ANSI.reset}
  audit [path]      Scans workspace or target directory for AI visual clichés & APCA failures
                    Options: --dir <path>, --strict

  fix [path]        Recursively auto-patches AST nodes to human layout
                    Options: --dry-run, --write (-w), --file <path>

  watch [dir]       Runs daemon watching for AI agent edits and auto-patching instantaneously

  init              Injects Aether adapters (.cursorrules, .windsurfrules, antigravity.json)

  compile-tokens    Compiles OKLCH CSS variables
                    Options: --hue <degrees>, --mode <dark|light>, --out <file>

  help              Displays this help manual
`);
      process.exit(0);
      break;
    }

    default: {
      console.error(`${ANSI.red}Unknown command:${ANSI.reset} ${command}`);
      console.log('Run `npx aether-kernel --help` for available commands.');
      process.exit(1);
    }
  }
}

main().catch((err) => {
  console.error(`${ANSI.red}Fatal Error:${ANSI.reset}`, err);
  process.exit(1);
});
