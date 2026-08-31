import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  base: '/Portfolio-Marc/', // Nombre de tu repositorio rodeado de barras
})
