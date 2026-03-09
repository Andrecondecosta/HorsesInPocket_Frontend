import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.horsehub.app',
  appName: 'HorseHub',
  webDir: 'build',
  plugins: {
    App: {
      appUrlOpen: {
        enabled: true
      }
    }
  }
};

export default config;
