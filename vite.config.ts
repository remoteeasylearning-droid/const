import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

const entryBridgePlugin = {
  name: 'github-pages-entry-bridge',
  enforce: 'pre' as const,
  transformIndexHtml: {
    order: 'pre' as const,
    handler(html: string) {
      return html
        .replace(/<link\s+rel="stylesheet"\s+crossorigin\s+href="\.\/assets\/index\.css">/g, '')
        .replace(/<script\s+type="module"\s+crossorigin\s+src="\.\/assets\/index\.js"><\/script>/g, '<script type="module" src="/src/main.tsx"></script>');
    },
  },
};

export default defineConfig(() => {
  return {
    base: './',
    plugins: [entryBridgePlugin, react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    build: {
      rollupOptions: {
        output: {
          entryFileNames: 'assets/index.js',
          chunkFileNames: 'assets/[name].js',
          assetFileNames: (assetInfo) => {
            if (assetInfo.name && assetInfo.name.endsWith('.css')) {
              return 'assets/index.css';
            }
            return 'assets/[name].[ext]';
          },
        },
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
