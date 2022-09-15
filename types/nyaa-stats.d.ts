interface NSConfig {
  web: {
    title?: string
    servername?: string
    homepage?: string
  }
  render: {
    crafatar: string
    level: string
    playerdata: string
    stats: string
    advancements: string
    whitelist?: string
    'banned-players'?: string
    'render-banned'?: boolean
    output: string
    'time-format': {
      full: string
      short: string
      compact: string
    }
    'confirm-clear-data'?: boolean
  }
  api: {
    ratelimit: number
  }
}

interface NSPlayerStatsJson {
  stats: {
    // FIXME: not really correct
    [key: string]: number
  }
  stats_source: {
    [key: string]: number
  }
  advancements: {
    [key: string]: {
      criteria: {
        [condition: string]: string
      }
      done: boolean
    }
  }
  data: NSPlayerInfoData
}

interface NSPlayerNameHistoryRecord {
  name: PlayerName
  detectedAt: UTCTimestamp
}

interface NSPlayerInfoData {
  uuid: LongUuid
  uuid_short: ShortUuid
  seen?: UTCTimestamp
  time_start?: UTCTimestamp
  time_last?: UTCTimestamp
  time_lived?: number
  playername: PlayerName
  names: Array<McNameHistoryRecord | NSPlayerNameHistoryRecord>
  banned?: boolean
  lastUpdate: UTCTimestamp
}
