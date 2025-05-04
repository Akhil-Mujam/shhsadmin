import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist', // Ensure the build output is in `dist`
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:9090', // Your Spring Boot server
        changeOrigin: true,
        secure: false,
      },
    },
    port: 3000, // Match Railway's default
  },
});
