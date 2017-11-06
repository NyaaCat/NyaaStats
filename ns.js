import fs from 'fs-extra';
import path from 'path';
import async from 'async';

import Utils from './utils';

const utils = new Utils();
const config = utils.getConfig();

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
console.log('[INFO] CREATE:', output);

try {
  fs.emptyDirSync(output);
} catch (err) {
  throw new Error(err);
}

let banlist = [];
const players = [];
if (config.render['banned-players']) {
  banlist = utils.getBannedPlayers();
}
if (!config.render['render-banned']) {
  playerlist = playerlist.filter(player => banlist.indexOf(player) === -1);
}

async.eachSeries(playerlist, async (uuid, callback) => {
  let data;
  try {
    data = await utils.createPlayerData(uuid);
  } catch (error) {
    return callback();
  }
  players.push({
    uuid: data.data.uuid_short,
    playername: data.data.playername,
    names: data.data.names,
    seen: data.data._seen, // eslint-disable-line
  });
  return callback();
}, async () => {
  players.sort((a, b) => b.data._seen - a.data._seen); // eslint-disable-line
  Utils.writeJSON(
    path.join(config.BASEPATH, config.render.output, 'players.json'),
    players,
  );
});
