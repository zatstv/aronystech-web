import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Dentro de un Codespace el navegador entra por el dominio reenviado, que va
// por HTTPS en el 443. Si no se le dice, el cliente de recarga en vivo
// intenta abrir el WebSocket contra el 5173 y falla sin avisar: la página
// carga bien pero deja de actualizarse sola.
const enCodespace = Boolean(process.env.CODESPACE_NAME)

// El catálogo se compila a archivos estáticos: no hay servidor detrás.
// PocketBase (ver STACK.md) solo lo toca la zona de admin, aparte de esto.
export default defineConfig({
  plugins: [react()],
  server: {
    // Escucha en todas las interfaces para que el reenvío de puertos del
    // Codespace pueda llegar al servidor.
    host: true,
    // Puerto fijo. Sin strictPort, si el 5173 está ocupado Vite se corre solo
    // al siguiente y no avisa: quedan dos servidores vivos, el túnel reenvía
    // el que no es y el enlace da 404. Mejor que falle y se vea.
    port: 5173,
    strictPort: true,
    // Vite rechaza peticiones con un Host que no conoce. Sin esta línea el
    // enlace público del Codespace responde "Blocked request".
    allowedHosts: ['.app.github.dev'],
    hmr: enCodespace ? { clientPort: 443, protocol: 'wss' } : undefined,
  },
  // `vite preview` no hereda la configuración de `server`, así que el
  // dominio del Codespace hay que repetirlo acá.
  preview: {
    host: true,
    port: 4173,
    strictPort: true,
    allowedHosts: ['.app.github.dev'],
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
})
