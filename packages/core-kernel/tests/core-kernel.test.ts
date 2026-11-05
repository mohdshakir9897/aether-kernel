import assert from 'node:assert';
import {
  calcAPCA,
  evaluateAPCA,
  calculateChromaticBudget,
  generateSemanticPalette,
  calculateVCoM,
  goldenSplit,
  analyzeLayoutEntropy,
  DOMAIN_ONTOLOGY_REGISTRY,
  extractSchemaModels,
  inferWorkspaceContext,
  evaluateRenderedPhysics,
} from '../src/index.js';

console.log('🧪 Running @aether-ui/core-kernel hermetic tests...');

// 1. APCA Contrast Tests
{
  // Pure black on pure white should yield high positive Lc (~106)
  const lcBlackOnWhite = calcAPCA('#000000', '#ffffff');
  assert(lcBlackOnWhite > 100, `Expected Lc > 100, got ${lcBlackOnWhite}`);

  // Pure white on pure black should yield high negative Lc (~ -108)
  const lcWhiteOnBlack = calcAPCA('#ffffff', '#000000');
  assert(lcWhiteOnBlack < -100, `Expected Lc < -100, got ${lcWhiteOnBlack}`);

  // Low contrast grey text should fail evaluation for fine copy
  const evalResult = evaluateAPCA('#737373', '#171717', 14, 400);
  assert(!evalResult.isCompliant, 'Low contrast subtle grey on dark canvas should fail APCA compliance');
  console.log('  ✓ APCA Contrast matrix validated');
}

// 2. Chromatic Budget & Chromostereopsis Tests
{
  const saturatedPurple = { l: 0.6, c: 0.25, h: 290 };
  const saturatedCyan = { l: 0.7, c: 0.22, h: 180 };
  const report = calculateChromaticBudget([saturatedPurple, saturatedCyan]);

  assert(report.hasChromostereopsisRisk, 'High chroma purple + cyan pair should trigger chromostereopsis risk');
  assert(report.totalFatigueScore > 50, 'Fatigue score should be elevated for clashing primaries');
  console.log('  ✓ Chromatic budget & chromostereopsis detection validated');
}

// 3. Palette Generator Tests
{
  const palette = generateSemanticPalette(220, 'dark');
  assert(palette.bgCanvas.startsWith('#'), 'Palette should generate valid hex canvas');
  assert(palette.fgPrimary.startsWith('#'), 'Palette should generate valid hex foreground');
  console.log('  ✓ OKLCH non-linear palette generator validated');
}

// 4. Visual Center of Mass (VCoM) Tests
{
  const nodes = [
    { box: { x: 500, y: 100, width: 440, height: 40 }, luminanceContrast: 0.8 },
    { box: { x: 450, y: 160, width: 540, height: 100 }, luminanceContrast: 0.9 },
    { box: { x: 480, y: 280, width: 480, height: 60 }, luminanceContrast: 0.5 },
  ];
  const vcom = calculateVCoM(nodes, { width: 1440, height: 900 });
  assert(vcom.isStagnantCenterStack, 'Centered stacked nodes should be flagged as stagnant center stack');
  console.log('  ✓ Visual Center of Mass (VCoM) physics validated');
}

// 5. Golden Grid Split Tests
{
  const split = goldenSplit(1000);
  assert.strictEqual(split.major, 618);
  assert.strictEqual(split.minor, 382);
  console.log('  ✓ Golden ratio Fibonacci partitioning validated');
}

// 6. Domain Ontology Registry
{
  assert(DOMAIN_ONTOLOGY_REGISTRY['devtools-infra'], 'DevTools ontology must be registered');
  assert(DOMAIN_ONTOLOGY_REGISTRY['fintech-precision'], 'Fintech ontology must be registered');
  console.log('  ✓ Domain ontology schema database validated');
}

// 7. Telemetry Context Inference Tests
{
  const mockFiles: Record<string, string> = {
    'package.json': JSON.stringify({ dependencies: { 'monaco-editor': '^0.45.0', '@octokit/rest': '^20.0.0' } }),
    'schema.prisma': `
      model PipelineExecution {
        id String @id
        status String
      }
      model ClusterNode {
        id String @id
        load Float
      }
    `,
    'openapi.json': JSON.stringify({
      components: {
        schemas: {
          DeploymentTarget: { type: 'object' },
        },
      },
    }),
  };

  const models = extractSchemaModels(mockFiles);
  assert(models.includes('PipelineExecution'), 'Should extract Prisma model PipelineExecution');
  assert(models.includes('ClusterNode'), 'Should extract Prisma model ClusterNode');
  assert(models.includes('DeploymentTarget'), 'Should extract OpenAPI schema DeploymentTarget');

  const context = inferWorkspaceContext(mockFiles);
  assert.strictEqual(context.domain, 'devtools-infra', 'Should infer devtools-infra domain');
  assert.strictEqual(context.density, 'compact', 'Should infer compact density for devtools');
  assert(context.primaryEntities.includes('PipelineExecution'), 'Primary entities should include inferred models');

  // Edge cases: Empty file maps, empty strings, invalid json must not crash
  const emptyFiles = {
    'package.json': '',
    'schema.prisma': '',
    'openapi.json': '{ invalid json }',
  };
  const emptyModels = extractSchemaModels(emptyFiles);
  assert(Array.isArray(emptyModels), 'Should return array on empty files');
  assert.strictEqual(emptyModels.length, 0);

  const emptyContext = inferWorkspaceContext(emptyFiles);
  assert.strictEqual(emptyContext.domain, 'general-b2b');
  assert.strictEqual(emptyContext.density, 'balanced');
  assert.strictEqual(emptyContext.primaryEntities.length, 3);

  const nullContext = inferWorkspaceContext({} as any);
  assert.strictEqual(nullContext.domain, 'general-b2b');

  console.log('  ✓ Telemetry context inference (Prisma / OpenAPI / Package.json) & empty file safety validated');
}

// 8. Rendered Spatial Physics & Slop Discriminator Tests
{
  // Symmetrical center-stack with 3 identical boxes
  const slopBoxes = [
    { left: 0.3, top: 0.1, width: 0.4, height: 0.1 },
    { left: 0.25, top: 0.25, width: 0.5, height: 0.2 },
    { left: 0.3, top: 0.5, width: 0.4, height: 0.15 },
  ];
  const slopEval = evaluateRenderedPhysics(slopBoxes);
  assert.strictEqual(slopEval.isSlop, true, 'Symmetrical center-stack should be flagged as slop');
  assert(slopEval.symmetry > 0.94, 'Symmetry should exceed 0.94 threshold');
  assert(slopEval.violations.length > 0, 'Should register aesthetic convergence violation');

  // Asymmetric layout with intentional dynamic tension (left-anchored primary canvas)
  const humanBoxes = [
    { left: 0.05, top: 0.1, width: 0.50, height: 0.6 },
    { left: 0.05, top: 0.75, width: 0.50, height: 0.2 },
    { left: 0.60, top: 0.1, width: 0.35, height: 0.3 },
  ];
  const humanEval = evaluateRenderedPhysics(humanBoxes);
  assert.strictEqual(humanEval.isSlop, false, 'Asymmetric layout should not be flagged as slop');
  assert(humanEval.symmetry <= 0.94, 'Asymmetric layout should have symmetry <= 0.94');
  console.log('  ✓ Rendered spatial physics & slop discriminator validated');
}

console.log('🎉 All @aether-ui/core-kernel tests passed successfully!\n');
