import request from 'request-promise';
import bignum from 'bignum';
import NBT from 'mcnbt';
import path from 'path';
import yaml from 'js-yaml';
import fs from 'fs-extra';

const reqOpts = {
  timeout: 30000, // 30 secs
  pool: false,
};

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export default class Utils {
  constructor() {
    this.config = Utils.loadConfig();
    this.apiLimited = false;
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

  getWorldTime() {
    const nbt = new NBT();
    return new Promise((resolve, reject) => {
      nbt.loadFromZlibCompressedFile(
        path.join(this.config.BASEPATH, this.config.render.level),
        (err) => {
          if (err) return reject(err);
          return resolve(bignum(nbt.select('').select('Data').select('Time').getValue()).toNumber() / 20);
        },
      );
    });
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

  // return [ stats, advancements, data ]
  getPlayerData(uuid, extdata) {
    const datafile = path.join(this.config.BASEPATH, this.config.render.playerdata, `${uuid}.dat`);
    let statsfile;
    let advancementsfile;
    if (this.config.render.stats) {
      statsfile = path.join(this.config.BASEPATH, this.config.render.stats, `${uuid}.json`);
    }
    if (this.config.render.advancements) {
      advancementsfile = path.join(this.config.BASEPATH, this.config.render.advancements, `${uuid}.json`);
    }

    return Promise.all([
      new Promise((resolve) => {
        let data;
        try {
          data = fs.readFileSync(statsfile);
        } catch (error) {
          console.log('[ERROR] READ:', statsfile, error);
          return resolve([]);
        }
        return resolve(JSON.parse(data));
      }),
      new Promise((resolve) => {
        // compatible to 1.11
        if (!this.config.render.advancements) return resolve();
        let data;
        try {
          data = fs.readFileSync(advancementsfile);
        } catch (error) {
          console.log('[ERROR] READ:', advancementsfile, error);
          return resolve({});
        }
        return resolve(JSON.parse(data));
      }),
      new Promise((resolve) => {
        const nbt = new NBT();
        nbt.loadFromZlibCompressedFile(datafile, async (err) => {
          if (err) {
            console.error('[ERROR] READ:', datafile, err);
            return resolve();
          }
          console.log('[INFO] PARSE:', datafile);
          const uuidShort = uuid.replace(/-/g, '');
          let history;
          try {
            history = await this.getNameHistory(uuidShort);
          } catch (error) {
            return resolve();
          }
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
            return resolve(pdata);
          }
          return resolve();
        });
      }),
    ]);
  }

  async getNameHistory(uuid) {
    const apiNameHistory = `https://api.mojang.com/user/profiles/${uuid}/names`;
    const history = [];
    let res;
    try {
      res = await this.getMojangAPI(apiNameHistory);
    } catch (err) {
      return null;
    }
    if (!res) return null;
    let limit = this.config.api['max-name-history'];
    if (res.length < this.config.api['max-name-history']) {
      limit = res.length;
    }
    for (let i = 1; i <= limit; i += 1) {
      history.push(res[res.length - i]);
    }
    return history;
  }

  async getMojangAPI(apiPath) {
    if (this.config.api.ratelimit && this.apiLimited) {
      await delay(1000);
      return this.getMojangAPI(apiPath);
    }
    this.apiLimited = true;
    console.log('[INFO] API REQUEST:', apiPath);
    let body;
    try {
      body = await request({
        url: apiPath,
        ...reqOpts,
      });
    } catch (err) {
      console.error('[ERROR] API REQUEST:', apiPath, err);
      this.apiLimited = false;
      throw new Error(err);
    }
    setTimeout(() => {
      this.apiLimited = false;
    }, 1500);
    return JSON.parse(body);
  }

  async getPlayerAssets(uuid, playerpath) {
    try {
      fs.ensureDirSync(playerpath);
    } catch (error) {
      throw new Error(error);
    }
    const skinapipath = `https://sessionserver.mojang.com/session/minecraft/profile/${uuid}`;

    let res;
    try {
      res = await this.getMojangAPI(skinapipath);
    } catch (err) {
      console.error('[ERROR] SKIN API', skinapipath, err);
      throw new Error(err);
    }
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

  static download(apiPath, dest) {
    console.log('[INFO] DOWNLOAD:', apiPath);
    request
      .get(apiPath)
      .on('error', (err) => {
        console.error('[ERROR] DOWNLOAD:', apiPath, err);
      })
      .pipe(fs.createWriteStream(dest));
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

  createPlayerData(uuid, banlist) {
    return new Promise(async (resolve, reject) => {
      if (banlist.indexOf(uuid) !== -1 && !this.config.render['render-banned']) {
        return reject();
      }
      let data;
      try {
        data = await this.getPlayerData(uuid, { banlist });
      } catch (error) {
        console.log(error);
        return reject(error);
      }
      data = {
        stats: data[0],
        advancements: data[1],
        data: data[2],
      };
      if (data && data.stats && data.data) {
        const playerpath = path.join(this.config.BASEPATH, this.config.render.output, data.data.uuid_short);
        try {
          await this.getPlayerAssets(data.data.uuid_short, playerpath);
        } catch (error) {
          console.log(error);
        }
        if (this.config.render.json) {
          Utils.writeJSON(path.join(playerpath, 'stats.json'), data);
        }
        return resolve(data);
      }
      return reject();
    });
  }
}
