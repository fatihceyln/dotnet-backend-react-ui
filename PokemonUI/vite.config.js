import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/auth': {
        target: 'http://localhost:5102',
        changeOrigin: true,
      },
      '/pokemons': {
        target: 'http://localhost:5102',
        changeOrigin: true,
      },
    },
  },
})
