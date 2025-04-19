import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@data': path.resolve(__dirname, './data'),
    },
  },
  assetsInclude: ['**/*.json'],
  define: {
    // Define environment variables that will be available in the client code
    'process.env.VITE_API_URL': JSON.stringify('https://healthquest-n0i2.onrender.com/api'),
  }
}) 