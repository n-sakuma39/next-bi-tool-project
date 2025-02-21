/// <reference types="vitest" />

import path from 'node:path'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'happy-dom',
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/test/**/*.{test,spec}.{js,jsx,ts,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: [
        'src/components/TaskUserList/index.tsx',
        'src/contexts/TaskContext.tsx',
        'src/constants/**/*.ts'
      ],
      exclude: [
        'node_modules/**',
        '.next/**',
        'public/**',
        'coverage/**',
        '**/*.d.ts',
        '**/*.test.{js,jsx,ts,tsx}',
        '**/*.config.*',
        '**/types/**',
        'src/test/**',
        'src/mocks/**',
        'dist/**',
        'build/**',
        'src/app/**',
        'src/components/Task/**',
        'src/components/User/**',
        'src/components/chart/**',
        'src/components/elements/**',
        'src/utils/**'
      ],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80
      }
    },
    deps: {
      optimizer: {
        web: {
          include: ['@testing-library/jest-dom']
        }
      }
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
