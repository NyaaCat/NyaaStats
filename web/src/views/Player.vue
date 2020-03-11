<template>
  <div class="player-page container">
    <ProgressBar :visible="!player" />
    <template v-if="player">
      <div class="h-12 flex items-center">
        <strong class="text-2xl">{{ player.data.playername }}</strong>
        <span v-if="player.data.banned" class="ml-2 p-1 text-xs rounded bg-red-600 text-white">BANNED</span>
      </div>

      <div class="lg:flex lg:items-start">
        <div class="border border-gray-400 rounded shadow-sm lg:flex-none lg:w-48 ">
          <img
            v-if="!isCanvasSupported"
            :src="`/data/${uuid}/body.png`"
            :alt="`${player.data.playername}'s model`"
            class="img-rounded"
          >
          <iframe
            v-if="isCanvasSupported"
            :src="`/skin/index.html?uuid=${uuid}`"
            scrolling="no"
            class="skin"
          />
        </div>
        <div class="lg:flex-1 lg:ml-8 mt-5 lg:mt-0 lg:flex lg:items-start">
          <Membership :player="player" class="lg:flex-1 rounded shadow-sm" />
          <NameHistory :player="player" class="lg:flex-1 lg:ml-8 mt-5 lg:mt-0 rounded shadow-sm" />
        </div>
      </div>

      <PlayerAdvancement :player="player" />

      <PlayerStatistic :player="player" />

      <NyaaFooter :player="player" />
    </template>
  </div>
</template>

<script>
  import { mapState } from 'vuex'

  import store from '../store'
  import ProgressBar from '@/components/ProgressBar.vue'
  import NameHistory from '../components/NameHistory'
  import Membership from '../components/Membership'
  import PlayerAdvancement from '../components/PlayerAdvancement'
  import PlayerStatistic from '../components/PlayerStatistic'
  import NyaaFooter from '../components/Footer'

  export default {
    name: 'PlayerPage',

    components: {
      ProgressBar,
      NameHistory,
      Membership,
      PlayerAdvancement,
      PlayerStatistic,
      NyaaFooter,
    },

    data() {
      return {
        mutableInfo: null,
        player: null,
        uuid: '',
        showNetworkErrorAlert: false,
        progress: 0,
      }
    },

    computed: {
      ...mapState(['info']),
      isCanvasSupported() {
        const elem = document.createElement('canvas')
        return !!(elem.getContext && elem.getContext('2d'))
      },
    },

    async beforeRouteEnter(to, from, next) {
      const uuid = to.params.uuid
      const player =
        store.state.players[uuid] || (await store.dispatch('fetchStats', uuid))
      next(vm => void vm.setPlayerData(uuid, player))
    },

    mounted() {
      const timer = setInterval(() => {
        this.progress += 20
        if (this.progress === 80) {
          clearInterval(timer)
        }
      }, 100)
      this.$el.scrollTop = 0
    },

    methods: {
      setPlayerData(uuid, data) {
        this.progress = 100
        this.uuid = uuid
        this.player = data
        document.title = `${this.player.data.playername} | ${this.info.title}`
      },
    },
  }
</script>

<style scoped>
  .skin {
    width: 100%;
    height: 285px;
    border: none;
    overflow: hidden;
  }
</style>
