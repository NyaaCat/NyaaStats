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
              <img v-if="!isCanvasSupported" :src="`/static/data/${uuid}/body.png`" :alt="`${player.data.playername}'s model`" class="img-rounded">
              <iframe v-if="isCanvasSupported" :src="`/static/skin/index.html?uuid=${uuid}`" class="skin" />
            </div>
          </div>
        </div>
        <div class="col-sm-12 col-md-9 col-lg-10">
          <div class="row">
            <membership :info="info" :player="player"></membership>
            <name-history :info="info" :player="player"></name-history>
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

      <player-advancement :player="player" :info="info" />
      <player-statistic :player="player" />

      <hr/>

      <nyaa-footer :info="info"></nyaa-footer>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

import NameHistory from './NameHistory';
import Membership from './Membership';
import PlayerAdvancement from './PlayerAdvancement';
import PlayerStatistic from './PlayerStatistic';
import Footer from './Footer';

export default {
  name: 'PlayerPage',
  props: ['info'],
  data() {
    return {
      player: null,
      uuid: '',
      showNetworkErrorAlert: false,
      progress: 0,
    };
  },
  async beforeRouteEnter(to, from, next) {
    const uuid = to.params.uuid;
    let data;
    try {
      data = await axios.get(`/static/data/${uuid}/stats.json`);
    } catch (error) {
      this.showNetworkErrorAlert = true;
      return;
    }
    next((vm) => {
      vm.setPlayerData(data.data);
      vm.setUUID(uuid);
    });
  },
  async beforeRouteUpdate(to, from, next) {
    this.player = null;
    this.progress = 0;
    const uuid = to.params.uuid;
    let data;
    try {
      data = await axios.get(`/static/data/${uuid}/stats.json`);
    } catch (error) {
      this.showNetworkErrorAlert = true;
      return;
    }
    this.setPlayerData(data.data);
    this.setUUID(uuid);
    next();
  },
  methods: {
    setPlayerData(data) {
      this.progress = 100;
      this.player = data;
    },
    setUUID(uuid) {
      this.uuid = uuid;
    },
  },
  computed: {
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
}
.panel-body {
  padding: 0;
}
</style>
