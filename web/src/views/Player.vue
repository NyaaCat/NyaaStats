<template>
  <div class="flex flex-col">
    <div class="page-section">
      <ProgressBar :visible="!player" />
    </div>
    <template v-if="player">
      <div class="page-section">
        <div class="py-4 flex items-center">
          <h1 class="text-3xl xl:text-4xl font-bold">{{ player.data.playername }}</h1>
          <span v-if="player.data.banned" class="ml-2 p-1 rounded bg-red-600 text-white font-medium">BANNED</span>
        </div>
      </div>
      <div class="page-section">
        <div class="md:flex md:items-start">
          <div class="border border-gray-300 rounded-md bg-gray-50 shadow-inner md:flex-1 lg:flex-none lg:w-64">
            <iframe
              v-if="isCanvasSupported"
              :src="`/skin/index.html?uuid=${uuid}`"
              scrolling="no"
              class="w-full border-0 rounded-md overflow-hidden bg-gray-50 shadow-inner"
              style="height: 285px;"
            />
            <img v-else :src="`/data/${uuid}/body.png`" :alt="`${player.data.playername}'s model`">
          </div>
          <div class="md:ml-5 md:flex-1 lg:flex lg:items-start">
            <Membership :player="player" class="md:flex-1 mt-8 md:mt-0" />
            <NameHistory :player="player" class="md:flex-1 lg:ml-5 mt-8 lg:mt-0" />
          </div>
        </div>
      </div>
      <PlayerAdvancement :player="player" class="mt-8" />
      <PlayerStatistic v-if="player" :player="player" />
    </template>
    <Footer :player="player" class="mt-auto" />
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
  import Footer from '../components/Footer'

  export default {
    name: 'PlayerPage',

    components: {
      ProgressBar,
      NameHistory,
      Membership,
      PlayerAdvancement,
      PlayerStatistic,
      Footer,
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
