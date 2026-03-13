import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const isProduction = mode === 'production';

  return {
    plugins: [react()],

    // 开发服务器配置
    server: {
      port: 3000,
      host: true,
      proxy: {
        '/api': {
          target: process.env.VITE_API_URL || 'http://localhost:3001',
          changeOrigin: true,
          secure: false
        }
      }
    },

    // 构建配置
    build: {
      outDir: 'dist',
      sourcemap: !isProduction,
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: isProduction,
          drop_debugger: isProduction
        }
      },
      rollupOptions: {
        output: {
          manualChunks: {
            'react-vendor': ['react', 'react-dom', 'react-router-dom'],
            'chart-vendor': ['chart.js', 'react-chartjs-2', 'echarts', 'echarts-for-react'],
            'three-vendor': ['three']
          }
        }
      },
      chunkSizeWarningLimit: 1000,
      reportCompressedSize: false
    },

    // 优化配置
    optimizeDeps: {
      include: ['react', 'react-dom', 'react-router-dom']
    },

    // 预览服务器
    preview: {
      port: 3000,
      host: true
    }
  };
});
