
const utils = require('./utils');
const config = require('../config');

const isProduction = process.env.NODE_ENV === 'production';

module.exports = {
  preLoaders: {
    i18n: 'yaml-loader',
  },
  loaders: {
    ...utils.cssLoaders({
      sourceMap: isProduction
        ? config.build.productionSourceMap
        : config.dev.cssSourceMap,
      extract: isProduction,
    }),
    i18n: '@kazupon/vue-i18n-loader',
  },
  transformToRequire: {
    video: 'src',
    source: 'src',
    img: 'src',
    image: 'xlink:href',
  },
};
