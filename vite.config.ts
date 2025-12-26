
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // This allows Termux to broadcast on local network
    port: 5173,
    strictPort: true
  }
});
