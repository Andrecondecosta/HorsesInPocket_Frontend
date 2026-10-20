import { fileURLToPath, URL } from 'node:url';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

const SRC_DIR = fileURLToPath(new URL('./src/', import.meta.url));
const UI_CSS = fileURLToPath(new URL('./src/ui.css', import.meta.url));

// Põe o CSS antigo de src/ na camada "legacy", a de menor prioridade (ver a ordem
// das camadas em src/ui.css). Assim as regras globais antigas (ex.: `button {}`)
// não passam por cima dos componentes do novo design, e os ecrãs antigos ficam iguais.
const legacyCssLayer = {
  postcssPlugin: 'horsehub-legacy-layer',
  Once(root, { AtRule }) {
    const file = root.source?.input.file;
    if (!file || !file.startsWith(SRC_DIR) || file === UI_CSS) return;

    // @import e @charset têm de ficar no topo, fora da camada
    const movable = root.nodes.filter(
      (node) => !(node.type === 'atrule' && (node.name === 'import' || node.name === 'charset'))
    );
    // Ficheiro vazio (ou só com @import): nada a envolver
    if (!movable.some((node) => node.type !== 'comment')) return;

    const layer = new AtRule({ name: 'layer', params: 'legacy', nodes: [] });
    movable.forEach((node) => layer.append(node.remove()));
    root.append(layer);
  },
};

export default defineConfig(({ mode }) => {
  // Mantém os nomes REACT_APP_* do Create React App, para não mexer no código
  // nem nas variáveis definidas no alojamento
  const env = loadEnv(mode, process.cwd(), 'REACT_APP_');

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      // "@/..." aponta para src/ (convenção do shadcn/ui: @/components/ui, @/lib/utils)
      alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
    },
    define: {
      'process.env.REACT_APP_API_SERVER_URL': JSON.stringify(env.REACT_APP_API_SERVER_URL),
      'process.env.REACT_APP_STRIPE_PUBLIC_KEY': JSON.stringify(env.REACT_APP_STRIPE_PUBLIC_KEY),
      'process.env.PUBLIC_URL': JSON.stringify(''),
    },
    css: {
      postcss: { plugins: [legacyCssLayer] },
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
