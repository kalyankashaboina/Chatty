import { mergeConfig, defineConfig } from 'vite';
import baseConfig from './vite.config.base';

export default mergeConfig(
  baseConfig,
  defineConfig({
    server: {
      port: 3000,
      open: true,
      hmr: true,
      strictPort: true,
      proxy: {
        '/api': {
          target: 'http://localhost:5000',
          ws: true,
          changeOrigin: true,
        },
      },
    },
    build: {
      sourcemap: true,
    },
  })
);
