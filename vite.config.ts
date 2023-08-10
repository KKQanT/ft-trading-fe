import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import inject from "@rollup/plugin-inject";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    'process.env.ANCHOR_BROWSER': true
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    }
  },
  build: {
    rollupOptions: {
      plugins: [inject({Buffer:["buffer", "Buffer"]})],
    }
  }
  
})
