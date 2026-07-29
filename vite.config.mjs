import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': '/src', // Alias para que @ apunte a la carpeta src
    },
  },
  server: {
    host: 'localhost', // Necesario para el header Referer
  },
})
