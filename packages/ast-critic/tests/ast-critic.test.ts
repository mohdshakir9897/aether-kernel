import assert from 'node:assert';
import { lintSource, fixSource, evaluateRenderedPhysics } from '../src/index.js';

console.log('🧪 Running @aether-kernel/ast-critic hermetic tests...');

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

// 7. Test Pixel & Spatial Physics Evaluator (Edge Cases & Slop Discriminator)
{
  // Edge Case: Zero / Negative area boxes should NOT produce NaN
  const zeroBoxes = [
    { left: 0, top: 0, width: 0, height: 10 },
    { left: 0, top: 0, width: -5, height: 10 },
  ];
  const zeroEval = evaluateRenderedPhysics(zeroBoxes);
  assert(!Number.isNaN(zeroEval.entropy), 'Entropy must not be NaN for zero/negative area boxes');
  assert(!Number.isNaN(zeroEval.energy), 'Energy must not be NaN');
  assert.strictEqual(zeroEval.isSlop, false);

  // Slop layout: Symmetry > 0.94 and low entropy < 1.8
  const centeredSlop = [
    { left: 0.3, top: 0.1, width: 0.4, height: 0.1 },
    { left: 0.25, top: 0.25, width: 0.5, height: 0.2 },
    { left: 0.3, top: 0.5, width: 0.4, height: 0.15 },
  ];
  const slopEval = evaluateRenderedPhysics(centeredSlop);
  assert(slopEval.symmetry > 0.94, `Expected symmetry > 0.94, got ${slopEval.symmetry}`);
  assert(slopEval.entropy < 1.8, `Expected entropy < 1.8, got ${slopEval.entropy}`);
  assert.strictEqual(slopEval.isSlop, true, 'Must flag symmetry > 0.94 and entropy < 1.8 as slop');
  assert(slopEval.violations.length > 0);

  // Asymmetric dynamic tension layout: Symmetry <= 0.94
  const asymmetricLayout = [
    { left: 0.05, top: 0.1, width: 0.5, height: 0.6 },
    { left: 0.05, top: 0.75, width: 0.5, height: 0.2 },
    { left: 0.6, top: 0.1, width: 0.35, height: 0.3 },
  ];
  const humanEval = evaluateRenderedPhysics(asymmetricLayout);
  assert.strictEqual(humanEval.isSlop, false, 'Asymmetric layout must not be flagged as slop');
  assert(humanEval.symmetry <= 0.94, 'Asymmetric layout must have symmetry <= 0.94');
  console.log('  ✓ Pixel evaluator handles zero/negative area edge cases and VCoM slop thresholds');
}

console.log('🎉 All @aether-kernel/ast-critic tests passed successfully!\n');
