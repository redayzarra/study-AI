import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // Whenever the frontend calls "/api", just forward the request to my backend server running on port:3000
    proxy: {
      "/api": "http://localhost:3000"
    }
  }
})
