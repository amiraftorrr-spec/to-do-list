import { Capacitor } from '@capacitor/core';

/**
 * Accurately determines if the app is running as a compiled native Android / iOS app.
 * Returns false on web browsers (desktop Chrome, mobile Safari, etc.).
 */
export function isNativeApk(): boolean {
  if (typeof window === 'undefined') return false;

  try {
    if (Capacitor.isNativePlatform()) return true;
    const platform = Capacitor.getPlatform();
    if (platform === 'android' || platform === 'ios') return true;

    if (window.location.protocol === 'capacitor:' || window.location.protocol === 'ionic:') {
      return true;
    }

    if (typeof navigator !== 'undefined' && /capacitor/i.test(navigator.userAgent)) {
      return true;
    }
  } catch {
    return false;
  }

  return false;
}

/**
 * Determines if the app is installed either as a native APK or as an installed standalone PWA.
 */
export function isAppInstalledOrNative(): boolean {
  if (typeof window === 'undefined') return false;

  if (isNativeApk()) return true;

  try {
    if (typeof window.matchMedia === 'function' && window.matchMedia('(display-mode: standalone)').matches) {
      return true;
    }

    if (typeof navigator !== 'undefined' && (navigator as any).standalone === true) {
      return true;
    }
  } catch {
    return false;
  }

  return false;
}
