import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { testEmailPlugin } from './server/testEmail.js'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), testEmailPlugin()],
  envDir: '..',
  server: { host: '127.0.0.1' },
})
