/**
 * CLI Command: compile-tokens
 * Generates OKLCH CSS variables and palette definitions
 */

import fs from 'node:fs';
import path from 'node:path';
import { generateSemanticPalette } from '@aether-ui/core-kernel';
import { formatHeader, ANSI } from '../output/terminal-formatter.js';

export async function runCompileTokens(args: {
  hue?: number;
  mode?: 'dark' | 'light';
  out?: string;
}): Promise<number> {
  console.log(formatHeader());

  const hue = args.hue !== undefined ? Number(args.hue) : 220;
  const mode = args.mode || 'dark';
  const outPath = args.out || path.join(process.cwd(), 'aether-tokens.css');

  console.log(`Compiling OKLCH perceptual tokens (Hue: ${hue}°, Mode: ${mode})...`);

  const palette = generateSemanticPalette(hue, mode);

  const css = `:root {
  /* Aether UI Perceptual OKLCH Tokens */
  --color-bg-canvas: ${palette.bgCanvas};
  --color-bg-surface: ${palette.bgSurface};
  --color-bg-subtle: ${palette.bgSubtle};

  --color-border-hairline: ${palette.borderHairline};
  --color-border-active: ${palette.borderActive};

  --color-fg-muted: ${palette.fgMuted};
  --color-fg-body: ${palette.fgBody};
  --color-fg-primary: ${palette.fgPrimary};

  --color-accent: ${palette.accent};
  --color-accent-contrast: ${palette.accentContrast};

  /* Fibonacci Golden Spatial Grid */
  --space-xs: 6px;
  --space-sm: 10px;
  --space-md: 16px;
  --space-lg: 26px;
  --space-xl: 42px;
  --space-2xl: 68px;

  /* Golden Grid Partitions */
  --grid-golden-major: 1.618fr;
  --grid-golden-minor: 1fr;
}
`;

  fs.writeFileSync(outPath, css, 'utf-8');
  console.log(`${ANSI.green}✓ Wrote token definitions to:${ANSI.reset} ${outPath}\n`);
  return 0;
}
