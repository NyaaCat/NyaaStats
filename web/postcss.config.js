const purgecssOptions = {
  content: [
    './src/**/*.vue',
    './src/**/*.jsx',
  ],
  defaultExtractor: content => content.match(/[\w-/:.]+(?<!:)/g) || [],
}

module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
    ...process.env.NODE_ENV === 'production' ? {'@fullhuman/postcss-purgecss': purgecssOptions} : {},
  },
}
