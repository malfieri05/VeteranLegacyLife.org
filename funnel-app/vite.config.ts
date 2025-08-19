import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  esbuild: {
    logOverride: { 'this-is-undefined-in-esm': 'silent' }
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  },
  base: '/',
  define: {
    'process.env.NODE_ENV': '"production"'
  }
}) 