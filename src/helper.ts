import fs from 'fs-extra'
import axios from 'axios'
import inquirer from 'inquirer'

import * as logger from './logger'

export async function download (apiPath: string, dest: string): Promise<void> {
  logger.Assets.info('DOWNLOAD', apiPath)
  const {data} = await axios.get<fs.ReadStream>(apiPath, {responseType: 'stream'})
    .catch(err => {
      logger.Assets.error('DOWNLOAD', apiPath, err.toJSON())
      return {data: null}
    })
  data?.pipe(fs.createWriteStream(dest))
}

export function writeJSON (dest: string, data: never): void {
  fs.writeFile(dest, JSON.stringify(data), (err) => {
    if (err) {
      logger.WriteJSON.error('CREATE', dest, err)
    } else {
      logger.WriteJSON.info('CREATE', dest)
    }
  })
}

export function mergeStats (data: McPlayerStatsJson): McPlayerStatsJson {
  const merged: McPlayerStatsJson = {}
  if (Object.prototype.hasOwnProperty.call(data, 'stats')) {
    for (const key in data.stats) {
      for (const s in data.stats[key]) {
        merged[key + '/' + s] = data.stats[key][s]
      }
    }
    return merged
  }
  return data
}

export function defaultSkin (uuid: LongUuid): 'Alex' | 'Steve' {
  // great thanks to Minecrell for research into Minecraft and Java's UUID hashing!
  // https://git.io/xJpV
  // MC uses `uuid.hashCode() & 1` for alex
  // that can be compacted to counting the LSBs of every 4th byte in the UUID
  // an odd sum means alex, an even sum means steve
  // XOR-ing all the LSBs gives us 1 for alex and 0 for steve
  const isEven = (c: string) => {
    if (c >= '0' && c <= '9') {
      return (Number(c) & 1) === 0
    } else if (c >= 'a' && c <= 'f') {
      return (Number(c) & 1) === 1
    }
    console.log('Invalid digit', c)
    return null
  }
  const lsbsEven =
    (isEven(uuid[7]) !== isEven(uuid[23])) !== (isEven(uuid[15]) !== isEven(uuid[31]))
  return lsbsEven ? 'Alex' : 'Steve'
}

export async function confirm (message: string, _default = true): Promise<boolean> {
  const prompt = inquirer.createPromptModule()
  try {
    const res = await prompt<{confirm: boolean}>({
      type: 'confirm',
      name: 'confirm',
      default: _default,
      message,
    })
    return res.confirm
  } catch (error) {
    logger.Default.error('Cannot get user input.')
    return false
  }
}

export function delay (ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}
