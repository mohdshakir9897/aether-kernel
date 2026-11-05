/**
 * Domain Ontology Registry
 * Schema repository of real-world operational domains and their perceptual parameters.
 */

export interface DomainEntityField {
  name: string;
  type: 'scalar' | 'temporal' | 'status' | 'tabular' | 'currency' | 'log';
  precision?: number;
  criticality: 'ambient' | 'informational' | 'critical' | 'emergency';
}

export interface DomainSchema {
  id: string;
  name: string;
  description: string;
  recommendedFontStack: string;
  targetInformationDensity: 'ultra-dense' | 'balanced' | 'spacious';
  minApcaLcBody: number;
  maxHueFatigue: number;
  forbiddenTropeIds: string[];
  defaultEntities: DomainEntityField[];
}

export const DOMAIN_ONTOLOGY_REGISTRY: Record<string, DomainSchema> = {
  'devtools-infra': {
    id: 'devtools-infra',
    name: 'Developer Tools & Systems Infrastructure',
    description: 'High-density, low-latency observability, traces, and code navigation interfaces.',
    recommendedFontStack: 'ui-monospace, "SF Mono", Menlo, Consolas, monospace',
    targetInformationDensity: 'ultra-dense',
    minApcaLcBody: 75,
    maxHueFatigue: 30,
    forbiddenTropeIds: ['AETHER-001', 'AETHER-002', 'AETHER-003', 'AETHER-004'],
    defaultEntities: [
      { name: 'trace_id', type: 'scalar', criticality: 'informational' },
      { name: 'latency_p99', type: 'scalar', precision: 2, criticality: 'critical' },
      { name: 'error_rate', type: 'scalar', precision: 4, criticality: 'critical' },
      { name: 'log_stream', type: 'log', criticality: 'informational' },
    ],
  },

  'fintech-precision': {
    id: 'fintech-precision',
    name: 'High-Precision Financial Instruments',
    description: 'Tabular accounting ledgers, algorithmic trading books, and compliance records.',
    recommendedFontStack: '"IBM Plex Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    targetInformationDensity: 'ultra-dense',
    minApcaLcBody: 80,
    maxHueFatigue: 25,
    forbiddenTropeIds: ['AETHER-001', 'AETHER-002', 'AETHER-003', 'AETHER-004'],
    defaultEntities: [
      { name: 'notional_value', type: 'currency', precision: 2, criticality: 'critical' },
      { name: 'basis_points_delta', type: 'scalar', precision: 4, criticality: 'critical' },
      { name: 'execution_timestamp', type: 'temporal', criticality: 'informational' },
      { name: 'order_book_ledger', type: 'tabular', criticality: 'critical' },
    ],
  },

  'editorial-modern': {
    id: 'editorial-modern',
    name: 'Modern Literary & Investigative Journalism',
    description: 'High-contrast typography, generous negative space, intentional serif headers.',
    recommendedFontStack: '"Newsreader", "Charter", "Georgia", serif',
    targetInformationDensity: 'spacious',
    minApcaLcBody: 85,
    maxHueFatigue: 35,
    forbiddenTropeIds: ['AETHER-001', 'AETHER-002', 'AETHER-004'],
    defaultEntities: [
      { name: 'article_headline', type: 'scalar', criticality: 'informational' },
      { name: 'body_prose', type: 'scalar', criticality: 'informational' },
      { name: 'byline_credential', type: 'scalar', criticality: 'ambient' },
      { name: 'citation_index', type: 'tabular', criticality: 'informational' },
    ],
  },

  'industrial-telemetry': {
    id: 'industrial-telemetry',
    name: 'SCADA & Industrial Process Telemetry',
    description: 'High-contrast, glanceable status monitors for power grids and manufacturing plants.',
    recommendedFontStack: '"Inter", -apple-system, sans-serif',
    targetInformationDensity: 'balanced',
    minApcaLcBody: 85,
    maxHueFatigue: 20,
    forbiddenTropeIds: ['AETHER-001', 'AETHER-002', 'AETHER-003', 'AETHER-004', 'AETHER-005'],
    defaultEntities: [
      { name: 'bus_voltage_kv', type: 'scalar', precision: 1, criticality: 'critical' },
      { name: 'coolant_pressure_psi', type: 'scalar', precision: 2, criticality: 'emergency' },
      { name: 'actuator_interlock', type: 'status', criticality: 'critical' },
    ],
  },

  'public-utility': {
    id: 'public-utility',
    name: 'Public Sector & Civic Utility Portals',
    description: 'Universal accessibility, extreme contrast, plain language, and zero decorative noise.',
    recommendedFontStack: 'system-ui, -apple-system, sans-serif',
    targetInformationDensity: 'balanced',
    minApcaLcBody: 90,
    maxHueFatigue: 15,
    forbiddenTropeIds: ['AETHER-001', 'AETHER-002', 'AETHER-003', 'AETHER-004', 'AETHER-005'],
    defaultEntities: [
      { name: 'application_reference', type: 'scalar', criticality: 'informational' },
      { name: 'filing_status', type: 'status', criticality: 'critical' },
      { name: 'due_date', type: 'temporal', criticality: 'critical' },
    ],
  },
};

export function getDomainSchema(domainId: string): DomainSchema {
  return DOMAIN_ONTOLOGY_REGISTRY[domainId] ?? DOMAIN_ONTOLOGY_REGISTRY['devtools-infra'];
}
