<template>
  <div class="flex flex-col">
    <Welcome />
    <!-- Loading indicator -->
    <ProgressBar :visible="playerList.length === 0" />
    <section class="border-b border-gray-300">
      <SearchBox @focus="isSearchBoxFocused = true" @blur="isSearchBoxFocused = false" />
    </section>
    <section v-show="!keyword" :class="['xl:w-page xl:mx-auto px-page transition-opacity duration-200 ease-linear', {'opacity-25': isSearchBoxFocused}]">
      <p class="h-14 flex items-center">{{ t('nyaa.player_list.yesterday_active_count_label') + t('nyaa.symbol.colon_s') + yesterdayPlayers.length }}</p>
      <PlayerGrid :data="yesterdayPlayers" />
    </section>
    <section v-if="searchResult" class="xl:w-page xl:mx-auto px-page">
      <p class="h-14 flex items-center">{{ t('nyaa.player_list.search_result_total_label') + t('nyaa.symbol.colon_s') + searchResult.length }}</p>
      <PlayerList :data="searchResult" />
    </section>
  </div>
</template>

<script>
  import {mapState} from 'vuex'
  import {isYesterday} from 'date-fns'

  import Welcome from '@/components/Welcome.vue'
  import ProgressBar from '@/components/ProgressBar.vue'
  import SearchBox from '@/components/SearchBox'
  import PlayerGrid from '@/components/PlayerGrid.vue'
  import PlayerList from '@/components/PlayerList.vue'
  import useRandomPlayer from '@/composables/random-player'

  export default {
    components: {
      Welcome,
      ProgressBar,
      SearchBox,
      PlayerGrid,
      PlayerList,
    },

    data () {
      const {stopRandom} = useRandomPlayer()

      return {
        isSearchBoxFocused: false,

        stopRandom,
      }
    },

    computed: {
      ...mapState(['playerList']),

      yesterdayPlayers () {
        return process.env.NODE_ENV === 'development'
          ? this.playerList.filter(p => p.playername.length <= 3 || p.playername.length >= 16)
          : this.playerList.filter(p => isYesterday(p.seen))
      },

      keyword () {
        return this.$store.state.keyword?.trim().toLowerCase() ?? ''
      },

      searchResult () {
        if (!/^[0-9a-z_-]+$/.test(this.keyword)) return

        const canMatchName = this.keyword.length <= 16 && !this.keyword.includes('-')
        const canMatchUuid = /^[0-9a-f-]+$/.test(this.keyword)
        const keywordLen = this.keyword.length
        const result = [[], [], []] // [ matchPlayername, matchHistory, matchUuid ]

        for (const {uuid, playername, names} of this.playerList) {
          const r = {
            uuid,
            playername,
            historyName: null,
          }
          let rIdx = null

          if (canMatchName) {
            const currentMatch = playername.toLowerCase().indexOf(this.keyword)
            if (currentMatch >= 0) {
              rIdx = 0
              r.playername = [playername, currentMatch, currentMatch + keywordLen]
            }

            const {name: historyMatch} = names.slice(1).find(n => n.name.toLowerCase().includes(this.keyword)) ?? {}
            if (historyMatch) {
              if (rIdx === null) rIdx = 1
              const match = historyMatch.toLowerCase().indexOf(this.keyword)
              r.historyName = [historyMatch, match, match + keywordLen]
            }
          }

          if (canMatchUuid) {
            const keyword = this.keyword.replace(/-/g, '')
            const match = uuid.indexOf(keyword)
            if (match >= 0) {
              if (rIdx === null) rIdx = 2
              r.uuid = [uuid, match, match + keywordLen]
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
      },
    },

    watch: {
      '$store.state.info.lastUpdate': {
        immediate: true,
        handler (val) {
          if (val) {
            this.$store.commit('setFooterUpdateTime', val)
          }
        },
      },
    },

    beforeRouteEnter (to, from, next) {
      next(vm => {
        document.title = vm.$store.state.info.title
        vm.stopRandom()
      })
    },
  }
</script>
