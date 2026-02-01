import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { loadEnv } from 'vite';

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [
      react({
        // Enable Fast Refresh
        fastRefresh: true,
        // Add JSX runtime automatic
        jsxRuntime: 'automatic',
      }),
    ],

    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@components': path.resolve(__dirname, './src/components'),
        '@pages': path.resolve(__dirname, './src/pages'),
        '@hooks': path.resolve(__dirname, './src/hooks'),
        '@utils': path.resolve(__dirname, './src/utils'),
        '@styles': path.resolve(__dirname, './src/styles'),
        '@store': path.resolve(__dirname, './src/store'),
        '@types': path.resolve(__dirname, './src/types'),
      },
    },

    server: {
      port: 3000,
      proxy: {
        // Proxy API requests to backend
        '/api': {
          target: env.VITE_API_URL || 'http://localhost:8080',
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
    },

    build: {
      // Output directory
      outDir: 'dist',
      
      // Enable chunk size warnings
      chunkSizeWarningLimit: 1000,

      // Optimize dependencies
      rollupOptions: {
        output: {
          manualChunks: {
            'react-vendor': ['react', 'react-dom'],
            'query-vendor': ['@tanstack/react-query'],
            'chart-vendor': ['recharts', '@tremor/react'],
            'utils-vendor': ['date-fns', 'react-grid-layout'],
          },
        },
      },

      // Enable minification
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
        },
      },
    },

    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        '@tanstack/react-query',
        'zustand',
        'date-fns',
        'react-grid-layout',
        'recharts',
        '@tremor/react'
      ],
    },

    // Enable TypeScript
    esbuild: {
      jsxInject: `import React from 'react'`,
    },
  };
});