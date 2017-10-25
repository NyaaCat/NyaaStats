import request from 'request';
import bignum from 'bignum';
import NBT from 'mcnbt';
import path from 'path';
import yaml from 'js-yaml';
import fs from 'fs-extra';
import async from 'async';

const reqOpts = {
  timeout: 30000, // 30 secs
  pool: false,
};

export default class Utils {
  constructor() {
    this.config = Utils.loadConfig();
  }

  getConfig() {
    return this.config;
  }

  static loadConfig() {
    let config;
    try {
      config = yaml.safeLoad(fs.readFileSync('./config.yml'), 'utf8');
    } catch (e) {
      console.error('[ERROR] CONFIGURATION:', e.code);
      process.exit(1);
    }
    config.BASEPATH = path.parse(path.resolve('./config.yml')).dir;
    return config;
  }

  getWorldTime(callback) {
    const nbt = new NBT();
    nbt.loadFromZlibCompressedFile(
      path.join(this.config.BASEPATH, this.config.render.level),
      (err) => {
        if (err) throw err;
        callback(bignum(nbt.select('').select('Data').select('Time').getValue()).toNumber() / 20);
      },
    );
  }

  getAllPlayers() {
    const uuids = [];
    const r = new RegExp(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
    fs.readdirSync(path.join(this.config.BASEPATH, this.config.render.playerdata)).forEach((f) => {
      const uuid = path.basename(f, '.dat');
      // filter out old player usernames.
      if (r.test(uuid)) {
        uuids.push(uuid);
      }
    });
    return uuids;
  }

  getWhitelistedPlayers() {
    const uuids = [];
    JSON.parse(fs.readFileSync(this.config.render.whitelist, 'utf8')).forEach((p) => {
      uuids.push(p.uuid);
    });
    return uuids;
  }

  getBannedPlayers() {
    const banlist = [];
    const banned = JSON.parse(fs.readFileSync(path.join(this.config.BASEPATH, this.config.render['banned-players']), 'utf8'));
    banned.forEach((ban) => {
      banlist.push(ban.uuid);
    });
    return banlist;
  }

  getPlayerData(uuid, extdata, callback) {
    const datafile = path.join(this.config.BASEPATH, this.config.render.playerdata, `${uuid}.dat`);
    let statsfile;
    let advancementsfile;
    if (this.config.render.stats) {
      statsfile = path.join(this.config.BASEPATH, this.config.render.stats, `${uuid}.json`);
    }
    if (this.config.render.advancements) {
      advancementsfile = path.join(this.config.BASEPATH, this.config.render.advancements, `${uuid}.json`);
    }

    async.parallel({
      stats: (cb) => {
        fs.readFile(statsfile, (error, data) => {
          if (error) {
            console.log('[ERROR] READ:', statsfile, error);
            return cb(null, []);
          }
          return cb(null, JSON.parse(data));
        });
      },
      advancements: (cb) => {
        // compatible to 1.11
        if (!this.config.render.advancements) return cb();
        return fs.readFile(advancementsfile, (error, data) => {
          if (error) {
            console.log('[ERROR] READ:', advancementsfile, error);
            return cb(null, {});
          }
          return cb(null, JSON.parse(data));
        });
      },
      data: (cb) => {
        const nbt = new NBT();
        nbt.loadFromZlibCompressedFile(datafile, (err) => {
          if (err) {
            console.error('[ERROR] READ:', datafile, err);
            return cb();
          }
          console.log('[INFO] PARSE:', datafile);
          const uuidShort = uuid.replace(/-/g, '');
          return this.getNameHistory(uuidShort, (history) => {
            if (history && history[0]) {
              let lived = '';
              if (nbt.select('').select('Spigot.ticksLived')) {
                lived = nbt.select('').select('Spigot.ticksLived').getValue() / 20;
              }
              const timeStart = bignum(nbt.select('').select('bukkit').select('firstPlayed').getValue()).toNumber();
              const timeLast = bignum(nbt.select('').select('bukkit').select('lastPlayed').getValue()).toNumber();
              const pdata = {
                _seen: timeLast,
                time_start: timeStart,
                time_last: timeLast,
                time_lived: lived,
                playername: history[0].name,
                names: history,
                banned: extdata.banlist.indexOf(uuid) !== -1,
                uuid_short: uuidShort,
                uuid,
              };
              cb(null, pdata);
            } else {
              cb();
            }
          });
        });
      },
    }, (err, d) => {
      callback(d);
    });
  }

  getNameHistory(uuid, callback) {
    const apiNameHistory = `https://api.mojang.com/user/profiles/${uuid}/names`;
    const history = [];
    this.getMojangAPI(apiNameHistory, (err, res) => {
      if (err || !res) {
        return callback();
      }
      let limit = this.config.api['max-name-history'];
      if (res.length < this.config.api['max-name-history']) {
        limit = res.length;
      }
      for (let i = 1; i <= limit; i += 1) {
        history.push(res[res.length - i]);
      }
      return callback(history);
    });
  }

  getMojangAPI(apiPath, callback) {
    let timeout = 0;
    if (this.config.api.ratelimit) {
      timeout = 1000;
    }
    console.log('[INFO] API REQUEST:', apiPath);
    setTimeout(request, timeout, apiPath, reqOpts, (err, res, body) => {
      if (!err && res.statusCode === 200) {
        callback(null, JSON.parse(body));
      } else {
        console.error('[ERROR] API REQUEST:', apiPath, err);
        callback(err);
      }
    });
  }

  getPlayerAssets(uuid, playerpath, callback) {
    fs.ensureDir(playerpath, () => {
      const skinapipath = `https://sessionserver.mojang.com/session/minecraft/profile/${uuid}`;
      this.getMojangAPI(skinapipath, (err, res) => {
        if (err || !res) {
          console.error('[ERROR] SKIN API', skinapipath, err);
        } else {
          const apiprefixAvatar = 'https://crafatar.com/avatars/';
          const apiprefixBody = 'https://crafatar.com/renders/body/';
          let slim = '';
          res.properties.forEach((t) => {
            if (t.name === 'textures') {
              const texture = JSON.parse(Buffer.from(t.value, 'base64').toString('ascii'));
              if (texture.textures.SKIN) {
                if (texture.textures.SKIN.metadata && texture.textures.SKIN.metadata.model === 'slim') {
                  // Alex model
                  slim = '&default=MHF_Alex';
                }
              }
            }
          });
          Utils.download(
            `${apiprefixAvatar}${uuid}?size=64&overlay${slim}`,
            path.join(playerpath, 'avatar.png'),
          );
          Utils.download(
            `${apiprefixBody}${uuid}?size=128&overlay${slim}`,
            path.join(playerpath, 'body.png'),
          );
        }
        callback();
      });
    });
  }

  static download(apiPath, dest) {
    console.log('[INFO] DOWNLOAD:', apiPath);
    request
      .get(apiPath)
      .on('error', (err) => {
        console.error('[ERROR] DOWNLOAD:', apiPath, err);
      })
      .pipe(fs.createWriteStream(dest));
  }

  render(template, dest, data) {
    fs.writeFile(dest, template(data), (err) => {
      if (err) {
        return console.error('[ERROR] CREATE:', dest, err);
      }
      return console.log('[INFO] CREATE:', dest);
    });
  }

  static writeJSON(dest, data) {
    fs.writeFile(dest, JSON.stringify(data), (err) => {
      if (err) {
        console.log('[ERROR] CREATE:', dest);
      } else {
        console.log('[INFO] CREATE:', dest);
      }
    });
  }

  static numAbbr(value) {
    value = Math.round(value);
    let newValue = value;
    if (value >= 1000) {
      const suffixes = ['', 'k', 'M', 'b'];
      const suffixNum = Math.floor((`${value}`).length / 3);
      let shortValue = '';
      for (let precision = 2; precision >= 1; precision -= 1) {
        shortValue = parseFloat((suffixNum !== 0 ? (value / Math.pow(1000, suffixNum)) : value)
          .toPrecision(precision));
        const dotLessShortValue = (`${shortValue}`).replace(/[^a-zA-Z 0-9]+/g, '');
        if (dotLessShortValue.length <= 2) {
          break;
        }
      }
      if (shortValue % 1 !== 0) {
        shortValue = shortValue.toFixed(1);
      }
      newValue = shortValue + suffixes[suffixNum];
    }
    return newValue;
  }
}
