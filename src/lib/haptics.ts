import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';

/**
 * Robust haptics helper that works seamlessly on Capacitor native Android/iOS
 * and gracefully falls back to the browser navigator.vibrate API on mobile web/PWA.
 */
export async function triggerHaptic(
  type: 'light' | 'medium' | 'heavy' | 'success' | 'selection' = 'light'
): Promise<void> {
  // Only trigger on client
  if (typeof window === 'undefined') return;

  try {
    if (type === 'success') {
      await Haptics.notification({ type: NotificationType.Success });
      return;
    }

    if (type === 'selection') {
      await Haptics.selectionChanged();
      return;
    }

    const styleMap = {
      light: ImpactStyle.Light,
      medium: ImpactStyle.Medium,
      heavy: ImpactStyle.Heavy,
    };

    await Haptics.impact({ style: styleMap[type] || ImpactStyle.Light });
  } catch {
    // Fallback for mobile browsers supporting navigator.vibrate
    try {
      if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        if (type === 'success') {
          navigator.vibrate([25, 40, 25]);
        } else if (type === 'medium' || type === 'heavy') {
          navigator.vibrate(25);
        } else {
          navigator.vibrate(12);
        }
      }
    } catch {
      // Ignore vibration errors on unsupported platforms
    }
  }
}
