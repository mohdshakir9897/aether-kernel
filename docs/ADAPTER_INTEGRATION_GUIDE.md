# Aether Adapter Integration Guide

This guide describes how to integrate the Aether protocol and anti-convergence rules into any autonomous coding agent, IDE environment, or web generative model.

---

## 1. Architecture of an Aether Adapter

An Aether Adapter bridges an AI developer tool's context window with the Aether Perceptual System:

```
[ Developer Prompt ]
         │
         ▼
[ Aether Adapter Injection ] ───▶ Injects Gate 1 (Socratic Friction) & Gate 2 (Tokens)
         │
         ▼
[ LLM Generation Pipeline ]
         │
         ▼
[ Pre-Flight AST Critic ] ───▶ Scans for AETHER-001..005
         │
  Pass? ─┴─ Fail? ──▶ [ Automated Rewriter / Self-Healing Loop ]
         │
         ▼
[ Clean, Ergonomic, Post-Cliché Code ]
```

---

## 2. Implementing an IDE Adapter
For tools like Cursor, Windsurf, or GitHub Copilot:
1. Place the adapter file at workspace root:
   - Cursor: `.cursorrules`
   - Windsurf: `.windsurfrules`
   - GitHub Copilot: `.github/copilot-instructions.md`
2. Include the master directives:
   - Prohibit floating pill badges (`AETHER-001`)
   - Prohibit decorative blur blobs (`AETHER-002`)
   - Enforce asymmetric golden grids (`AETHER-003`)
   - Replace marketing buzzwords with verifiable operational telemetry (`AETHER-004`)
   - Enforce APCA contrast validation (`AETHER-005`)

---

## 3. Implementing an Autonomous Daemon Adapter
For background agents like Google Antigravity, Aider, Cline, or Claude Code:
- Use tool call hooks or pre-commit hooks to invoke `aether audit --staged --fix` automatically before committing or returning the task to the operator.
- Example `antigravity.json`:
```json
{
  "name": "aether-guard",
  "version": "1.0.0",
  "hooks": {
    "post_file_write": "node packages/cli/dist/bin/aether.js audit --fix"
  }
}
```

---

## 4. Testing Adapter Conformance
Verify your adapter using the conformance runner:
```bash
pnpm benchmark
```
