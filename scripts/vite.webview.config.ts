import path from 'path';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

const view = process.argv[6] ?? 'iconify';
const watch = process.argv[7] === '--watch';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    tsconfigPaths({
      projects: [path.resolve(__dirname, '../tsconfig.json')],
    }),
  ],

  build: {
    watch: watch ? {} : undefined,
    minify: false,
    outDir: path.resolve(__dirname, '../out'),
    emptyOutDir: false,
    sourcemap: true,
    lib: {
      name: `${view}WebView`,
      entry: {
        [`${view}WebView`]: path.resolve(__dirname, `../src/${view}WebView/main.ts`),
      },
      formats: ['iife'],
      fileName: () => `${view}WebView.js`,
    },
    rollupOptions: {
      output: {
        assetFileNames(chunkInfo) {
          if (chunkInfo.name === 'style.css') return `${view}WebView.css`;
          return '';
        },
      },
    },
  },
});
