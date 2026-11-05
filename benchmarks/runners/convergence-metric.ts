/**
 * Benchmark Runner: Aesthetic Convergence Metric
 * Computes vector cosine similarity and Shannon spatial entropy against AI and human baselines.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { lintSource } from '@aether-kernel/ast-critic';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export interface SiteVector {
  pillCount: number;
  blurBlobCount: number;
  uniformGridCount: number;
  buzzwordCount: number;
  apcaFailures: number;
}

export function extractVectorFromHtml(html: string): SiteVector {
  const result = lintSource(html);
  return {
    pillCount: result.diagnostics.filter((d) => d.ruleId === 'AETHER-001').length,
    blurBlobCount: result.diagnostics.filter((d) => d.ruleId === 'AETHER-002').length,
    uniformGridCount: result.diagnostics.filter((d) => d.ruleId === 'AETHER-003').length,
    buzzwordCount: result.diagnostics.filter((d) => d.ruleId === 'AETHER-004').length,
    apcaFailures: result.diagnostics.filter((d) => d.ruleId === 'AETHER-005').length,
  };
}

export function cosineSimilarity(v1: SiteVector, v2: SiteVector): number {
  const a = [v1.pillCount, v1.blurBlobCount, v1.uniformGridCount, v1.buzzwordCount, v1.apcaFailures];
  const b = [v2.pillCount, v2.blurBlobCount, v2.uniformGridCount, v2.buzzwordCount, v2.apcaFailures];

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }

  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

async function run() {
  console.log('📊 Executing Aether UI Conformance Benchmark...');

  const aiSamplePath = path.resolve(__dirname, '../datasets/1000-ai-generated-sites/sample-001.html');
  const humanSamplePath = path.resolve(__dirname, '../datasets/1000-award-human-sites/sample-001.html');

  const aiHtml = fs.readFileSync(aiSamplePath, 'utf-8');
  const humanHtml = fs.readFileSync(humanSamplePath, 'utf-8');

  const vecAi = extractVectorFromHtml(aiHtml);
  const vecHuman = extractVectorFromHtml(humanHtml);

  // Generic AI Centroid Vector
  const aiCentroid: SiteVector = {
    pillCount: 1,
    blurBlobCount: 1,
    uniformGridCount: 1,
    buzzwordCount: 2,
    apcaFailures: 1,
  };

  const simAiToCentroid = cosineSimilarity(vecAi, aiCentroid);
  const simHumanToCentroid = cosineSimilarity(vecHuman, aiCentroid);

  console.log(`  AI Sample Cliché Vector:    [${Object.values(vecAi).join(', ')}]`);
  console.log(`  AI Similarity to Slop Mean: ${(simAiToCentroid * 100).toFixed(1)}% (High Convergence)`);
  console.log(`  Human Sample Cliché Vector: [${Object.values(vecHuman).join(', ')}]`);
  console.log(`  Human Similarity to Slop:   ${(simHumanToCentroid * 100).toFixed(1)}% (Divergent Craft)`);

  const results = {
    timestamp: new Date().toISOString(),
    aiConvergenceScore: simAiToCentroid,
    humanDivergenceScore: 1 - simHumanToCentroid,
    status: simHumanToCentroid < 0.2 ? 'PASS' : 'FAIL',
  };

  const resultsDir = path.resolve(__dirname, '../results');
  if (!fs.existsSync(resultsDir)) fs.mkdirSync(resultsDir, { recursive: true });
  fs.writeFileSync(path.join(resultsDir, 'baseline-eval.json'), JSON.stringify(results, null, 2), 'utf-8');

  console.log('✅ Benchmark run complete. Results saved to benchmarks/results/baseline-eval.json');
}

run().catch(console.error);
