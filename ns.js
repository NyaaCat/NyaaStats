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

fs.emptyDir(output, (err) => {
  if (err) throw err;
  ncp(
    path.join(config.BASEPATH, 'template', 'static'),
    path.join(config.BASEPATH, config.render.output),
    ncpOpts,
    (ncpErr) => {
      if (ncpErr) {
        return console.error('[ERROR] ASSETS:', err);
      }
      return console.log('[INFO] ASSETS: Synced');
    },
  );
  let banlist = [];
  const indexdata = [];
  const playeruuids = [];
  const template = {
    index: ejs.compile(fs.readFileSync(path.join(config.BASEPATH, 'template', 'ejs', 'index.ejs'), 'utf8'), {
      filename: path.join(config.BASEPATH, 'template', 'ejs', 'index.ejs')
    }),
    player: ejs.compile(fs.readFileSync(path.join(config.BASEPATH, 'template', 'ejs', 'player.ejs'), 'utf8'), {
      filename: path.join(config.BASEPATH, 'template', 'ejs', 'player.ejs')
    }),
  };
  if (config.render['banned-players']) {
    banlist = utils.getBannedPlayers();
  }
  async.eachSeries(playerlist, (uuid, callback) => {
    if (banlist.indexOf(uuid) === -1 || config.render['render-banned']) {
      utils.getPlayerData(uuid, {
        banlist,
      }, (data) => {
        if (data && data.stats && data.data) {
          indexdata.push(data);
          playeruuids.push(data.data.uuid);
          const playerpath = path.join(config.BASEPATH, config.render.output, data.data.uuid_short);
          utils.getPlayerAssets(data.data.uuid_short, playerpath, () => {
            utils.render(
              template.player,
              path.join(playerpath, 'index.html'),
              {
                playerdata: data,
                config,
                moment,
                numAbbr: Utils.numAbbr,
                lang: JSON.parse(fs.readFileSync(path.join(config.BASEPATH, 'template', 'lang.json')))
              },
            );
          });
          if (config.render.json) {
            Utils.writeJSON(path.join(playerpath, 'stats.json'), data);
          }
        }
        callback();
      });
    } else {
      callback();
    }
  }, () => {
    utils.getWorldTime((wtime) => {
      indexdata.sort((a, b) => {
        return b.data._seen - a.data._seen; // sort by activity
      });
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
      utils.render(
        template.index,
        path.join(config.BASEPATH, config.render.output, 'index.html'),
        {
          playerdata: indexdata,
          wtime,
          config,
          moment,
        },
      );
    });
  });
});
