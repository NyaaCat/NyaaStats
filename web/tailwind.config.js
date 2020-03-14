module.exports = {
  theme: {
    extend: {
      spacing: {
        page: '1200px',
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'Noto Sans',
          'Helvetica Neue',
          'Helvetica',
          'Nimbus Sans L',
          'Arial',
          'Liberation Sans',
          'PingFang SC',
          'Hiragino Sans GB',
          'Noto Sans CJK SC',
          'Source Han Sans SC',
          'Source Han Sans CN',
          'Microsoft YaHei',
          'Wenquanyi Micro Hei',
          'WenQuanYi Zen Hei',
          'ST Heiti',
          'SimHei',
          'WenQuanYi Zen Hei Sharp',
          'sans-serif',
        ],
      },
    },
  },
  variants: {
    display: ['responsive', 'group-hover'],
  },
  plugins: [
    require('@tailwindcss/ui'),
  ],
}
