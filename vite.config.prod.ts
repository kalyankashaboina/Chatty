import { defineConfig, mergeConfig } from 'vite';
import baseConfig from './vite.config.base';

export default mergeConfig(
  baseConfig,
  defineConfig({
    define: {
      'process.env.NODE_ENV': JSON.stringify('production'),
    },
    build: {
      target: 'es2018',
      cssCodeSplit: true,
      sourcemap: false,
      minify: 'esbuild',
      reportCompressedSize: true,
      chunkSizeWarningLimit: 600,
      outDir: 'dist',
      rollupOptions: {
        output: {
          // ✅ Better code splitting
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
      // ✅ Drop console/debug logs in prod
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
  })
);
