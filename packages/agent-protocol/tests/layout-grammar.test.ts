import assert from 'node:assert';
import { validateLayoutGrammar, EBNF_GRAMMAR_DEFINITION } from '../src/index.js';

console.log('🧪 Running @aether-ui/agent-protocol grammar tests...');

// 1. Verify EBNF Grammar definition exists
assert(EBNF_GRAMMAR_DEFINITION.includes('RootLayout ::= HeaderContainer PrimarySplitView FooterContainer'));
console.log('  ✓ EBNF grammar specification validated');

// 2. Conforming Markup Verification
const conformingMarkup = `
<header class="flex items-center justify-between border-b border-neutral-800 px-6 py-3">
  <div class="flex items-center gap-3">
    <div class="h-6 w-6 rounded bg-emerald-500"></div>
    <span class="font-semibold text-neutral-100">BrandTitle</span>
  </div>
  <nav class="flex gap-4"></nav>
  <div class="flex items-center gap-2 font-mono text-xs tabular-nums text-neutral-400">
    <span class="h-2 w-2 rounded-full bg-emerald-500"></span>
    <span>STATUS: 99.98%</span>
  </div>
</header>
<main class="grid grid-cols-1 lg:grid-cols-12 gap-6 p-6">
  <section class="lg:col-span-8">
    <div class="rounded-lg border border-neutral-800 bg-neutral-950/60 p-4">
      <table></table>
    </div>
  </section>
  <aside class="lg:col-span-4">
    <div class="flex flex-col gap-3 rounded-md border border-neutral-800 p-4">
      <div>Inspector</div>
    </div>
  </aside>
</main>
<footer class="border-t border-neutral-800 p-4"></footer>
`;

const result = validateLayoutGrammar(conformingMarkup);
assert.strictEqual(result.isConforming, true, 'Conforming markup should pass all grammar rules');
assert.strictEqual(result.score, 100, 'Score should be 100 for fully conforming layout');
console.log('  ✓ Conforming layout adheres 100% to layout-grammar.ebnf');

// 3. Generic AI Slop Markup Rejection
const slopMarkup = `
<div class="text-center py-20">
  <div class="rounded-full border px-3 py-1">New &rarr;</div>
  <h1>Generic Headline</h1>
  <div class="grid grid-cols-3 gap-6"></div>
</div>
`;

const slopResult = validateLayoutGrammar(slopMarkup);
assert.strictEqual(slopResult.isConforming, false, 'Generic slop should fail layout grammar');
assert(slopResult.violations.length >= 4, 'Should flag multiple structural violations');
console.log('  ✓ Generic AI slop correctly rejected by layout grammar');

console.log('🎉 All @aether-ui/agent-protocol tests passed successfully!\n');
