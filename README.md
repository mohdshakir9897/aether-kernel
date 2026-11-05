# Aether Kernel (`aether-kernel`)
> **Deterministic Interface Compiler & Spatial Physics Kernel for AI Coding Agents**

[![CI Core Kernel](https://github.com/mohdshakir9897/aether-kernel/actions/workflows/ci-core-kernel.yml/badge.svg)](https://github.com/mohdshakir9897/aether-kernel/actions)
[![Conformance Benchmark](https://github.com/mohdshakir9897/aether-kernel/actions/workflows/conformance-benchmark.yml/badge.svg)](https://github.com/mohdshakir9897/aether-kernel/actions)
[![License: Apache-2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE)
[![APCA Verified](https://img.shields.io/badge/APCA-W3C%20Silver%20Compliant-emerald.svg)](docs/PERCEPTUAL_PHYSICS.md)
[![OKLCH Gamut](https://img.shields.io/badge/Color%20Space-OKLCH-f43f5e.svg)](docs/PERCEPTUAL_PHYSICS.md)

Aether Kernel is an open-source layout compiler and spatial verification engine designed to eradicate **Algorithmic Aesthetic Convergence** ("AI UI Slop"). It enforces mathematical color physics (OKLCH/APCA), spatial entropy thresholds (Shannon Entropy), and AST layout grammars across autonomous AI coding workflows (Cursor, Windsurf, Antigravity, Claude Code, Copilot).

---

## The Core Problem: Algorithmic Aesthetic Convergence

Generative LLMs sample code by maximizing token probability ($P(w_t \mid w_{<t})$). Because training sets are saturated with template-based frontend code, AI defaults to statistical medians:
- Centered hero layouts with floating pill badges
- Purple/violet decorative blur orbs (`blur-3xl bg-purple-500`)
- Homogeneous 3-column feature grids with rounded icon boxes
- Vacuous corporate buzzwords ("Supercharge your workflow")

Aether Kernel replaces statistical guesswork with **perceptual color math and layout thermodynamics**.

---

## Architecture Overview

```
[ User Intent / Workspace AST ]
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

---

## 📦 Monorepo Packages

| Package | Role | Key Capabilities |
|:--------|:-----|:-----------------|
| [`@aether-ui/core-kernel`](packages/core-kernel) | **Pure Math & Physics Engine** | APCA contrast ($L_c$), OKLCH palette derivation, Visual Center of Mass ($\vec{R}_{cm}$), golden grid ($\phi$), Shannon spatial layout entropy, rendered bounding box physics, telemetry context inference. |
| [`@aether-ui/ast-critic`](packages/ast-critic) | **AST Linter & Auto-Fixer** | Multi-framework parser (JSX, TSX, Vue, Svelte, Tailwind) detecting clichés `AETHER-001` through `005` with automated AST node recompilation and pixel evaluation. |
| [`@aether-ui/agent-protocol`](packages/agent-protocol) | **Universal Directives & Adapters** | Formal EBNF layout grammar (`layout-grammar.ebnf`), 4-Gate operational protocol, and adapters for Cursor, Windsurf, Copilot, Antigravity, Aider, Claude Code, Gemini, Grok, v0, and Bolt. |
| [`@aether-ui/cli`](packages/cli) | **Terminal & CI Enforcement** | `npx aether-kernel audit [path]`, `fix [path]`, `init`, and `compile-tokens`. |
| [`@aether-ui/browser-inspector`](packages/browser-inspector) | **DevTools Extension** | Chrome/Firefox extension projecting live VCoM heatmaps and APCA contrast overlays directly over the browser viewport. |
| [`benchmarks`](benchmarks) | **Research & Eval Suite** | Cosine similarity vectors & statistical distance benchmark measuring convergence across 1,000 AI sites vs human craft. |

---

## 📐 Mathematical Foundations

### 1. Accessible Perceptual Contrast Algorithm (APCA)
APCA models human cone photoreceptors using non-linear power-law transformations with polarity-specific exponents:
- **Positive Polarity (Dark on Light)**:
  $$S_{\text{bg}} = Y_{\text{bg}}^{0.56}, \quad S_{\text{txt}} = Y_{\text{txt}}^{0.62} \implies L_c = (S_{\text{bg}} - S_{\text{txt}}) \cdot 1.14154 \cdot 100$$
- **Negative Polarity (Light on Dark)**:
  $$S_{\text{bg}} = Y_{\text{bg}}^{0.65}, \quad S_{\text{txt}} = Y_{\text{txt}}^{0.57} \implies L_c = (S_{\text{bg}} - S_{\text{txt}}) \cdot 1.14154 \cdot 100$$

Mandatory contrast standards: $|L_c| \ge 60$ for standard body text, $|L_c| \ge 75$ for fine telemetry or code.

### 2. Rendered Spatial Physics & Mathematical Slop Discriminator
Given rendered element bounding boxes $\{B_i\}$, Aether evaluates layout thermodynamics:
- **Spatial Shannon Entropy**:
  $$H(X) = -\sum_{i=1}^N p_i \log_2(p_i), \quad p_i = \frac{\text{Area}_i}{\sum \text{Area}}$$
- **Visual Center of Mass (VCoM) & Horizontal Symmetry**:
  $$\bar{x}_{\text{VCoM}} = \frac{\sum x_i \cdot \text{Area}_i}{\sum \text{Area}_i}, \quad S = \max(0, 1 - 2|\bar{x} - 0.5|)$$
- **Slop Discriminator**:
  $$\text{isSlop} = \left(S > 0.94 \land H(X) < 1.8 \land N \ge 3\right)$$
- **Layout Energy Metric**:
  $$E = S + \frac{1}{H(X) + 0.01}$$

### 3. Formal Layout Grammar ([`layout-grammar.ebnf`](packages/agent-protocol/grammars/layout-grammar.ebnf))
Aether enforces an explicit Extended Backus-Naur Form (EBNF) grammar that structurally eliminates generic center stacks:

```ebnf
RootLayout ::= HeaderContainer PrimarySplitView FooterContainer
HeaderContainer ::= "<header " HeaderAttributes ">" (LeftAnchoredBrand NavList ContextualMetadata) "</header>"
PrimarySplitView ::= "<main class=\"grid " AsymmetricGridColumns " gap-6\">" PrimaryCanvas SecondaryPanel "</main>"

AsymmetricGridColumns ::= "grid-cols-1 lg:grid-cols-12" 
PrimaryCanvas ::= "<section class=\"lg:col-span-8\">" (InteractiveDataSurface | StructuralViewport) "</section>"
SecondaryPanel ::= "<aside class=\"lg:col-span-4\">" ContextualInspector "</aside>"
```

### 4. Telemetry Context Inference
The core kernel introspects workspace schemas without external dependencies:
- **Prisma**: Models (`model <Name> {`)
- **Drizzle**: Tables (`pgTable`, `sqliteTable`, `mysqlTable`)
- **OpenAPI / JSON Schema**: Entity definitions
- **Workspace Classifier**: Inferred domain (`high-precision-fintech`, `devtools-infra`, `editorial-luxury`, `general-b2b`) and density (`compact`, `balanced`, `editorial`).

---

## 🚀 Quickstart

### 1. Install & Run Audit
```bash
npx aether-kernel audit ./src --strict
```

### 2. Automatically Patch Layouts
Automatically refactor uniform grids, eliminate blur blobs, upgrade low-contrast tokens, and replace corporate buzzwords with domain-accurate metrics:
```bash
npx aether-kernel fix --file src/components/Hero.tsx
```

### 3. Initialize Agent Directives & Adapters
Inject `.cursorrules`, `.windsurfrules`, and `antigravity.json` into your local workspace:
```bash
npx aether-kernel init
```

### 4. Compile Perceptual OKLCH CSS Variables
Generate mathematically harmonious CSS design tokens anchored to an OKLCH hue angle:
```bash
npx aether-kernel compile-tokens --hue 220 --mode dark --out src/tokens.css
```

---

## 🛠️ CI & Conformance Verification

In `.github/workflows/ci-core-kernel.yml`, Aether executes hermetic verification:
```yaml
- name: Verify Human Benchmark Clean Pass
  run: node packages/cli/dist/bin/aether.js audit benchmarks/datasets/1000-award-human-sites/ --strict

- name: Verify AI Slop Benchmark Is Successfully Flagged
  run: |
    if node packages/cli/dist/bin/aether.js audit benchmarks/datasets/1000-ai-generated-sites/ --strict; then
      echo "Error: AI Slop sample passed audit! Detector failed."
      exit 1
    else
      echo "Success: AI Slop sample correctly flagged and blocked by Aether Kernel."
    fi
```

---

## 🛡️ Governance & Ethical Alignment

- **Charter**: Formulated under the [Aether Open Governance Board](governance/CHARTER.md) (MIT CSAIL, Google AI Principles, W3C Silver contributors).
- **Ethics & Safety**: Strict adherence to the [Ethics & Ergonomic Safety Policy](governance/ETHICS_SAFETY_POLICY.md).
- **Google AI Principles**: Explicit mapping across Fairness, Safety, Accountability, and Scientific Excellence detailed in [AI_PRINCIPLES_ALIGNMENT.md](docs/AI_PRINCIPLES_ALIGNMENT.md).

---

## 📜 License

Licensed under the Apache License, Version 2.0. See [LICENSE](LICENSE) for details.
