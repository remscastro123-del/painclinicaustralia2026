import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Builds the React islands into assets/react/ as a plain <script type="module">.
// The nine static HTML pages stay exactly as they are.
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'assets/react',
    emptyOutDir: true,
    manifest: false,
    rollupOptions: {
      input: 'src/main.jsx',
      output: {
        entryFileNames: 'islands.js',
        chunkFileNames: 'islands-[name].js',
        assetFileNames: 'islands[extname]',
      },
    },
  },
});
