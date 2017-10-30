import fs from 'fs-extra';
import path from 'path';
import ejs from 'ejs';
import async from 'async';
import ncp from 'ncp';
import moment from 'moment';

import Utils from './utils';

const utils = new Utils();
const config = utils.getConfig();

const ncpOpts = {
  filter: (filepath) => {
    const filename = path.basename(filepath);
    return filename.indexOf('.') !== 0;
  },
};

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
ncp(
  path.join(config.BASEPATH, 'template', 'static'),
  path.join(config.BASEPATH, config.render.output),
  ncpOpts,
  (ncpErr) => {
    if (ncpErr) {
      return console.error('[ERROR] ASSETS:', ncpErr);
    }
    return console.log('[INFO] ASSETS: Synced');
  },
);
let banlist = [];
const indexdata = [];
const playeruuids = [];
if (config.render['banned-players']) {
  banlist = utils.getBannedPlayers();
}
async.eachSeries(playerlist, async (uuid, callback) => {
  let data;
  try {
    data = await utils.createPlayerData(uuid, banlist);
  } catch (error) {
    return callback();
  }
  indexdata.push(data);
  playeruuids.push({
    uuid: data.data.uuid,
    playername: data.data.playername,
    names: data.data.names,
  });
  return callback();
}, async () => {
  let wtime;
  try {
    wtime = await utils.getWorldTime();
  } catch (error) {
    throw new Error(error);
  }
  indexdata.sort((a, b) => b.data._seen - a.data._seen); // eslint-disable-line
  if (config.render.json) {
    Utils.writeJSON(
      path.join(config.BASEPATH, config.render.output, 'players.json'),
      {
        update: new Date().getTime(),
        world_lived: wtime,
        players: playeruuids,
      },
    );
  }
});
