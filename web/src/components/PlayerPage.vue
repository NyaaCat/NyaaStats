<template>
  <div>
    <b-progress v-if="!player" :value="progress" :max="100" show-progress animated></b-progress>
    <div v-if="player">
      <div class="row">
        <div class="col-md-12">
          <h3>
            {{player.data.playername}}
            <span v-if="player.data.banned" class="label label-danger">BANNED</span>
          </h3>
        </div>
      </div>
      <div class="row">
        <div class="col-sm-12 col-md-3 col-lg-2 skin-container">
          <div class="panel panel-default">
            <div class="panel-body">
              <img v-if="!isCanvasSupported" :src="`/data/${uuid}/body.png`" :alt="`${player.data.playername}'s model`" class="img-rounded">
              <iframe v-if="isCanvasSupported" :src="`/skin/index.html?uuid=${uuid}`" class="skin" scrolling="no" />
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

      <div class="row">
        <ol class="breadcrumb">
          <li><router-link to="/">Home</router-link></li>
          <li>Player</li>
          <li class="active">{{player.data.playername}}</li>
        </ol>
      </div>

      <player-advancement :player="player" />
      <player-statistic :player="player" />

      <hr/>

      <nyaa-footer :player="player"></nyaa-footer>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { mapMutations, mapState } from 'vuex';

import { store } from '../main';
import NameHistory from './NameHistory';
import Membership from './Membership';
import PlayerAdvancement from './PlayerAdvancement';
import PlayerStatistic from './PlayerStatistic';
import Footer from './Footer';

export default {
  name: 'PlayerPage',
  data() {
    return {
      mutableInfo: null,
      player: null,
      uuid: '',
      showNetworkErrorAlert: false,
      progress: 0,
    };
  },
  async beforeRouteEnter(to, from, next) {
    const uuid = to.params.uuid;
    let player;
    if (!store.state.players[uuid]) {
      let data;
      try {
        data = await axios.get(`/data/${uuid}/stats.json`);
      } catch (error) {
        this.showNetworkErrorAlert = true;
        return;
      }
      player = data.data;
    } else {
      player = store.state.players[uuid];
    }
    next((vm) => {
      vm.setPlayerData(uuid, player);
    });
  },
  methods: {
    ...mapMutations([
      'setPlayer',
    ]),
    setPlayerData(uuid, data) {
      this.progress = 100;
      this.uuid = uuid;
      this.player = data;
      this.setPlayer({
        uuid,
        player: data,
      });
      document.title = `${this.info.title} - ${this.player.data.playername}`;
    },
    setInfoData(data) {
      this.mutableInfo = data;
    },
  },
  computed: {
    ...mapState([
      'info',
    ]),
    isCanvasSupported() {
      const elem = document.createElement('canvas');
      return !!(elem.getContext && elem.getContext('2d'));
    },
  },
  mounted() {
    const timer = setInterval(() => {
      this.progress += 20;
      if (this.progress === 80) {
        clearInterval(timer);
      }
    }, 100);
    this.$el.scrollTop = 0;
  },
  components: {
    NameHistory,
    Membership,
    PlayerAdvancement,
    PlayerStatistic,
    nyaaFooter: Footer,
  },
};
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
