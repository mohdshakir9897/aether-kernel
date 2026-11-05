/**
 * @aether-ui/agent-protocol
 * Universal directives and multi-platform adapters for AI coding agents
 */

export const PROTOCOL_VERSION = '1.0.0';

export const DIRECTIVES = [
  'socratic-friction',
  'token-manifesto',
  'spatial-composition',
  'self-healing-loop',
] as const;

export const ARCHETYPES = [
  'devtools-infra',
  'fintech-precision',
  'editorial-modern',
  'industrial-telemetry',
  'public-utility',
] as const;

export type ArchetypeId = typeof ARCHETYPES[number];

export * from './grammar/layout-grammar.js';
