import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    // Frontend and config files
    files: ['src/**/*.{js,jsx}', 'eslint.config.js', 'vite.config.js', 'postcss.config.js', 'tailwind.config.js'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    rules: {
      'no-unused-vars': ['error', { 'argsIgnorePattern': '^_' }],
    }
  },
  {
    // Backend Node.js files
    files: ['backend/**/*.js'],
    extends: [
      js.configs.recommended,
    ],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.es2021,
      },
    },
    rules: {
      'no-unused-vars': ['error', { 'argsIgnorePattern': '^_' }],
    }
  }
])
