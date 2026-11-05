/**
 * @aether-ui/ast-critic
 * Multi-Framework Linter and Critic for Post-Cliché Human Interfaces
 */

import { ASTNode, parseHTML } from './parsers/html-tailwind.js';
import { parseJSX } from './parsers/jsx-parser.js';
import { parseSvelte } from './parsers/svelte-parser.js';
import { parseVue } from './parsers/vue-parser.js';

import { checkAether001, CriticRuleResult } from './rules/AETHER-001-pill-badge.js';
import { checkAether002 } from './rules/AETHER-002-blur-blobs.js';
import { checkAether003 } from './rules/AETHER-003-uniform-grid.js';
import { checkAether004 } from './rules/AETHER-004-semantic-buzz.js';
import { checkAether005 } from './rules/AETHER-005-apca-failure.js';

import { patchSourceWithRules } from './fixer/ast-rewriter.js';

export * from './parsers/html-tailwind.js';
export * from './parsers/jsx-parser.js';
export * from './parsers/svelte-parser.js';
export * from './parsers/vue-parser.js';
export * from './rules/AETHER-001-pill-badge.js';
export * from './rules/AETHER-002-blur-blobs.js';
export * from './rules/AETHER-003-uniform-grid.js';
export * from './rules/AETHER-004-semantic-buzz.js';
export * from './rules/AETHER-005-apca-failure.js';
export * from './fixer/ast-rewriter.js';
export * from './fixer/copy-synthesizer.js';

export interface LintOptions {
  filename?: string;
  domainId?: string;
}

export interface LintResult {
  filename: string;
  diagnostics: CriticRuleResult[];
  errorCount: number;
  warningCount: number;
  fixedSource?: string;
}

export function parseByFilename(source: string, filename: string = 'file.html'): ASTNode[] {
  if (filename.endsWith('.jsx') || filename.endsWith('.tsx')) {
    return parseJSX(source);
  }
  if (filename.endsWith('.svelte')) {
    return parseSvelte(source);
  }
  if (filename.endsWith('.vue')) {
    return parseVue(source);
  }
  return parseHTML(source);
}

function traverseAST(nodes: ASTNode[], visitor: (node: ASTNode) => void) {
  for (const node of nodes) {
    visitor(node);
    if (node.children && node.children.length > 0) {
      traverseAST(node.children, visitor);
    }
  }
}

export function lintSource(source: string, options: LintOptions = {}): LintResult {
  const filename = options.filename ?? 'unknown.html';
  const nodes = parseByFilename(source, filename);
  const diagnostics: CriticRuleResult[] = [];

  const rules = [checkAether001, checkAether002, checkAether003, checkAether004, checkAether005];

  traverseAST(nodes, (node) => {
    for (const rule of rules) {
      const res = rule(node);
      if (res) {
        diagnostics.push(res);
      }
    }
  });

  const errorCount = diagnostics.filter((d) => d.severity === 'error').length;
  const warningCount = diagnostics.filter((d) => d.severity === 'warning').length;

  return {
    filename,
    diagnostics,
    errorCount,
    warningCount,
  };
}

export function fixSource(source: string, options: LintOptions = {}): LintResult {
  const result = lintSource(source, options);
  if (result.diagnostics.length > 0) {
    result.fixedSource = patchSourceWithRules(source, result.diagnostics);
  } else {
    result.fixedSource = source;
  }
  return result;
}
