<template>
  <div class="player-page">
    <b-progress
      v-if="!player"
      :value="progress"
      :max="100"
      show-progress
      animated
    />
    <template v-else>
      <div class="player-page-header flex items-center">
        <strong class="player-name">{{ player.data.playername }}</strong>
        <span v-if="player.data.banned" class="player-banned">BANNED</span>
      </div>

      <div class="row">
        <div class="col-sm-12 col-md-3 col-lg-2 skin-container">
          <div class="panel panel-default">
            <div class="panel-body">
              <img
                v-if="!isCanvasSupported"
                :src="`/data/${uuid}/body.png`"
                :alt="`${player.data.playername}'s model`"
                class="img-rounded"
              >
              <iframe
                v-if="isCanvasSupported"
                :src="`/skin/index.html?uuid=${uuid}`"
                class="skin"
                scrolling="no"
              />
            </div>
          </div>
        </div>
        <div class="col-sm-12 col-md-9 col-lg-10">
          <div class="row">
            <Membership :player="player" />
            <NameHistory :player="player" />
          </div>
        </div>
      </div>

      <PlayerAdvancement :player="player" />
      <PlayerStatistic :player="player" />

      <hr>

      <NyaaFooter :player="player" />
    </template>
  </div>
</template>

<script>
  import { mapState } from 'vuex'

  import store from '../store'
  import NameHistory from '../components/NameHistory'
  import Membership from '../components/Membership'
  import PlayerAdvancement from '../components/PlayerAdvancement'
  import PlayerStatistic from '../components/PlayerStatistic'
  import NyaaFooter from '../components/Footer'

  export default {
    name: 'PlayerPage',

    components: {
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

.panel-body {
  padding: 0;
}
</style>

<style>
.player-page .player-page-header {
  height: 50px;
}

.player-page .player-name {
  font-size: 24px;
}

.player-page .player-banned {
  font-size: 12px;
  line-height: 1;
  padding: 6px;
  border-radius: 3px;
  background: #d9534f;
  color: #fff;
  margin-left: 10px;
}
</style>
