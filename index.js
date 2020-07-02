const fs = require('fs-extra')
const path = require('path')

const Utils = require('./utils')
const {writeJSON, confirm} = require('./helper')
const logger = require('./logger')
const ProgressBar = require('./progressbar')

process.on('SIGINT', () => {
  process.exit()
})

process.stdout.write('\x1Bc')

const utils = new Utils()
const config = utils.getConfig()

void async function main () {
  /** @type {string[]} */
  const bannedUuidList = config.render['banned-players'] ? utils.getBannedPlayers() : []

  /** @type {string[]} */
  const uuidList = (() => {
    let list = config.render.whitelist ? utils.getWhitelistedPlayers() : utils.getAllPlayers()
    if (!config.render['render-banned'] && bannedUuidList.length) {
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
  const outputDir = path.join(config.BASEPATH, config.render.output)

  logger.Default.info('CREATE OUTPUT DIR', outputDir)
  if (config.render['confirm-clear-data'] !== false) {
    const prompt = await confirm('Do you want to clean the output folder?')
    if (prompt) {
      try {
        fs.emptyDirSync(outputDir)
      } catch (err) {
        throw new Error(err)
      }
    }
  }

  /** @type {object[]} */
  const players = []

  const progress = new ProgressBar(uuidList.length)
  progress.start()

  for (const uuid of uuidList) {
    try {
      const banned = config.render['render-banned'] ? bannedUuidList.some(ban => ban === uuid) : false
      let data
      try {
        data = await utils.createPlayerData(uuid, banned)
      } catch (error) {
        logger.Default.error(`Failed to create player data for ${uuid}`)
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

  players.sort((a, b) => b.seen - a.seen)
  writeJSON(path.join(outputDir, 'players.json'), players)

  let worldTime = await utils.getWorldTime()
  writeJSON(path.join(outputDir, 'info.json'), {
    worldTime,
    timeFormat: config.render['time-format'],
    lastUpdate: Date.now(),
    ...config.web,
  })
}()
