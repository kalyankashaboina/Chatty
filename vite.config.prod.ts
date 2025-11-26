import { defineConfig, mergeConfig } from 'vite';
import baseConfig from './vite.config.base';

export default mergeConfig(
  baseConfig,
  defineConfig({
    define: {
      'process.env.NODE_ENV': JSON.stringify('production'),
    },
    plugins: [
      // viteCompression({
      //   algorithm: 'gzip',
      //   ext: '.gz',
      // }),
      // viteCompression({
      //   algorithm: 'brotliCompress',
      //   ext: '.br',
      // }),
    ],
    build: {
      target: 'es2018',
      cssCodeSplit: true,
      sourcemap: false,
      minify: 'terser',
      reportCompressedSize: true,
      chunkSizeWarningLimit: 600,
      outDir: 'dist',
      rollupOptions: {
        output: {
          manualChunks: {
            react: ['react', 'react-dom'],
            mui: ['@mui/material', '@mui/icons-material'],
            redux: ['@reduxjs/toolkit', 'react-redux'],
            auth: ['@react-oauth/google'],
          },
          entryFileNames: 'assets/[name].[hash].js',
          chunkFileNames: 'assets/[name].[hash].js',
          assetFileNames: 'assets/[name].[hash].[ext]',
        },
      },
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
        },
      },
    },
    optimizeDeps: {
      include: ['react', 'react-dom'],
      esbuildOptions: {
        target: 'es2018',
      },
    },
  }),
);
