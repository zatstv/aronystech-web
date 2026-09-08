import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// El catálogo se compila a archivos estáticos: no hay servidor detrás.
// PocketBase (ver STACK.md) solo lo toca la zona de admin, aparte de esto.
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
})
