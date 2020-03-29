const {resolve} = require('path')
const fs = require('fs-extra')
const fetch = require('node-fetch')

const MOCK_DIR = resolve(__dirname, '../__mock__')

module.exports = {
  devServer: {
    proxy: {
      '^/mojang-api': {
        target: 'https://api.mojang.com',
        pathRewrite: {
          '^/mojang-api/': '/',
        },
      },
    },
    before (app) {
      app.get(/^\/data/, async ({path}, /** @type {express.response} */ res) => {
        const file = resolve(MOCK_DIR, './' + path)

        if (!fs.existsSync(file)) {
          await fetch('https://stats.craft.moe' + path)
            .then(res => res.buffer())
            .then(buffer => fs.outputFile(file, buffer))
        }
        res.sendFile(file)
      })

      app.get(/^\/skin/, ({path}, res) => {
        res.sendFile(resolve(__dirname, '..' + path))
      })
    },
  },
}
