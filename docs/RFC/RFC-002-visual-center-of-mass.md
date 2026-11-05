# RFC-002: Visual Center of Mass (VCoM) Vector Physics

- **Status**: Accepted / Implemented
- **Authors**: Aether Perceptual Physics Working Group
- **Target**: `@aether-ui/core-kernel`, `@aether-ui/browser-inspector`

## Context
AI-generated frontends almost invariably produce center-aligned, symmetrical stacks:
```
[ Centered Pill Badge ]
[ Giant Centered H1 ]
[ Centered 2-line Subtitle ]
[ Centered Twin Primary Buttons ]
```
This causes an unnaturally static visual gravity that lacks intentional focal guidance, causing ocular drift and reading inertia. In contrast, master human typography and architectural layout employ deliberate tension, visual asymmetry, and dynamic balance across the optical axis.

## Decision
Define the **Visual Center of Mass (VCoM)** of any viewport or DOM container as:
$$\vec{R}_{\text{VCoM}} = \frac{\sum_{i=1}^N m_i \cdot \vec{r}_i}{\sum_{i=1}^N m_i}$$
where each DOM element node $i$ carries a calculated visual mass $m_i$:
$$m_i = \text{Area}_i \cdot (\Delta L_i)^{\alpha} \cdot (1 + \beta \cdot \text{EdgeDensity}_i)$$
and $\vec{r}_i = (x_i, y_i)$ is the centroid coordinates of element $i$.

The system enforces:
1. **Dynamic Asymmetry**: Reject pure dead-center balance ($\|\vec{R}_{\text{VCoM}} - \vec{R}_{\text{GeometricCenter}}\| < \epsilon$) when natural content hierarchy requires directional flow.
2. **Anchor Stability**: Ensure intentional focal anchors align with golden-ratio ($\phi \approx 1.618$) sub-divisions.
