import { Capacitor } from '@capacitor/core';

/**
 * Accurately determines if the app is currently running inside the installed native APK
 * or as an installed standalone PWA.
 */
export function isAppInstalledOrNative(): boolean {
  if (typeof window === 'undefined') return true; // Default to true on SSR to avoid flash

  try {
    // 1. Capacitor native check
    if (Capacitor.isNativePlatform()) return true;
    if (Capacitor.getPlatform() !== 'web') return true;

    // 2. Window protocol/host checks in Android WebView
    if (window.location.protocol === 'capacitor:' || window.location.protocol === 'ionic:') {
      return true;
    }

    // 3. User agent check for Capacitor Android
    if (typeof navigator !== 'undefined' && /capacitor/i.test(navigator.userAgent)) {
      return true;
    }

    // 4. Standalone display mode (installed PWA)
    if (typeof window.matchMedia === 'function' && window.matchMedia('(display-mode: standalone)').matches) {
      return true;
    }

    if (typeof navigator !== 'undefined' && (navigator as any).standalone === true) {
      return true;
    }

    // 5. Dismissed / installed flag
    if (localStorage.getItem('tedlist_apk_installed') === 'true') {
      return true;
    }
  } catch {
    // fallback
  }

  return false;
}
