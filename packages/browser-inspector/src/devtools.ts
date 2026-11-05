/**
 * Browser Inspector: DevTools Panel Registration
 */

declare const chrome: any;

if (typeof chrome !== 'undefined' && chrome.devtools) {
  chrome.devtools.panels.create(
    'Aether Perceptual Physics',
    'icons/icon16.png',
    'src/devtools.html',
    (panel: any) => {
      console.log('Aether UI DevTools panel initialized', panel);
    }
  );
}
