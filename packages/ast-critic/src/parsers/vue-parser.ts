/**
 * Vue Single File Component (SFC) Template AST Parser
 */

import { ASTNode, parseHTML } from './html-tailwind.js';

export function parseVue(source: string): ASTNode[] {
  const templateMatch = source.match(/<template[\s\S]*?>([\s\S]*?)<\/template>/i);
  if (!templateMatch) {
    return parseHTML(source);
  }
  return parseHTML(templateMatch[1]);
}
