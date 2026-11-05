# Perceptual Physics: Mathematical Proofs & Formalisms

This document details the mathematical models and physics engines implemented in `@aether-kernel/core-kernel`.

---

## 1. Accessible Perceptual Contrast Algorithm (APCA)

The APCA model computes perceptual lightness contrast $L_c$ based on human psychophysics, taking into account non-linear rod and cone responses, spatial frequency, and polarity.

### 1.1 Linear Luminance Derivation
For an sRGB color with channel values $R, G, B \in [0, 255]$:
1. Normalize channels to $r_s, g_s, b_s \in [0, 1]$.
2. Apply the sRGB linearization power-law expansion:
   $$V_{\text{lin}} = \begin{cases} \frac{V_s}{12.92} & \text{if } V_s \le 0.04045 \\ \left(\frac{V_s + 0.055}{1.055}\right)^{2.4} & \text{if } V_s > 0.04045 \end{cases}$$
3. Spectral weighting for CIE 1931 standard 2° photopic luminous efficiency:
   $$Y = 0.2126729 \cdot R_{\text{lin}} + 0.7151522 \cdot G_{\text{lin}} + 0.0721750 \cdot B_{\text{lin}}$$

### 1.2 Soft Clipping for Deep Shadows
To account for dark adaptation thresholds and flare (veiling glare), luminances are adjusted:
$$Y_{\text{clamped}} = \begin{cases} Y & \text{if } Y \ge 0.022 \\ Y + (0.022 - Y)^{1.414} & \text{if } Y < 0.022 \end{cases}$$

### 1.3 Polarity-Dependent Lightness Contrast $L_c$
- **Positive Polarity (Dark text on Light background, $Y_{\text{bg}} > Y_{\text{txt}}$)**:
  $$S_{\text{bg}} = Y_{\text{bg}}^{0.56}, \quad S_{\text{txt}} = Y_{\text{txt}}^{0.62}$$
  $$L_c = (S_{\text{bg}} - S_{\text{txt}}) \cdot 1.14154 \cdot 100$$
- **Negative Polarity (Light text on Dark background, $Y_{\text{txt}} \ge Y_{\text{bg}}$)**:
  $$S_{\text{bg}} = Y_{\text{bg}}^{0.65}, \quad S_{\text{txt}} = Y_{\text{txt}}^{0.57}$$
  $$L_c = (S_{\text{bg}} - S_{\text{txt}}) \cdot 1.14154 \cdot 100$$

Aether mandates $|L_c| \ge 60$ for standard body text and $|L_c| \ge 75$ for fine telemetry or code.

---

## 2. Visual Center of Mass (VCoM) Vector Physics

The visual weight of a viewport is treated as a two-dimensional mechanical system of distributed mass.

$$\vec{R}_{\text{VCoM}} = \frac{1}{M_{\text{total}}} \sum_{i=1}^{N} m_i \begin{bmatrix} x_i \\ y_i \end{bmatrix}, \quad M_{\text{total}} = \sum_{i=1}^N m_i$$

### 2.1 Node Visual Mass $m_i$
The visual mass of element $i$ is calculated from area $A_i$, luminance difference against local canvas $\Delta L_i = |L_{\text{element}} - L_{\text{canvas}}|$, and structural high-frequency content (edge density $\kappa_i$):
$$m_i = A_i \cdot (\Delta L_i)^{1.25} \cdot (1.0 + 0.4 \cdot \kappa_i)$$

### 2.2 Visual Tension Vector $\vec{T}$
Visual tension quantifies the intentional dynamic offset from the geometric center of the viewport $(W/2, H/2)$:
$$\vec{T} = \begin{bmatrix} \frac{x_{\text{VCoM}} - W/2}{W/2} \\ \frac{y_{\text{VCoM}} - H/2}{H/2} \end{bmatrix}$$

An interface with $\|\vec{T}\| = 0$ is completely static (symmetrical center-stack cliché). Aether encourages intentional dynamic balance with $0.08 \le \|\vec{T}\| \le 0.32$.

---

## 3. Golden Ratio Fibonacci Spatial Grammar

Rather than arbitrary 8px or uniform 12-column subdivisions, Aether derives layout dimensions using the golden section:
$$\phi = \frac{1 + \sqrt{5}}{2} \approx 1.6180339887...$$

Given a container width $W$, the primary asymmetric partition yields:
$$W_{\text{major}} = \frac{W}{\phi} \approx 0.618 \cdot W, \quad W_{\text{minor}} = W - W_{\text{major}} \approx 0.382 \cdot W$$

Iterating this section generates harmonic modular spacing scales:
$$S_n = S_0 \cdot \phi^{(n/2)}$$

---

## 4. Shannon Spatial Layout Entropy

The degree of informational disorder in a layout is computed via spatial Shannon entropy:
$$H(X) = - \sum_{k=1}^K p_k \log_2(p_k)$$
where $p_k$ is the normalized visual mass density in spatial sector $k$. AI-generated layouts that cram identical card clones into every grid cell exhibit artificially low entropy variance, failing human ergonomic scanning requirements.
