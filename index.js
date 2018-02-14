import fs from 'fs-extra';
import path from 'path';

import Utils from './utils';
import { writeJSON, confirm } from './helper';
import * as logger from './logger';
import ProgressBar from './progressbar';

process.on('SIGINT', () => {
  process.exit();
});

process.stdout.write('\x1Bc');

const utils = new Utils();
const config = utils.getConfig();

let playerlist = [];
if (config.render.whitelist) {
  playerlist = utils.getWhitelistedPlayers();
} else {
  playerlist = utils.getAllPlayers();
}
logger.Default.info('Players found', playerlist.length);

if (config.render.advancements) {
  logger.Default.info('Advancements is set: Render mode set to 1.12+');
  if (!config['advancements-progress']) {
    logger.Default.warn('You do not have advancements progresses defined. Please visit github.com/NyaaCat/NyaaStats for a new version of config file.');
  }
} else {
  logger.Default.info('Advancements not set: Render mode set to 1.11');
}

const output = path.join(config.BASEPATH, config.render.output);
logger.Default.info('CREATE OUTPUT DIR', output);


(async () => {
  if (config.render['confirm-clear-data'] || config.render['confirm-clear-data'] === undefined) {
    const prompt = await confirm('Do you want to clean the output folder?');
    if (prompt) {
      try {
        fs.emptyDirSync(output);
      } catch (err) {
        throw new Error(err);
      }
    }
  }

  let banlist = [];
  const players = [];
  if (config.render['banned-players']) {
    banlist = utils.getBannedPlayers();
  }
  if (!config.render['render-banned']) {
    playerlist = playerlist.filter(uuid => !banlist.some(ban => ban === uuid));
  }
  playerlist = playerlist.sort(() => 0.5 - Math.random());

  const totalTasks = playerlist.length;
  const progress = new ProgressBar(totalTasks);
  progress.start();
  for (const uuid of playerlist) {
    let banned = false;
    if (config.render['render-banned']) {
      banned = banlist.some(ban => ban === uuid);
    }
    let data;
    try {
      data = await utils.createPlayerData(uuid, banned); // eslint-disable-line
    } catch (error) {
      progress.tick(uuid);
      continue;
    }
    players.push({
      uuid: data.data.uuid_short,
      playername: data.data.playername,
      names: data.data.names,
      seen: data.data.seen,
    });
    progress.tick(uuid);
  }
  progress.stop();

  players.sort((a, b) => b.seen - a.seen); // eslint-disable-line
  writeJSON(
    path.join(config.BASEPATH, config.render.output, 'players.json'),
    players,
  );

  let worldTime;
  try {
    worldTime = await utils.getWorldTime();
  } catch (error) {
    throw new Error(error);
  }
  writeJSON(
    path.join(config.BASEPATH, config.render.output, 'info.json'),
    {
      worldTime,
      timeFormat: config.render['time-format'],
      lastUpdate: (new Date()).valueOf(),
      advancementsProgress: config['advancements-progress'],
      ...config.web,
    },
  );
})();
