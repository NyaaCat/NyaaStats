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
              />
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
            <membership :player="player"></membership>
            <name-history :player="player"></name-history>
          </div>
        </div>
      </div>

      <player-advancement :player="player" />
      <player-statistic :player="player" />

      <hr />

      <NyaaFooter :player="player" />
    </template>
  </div>
</template>

<script>
import axios from 'axios'
import { mapMutations, mapState } from 'vuex'

import store from '../store'
import NameHistory from './NameHistory'
import Membership from './Membership'
import PlayerAdvancement from './PlayerAdvancement'
import PlayerStatistic from './PlayerStatistic'
import NyaaFooter from './Footer'

export default {
  name: 'PlayerPage',
  data() {
    return {
      mutableInfo: null,
      player: null,
      uuid: '',
      showNetworkErrorAlert: false,
      progress: 0,
    }
  },
  async beforeRouteEnter(to, from, next) {
    const uuid = to.params.uuid
    let player
    if (!store.state.players[uuid]) {
      let data
      try {
        data = await axios.get(`/data/${uuid}/stats.json`)
      } catch (error) {
        this.showNetworkErrorAlert = true
        return
      }
      player = data.data
    } else {
      player = store.state.players[uuid]
    }
    next(vm => {
      vm.setPlayerData(uuid, player)
    })
  },
  methods: {
    ...mapMutations(['setPlayer']),
    setPlayerData(uuid, data) {
      this.progress = 100
      this.uuid = uuid
      this.player = data
      this.setPlayer({
        uuid,
        player: data,
      })
      document.title = `${this.info.title} - ${this.player.data.playername}`
    },
    setInfoData(data) {
      this.mutableInfo = data
    },
  },
  computed: {
    ...mapState(['info']),
    isCanvasSupported() {
      const elem = document.createElement('canvas')
      return !!(elem.getContext && elem.getContext('2d'))
    },
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
  components: {
    NameHistory,
    Membership,
    PlayerAdvancement,
    PlayerStatistic,
    NyaaFooter,
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
