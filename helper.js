import fs from 'fs-extra';
import request from 'request';
import inquirer from 'inquirer';

import * as logger from './logger';

export function download(apiPath, dest) {
  logger.Assets.info('DOWNLOAD', apiPath);
  request
    .get(apiPath)
    .on('error', (err) => {
      logger.Assets.error('DOWNLOAD', apiPath, err);
    })
    .pipe(fs.createWriteStream(dest));
}

export function writeJSON(dest, data) {
  fs.writeFile(dest, JSON.stringify(data), (err) => {
    if (err) {
      logger.WriteJSON.error('CREATE', dest, err);
    } else {
      logger.WriteJSON.info('CREATE', dest);
    }
  });
}

export function mergeStats(data) {
  let merged = {};
  if (data.hasOwnProperty('stats')) {
    for (let key in data.stats) {
      for (let s in data.stats[key]) {
        merged[key + '/' + s] = data.stats[key][s]
      }
    }
    merged['source'] = data.stats;
    return merged;
  }
  return data;
}

export function defaultSkin(uuid) {
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

export async function confirm(message, _default = true) {
  const prompt = inquirer.createPromptModule();
  try {
    const res = await prompt({
      type: 'confirm',
      name: 'confirm',
      default: _default,
      message,
    });
    return res.confirm;
  } catch (error) {
    logger.Default.error('Cannot get user input.');
    return false;
  }
}

export function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
