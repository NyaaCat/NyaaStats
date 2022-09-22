import fs from 'fs-extra'
import path from 'path'

import loadConfig from './config'
import Utils from './utils'
import {confirm, writeJSON} from './helper'
import * as logger from './logger'
import ProgressBar from './progressbar'

process.on('SIGINT', () => {
  process.exit()
})

process.stdout.write('\x1Bc')

const utils = new Utils()
const config = loadConfig()

void async function main () {
  const bannedUuidList = config.get('render.banned-players') ? utils.getBannedPlayers() : []

  const uuidList = (() => {
    let list = config.render.whitelist ? utils.getWhitelistedPlayers() : utils.getAllPlayers()
    if (!config.get('render.render-banned') && bannedUuidList.length) {
      list = list.filter(uuid => !bannedUuidList.some(ban => ban === uuid))
    }
    return list
  })()
  logger.Default.info('Players to process:', uuidList.length)

  if (config.render.advancements) {
    logger.Default.info('Advancements is set: Render mode set to 1.12+')
  } else {
    logger.Default.info('Advancements not set: Render mode set to 1.11')
  }

  const outputDir = config.resolve(config.render.output)
  logger.Default.info('CREATE OUTPUT DIR', outputDir)

  if (config.get('render.confirm-clear-data') !== false) {
    const prompt = await confirm('Do you want to clean the output folder?')
    if (prompt) {
      try {
        // Clean output dir
        for (const f of fs.readdirSync(outputDir)) {
          // ...but keep players.json as we need the name history in it
          // This file will be re-generated anyway
          if (f !== 'players.json') {
            fs.removeSync(path.join(outputDir, f))
          }
        }
      } catch (err) {
        throw new Error(err)
      }
    }
  }

  const players = []

  const progress = new ProgressBar(uuidList.length)
  progress.start()

  for (const uuid of uuidList) {
    try {
      const banned = config.get('render.render-banned') ? bannedUuidList.some(ban => ban === uuid) : false
      let data
      try {
        data = await utils.createPlayerData(uuid, banned)
      } catch (error) {
        logger.Default.error(`Failed to create player data for ${uuid}`, error.toString())
        continue
      }
      players.push({
        uuid: data.data.uuid_short,
        playername: data.data.playername,
        names: data.data.names,
        seen: data.data.seen,
      })
    } finally {
      progress.tick(uuid)
    }
  }

  progress.stop()

  players.sort((a, b) => (b.seen ?? 0) - (a.seen ?? 0))
  writeJSON(path.join(outputDir, 'players.json'), players as never)

  const worldTime = await utils.getWorldTime()
  writeJSON(path.join(outputDir, 'info.json'), {
    worldTime,
    timeFormat: config.get('render.time-format'),
    lastUpdate: Date.now(),
    ...config.web,
  } as never)
}()
