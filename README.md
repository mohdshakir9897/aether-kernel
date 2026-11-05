<div align="center">

# Aether Kernel

**Stop your AI coding agents from generating identical, generic UI.**

A zero-config tool and CLI that keeps Cursor, Windsurf, Claude Code, and Copilot aligned to human design standards—preventing purple blur blobs, repetitive 3-card grids, and AI template fatigue.

[![CI Status](https://github.com/mohdshakir9897/aether-kernel/actions/workflows/ci-core-kernel.yml/badge.svg)](https://github.com/mohdshakir9897/aether-kernel/actions)
[![License: Apache-2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg?style=flat-square)](LICENSE)

[Quickstart](#quickstart) • [How It Works](#how-it-works) • [Supported IDEs](#supported-ai-tools) • [Rules Caught](#what-it-detects) • [Architecture Docs](docs/)

</div>

---

## Why Aether Kernel?

When modern AI coding assistants build web interfaces, token probability mechanics cause them to default to the same repetitive patterns:
- Purple or neon-violet background glow blobs (`blur-3xl bg-purple-500`).
- Centered hero headers with floating "Introducing 2.0" pill badges.
- Identical 3-column card grids with icons in rounded boxes.
- Generic corporate buzzwords ("Supercharge your workflow").

**Aether Kernel connects directly to your AI IDE or CI pipeline.** It automatically audits your components, blocks generic template clichés, and guides your AI agent to build distinctive, human-grade UI tailored to your actual project.

---

## Quickstart

### 1. Connect to Your AI Editor (10 Seconds)

Inside your project root, run:

```bash
npx aether-kernel init
```

This immediately configures your AI workspace rules (`.cursorrules`, `.windsurfrules`, `antigravity.json`, and Copilot workspace instructions). Your agent will immediately cease outputting floating pill badges and generic purple blur templates.

### 2. Audit Your Existing Components

Scan your project for AI template convergence and low-contrast accessibility failures:

```bash
npx aether-kernel audit ./src --strict
```

### 3. Automatically Fix Violations

Auto-patch detected clichés into domain-accurate, asymmetric layouts:

```bash
npx aether-kernel fix --file src/components/Hero.tsx
```

---

## What It Detects

Aether Kernel includes deterministic AST rules that catch AI design tropes before they reach production:

| Rule | Targeted AI Cliché | Why It Matters |
|:---|:---|:---|
| **`AETHER-001`** | **Floating Hero Pill Badge** | Symmetrical centered pills (`rounded-full px-3 py-1`) waste prime optical real estate. |
| **`AETHER-002`** | **Neon Blur Glow Blobs** | Decorative `blur-3xl` purple/cyan gradients induce chromostereopsis and rapid retinal fatigue. |
| **`AETHER-003`** | **Homogeneous 3-Card Grids** | Cloned 3-column card grids collapse information hierarchy in complex software. |
| **`AETHER-004`** | **Corporate Buzzword Fluff** | Replaces meaningless filler ("Supercharge your workflow") with measurable domain metrics. |
| **`AETHER-005`** | **APCA Contrast Failures** | Replaces unreadable grey-on-dark text with verified W3C Silver APCA ($L_c \ge 75$) contrast tokens. |

---

## How It Works

```
[ User Prompt / Workspace AST ]
               │
               ▼
┌──────────────────────────────────────────────┐
│ 1. Telemetry & Schema Ingestion Engine       │
│    - Deduces domain from Prisma/DB/package   │
└──────────────────────┬───────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────┐
│ 2. Deterministic OKLCH & APCA Color Kernel   │
│    - Calculates perceptual contrast (Lc ≥ 75)│
└──────────────────────┬───────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────┐
│ 3. Layout Grammar (EBNF) & Asymmetry Engine  │
│    - Mandates asymmetric spatial balance     │
└──────────────────────┬───────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────┐
│ 4. AST Critic & Shannon Entropy Evaluator    │
│    - Flags & blocks high-symmetry cliches    │
└──────────────────────────────────────────────┘
```

1. **Schema Context Ingestion**: Detects your actual domain (fintech, devtools, SCADA telemetry, editorial) by reading your Prisma, Drizzle, or OpenAPI definitions—no configuration required.
2. **Perceptual Math**: Enforces human psychophysics (Accessible Perceptual Contrast Algorithm and OKLCH color gamut) rather than ad-hoc hex values.
3. **Mathematical Layout Grammar**: Replaces symmetric center-stacks with an asymmetric golden-ratio 12-column grid (`lg:col-span-8` canvas + `lg:col-span-4` inspector).
4. **Shannon Entropy Evaluator**: Measures spatial distribution entropy $H(X)$ to mathematically distinguish artisan craft from generic AI clustering.

---

## Supported AI Tools

Aether Kernel natively injects directives and runtime hooks into your development environment:

- **Cursor**: Generates `.cursorrules`
- **Windsurf**: Generates `.windsurfrules`
- **GitHub Copilot**: Generates `.github/copilot-instructions.md`
- **Google Antigravity**: Lifecycle hooks in `antigravity.json`
- **Claude Code**: Tool execution in `claude-code.json`
- **Aider & Cline**: Integrated system directives

---

## Monorepo Architecture

For advanced customization and deep technical proofs:

- [`@aether-ui/core-kernel`](packages/core-kernel): Pure mathematical physics engine (APCA, VCoM, golden grids, Shannon entropy, schema inference).
- [`@aether-ui/ast-critic`](packages/ast-critic): Multi-framework AST parser (JSX, TSX, Vue, Svelte, Tailwind) and automated node patcher.
- [`@aether-ui/agent-protocol`](packages/agent-protocol): Master agent system prompts, archetypes, and [EBNF Layout Grammar](packages/agent-protocol/grammars/layout-grammar.ebnf).
- [`@aether-ui/cli`](packages/cli): Terminal auditor, auto-fixer, and token generator.
- [`@aether-ui/browser-inspector`](packages/browser-inspector): Chrome & Firefox DevTools extension for live visual center of mass heatmaps.
- [`benchmarks`](benchmarks): Conformance test bench comparing 1,000 AI landing pages against human craft.

---

## Deep Technical Proofs

Looking for the underlying mathematical derivations?
- [Perceptual Physics & APCA Contrast Proofs](docs/PERCEPTUAL_PHYSICS.md)
- [Visual Center of Mass (VCoM) Vector Mathematics](docs/RFC/RFC-002-visual-center-of-mass.md)
- [Google AI Principles Alignment](docs/AI_PRINCIPLES_ALIGNMENT.md)
- [Adapter Integration Guide](docs/ADAPTER_INTEGRATION_GUIDE.md)
- [Open Governance Charter](governance/CHARTER.md)

---

## License

Licensed under the [Apache License, Version 2.0](LICENSE).
