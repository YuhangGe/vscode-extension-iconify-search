import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tsconfigPaths from 'vite-tsconfig-paths';

const view = process.argv[6] ?? 'iconify';
const watch = process.argv[7] === '--watch';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths({
      projects: [path.resolve(__dirname, '../tsconfig.json')],
    }),
  ],
  define: {
    'process.env.NODE_ENV': JSON.stringify(watch ? 'development' : 'production'),
  },
  root: path.resolve(__dirname, '../src/iconifyWebView'),
  build: {
    watch: watch ? {} : undefined,
    minify: watch ? false : true,

    outDir: path.resolve(__dirname, '../out'),
    emptyOutDir: false,
    sourcemap: watch ? true : false,
    lib: {
      name: `${view}WebView`,
      entry: {
        [`${view}WebView`]: path.resolve(__dirname, `../src/${view}WebView/main.tsx`),
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
