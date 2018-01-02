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
      console.error('[ERROR][LoadConfig] CONFIGURATION:', e.code);
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

  getPlayerState(uuid) {
    return new Promise((resolve, reject) => {
      if (!this.config.render.stats) return reject();
      const statsfile = path.join(this.config.BASEPATH, this.config.render.stats, `${uuid}.json`);
      let data;
      try {
        data = fs.readFileSync(statsfile);
      } catch (error) {
        console.error('[ERROR][PlayerData] READ:', statsfile, error);
        return reject();
      }
      console.log('[INFO][PlayerData] READ:', statsfile);
      return resolve(JSON.parse(data));
    });
  }

  getPlayerAdvancements(uuid) {
    return new Promise((resolve, reject) => {
      // compatible to 1.11
      if (!this.config.render.advancements) return reject();
      const advancementsfile = path.join(this.config.BASEPATH, this.config.render.advancements, `${uuid}.json`);

      let data;
      try {
        data = fs.readFileSync(advancementsfile);
      } catch (error) {
        console.error('[ERROR][PlayerData] READ:', advancementsfile, error);
        return reject();
      }
      console.log('[INFO][PlayerData] READ:', advancementsfile);
      return resolve(JSON.parse(data));
    });
  }

  getPlayerData(uuid) {
    const datafile = path.join(this.config.BASEPATH, this.config.render.playerdata, `${uuid}.dat`);
    return new Promise((resolve, reject) => {
      const nbt = new NBT();
      nbt.loadFromZlibCompressedFile(datafile, async (err) => {
        if (err) {
          console.error('[ERROR][PlayerData] READ:', datafile, err);
          return reject();
        }
        console.log('[INFO][PlayerData] PARSE NBT:', datafile);
        const uuidShort = uuid.replace(/-/g, '');
        let history;
        try {
          history = await this.getNameHistory(uuidShort);
        } catch (error) {
          return reject();
        }
        if (history && history[0]) {
          let lived = '';
          if (nbt.select('').select('Spigot.ticksLived')) {
            lived = nbt.select('').select('Spigot.ticksLived').getValue() / 20;
          }
          const timeStart = bignum(nbt.select('').select('bukkit').select('firstPlayed').getValue()).toNumber();
          const timeLast = bignum(nbt.select('').select('bukkit').select('lastPlayed').getValue()).toNumber();
          const pdata = {
            seen: timeLast,
            time_start: timeStart,
            time_last: timeLast,
            time_lived: lived,
            playername: history[0].name,
            names: history,
            uuid_short: uuidShort,
            lastUpdate: (new Date()).valueOf(),
            uuid,
          };
          return resolve(pdata);
        }
        return reject();
      });
    });
  }

  async getPlayerTotalData(uuid) {
    let stats;
    let advancements;
    let data;
    try {
      stats = await this.getPlayerState(uuid);
      advancements = await this.getPlayerAdvancements(uuid);
      data = await this.getPlayerData(uuid);
    } catch (error) {
      return null;
    }
    return {
      stats,
      advancements,
      data,
    };
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
      await delay(10);
      return this.getMojangAPI(apiPath);
    }
    this.apiLimited = true;
    console.log('[INFO][MojangAPI] API REQUEST:', path);

    let body;
    try {
      body = await request({
        url: apiPath,
        ...reqOpts,
      });
    } catch (err) {
      console.error('[ERROR][MojangAPI] API REQUEST:', path, err);
      setTimeout(() => {
        this.apiLimited = false;
      }, this.config.api.ratelimit * 3000);
      throw new Error(err);
    }

    setTimeout(() => {
      this.apiLimited = false;
    }, this.config.api.ratelimit * 1000);


    return JSON.parse(body);
  }

  static defaultSkin(uuid) {
    // great thanks to Minecrell for research into Minecraft and Java's UUID hashing!
    // https://git.io/xJpV
    // MC uses `uuid.hashCode() & 1` for alex
    // that can be compacted to counting the LSBs of every 4th byte in the UUID
    // an odd sum means alex, an even sum means steve
    // XOR-ing all the LSBs gives us 1 for alex and 0 for steve
    const isEven = (c) => {
      if (c >= '0' && c <= '9') {
        return (c & 1) === 0; // eslint-disable-line
      } else if (c >= 'a' && c <= 'f') {
        return (c & 1) === 1; // eslint-disable-line
      }
      console.log('Invalid digit', c);
      return null;
    };
    const lsbsEven =
      (isEven(uuid[7]) !== isEven(uuid[23])) !== (isEven(uuid[15]) !== isEven(uuid[31]));
    return lsbsEven ? 'Alex' : 'Steve';
  }

  static async getPlayerAssets(uuid, playerpath) {
    try {
      fs.ensureDirSync(playerpath);
    } catch (error) {
      throw new Error(error);
    }

    const apiPrefixAvatar = 'https://crafatar.com/avatars/';
    const apiPrefixBody = 'https://crafatar.com/renders/body/';
    const apiPrefixSkin = 'https://crafatar.com/skins/';

    const slim = `&default=MHF_${Utils.defaultSkin(uuid)}`;

    Utils.download(
      `${apiPrefixAvatar}${uuid}?size=64&overlay${slim}`,
      path.join(playerpath, 'avatar.png'),
    );
    Utils.download(
      `${apiPrefixBody}${uuid}?size=128&overlay${slim}`,
      path.join(playerpath, 'body.png'),
    );
    Utils.download(
      `${apiPrefixSkin}${uuid}?${slim}`,
      path.join(playerpath, 'skin.png'),
    );
  }

  static download(apiPath, dest) {
    console.log('[INFO][ASSETS] DOWNLOAD:', path);
    request
      .get(apiPath)
      .on('error', (err) => {
        console.error('[ERROR][ASSETS] DOWNLOAD:', path, err);
      })
      .pipe(fs.createWriteStream(dest));
  }

  static writeJSON(dest, data) {
    fs.writeFile(dest, JSON.stringify(data), (err) => {
      if (err) {
        console.error('[ERROR][WriteJSON] CREATE:', dest, err);
      } else {
        console.log('[INFO][WriteJSON] CREATE:', dest);
      }
    });
  }

  createPlayerData(uuid, banned = false) {
    return new Promise(async (resolve, reject) => {
      const playerpath = path.join(this.config.BASEPATH, this.config.render.output, uuid.replace(/-/g, ''));
      let data;
      try {
        if (fs.existsSync(path.join(playerpath, 'stats.json'))) {
          data = JSON.parse(fs.readFileSync(path.join(playerpath, 'stats.json')));
        } else {
          data = await this.getPlayerTotalData(uuid, banned);
        }
      } catch (error) {
        return reject(error);
      }
      if (fs.existsSync(path.join(playerpath, 'avatar.png') && path.join(playerpath, 'body.png'))) {
        return resolve(data);
      } else if (data && data.stats && data.data) {
        try {
          await Utils.getPlayerAssets(uuid.replace(/-/g, ''), playerpath);
        } catch (error) {
          console.log(error);
        }
        data.data = {
          ...data.data,
          banned,
        };
        Utils.writeJSON(path.join(playerpath, 'stats.json'), data);
        return resolve(data);
      }
      return reject();
    });
  }
}
