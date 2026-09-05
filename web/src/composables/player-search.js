/**
 * Return players matching a name, historical name, or UUID.
 *
 * Match groups are kept in the same priority order as the original home page
 * search: current name, historical name, then UUID.
 *
 * @param {Array} playerList
 * @param {String} rawKeyword
 * @returns {Array | null}
 */
export function searchPlayers (playerList = [], rawKeyword = '') {
  const keyword = rawKeyword?.trim().toLowerCase() ?? ''

  if (!keyword || !/^[0-9a-z_-]+$/.test(keyword)) return null

  const canMatchName = keyword.length <= 16 && !keyword.includes('-')
  const uuidKeyword = keyword.replace(/-/g, '')
  const canMatchUuid = uuidKeyword.length > 0 && /^[0-9a-f]+$/.test(uuidKeyword)
  const keywordLen = keyword.length
  const result = [[], [], []] // [ matchPlayername, matchHistory, matchUuid ]

  for (const {uuid, playername, names = []} of playerList) {
    const r = {
      uuid,
      playername,
      historyName: null,
    }
    let rIdx = null

    if (canMatchName) {
      const currentMatch = playername.toLowerCase().indexOf(keyword)
      if (currentMatch >= 0) {
        rIdx = 0
        r.playername = [playername, currentMatch, currentMatch + keywordLen]
      }

      const {name: historyMatch} = names.slice(1).find(n => n.name.toLowerCase().includes(keyword)) ?? {}
      if (historyMatch) {
        if (rIdx === null) rIdx = 1
        const match = historyMatch.toLowerCase().indexOf(keyword)
        r.historyName = [historyMatch, match, match + keywordLen]
      }
    }

    if (canMatchUuid) {
      const match = uuid.indexOf(uuidKeyword)
      if (match >= 0) {
        if (rIdx === null) rIdx = 2
        r.uuid = [uuid, match, match + uuidKeyword.length]
      }
    }

    if (rIdx !== null) {
      result[rIdx].push(r)
    }
  }

  result[0].sort((a, b) => a.playername[1] - b.playername[1])
  result[1].sort((a, b) => a.historyName[1] - b.historyName[1])
  result[2].sort((a, b) => a.uuid[1] - b.uuid[1])

  return result.flat()
}

export default searchPlayers
