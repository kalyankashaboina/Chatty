import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';
import path from 'path';

export default defineConfig({
  plugins: [
    react(),

    // ----- PWA CONFIG -----
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
            src: '/icons/pwa-icon',
            sizes: '16x16',
            type: 'image/png',
          },
          {
            src: '/icons/pwa-icon',
            sizes: '32x32',
            type: 'image/png',
          },
          {
            src: '/icons/pwa-icon',
            sizes: '48x48',
            type: 'image/png',
          },
          {
            src: '/icons/pwa-icon',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: '/icons/pwa-icon',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
      },
    }),

    // ----- IMAGE OPTIMIZATION (NEW PLUGIN) -----
    ViteImageOptimizer({
      png: {
        quality: 75,
      },
      jpeg: {
        quality: 75,
      },
      webp: {
        lossless: false,
        quality: 75,
      },
      svg: {
        multipass: true,
      },
      gif: {
        optimizationLevel: 3,
      },
    }),
  ],

  resolve: {
    alias: {
      '@components': path.resolve(__dirname, 'src/components'),
      '@pages': path.resolve(__dirname, 'src/pages'),
      '@hooks': path.resolve(__dirname, 'src/hooks'),
      '@utils': path.resolve(__dirname, 'src/utils'),
      '@store': path.resolve(__dirname, 'src/store'),
      '@services': path.resolve(__dirname, 'src/services'),
      '@constants': path.resolve(__dirname, 'src/constants'),
      '@assets': path.resolve(__dirname, 'src/assets'),
      '@router': path.resolve(__dirname, 'src/router'),
    },
  },
});
