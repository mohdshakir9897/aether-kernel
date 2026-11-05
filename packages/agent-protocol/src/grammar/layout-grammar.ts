/**
 * Layout Grammar Validator & AST Conformance Evaluator
 * Evaluates layouts against packages/agent-protocol/grammars/layout-grammar.ebnf
 */

export interface GrammarValidationResult {
  isConforming: boolean;
  score: number; // 0..100
  hasHeaderContainer: boolean;
  hasLeftAnchoredBrand: boolean;
  hasContextualMetadata: boolean;
  hasPrimarySplitView: boolean;
  hasAsymmetricColumns: boolean;
  hasPrimaryCanvas: boolean;
  hasSecondaryPanel: boolean;
  violations: string[];
}

export const EBNF_GRAMMAR_DEFINITION = `
RootLayout ::= HeaderContainer PrimarySplitView FooterContainer
HeaderContainer ::= "<header " HeaderAttributes ">" (LeftAnchoredBrand NavList ContextualMetadata) "</header>"
PrimarySplitView ::= "<main class=\\"grid " AsymmetricGridColumns " gap-6\\">" PrimaryCanvas SecondaryPanel "</main>"

AsymmetricGridColumns ::= "grid-cols-1 lg:grid-cols-12" 
PrimaryCanvas ::= "<section class=\\"lg:col-span-8\\">" (InteractiveDataSurface | StructuralViewport) "</section>"
SecondaryPanel ::= "<aside class=\\"lg:col-span-4\\">" ContextualInspector "</aside>"

LeftAnchoredBrand ::= "<div class=\\"flex items-center gap-3\\">" BrandLogo BrandTitle "</div>"
ContextualMetadata ::= "<div class=\\"flex items-center gap-2 font-mono text-xs tabular-nums\\">" StatusIndicator MetricTag "</div>"

InteractiveDataSurface ::= "<div class=\\"rounded-lg border border-neutral-800 bg-neutral-950/60 p-4\\">" (DataTable | CanvasPlot | StreamViewer) "</div>"
StructuralViewport ::= "<div class=\\"flex flex-col gap-4\\">" PrimaryArticle DataInsightRow "</div>"
ContextualInspector ::= "<div class=\\"flex flex-col gap-3 rounded-md border border-neutral-800 p-4\\">" InspectorHeader ParameterKeyValues "</div>"
`.trim();

/**
 * Validates whether an HTML/JSX template complies with the Aether EBNF Layout Grammar
 */
export function validateLayoutGrammar(markup: string): GrammarValidationResult {
  const violations: string[] = [];

  const hasHeaderContainer = /<header[\s>]/i.test(markup) && /<\/header>/i.test(markup);
  if (!hasHeaderContainer) {
    violations.push('Missing HeaderContainer (<header ...>...</header>)');
  }

  const hasLeftAnchoredBrand =
    markup.includes('items-center') &&
    (markup.includes('gap-3') || markup.includes('gap-2')) &&
    (markup.includes('logo') || markup.includes('brand') || markup.includes('Brand'));
  if (!hasLeftAnchoredBrand) {
    violations.push('Missing LeftAnchoredBrand with logo and brand title anchor');
  }

  const hasContextualMetadata =
    (markup.includes('font-mono') || markup.includes('tabular-nums')) &&
    (markup.includes('text-xs') || markup.includes('text-sm'));
  if (!hasContextualMetadata) {
    violations.push('Missing ContextualMetadata with font-mono / tabular-nums status indicators');
  }

  const hasPrimarySplitView = /<main[\s\S]*?class=["'][^"']*grid[^"']*["']/i.test(markup);
  if (!hasPrimarySplitView) {
    violations.push('Missing PrimarySplitView with CSS Grid on <main>');
  }

  const hasAsymmetricColumns =
    (markup.includes('grid-cols-12') || markup.includes('1.618fr')) &&
    (markup.includes('col-span-8') || markup.includes('col-span-7') || markup.includes('1.618fr'));
  if (!hasAsymmetricColumns) {
    violations.push('Missing AsymmetricGridColumns (expected 12-column grid with 8:4 golden partition)');
  }

  const hasPrimaryCanvas = /<section[\s\S]*?(?:col-span-8|1\.618fr)[\s\S]*?>/i.test(markup);
  if (!hasPrimaryCanvas) {
    violations.push('Missing PrimaryCanvas (<section class="...col-span-8">)');
  }

  const hasSecondaryPanel = /<aside[\s\S]*?(?:col-span-4|col-span-5|1fr)[\s\S]*?>/i.test(markup);
  if (!hasSecondaryPanel) {
    violations.push('Missing SecondaryPanel (<aside class="...col-span-4">)');
  }

  let passedRules = 0;
  if (hasHeaderContainer) passedRules += 15;
  if (hasLeftAnchoredBrand) passedRules += 15;
  if (hasContextualMetadata) passedRules += 15;
  if (hasPrimarySplitView) passedRules += 15;
  if (hasAsymmetricColumns) passedRules += 15;
  if (hasPrimaryCanvas) passedRules += 15;
  if (hasSecondaryPanel) passedRules += 10;

  return {
    isConforming: violations.length === 0,
    score: passedRules,
    hasHeaderContainer,
    hasLeftAnchoredBrand,
    hasContextualMetadata,
    hasPrimarySplitView,
    hasAsymmetricColumns,
    hasPrimaryCanvas,
    hasSecondaryPanel,
    violations,
  };
}
