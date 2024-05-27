import path from 'path';
import { builtinModules } from 'module';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

const watch = process.argv[6] === '--watch';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    // HtmlImportPlugin,
    tsconfigPaths({
      projects: [path.resolve(__dirname, '../tsconfig.json')],
    }),
  ],

  build: {
    watch: watch ? {} : undefined,
    minify: watch ? false : true,
    outDir: path.resolve(__dirname, '../out'),
    emptyOutDir: false,
    sourcemap: watch ? true : false,
    lib: {
      fileName: () => 'extension.cjs',
      entry: path.resolve(__dirname, `../src/extension.ts`),
      formats: ['cjs'],
    },
    rollupOptions: {
      external: ['vscode', ...builtinModules],
    },
  },
});
