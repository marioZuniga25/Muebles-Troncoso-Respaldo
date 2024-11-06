import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: './src/web-component.jsx',
      name: 'WebComponent',
      fileName: 'web-component',
      formats: ['umd'], // Formato universal para compatibilidad
    },
    cssCodeSplit: false, // Un solo archivo CSS
  },
  server: {
    port: 5173, // Puedes cambiarlo si está en uso
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify('development'), // Ajusta según el entorno
  },
});
