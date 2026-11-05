# Gate 3: Asymmetrical Layout Grammar & Visual Tension

## Mandate
Break free from the symmetrical, center-stacked vertical monolith. Human cognitive architecture processes structured asymmetric tension with higher retention and less ocular fatigue.

---

## 1. Visual Center of Mass (VCoM) Calibration
- Do NOT place the visual center of mass at dead center $(\|\vec{T}\| = 0)$.
- Target an intentional dynamic balance offset of $0.08 \le \|\vec{T}\| \le 0.35$.
- Ground high-frequency elements (controls, tables, search bars) with deliberate counterweights.

## 2. Asymmetric Grid Partitions
Never use equal-width homogeneous cards (`1:1:1` or `grid-cols-3`):
- **Hero & Primary Panes**: Use the golden split `grid-cols-[1.618fr_1fr]` (61.8% primary narrative, 38.2% interactive live instrument).
- **Telemetry & Logs**: Use `grid-cols-[1fr_1.618fr]` (38.2% system metrics, 61.8% streaming event ledger).
- **Master-Detail**: Split on `minmax(280px, 1fr) minmax(0, 1.618fr)`.
