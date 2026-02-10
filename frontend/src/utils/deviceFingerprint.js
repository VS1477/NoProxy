/**
 * Generate a simple device fingerprint from browser/device info.
 * Used to detect multiple accounts from same device.
 */
export function getDeviceFingerprint() {
  const nav = navigator;
  const screen = window.screen;
  const parts = [
    nav.userAgent,
    nav.language,
    screen.width,
    screen.height,
    screen.colorDepth,
    new Date().getTimezoneOffset(),
    nav.hardwareConcurrency || 0,
    nav.platform
  ].join('|');
  let hash = 0;
  for (let i = 0; i < parts.length; i++) {
    const c = parts.charCodeAt(i);
    hash = ((hash << 5) - hash) + c;
    hash = hash & hash;
  }
  return 'fp_' + Math.abs(hash).toString(36);
}
