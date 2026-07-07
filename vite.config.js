import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// Multi-page setup: each real "page" (home, rsvp) has its own HTML entry
// and its own small React root. This keeps routes as plain static URLs
// (no client-side router / SPA fallback needed on Cloudflare Pages) while
// still using React components for everything inside each page.
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        rsvp: resolve(__dirname, 'rsvp/index.html'),
      },
    },
  },
})
