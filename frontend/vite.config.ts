import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: '127.0.0.1', // Fuerzas IPv4 explícitamente para evitar problemas de resolución en entornos Linux/Wayland
    port: 5173,
    strictPort: true,
    open: false, // Evita que intente ejecutar xdg-open que a menudo falla en Wayland
    watch: {
      usePolling: true, // Si hay problemas con inotify en Wayland/Linux, usa polling
    }
  }
});
