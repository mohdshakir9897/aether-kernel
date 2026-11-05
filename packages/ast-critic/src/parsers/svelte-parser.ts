/**
 * Svelte Template AST Parser
 */

import { ASTNode, parseHTML } from './html-tailwind.js';

export function parseSvelte(source: string): ASTNode[] {
  // Extract template markup outside of <script> and <style>
  const templateOnly = source
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/\{#[\s\S]*?\}/g, '')
    .replace(/\{\/[\s\S]*?\}/g, '');

  return parseHTML(templateOnly);
}
