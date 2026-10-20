import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Mantém os nomes REACT_APP_* do Create React App, para não mexer no código
  // nem nas variáveis definidas no alojamento
  const env = loadEnv(mode, process.cwd(), 'REACT_APP_');

  return {
    plugins: [react()],
    define: {
      'process.env.REACT_APP_API_SERVER_URL': JSON.stringify(env.REACT_APP_API_SERVER_URL),
      'process.env.REACT_APP_STRIPE_PUBLIC_KEY': JSON.stringify(env.REACT_APP_STRIPE_PUBLIC_KEY),
      'process.env.PUBLIC_URL': JSON.stringify(''),
    },
    build: {
      // O Capacitor (webDir) e o alojamento esperam a pasta build/
      outDir: 'build',
    },
    server: {
      // A porta 3000 fica livre para o backend local (REACT_APP_API_SERVER_URL)
      port: 3001,
    },
    test: {
      environment: 'jsdom',
      globals: true,
      setupFiles: './src/setupTests.js',
    },
  };
});
