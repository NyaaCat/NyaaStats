import {resolve} from 'node:path'
import fs from 'fs-extra'
import axios from 'axios'
import createAgent from 'https-proxy-agent'
import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue2'

const MOCK_DIR = resolve(__dirname, '../__mock__')
const agent = process.env.https_proxy || process.env.http_proxy
  ? createAgent(process.env.https_proxy || process.env.http_proxy)
  : undefined

const resources = () => ({
  name: 'resources-proxy',
  configureServer (server) {
    server.middlewares.use(async (req, res, next) => {
      if (/^(\/data|\/skin)/.test(req.url)) {
        const file = resolve(MOCK_DIR, '.' + req.url)
        if (fs.existsSync(file)) {
          res.end(fs.readFileSync(file))
        } else {
          const {data} = await axios('https://stats.craft.moe' + req.url, {
            responseType: 'arraybuffer',
            agent,
          })
          await fs.outputFile(file, data)
          res.end(data)
        }
      } else {
        next()
      }
    })
  },
})

export default defineConfig({
  plugins: [
    vue(),
    resources(),
  ],

  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },

  server: {
    proxy: {
      '^/data': {
        target: 'https://stats.craft.moe',
        changeOrigin: true,
      },
    },
  },
})
