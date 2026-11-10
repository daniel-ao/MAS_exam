import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: process.env.NODE_ENV === 'production' ? '/MAS_exam/' : '/',
  plugins: [react()],
  server: {
    port: 5173,
    host: true
  }
});

