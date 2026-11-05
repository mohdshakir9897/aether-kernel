/**
 * Benchmark Runner: Human Delta Evaluator
 * Evaluates Euclidean and Mahalanobis statistical distance from generic median.
 */

import { extractVectorFromHtml, SiteVector } from './convergence-metric.js';

export function euclideanDistance(v1: SiteVector, v2: SiteVector): number {
  const d1 = v1.pillCount - v2.pillCount;
  const d2 = v1.blurBlobCount - v2.blurBlobCount;
  const d3 = v1.uniformGridCount - v2.uniformGridCount;
  const d4 = v1.buzzwordCount - v2.buzzwordCount;
  const d5 = v1.apcaFailures - v2.apcaFailures;

  return Math.sqrt(d1 * d1 + d2 * d2 + d3 * d3 + d4 * d4 + d5 * d5);
}

export function evaluateHumanDelta(sampleHtml: string): { delta: number; isHumanGrade: boolean } {
  const vec = extractVectorFromHtml(sampleHtml);
  const genericMedian: SiteVector = {
    pillCount: 1,
    blurBlobCount: 1,
    uniformGridCount: 1,
    buzzwordCount: 2,
    apcaFailures: 1,
  };

  const distance = euclideanDistance(vec, genericMedian);
  return {
    delta: Math.round(distance * 100) / 100,
    isHumanGrade: distance >= 2.0 && vec.pillCount === 0 && vec.blurBlobCount === 0,
  };
}

console.log('Human Delta Evaluator ready.');
