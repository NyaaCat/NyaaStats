import fs from 'fs-extra';
import path from 'path';
import ProgressBar from 'ascii-progress';
import Confirm from 'prompt-confirm';

import Utils from './utils';

const utils = new Utils();
const config = utils.getConfig();

// Clear the terminal
process.stdout.write('\x1Bc');

let playerlist = [];
if (config.render.whitelist) {
  playerlist = utils.getWhitelistedPlayers();
} else {
  playerlist = utils.getAllPlayers();
}
console.log('[INFO] Players found:', playerlist.length);

if (config.render.advancements) {
  console.log('[INFO] Advancements is set: Render mode set to 1.12+');
  if (!config['advancements-progress']) {
    console.log('[WARN] You do not have advancements progresses defined. Please visit github.com/NyaaCat/NyaaStats for a new version of config file.');
  }
} else {
  console.log('[INFO] Advancements not set: Render mode set to 1.11');
}

const output = path.join(config.BASEPATH, config.render.output);
console.log('[INFO] CREATE OUTPUT DIR:', output);

(async () => {
  const prompt = new Confirm('Do you want to clean the output folder?');

  if (await prompt.run()) {
    try {
      fs.emptyDirSync(output);
    } catch (err) {
      throw new Error(err);
    }
  }

  let banlist = [];
  const players = [];
  if (config.render['banned-players']) {
    banlist = utils.getBannedPlayers();
  }
  if (!config.render['render-banned']) {
    console.log(playerlist, banlist);
    playerlist = playerlist.filter(uuid => !banlist.some(ban => ban === uuid));
  }
  playerlist = playerlist.sort(() => 0.5 - Math.random());

  const totalTasks = playerlist.length;
  const bar = new ProgressBar({
    schema: '[:bar] :current/:total :percent :etas',
    width: 0.95,
    total: totalTasks,
  });

  for (const uuid of playerlist) {
    let banned = false;
    if (config.render['render-banned']) {
      banned = banlist.some(ban => ban === uuid);
    }
    let data;
    try {
      data = await utils.createPlayerData(uuid, banned); // eslint-disable-line
    } catch (error) {
      bar.tick();
      continue;
    }
    if (!data.data) {
      console.log(data);
    }
    players.push({
      uuid: data.data.uuid_short,
      playername: data.data.playername,
      names: data.data.names,
      seen: data.data.seen,
    });
    bar.tick();
  }

  players.sort((a, b) => b.seen - a.seen); // eslint-disable-line
  Utils.writeJSON(
    path.join(config.BASEPATH, config.render.output, 'players.json'),
    players,
  );

  let worldTime;
  try {
    worldTime = await utils.getWorldTime();
  } catch (error) {
    throw new Error(error);
  }
  Utils.writeJSON(
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
