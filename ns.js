'use strict';

var fs = require('fs-extra');
var path = require('path');
var NBT = require('mcnbt');
var yaml = require('js-yaml');
var ejs = require('ejs');
var async = require('async');
var ncp = require('ncp');
var request = require('request');
var bignum = require('bignum');
var moment = require('moment');

var reqOpts = {
    timeout: 30000, // 30 secs
    pool: false
};

var ncpOpts = {
    filter: function (filepath) {
        var filename = path.basename(filepath);
        return filename.indexOf('.') !== 0;
    }
};

try {
    var config = yaml.safeLoad(fs.readFileSync('./config.yml'), 'utf8');
} catch (e) {
    console.error('[ERROR] CONFIGURATION:', e.code);
    process.exit(1);
}
config.BASEPATH = path.parse(path.resolve('./config.yml')).dir;

var playerlist = [];
if (config['render'].whitelist) {
    playerlist = getWhitelistedPlayers();
} else {
    playerlist = getAllPlayers();
}

var output = path.join(config.BASEPATH, config['render'].output);
console.log('[INFO] CREATE:', output);
fs.emptyDir(output, function (err) {
    if (err) throw err;
    ncp(
        path.join(config.BASEPATH, 'template', 'static'),
        path.join(config.BASEPATH, config['render'].output),
        ncpOpts,
        function (err) {
            if (err) {
                console.error('[ERROR] ASSETS:', err);
            } else {
                console.log('[INFO] ASSETS: Synced');
            }
        });
    getPlayerData(playerlist, function (data) {
        data = filter(data);
        data.sort(function (a, b) {
            return b._seen - a._seen; // sort by activity
        });
        getWorldTime(function (wtime) {
            async.eachSeries(data, function (player, callback) {
                if (player.data && player.stats && player.data.uuid) {
                    // all data retrieved
                    var playerpath = path.join(config.BASEPATH, config['render'].output, player.data.uuid_short);
                    fs.ensureDir(playerpath, function (err) {
                        var skinapipath = 'https://sessionserver.mojang.com/session/minecraft/profile/' + player.data.uuid_short;
                        getMojangAPI(skinapipath, function (err, res) {
                            if (err || !res) {
                                console.error('[ERROR] SKIN API', skinapipath, err);
                            } else {
                                var apiprefix_avatar = 'https://crafatar.com/avatars/';
                                var apiprefix_body = 'https://crafatar.com/renders/body/';
                                var slim = '';
                                res.properties.forEach(function (t) {
                                    if (t.name === 'textures') {
                                        var texture = JSON.parse(new Buffer(t.value, 'base64').toString('ascii'));
                                        if (texture.textures.SKIN) {
                                            if (texture.textures.SKIN.metadata && texture.textures.SKIN.metadata.model === 'slim') {
                                                // Alex model
                                                slim = '&default=MHF_Alex&overlay';
                                            }
                                        }
                                    }
                                });
                                download(
                                    apiprefix_avatar + player.data.uuid_short + '?size=64' + slim,
                                    path.join(playerpath, 'avatar.png')
                                );
                                download(
                                    apiprefix_body + player.data.uuid_short + '?size=128' + slim,
                                    path.join(playerpath, 'body.png')
                                );
                            }
                        });
                        render(
                            path.join(config.BASEPATH, 'template', 'ejs', 'player.ejs'),
                            path.join(playerpath, 'index.html'),
                            {
                                playerdata: player,
                                config: config,
                                moment: moment,
                                lang: JSON.parse(fs.readFileSync(path.join(config.BASEPATH, 'template', 'lang.json')))
                            }
                        );
                    });
                }
                callback();
            }, function () {
                render(
                    path.join(config.BASEPATH, 'template', 'ejs', 'index.ejs'),
                    path.join(config.BASEPATH, config['render'].output, 'index.html'),
                    {
                        playerdata: data,
                        wtime: wtime,
                        config: config,
                        moment: moment
                    }
                );
            });
        });
    });
});

function getWorldTime(callback) {
    var nbt = new NBT();
    nbt.loadFromZlibCompressedFile(path.join(config.BASEPATH, config['render'].level), function (err) {
        if (err) throw err;
        callback(bignum(nbt.select("").select("Data").select("Time").getValue()).toNumber() / 20);
    });
}

