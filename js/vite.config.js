import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  define: {
    global: 'globalThis',
    'process.env': {},        // ayuda con libs que leen process.env
  },
  optimizeDeps: {
    include: ['docx', 'xlsx'], // fuerza el prebundle
  },
})
