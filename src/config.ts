/// <reference types="../types/nyaa-stats" />

import path from 'path'
import yaml from 'js-yaml'
import fs from 'fs-extra'

import * as logger from './logger'

interface Config extends NSConfig {
  __filename: string
  __dirname: string

  resolve (filepath: string): string

  get<T> (keyPath: string | string[]): T
}

let config: Config

export default function loadConfig (configPath = './config.yml'): Config {
  const filename = path.resolve(configPath)

  if (config?.__filename === filename) {
    return config
  }

  let _config: NSConfig
  try {
    // TODO: `.yaml` support
    _config = yaml.safeLoad(fs.readFileSync(configPath, 'utf-8')) as NSConfig
  } catch (err) /* istanbul ignore next */ {
    logger.Config.error('Error occurred while reading config')
    logger.Config.error(err.toString())
    process.exit(1)
  }

  const dirname = path.parse(filename).dir
  config = Object.assign(_config, {
    __filename: filename,
    __dirname: dirname,
    resolve (filepath: string): string {
      return path.resolve(dirname, filepath)
    },
    get<T = unknown> (keyPath: string | string[]): T {
      if (typeof keyPath === 'string') {
        keyPath = keyPath.split('.')
      }
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      // FIXME: Better typing
      return keyPath.reduce((value, key) => value[key], config)
    },
  })
  return config
}
