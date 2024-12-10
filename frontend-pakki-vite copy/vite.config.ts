import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    assetsDir: '',
    // Enable this to disable errors and warnings that cause build to stop
    minify: false, // Optionally disable minification
    sourcemap: false, // Disable source maps if they are causing issues
    rollupOptions: {
      onwarn(warning, warn) {
        // Ignore specific warnings by type or message
        if (warning.code === 'UNUSED_EXTERNAL') {
          // Ignore unused external dependency warnings
          return;
        }
        warn(warning); // Log other warnings normally
      }
    }
  },
  server: {
    open: true,
  },
  base: '/',
});

