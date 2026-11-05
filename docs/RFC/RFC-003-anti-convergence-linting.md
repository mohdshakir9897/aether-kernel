# RFC-003: Anti-Convergence AST Linting & Automated Patching

- **Status**: Accepted / Implemented
- **Authors**: Aether Tooling & Principles WG
- **Target**: `@aether-ui/ast-critic`, `@aether-ui/cli`

## Context
Across diverse foundation models (GPT-4, Claude 3.5, Gemini 1.5/2.0), web layout generation suffers from severe output convergence. Without strict counter-measures, models repeatedly generate:
1. `rounded-full` badge pills floating above headlines with arrow icons (`AETHER-001`).
2. Saturated blur blobs (`blur-3xl bg-purple-500/30`) in backdrop pseudo-elements (`AETHER-002`).
3. Uniform 3-column card grids with identical box-shadow and icon-top cards (`AETHER-003`).
4. Meaningless buzzword slogans ("Supercharge your workflow with next-gen synergy") (`AETHER-004`).
5. Low-contrast grey text against subtle dark backgrounds failing APCA minimums (`AETHER-005`).

## Decision
1. Implement a unified multi-framework AST visitor that analyzes JSX, TSX, Vue templates, Svelte components, and HTML/Tailwind.
2. Emit high-severity diagnostic warnings when these algorithmic tropes are detected.
3. Provide automated AST rewriters (`--fix`) that convert clichés into purposeful, asymmetrical, domain-rich designs (e.g. converting a 3-column homogeneous grid into a modular golden-ratio master-detail layout, or replacing buzzwords with domain-accurate metrics).
