/**
 * Browser Inspector: Live APCA Contrast & Ocular Strain Overlay
 */

export function injectAPCAOverlay(): void {
  const textElements = Array.from(document.querySelectorAll('p, span, h1, h2, h3, h4, h5, h6, a, button, label'));

  for (const el of textElements) {
    const style = window.getComputedStyle(el);
    const color = style.color;
    // Highlight elements with high opacity or suspect low-contrast inline indicator
    if (style.opacity && parseFloat(style.opacity) < 0.6) {
      (el as HTMLElement).style.outline = '1px dashed #eab308';
      (el as HTMLElement).title = 'Aether Warning: Reduced opacity risks APCA contrast failure';
    }
  }
}
