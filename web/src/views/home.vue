<template>
  <div class="flex flex-col">
    <section class="border-b border-gray-300 bg-gray-50">
      <Welcome />
    </section>
    <section class="relative min-h-[var(--spacing-header)] px-page xl:mx-auto xl:w-page">
      <p v-if="playerList.length === 0" class="absolute inset-0 flex items-center justify-center tracking-widest text-gray-600">LOADING</p>
      <template v-else>
        <div class="flex h-14 items-center justify-between">
          <p>{{ t('nyaa.player_list.yesterday_active_count_label') + t('nyaa.symbol.colon_s') + yesterdayPlayers.length }}</p>
          <button class="text-blue-600" type="button" @click="goRandom">{{ t('nyaa.general.go_random_player') }}</button>
        </div>
        <PlayerGrid :data="yesterdayPlayers" />
      </template>
    </section>
  </div>
</template>

<script>
  import {mapState} from 'vuex'
  import {isYesterday} from 'date-fns'

  import Welcome from '@/components/welcome.vue'
  import PlayerGrid from '@/components/player-grid.vue'
  import useRandomPlayer from '@/composables/random-player'

  export default {
    components: {
      Welcome,
      PlayerGrid,
    },

    data () {
      const {stopRandom, goRandom} = useRandomPlayer()

      return {
        stopRandom,
        goRandom,
      }
    },

    computed: {
      ...mapState(['playerList']),

      yesterdayPlayers () {
        return import.meta.env.DEV
          ? this.playerList.filter(p => p.playername.length <= 3 || p.playername.length >= 16)
          : this.playerList.filter(p => isYesterday(p.seen))
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
