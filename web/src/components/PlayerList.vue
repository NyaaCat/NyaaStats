<template>
  <div>
    <b-alert variant="danger"
             dismissible
             :show="showNetworkErrorAlert"
             @dismissed="showNetworkErrorAlert=false">
      Network Error!
    </b-alert>
    <b-progress v-show="loading" :value="100" :max="100" animated class="mb-3"></b-progress>
    <b-row class="searchbox">
      <b-col sm="12"><b-form-input id="input-none" type="text" v-model="keyword" placeholder="Search User Name"></b-form-input></b-col>
    </b-row>
    <lazy-component class="row">
      <playerblock v-for="(player, key, index) in players" :key="index" v-bind:player="player" v-show="search(player)"></playerblock>
    </lazy-component>
    <hr/>
  </div>
</template>

<script>
import axios from 'axios';
import PlayerBlock from './PlayerBlock';

export default {
  name: 'PlayerList',
  data() {
    return {
      players: [],
      result: [],
      showNetworkErrorAlert: false,
      keyword: '',
      searchTimer: null,
      loading: true,
    };
  },
  async mounted() {
    let data;
    try {
      data = await axios.get('/static/data/players.json');
    } catch (error) {
      this.showNetworkErrorAlert = true;
      return;
    }
    this.players = data.data;
    this.result = data.data.slice(0, 100);
    this.loading = false;
  },
  watch: {
    keyword: 'search',
  },
  methods: {
    search(player) {
      if (this.keyword.length < 1) {
        return true;
      }
      if (player.playername.toLowerCase().indexOf(this.keyword.toLowerCase()) !== -1) {
        return true;
      }
      for (let i = 0; i < player.names.length; i += 1) {
        if (player.names[i].name.toLowerCase().indexOf(this.keyword.toLowerCase()) !== -1) {
          return true;
        }
      }
      return false;
    },
  },
  components: {
    playerblock: PlayerBlock,
  },
};
</script>

<style scoped>
.searchbox {
  margin-bottom: 16px;
}
</style>

