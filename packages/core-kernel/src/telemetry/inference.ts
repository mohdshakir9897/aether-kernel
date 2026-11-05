/**
 * Telemetry Context Inference Engine
 * Extracts real database models and architectural context from workspace schemas
 * (Prisma, Drizzle, OpenAPI / JSON schemas) without heavy external dependencies.
 */

export interface InferredDomainContext {
  domain: 'high-precision-fintech' | 'devtools-infra' | 'general-b2b' | 'editorial-luxury';
  density: 'compact' | 'balanced' | 'editorial';
  primaryEntities: string[];
}

export function extractSchemaModels(projectFiles: Record<string, string>): string[] {
  const models = new Set<string>();

  // 1. Prisma schema model extraction (model <Name> {)
  const prismaContent = Object.entries(projectFiles)
    .filter(([path]) => path.endsWith('.prisma'))
    .map(([, content]) => content)
    .join('\n');

  if (prismaContent) {
    const matches = prismaContent.matchAll(/model\s+([A-Za-z0-9_]+)\s*\{/g);
    for (const match of matches) {
      if (match[1]) models.add(match[1]);
    }
  }

  // 2. Drizzle schema extraction (export const <name> = pgTable|sqliteTable|mysqlTable)
  for (const [path, content] of Object.entries(projectFiles)) {
    if (path.includes('schema') && (path.endsWith('.ts') || path.endsWith('.js'))) {
      const drizzleMatches = content.matchAll(
        /export\s+const\s+([A-Za-z0-9_]+)\s*=\s*(?:pgTable|sqliteTable|mysqlTable)\s*\(/g
      );
      for (const match of drizzleMatches) {
        if (match[1]) models.add(match[1]);
      }
    }
  }

  // 3. OpenAPI / JSON schema entity extraction
  for (const [path, content] of Object.entries(projectFiles)) {
    if (path.includes('openapi') || path.includes('swagger') || path.endsWith('schema.json')) {
      try {
        const parsed = JSON.parse(content);
        const schemas = parsed.components?.schemas || parsed.definitions || {};
        Object.keys(schemas).forEach((key) => models.add(key));
      } catch {
        // Skip invalid JSON
      }
    }
  }

  return Array.from(models);
}

export function inferWorkspaceContext(projectFiles: Record<string, string>): InferredDomainContext {
  const pkgJson = projectFiles['package.json'] || '';
  const hasPrisma = Object.keys(projectFiles).some((p) => p.endsWith('.prisma'));
  const schemaContent = hasPrisma
    ? Object.entries(projectFiles).find(([p]) => p.endsWith('.prisma'))?.[1] || ''
    : Object.entries(projectFiles).find(([p]) => p.includes('schema'))?.[1] || '';

  const isFinance =
    pkgJson.includes('"d3"') ||
    pkgJson.includes('"financial"') ||
    schemaContent.includes('Transaction') ||
    schemaContent.includes('Ledger') ||
    schemaContent.includes('Portfolio');

  const isDevTool =
    pkgJson.includes('"monaco-editor"') ||
    pkgJson.includes('"@octokit"') ||
    pkgJson.includes('"xterm"') ||
    schemaContent.includes('Deployment') ||
    schemaContent.includes('Pipeline') ||
    schemaContent.includes('Cluster');

  const isEditorial =
    pkgJson.includes('"next-mdx"') ||
    pkgJson.includes('"contentlayer"') ||
    schemaContent.includes('Article') ||
    schemaContent.includes('Publication') ||
    schemaContent.includes('Author');

  const entities = extractSchemaModels(projectFiles);

  const domain = isFinance
    ? 'high-precision-fintech'
    : isDevTool
    ? 'devtools-infra'
    : isEditorial
    ? 'editorial-luxury'
    : 'general-b2b';

  const density = isDevTool ? 'compact' : isEditorial ? 'editorial' : 'balanced';

  return {
    domain,
    density,
    primaryEntities: entities.length > 0 ? entities.slice(0, 5) : ['Metric', 'Record', 'Session'],
  };
}
