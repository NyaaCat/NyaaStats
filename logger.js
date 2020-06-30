const log4js = require('log4js')

log4js.configure({
  level: 'info',
  appenders: {
    Default: {type: 'stdout'},
    Config: {type: 'stdout'},
    PlayerData: {type: 'stdout'},
    MojangAPI: {type: 'stdout'},
    Assets: {type: 'stdout'},
    WriteJSON: {type: 'stdout'},
  },
  categories: {
    default: {
      appenders: ['Default'],
      level: 'info',
    },
  },
})

exports.Default = log4js.getLogger('Default')
exports.Config = log4js.getLogger('Config')
exports.PlayerData = log4js.getLogger('PlayerData')
exports.MojangAPI = log4js.getLogger('MojangAPI')
exports.Assets = log4js.getLogger('Assets')
exports.WriteJSON = log4js.getLogger('WriteJSON')
