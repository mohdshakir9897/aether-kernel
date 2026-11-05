# RFC-001: Perceptual Color Spaces (OKLCH) & Contrast Verification (APCA)

- **Status**: Accepted / Implemented
- **Authors**: Aether Perceptual Physics Working Group
- **Target**: `@aether-kernel/core-kernel`

## Context
Legacy web design systems rely on sRGB or HSL color spaces and WCAG 2.1 relative luminance math ($CR = \frac{L_1 + 0.05}{L_2 + 0.05}$). WCAG 2.1 fails drastically with dark modes, saturated pure blues, and high-spatial-frequency typography because human lightness perception is non-linear and asymmetrical between dark-on-light and light-on-dark polarities.

Furthermore, generative models continuously hallucinate uncalibrated hex colors like `#a855f7` (purple) and `#06b6d4` (cyan) in hero banners without verifying visual legibility.

## Decision
1. Standardize all internal token calculations on the **OKLCH** color space (Lightness $L \in [0, 1]$, Chroma $C \in [0, 0.4]$, Hue $H \in [0, 360^\circ]$).
2. Mandate the **Accessible Perceptual Contrast Algorithm (APCA)** (W3C Silver / WCAG 3 Candidate) as the mathematical ground truth for text and UI element legibility.
3. Compute Lightness contrast $L_c$ considering:
   - Polarity (dark mode vs light mode power law adaptation)
   - Spatial frequency of the glyph (font weight $\times$ font size)
   - Soft clipping around dark thresholds to prevent false contrast spikes.

## Mathematical Formulation
Luminance $Y$ is derived via sRGB gamma expansion:
$$Y = 0.2126729 \cdot R^{2.4} + 0.7151522 \cdot G^{2.4} + 0.0721750 \cdot B^{2.4}$$
Perceptual lightness contrast $L_c$ is calculated using APCA non-linear power-law transformations with polarity-specific exponents $\gamma_{txt}, \gamma_{bg}$.
