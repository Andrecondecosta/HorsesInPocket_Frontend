import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.horsehub.app',
  appName: 'HorseHub',
  webDir: 'build',
  server: {
    androidScheme: 'https',
    cleartext: true,
    allowNavigation: [
      'horsesinpocket-backend-2.onrender.com',
      'res.cloudinary.com',
      'images.unsplash.com'
    ]
  },
  android: {
    allowMixedContent: true,
    captureInput: true,
    webContentsDebuggingEnabled: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#ffffff",
      showSpinner: false
    }
  }
};

export default config;
