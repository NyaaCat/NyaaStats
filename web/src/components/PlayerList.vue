<template>
  <div>
    <b-alert variant="danger"
             dismissible
             :show="showNetworkErrorAlert"
             @dismissed="showNetworkErrorAlert=false">
      Network Error!
    </b-alert>
    <div class="row">
      <playerblock v-for="player in players" :key="player.uuid" v-bind:player="player"></playerblock>
    </div>
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
      showNetworkErrorAlert: false,
    };
  },
  async beforeMount() {
    let data;
    try {
      data = await axios.get('/static/data/players.json');
    } catch (error) {
      this.showNetworkErrorAlert = true;
      return;
    }
    this.players = data.data;
  },
  components: {
    playerblock: PlayerBlock,
  },
};
</script>
