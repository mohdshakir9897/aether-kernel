import assert from 'node:assert';
import { lintSource, fixSource } from '../src/index.js';

console.log('🧪 Running @aether-ui/ast-critic hermetic tests...');

// 1. Detect AETHER-001: Floating Pill Badge
{
  const code = `<div class="rounded-full border border-purple-500/20 px-3 py-1 text-sm text-purple-400 mx-auto">
    <span>Introducing Aether 2.0 &rarr;</span>
  </div>`;
  const result = lintSource(code, { filename: 'Hero.tsx' });
  const diag = result.diagnostics.find((d) => d.ruleId === 'AETHER-001');
  assert(diag, 'AETHER-001 should flag floating pill badge');
  console.log('  ✓ AETHER-001 (floating pill badge) flagged');
}

// 2. Detect AETHER-002: Radial Blur Blob
{
  const code = `<div class="absolute -top-40 left-1/2 -z-10 blur-3xl opacity-30 bg-gradient-to-r from-purple-500 to-cyan-500 w-96 h-96 rounded-full"></div>`;
  const result = lintSource(code, { filename: 'Backdrop.jsx' });
  const diag = result.diagnostics.find((d) => d.ruleId === 'AETHER-002');
  assert(diag, 'AETHER-002 should flag purple/cyan blur blobs');
  console.log('  ✓ AETHER-002 (radial blur blob) flagged');
}

// 3. Detect AETHER-003: Uniform 3-Column Grid
{
  const code = `<div class="grid grid-cols-3 gap-6">
    <div class="card p-6">Feature 1</div>
    <div class="card p-6">Feature 2</div>
    <div class="card p-6">Feature 3</div>
  </div>`;
  const result = lintSource(code, { filename: 'Features.html' });
  const diag = result.diagnostics.find((d) => d.ruleId === 'AETHER-003');
  assert(diag, 'AETHER-003 should flag uniform 3-col card grid');
  console.log('  ✓ AETHER-003 (uniform 3-column grid) flagged');
}

// 4. Detect AETHER-004: Semantic Fluff Buzzwords
{
  const code = `<h2>Supercharge your workflow with next-gen AI</h2>`;
  const result = lintSource(code, { filename: 'Hero.tsx' });
  const diag = result.diagnostics.find((d) => d.ruleId === 'AETHER-004');
  assert(diag, 'AETHER-004 should flag corporate AI buzzwords');
  console.log('  ✓ AETHER-004 (semantic buzzwords) flagged');
}

// 5. Detect AETHER-005: Low-contrast APCA failure
{
  const code = `<p class="bg-black text-gray-600">Subtle unreadable footer copy</p>`;
  const result = lintSource(code, { filename: 'Footer.tsx' });
  const diag = result.diagnostics.find((d) => d.ruleId === 'AETHER-005');
  assert(diag, 'AETHER-005 should flag low-contrast APCA failure');
  console.log('  ✓ AETHER-005 (APCA contrast failure) flagged');
}

// 6. Test Automated Fixer
{
  const code = `<div>
    <div class="absolute blur-3xl bg-purple-500/20"></div>
    <h2>Supercharge your workflow</h2>
  </div>`;
  const fixed = fixSource(code, { filename: 'Hero.tsx' });
  assert(fixed.fixedSource, 'Fixer should return patched source');
  assert(!fixed.fixedSource.includes('Supercharge your workflow'), 'Buzzwords should be replaced');
  console.log('  ✓ Automated AST node patcher and copy synthesizer verified');
}

console.log('🎉 All @aether-ui/ast-critic tests passed successfully!\n');