function getAllPlayers() {
    var uuids = [];
    var r = new RegExp(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
    fs.readdirSync(path.join(config.BASEPATH, config['render'].playerdata)).forEach(function (f) {
        var uuid = path.basename(f, '.dat');
        // filter out old player usernames.
        if (r.test(uuid)) {
            uuids.push(uuid);
        }
    });
    return uuids;
}

function getWhitelistedPlayers() {
    var uuids = [];
    JSON.parse(fs.readFileSync(config['render'].whitelist, 'utf8')).forEach(function (p) {
        uuids.push(p.uuid);
    });
    return uuids;
}

function getPlayerData(uuids, callback) {
    var banlist = [];
    if (config['render']['banned-players']) {
        var banned = JSON.parse(fs.readFileSync(path.join(config.BASEPATH, config['render']['banned-players']), 'utf8'));
        banned.forEach(function (ban) {
            banlist.push(ban.uuid);
        });
    }
    async.mapSeries(uuids, function (uuid, cb) {
        var datafile = path.join(config.BASEPATH, config['render'].playerdata, uuid + '.dat');
        var statsfile = path.join(config.BASEPATH, config['render'].stats, uuid + '.json');
        async.parallel({
            stats: function (taskcb) {
                fs.readFile(statsfile, function (error, data) {
                    if (error) {
                        console.log('[ERROR] READ:', statsfile, error);
                        return taskcb(null, {});
                    }
                    taskcb(null, JSON.parse(data));
                });
            },
            data: function (taskcb) {
                var nbt = new NBT();
                nbt.loadFromZlibCompressedFile(datafile, function (err) {
                    if (err) {
                        console.error('[ERROR] READ:', datafile, err);
                        return taskcb(null, {});
                    }
                    console.log('[INFO] PARSE:', datafile);
                    var uuid_short = uuid.replace(/-/g, '');
                    var api_namehistory = 'https://api.mojang.com/user/profiles/' + uuid_short + '/names';
                    getMojangAPI(api_namehistory, function (err, res) {
                        if (err || !res) {
                            console.error('[ERROR] API REQUEST:', api_namehistory, err);
                            return taskcb(null, {});
                        }
                        var lived = '';
                        if (nbt.select("").select("Spigot.ticksLived")) {
                            lived = nbt.select("").select("Spigot.ticksLived").getValue() / 20;
                        }
                        var pdata = {
                            time_start: bignum(nbt.select("").select("bukkit").select("firstPlayed").getValue()).toNumber(),
                            time_last: bignum(nbt.select("").select("bukkit").select("lastPlayed").getValue()).toNumber(),
                            time_lived: lived,
                            uuid: uuid,
                            uuid_short: uuid_short,
                            playername: res[res.length -1].name,
                            names: res
                        };
                        taskcb(null, pdata);
                    });
                });
            }
        }, function (err, d) {
            if (d.data && d.data.time_last) {
                d._seen = d.data.time_last;
                if (banlist.indexOf(d.data.uuid) !== -1) {
                    d.banned = true;
                }
            }
            cb(null, d);
        });
    }, function (err, playerdata) {
        callback(playerdata);
    });
}

function getMojangAPI(path, callback) {
    console.log('[INFO] API REQUEST:', path);
    request(path, reqOpts, function (err, res, body) {
        if (!err && res.statusCode == 200) {
            callback(null, JSON.parse(body));
        } else {
            console.error('[ERROR] API REQUEST:', path, err);
            callback(err);
        }
    });
}

function download(path, dest) {
    console.log('[INFO] DOWNLOAD:', path);
    request
        .get(path)
        .on('error', function (err) {
            console.error('[ERROR] DOWNLOAD:', path, err);
        })
        .pipe(fs.createWriteStream(dest));
}

function render(src, dest, data) {
    ejs.renderFile(src, data, function (err, html) {
        if (err) {
            return console.error('[ERROR] RENDER:', src, err);
        }
        console.log('[INFO] RENDER:', src);
        fs.writeFile(dest, html, function (err) {
            if (err) {
                return console.error('[ERROR] CREATE:', dest, err);
            }
            console.log('[INFO] CREATE:', dest);
        });
    });
}

function filter(playerdata) {
    var players = [];
    playerdata.forEach(function (p) {
        if (p.data && p.stats && p.data.uuid) {
            if (config['render']['render-banned']) {
                players.push(p);
            } else {
                if (!p.data.banned) {
                    players.push(p);
                }
            }
        }
    });
    return players;
}
