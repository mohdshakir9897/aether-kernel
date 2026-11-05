---
name: Bug Report
about: Report a defect in perceptual calculation, AST parsing, or CLI execution
title: "[BUG]: "
labels: ["bug", "triage"]
assignees: []
---

## Summary
A clear and concise description of what the bug is.

## Package Affected
- [ ] `@aether-kernel/core-kernel` (APCA, VCoM, chromatic budget, golden grid)
- [ ] `@aether-kernel/ast-critic` (AST parsing, rules, fixer)
- [ ] `@aether-kernel/agent-protocol` (Directives, adapters, prompt templates)
- [ ] `@aether-kernel/cli` (CLI commands, audit, fix, compile-tokens)
- [ ] `@aether-kernel/browser-inspector` (Extension, VCoM overlay, APCA HUD)

## Reproduction Steps
1. Execute command: `...`
2. Input source markup / AST:
```html
<!-- snippet here -->
```
3. Observed behavior:
4. Expected physical / perceptual outcome (with APCA $L_c$ or VCoM vector offset if applicable):

## Environment
- OS: [e.g. Linux, macOS, Windows]
- Node version: [e.g. 22.x, 24.x]
- Aether version: [e.g. 1.0.0]

## Perceptual Mathematics / Logs
Include any relevant calculated contrast metrics, token values, or stack traces.
