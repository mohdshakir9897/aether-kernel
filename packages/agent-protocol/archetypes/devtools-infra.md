# Archetype: Developer Tools & Systems Infrastructure (`devtools-infra`)

## Target Environment
- **Operators**: Systems engineers, SREs, kernel developers.
- **Physical Context**: High-resolution multi-monitor desktop (65cm viewing distance), dark mode standard, prolonged continuous work sessions (6-12 hours).

## Typographic Grammar
- **Font Stack**: `ui-monospace, "SF Mono", "JetBrains Mono", Menlo, Consolas, monospace`
- **Scale**: Compact 13px base body, tabular figures (`font-variant-numeric: tabular-nums`).
- **APCA Requirement**: Minimum $|L_c| \ge 75$ across all code blocks and log outputs.

## Layout & Affordances
- **Density**: Ultra-dense. Tight row padding (`py-1`, `px-2.5`).
- **Borders**: Sharp 1px hairline borders (`border-neutral-800`), minimal border-radius (`rounded-sm`).
- **Telemetry Elements**: P99 latencies, memory allocations (MB/s), trace IDs, active socket states.
- **Prohibited**: Saturated decorative gradients, floating pills, marketing placeholders.
