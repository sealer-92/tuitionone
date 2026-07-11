import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'node:path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { '@': path.resolve(__dirname, 'src') },
  },
  test: {
    globals: true,
    include: ['src/**/_tests_/**/*.tests.{ts,tsx}'],
    setupFiles: ['./vitest.setup.ts'],
    environment: 'node',
  },
})
