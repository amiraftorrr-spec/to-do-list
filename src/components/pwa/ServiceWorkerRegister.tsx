'use client';

import { useEffect } from 'react';

export function ServiceWorkerRegister() {
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      if (process.env.NODE_ENV !== 'production') {
        navigator.serviceWorker.getRegistrations().then((registrations) => {
          for (const reg of registrations) {
            reg.unregister();
          }
        });
        return;
      }

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
    }
  }, []);

  return null;
}
