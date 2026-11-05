# Gate 2: Mathematical Token Declaration

## Mandate
You must mathematically derive all color and spatial tokens using perceptual physics models prior to assembling components.

---

## 1. Color Token Construction (OKLCH)
- Anchor your design around a single primary hue angle $\theta_0 \in [0, 360^\circ]$.
- Restrict average surface chroma to $C \le 0.04$ to prevent retinal fatigue.
- Avoid saturated purple ($\approx 290^\circ$) paired with saturated cyan ($\approx 180^\circ$) to eliminate chromostereopsis.
- Guarantee APCA contrast thresholds:
  - Body text: $|L_c| \ge 60$
  - Numerical telemetry / Monospace code: $|L_c| \ge 75$
  - Hairline borders: $|L_c| \ge 20$

## 2. Spatial Scale Construction (Fibonacci / $\phi \approx 1.618$)
Construct spacing and sizing using the non-linear golden scale based on your base unit $S_0$ (typically 16px):
- `scale-xs`: $\approx 6\text{px}$ ($S_0 / \phi^2$)
- `scale-sm`: $\approx 10\text{px}$ ($S_0 / \phi$)
- `scale-md`: $16\text{px}$ ($S_0$)
- `scale-lg`: $\approx 26\text{px}$ ($S_0 \cdot \phi$)
- `scale-xl`: $\approx 42\text{px}$ ($S_0 \cdot \phi^2$)
- `scale-2xl`: $\approx 68\text{px}$ ($S_0 \cdot \phi^3$)
