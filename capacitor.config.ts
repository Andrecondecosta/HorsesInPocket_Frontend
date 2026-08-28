import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.horsehub.app',
  appName: 'HorseHub',
  webDir: 'build',
  server: {
    androidScheme: 'https',
    hostname: 'localhost'
  },
  plugins: {
    PushNotifications: {
      presentationOptions: ['badge', 'sound', 'alert']
    }
  }
};

export default config;
