module.exports = {
  root: true,
  env: {
    node: true,
    es2021: true
  },
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      parserOptions: {
        project: ['./tsconfig.json'],
        ecmaVersion: 2021,
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true
        }
      }
    }
  ],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'prettier'
  ],
  rules: {
    '@typescript-eslint/no-explicit-any': 'warn',
    'import/order': ['error', { alphabetize: { order: 'asc' } }],
    'import/no-unresolved': 'warn'
  },
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx']
    },
    'import/resolver': {
      typescript: {}
    },
    react: {
      version: 'detect'
    }
  }
}
