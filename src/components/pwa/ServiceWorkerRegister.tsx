'use client';

import { useEffect } from 'react';
import { isNativeApk } from '@/lib/platform';

export function ServiceWorkerRegister() {
  useEffect(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return;

    // Inside native Android / Capacitor APK: NEVER use Service Worker.
    // Clean up and unregister any lingering service worker registrations from previous installs/tests.
    if (isNativeApk() || process.env.NODE_ENV !== 'production') {
      navigator.serviceWorker
        .getRegistrations()
        .then((registrations) => {
          for (const reg of registrations) {
            reg.unregister();
          }
        })
        .catch(() => {});
      return;
    }

    // Web PWA only
    const registerSW = () => {
      navigator.serviceWorker
        .register('/sw.js')
        .then((reg) => {
          console.log('tedlist ServiceWorker registered with scope: ', reg.scope);
        })
        .catch((err) => {
          console.log('tedlist ServiceWorker registration failed: ', err);
        });
    };

    if (document.readyState === 'complete') {
      registerSW();
    } else {
      window.addEventListener('load', registerSW);
      return () => window.removeEventListener('load', registerSW);
    }
  }, []);

  return null;
}
