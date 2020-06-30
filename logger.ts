import log4js from 'log4js'

log4js.configure({
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

export const Default = log4js.getLogger('Default')
export const Config = log4js.getLogger('Config')
export const PlayerData = log4js.getLogger('PlayerData')
export const MojangAPI = log4js.getLogger('MojangAPI')
export const Assets = log4js.getLogger('Assets')
export const WriteJSON = log4js.getLogger('WriteJSON')
