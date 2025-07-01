import { fileURLToPath, URL } from 'node:url';
import path from 'path'

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
//import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig(() => {
  return {
    base: './', // Usa './' en lugar de '/' si tienes problemas con rutas relativas
    build: {
      assetsDir: 'assets', // Esto debe coincidir con tu estructura actual
      emptyOutDir: true
    },
    plugins: [
      vue()
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    }
  };
});