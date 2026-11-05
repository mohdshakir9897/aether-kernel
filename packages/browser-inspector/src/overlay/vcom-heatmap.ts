/**
 * Browser Inspector: Visual Center of Mass (VCoM) Live Heatmap Overlay
 */

export function injectVCoMOverlay(): void {
  const existing = document.getElementById('aether-vcom-canvas');
  if (existing) existing.remove();

  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.id = 'aether-vcom-canvas';
  svg.style.position = 'fixed';
  svg.style.top = '0';
  svg.style.left = '0';
  svg.style.width = '100vw';
  svg.style.height = '100vh';
  svg.style.pointerEvents = 'none';
  svg.style.zIndex = '999999';

  const w = window.innerWidth;
  const h = window.innerHeight;
  const geomX = w / 2;
  const geomY = h / 2;

  // Scan visible DOM elements to compute live VCoM
  const elements = Array.from(document.querySelectorAll('h1, h2, h3, p, button, a, img, svg, [role="button"]'));
  let totalMass = 0;
  let weightedX = 0;
  let weightedY = 0;

  for (const el of elements) {
    const rect = el.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0 && rect.top < h && rect.bottom > 0) {
      const area = rect.width * rect.height;
      const mass = Math.sqrt(area); // Optical mass estimate
      totalMass += mass;
      weightedX += mass * (rect.left + rect.width / 2);
      weightedY += mass * (rect.top + rect.height / 2);
    }
  }

  const vcomX = totalMass > 0 ? weightedX / totalMass : geomX;
  const vcomY = totalMass > 0 ? weightedY / totalMass : geomY;

  // Draw Geometric Center Anchor
  const centerCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  centerCircle.setAttribute('cx', String(geomX));
  centerCircle.setAttribute('cy', String(geomY));
  centerCircle.setAttribute('r', '6');
  centerCircle.setAttribute('fill', 'rgba(255, 255, 255, 0.4)');
  centerCircle.setAttribute('stroke', '#000');
  centerCircle.setAttribute('stroke-width', '1.5');
  svg.appendChild(centerCircle);

  // Draw Tension Vector Line
  const tensionLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  tensionLine.setAttribute('x1', String(geomX));
  tensionLine.setAttribute('y1', String(geomY));
  tensionLine.setAttribute('x2', String(vcomX));
  tensionLine.setAttribute('y2', String(vcomY));
  tensionLine.setAttribute('stroke', '#f43f5e');
  tensionLine.setAttribute('stroke-width', '2');
  tensionLine.setAttribute('stroke-dasharray', '4 2');
  svg.appendChild(tensionLine);

  // Draw VCoM Centroid
  const vcomCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  vcomCircle.setAttribute('cx', String(vcomX));
  vcomCircle.setAttribute('cy', String(vcomY));
  vcomCircle.setAttribute('r', '10');
  vcomCircle.setAttribute('fill', 'rgba(244, 63, 94, 0.85)');
  vcomCircle.setAttribute('stroke', '#ffffff');
  vcomCircle.setAttribute('stroke-width', '2');
  svg.appendChild(vcomCircle);

  document.body.appendChild(svg);
}
