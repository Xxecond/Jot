import js from '@eslint/js'

export default [
  { ignores: ['dist'] },
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    rules: {
      ...js.configs.recommended.rules,
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
    },
  },
  // Node / server-side override (API routes, server libs)
  {
    files: ['src/app/api/**', 'src/lib/**'],
    env: { node: true },
    languageOptions: {
      globals: {
        ...globals.node,
        process: 'readonly',
        Buffer: 'readonly',
        console: 'readonly',
        Response: 'readonly',
        Request: 'readonly',
        URL: 'readonly',
        fetch: 'readonly',
      },
    },
  },
  // Browser / client-side override (components, client pages, context/hooks)
  {
    files: ['src/components/**', 'src/context/**', 'src/hooks/**', 'src/app/**'],
    env: { browser: true },
    languageOptions: {
      globals: {
        ...globals.browser,
        window: 'readonly',
        document: 'readonly',
      },
    },
  },
]
