type LongUuid = string // "12345678-90ab-cdef-1234-567890abcdef"
type ShortUuid = string // "1234567890abcdef1234567890abcdef"
type Uuid = LongUuid | ShortUuid
type PlayerName = string
type UTCTimestamp = number
type TickTime = number

interface McWhitelistRecord {
  uuid: LongUuid
  name: PlayerName
}

type McWhitelistJson = McWhitelistRecord[]

interface McBannedPlayerRecord {
  uuid: LongUuid
  name: string
  created: string
  source: string
  expires: string
  reason: string
}

type McBannedPlayersJson = McBannedPlayerRecord[]

type McPlayerStatsJson = Json // FIXME: implement it

type McPlayerAdvancementsJson = Json // FIXME: implement it

interface McNameHistoryRecord {
  name: string
  changedToAt?: UTCTimestamp
}

type McNameHistory = McNameHistoryRecord[]

interface McPlayerProfile {
  id: ShortUuid
  name: PlayerName
  legacy?: true
  properties: [
    {
      name: 'textures'
      value: string
      signature?: string
    }
  ]
}

interface McPlayerTextures {
  timestamp: UTCTimestamp
  profileId: ShortUuid
  profileName: PlayerName
  signatureRequired?: true
  textures: {
    SKIN?: {
      url: string
      metadata?: {
        model: 'slim'
      }
    }
    CAPE?: {
      url: string
    }
  }
}
