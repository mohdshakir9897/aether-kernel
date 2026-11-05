/**
 * CLI Command: init
 * Injects Aether adapters into the current workspace
 */

import fs from 'node:fs';
import path from 'node:path';
import { formatHeader, ANSI } from '../output/terminal-formatter.js';

export async function runInit(): Promise<number> {
  console.log(formatHeader());
  console.log('Injecting Aether Protocol adapters into workspace...\n');

  const cwd = process.cwd();

  const cursorrules = `# Cursor Rules: Aether UI Protocol
# Mode: Strict Ergonomics & Anti-Convergence

You are an expert engineer and designer operating under the Aether Protocol.

## Absolute Prohibitions:
1. NEVER generate centered floating pill badges (e.g., rounded-full border px-3 py-1).
2. NEVER generate purple/cyan radial blur blobs (e.g., blur-3xl bg-purple-500/20).
3. NEVER generate uniform 3-column card grids (grid-cols-3 with cloned cards). Use asymmetric golden grids (1.618fr : 1fr).
4. NEVER output empty marketing copy like "Supercharge your workflow with next-gen AI". Use factual domain metrics.
5. NEVER output low-contrast text. Guarantee APCA contrast |Lc| >= 60 for all body copy.
`;

  const windsurfrules = `# Windsurf Rules: Aether Perceptual Physics Directives
Always verify generated UI code against the Aether rule matrix:
- Banned: AETHER-001 (Floating pill badge)
- Banned: AETHER-002 (Decorative blur blob)
- Banned: AETHER-003 (Homogeneous 3-column card grid)
- Banned: AETHER-004 (Generic AI buzzwords)
- Banned: AETHER-005 (APCA contrast failure)
`;

  const antigravity = {
    name: "aether-antigravity-adapter",
    version: "1.0.0",
    gates: {
      gate1_socratic_friction: true,
      gate2_token_manifesto: true,
      gate3_spatial_composition: true,
      gate4_self_healing_loop: true
    }
  };

  fs.writeFileSync(path.join(cwd, '.cursorrules'), cursorrules, 'utf-8');
  console.log(`  ${ANSI.green}+ Created .cursorrules${ANSI.reset}`);

  fs.writeFileSync(path.join(cwd, '.windsurfrules'), windsurfrules, 'utf-8');
  console.log(`  ${ANSI.green}+ Created .windsurfrules${ANSI.reset}`);

  fs.writeFileSync(path.join(cwd, 'antigravity.json'), JSON.stringify(antigravity, null, 2), 'utf-8');
  console.log(`  ${ANSI.green}+ Created antigravity.json${ANSI.reset}`);

  console.log(`\n${ANSI.cyan}Aether Protocol successfully initialized in workspace.${ANSI.reset}\n`);
  return 0;
}
