const __PROD__ = process.env.NODE_ENV === 'production'

module.exports = {
  root: true,
  env: {
    es2020: true,
    node: true,
  },
  parserOptions: {
    parser: '@typescript-eslint/parser',
  },
  plugins: [
    '@typescript-eslint',
  ],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  rules: {
    'no-var': 'error',
    'quotes': ['error', 'single'],
    'semi': ['error', 'never'],
    'object-curly-spacing': ['error', 'never'],
    'space-before-function-paren': ['error', 'always'],
    'comma-dangle': [__PROD__ ? 'error' : 'warn', 'always-multiline'],
    'no-debugger': __PROD__ ? 'error' : 'off',
    'no-console': 'off',
  },
}
