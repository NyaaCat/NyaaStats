const __PROD__ = process.env.NODE_ENV === 'production'

module.exports = {
  root: true,
  extends: [
    '../.eslintrc.js',
    'plugin:vue/essential',
    'plugin:vue/strongly-recommended',
    'plugin:vue/recommended',
  ],
  rules: {
    'vue/max-attributes-per-line': [__PROD__ ? 'error' : 'warn', {singleline: 3}],
    'vue/script-indent': [__PROD__ ? 'error' : 'warn', 2, {baseIndent: 1}],
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
