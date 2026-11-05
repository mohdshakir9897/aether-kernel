# Archetype: Industrial Telemetry & SCADA (`industrial-telemetry`)

## Target Environment
- **Operators**: Power grid dispatchers, refinery operators, robotics supervisors.
- **Physical Context**: Wall-mounted monitors or ruggedized consoles (100-250cm viewing distance), variable lighting.

## Typographic Grammar
- **Font Stack**: Clean, legible grotesques (`"Inter", system-ui, sans-serif`).
- **Scale**: Large high-visibility numerals (24-48px), high stroke weight.
- **APCA Requirement**: Minimum $|L_c| \ge 85$ across all telemetry gauges.

## Layout & Affordances
- **Glanceability**: Status-driven hierarchy (Normal, Warning, Fault, Emergency).
- **Alarm States**: Instant visual pop for abnormal telemetry, neutral quiet background when nominal.
- **Prohibited**: Any distracting ambient CSS animations, pulses, or decorative blur gradients.
