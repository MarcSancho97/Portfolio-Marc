import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
<<<<<<< HEAD
import path from 'path'
=======
import { fileURLToPath, URL } from 'node:url'
>>>>>>> e56ef1a (Fix router path aliases for Vite build)

export default defineConfig({
  plugins: [vue()],
  base: '/Portfolio-Marc/',
  resolve: {
    alias: {
<<<<<<< HEAD
      '@': path.resolve(__dirname, './src')
    }
  }
=======
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
>>>>>>> e56ef1a (Fix router path aliases for Vite build)
})
