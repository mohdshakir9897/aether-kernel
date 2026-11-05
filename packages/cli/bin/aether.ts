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

const KNOWN_COMMANDS = new Set([
  'audit',
  'fix',
  'watch',
  'init',
  'compile-tokens',
  'help',
  '--help',
  '-h',
  'version',
  '--version',
  '-v',
]);

function parseArgs(rawArgs: string[]) {
  let command = 'audit';
  let commandArgs = rawArgs;

  if (rawArgs.length > 0) {
    const first = rawArgs[0];
    if (first === '-h' || first === '--help' || first === 'help') {
      command = 'help';
    } else if (first === '-v' || first === '--version' || first === 'version') {
      command = 'version';
    } else if (KNOWN_COMMANDS.has(first)) {
      command = first;
      commandArgs = rawArgs.slice(1);
    } else if (first.startsWith('-')) {
      command = 'audit';
      commandArgs = rawArgs;
    } else {
      command = 'audit';
      commandArgs = rawArgs;
    }
  }

  const flags: Record<string, string | boolean> = {};
  const positionals: string[] = [];

  for (let i = 0; i < commandArgs.length; i++) {
    const arg = commandArgs[i];
    if (arg.startsWith('--')) {
      const key = arg.slice(2);
      if (i + 1 < commandArgs.length && !commandArgs[i + 1].startsWith('-')) {
        flags[key] = commandArgs[i + 1];
        i++;
      } else {
        flags[key] = true;
      }
    } else if (arg.startsWith('-')) {
      const key = arg.slice(1);
      flags[key] = true;
    } else {
      positionals.push(arg);
    }
  }

  return { command, flags, positionals };
}

const { command, flags, positionals } = parseArgs(args);

async function main() {
  switch (command) {
    case 'audit': {
      const targetDir = typeof flags['dir'] === 'string'
        ? flags['dir']
        : positionals[0] || process.cwd();
      const code = await runAudit({
        targetDir,
        strict: Boolean(flags['strict']),
      });
      process.exit(code);
      break;
    }

    case 'fix': {
      const target = typeof flags['file'] === 'string'
        ? flags['file']
        : typeof flags['dir'] === 'string'
        ? flags['dir']
        : positionals[0] || process.cwd();

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
      const targetDir = typeof flags['dir'] === 'string'
        ? flags['dir']
        : positionals[0] || process.cwd();
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

    case 'version': {
      console.log(`@aether-kernel/cli v1.0.0`);
      process.exit(0);
      break;
    }

    case '--help':
    case '-h':
    case 'help': {
      console.log(`
${ANSI.cyan}${ANSI.bold}Aether Kernel CLI${ANSI.reset} - Deterministic Interface Compiler & Spatial Physics Kernel

${ANSI.bold}Usage:${ANSI.reset}
  npx aether-kernel [command] [path] [options]

${ANSI.bold}Commands:${ANSI.reset}
  audit [path]      Scans workspace or target directory for AI visual clichés & APCA failures
                    (defaults to current working directory: .)
                    Options: --dir <path>, --strict

  fix [path]        Recursively auto-patches AST nodes to human layout
                    (defaults to current working directory: .)
                    Options: --dry-run, --write (-w), --file <path>, --dir <path>

  watch [dir]       Runs daemon watching for AI agent edits and auto-patching instantaneously
                    (defaults to current working directory: .)
                    Options: --dir <path>

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
