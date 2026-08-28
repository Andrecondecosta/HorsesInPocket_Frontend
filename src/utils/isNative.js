import { Capacitor } from '@capacitor/core';

/**
 * Returns true when running as a native iOS app (Capacitor).
 * Use this to hide payments/Stripe UI for App Store compliance.
 */
export const isNativeiOS = () =>
  Capacitor.isNativePlatform() && Capacitor.getPlatform() === 'ios';
