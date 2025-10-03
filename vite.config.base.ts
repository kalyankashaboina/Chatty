import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import viteImagemin from 'vite-plugin-imagemin';

const baseConfig = defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Chatty App',
        short_name: 'Chatty',
        description: 'A modern chat application for seamless communication.',
        start_url: '/',
        display: 'standalone',
        background_color: '#a78bfa',
        theme_color: '#7c3aed',
        icons: [
          {
            src: '/icons/pwa-icon-16.png',
            sizes: '16x16',
            type: 'image/png',
          },
          {
            src: '/icons/pwa-icon-32.png',
            sizes: '32x32',
            type: 'image/png',
          },
          {
            src: '/icons/pwa-icon-48.png',
            sizes: '48x48',
            type: 'image/png',
          },
          {
            src: '/icons/pwa-icon-192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: '/icons/pwa-icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
      },
    }),
    viteImagemin({
      gifsicle: { optimizationLevel: 7 },
      optipng: { optimizationLevel: 7 },
      mozjpeg: { quality: 75 },
      svgo: {},
      webp: { quality: 75 },
    }),
  ],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
});

export default baseConfig;
