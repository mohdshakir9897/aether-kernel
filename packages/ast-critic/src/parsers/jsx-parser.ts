/**
 * JSX / TSX AST Parser for React, Preact, and Solid
 */

import { ASTNode, parseHTML } from './html-tailwind.js';

export function parseJSX(source: string): ASTNode[] {
  // Strip TypeScript types or imports for fast regex parsing or parse standard JSX tags
  // Replace `{...}` expressions temporarily to preserve tag balance
  const normalized = source.replace(/\{[\s\S]*?\}/g, (match) => {
    // If it's a className attribute like className={`...`}
    if (match.includes('`')) {
      const inner = match.replace(/[{}`]/g, '');
      return `"${inner}"`;
    }
    return '"__expr__"';
  });

  return parseHTML(normalized);
}
