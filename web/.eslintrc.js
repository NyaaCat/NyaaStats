module.exports = {
  root: true,
  env: {
    node: true,
  },
  parserOptions: {
    parser: 'babel-eslint',
  },
  extends: [
    'eslint:recommended',
    'plugin:vue/essential',
    'plugin:vue/strongly-recommended',
    'plugin:vue/recommended',
  ],
  rules: {
    'no-var': 'error',
    'comma-dangle': [process.env.NODE_ENV === 'production' ? 'error' : 'warn', 'always-multiline'],
    'no-console': 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'vue/max-attributes-per-line': [process.env.NODE_ENV === 'production' ? 'error' : 'warn', {
      singleline: 3,
    }],
    'vue/script-indent': [process.env.NODE_ENV === 'production' ? 'error' : 'warn', 2, {
      baseIndent: 1,
    }],
    'vue/singleline-html-element-content-newline': 'off',
  },
  overrides: [
    {
      files: ['*.vue'],
      rules: {
        indent: 'off',
      },
    },
  ],
}
