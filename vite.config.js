import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// El catálogo se compila a archivos estáticos: no hay servidor detrás.
// PocketBase (ver STACK.md) solo lo toca la zona de admin, aparte de esto.
export default defineConfig({
  plugins: [react()],
  server: {
    // Escucha en todas las interfaces para que el reenvío de puertos del
    // Codespace pueda llegar al servidor.
    host: true,
    // Vite rechaza peticiones con un Host que no conoce. Sin esta línea el
    // enlace público del Codespace responde "Blocked request".
    allowedHosts: ['.app.github.dev'],
  },
  // `vite preview` no hereda la configuración de `server`, así que el
  // dominio del Codespace hay que repetirlo acá.
  preview: {
    host: true,
    allowedHosts: ['.app.github.dev'],
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
})
