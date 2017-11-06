<template>
  <div id="app">
    <nav class="navbar navbar-inverse navbar-fixed-top">
      <div class="container">
          <div class="navbar-header">
              <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
                  <span class="sr-only">Toggle navigation</span>
                  <span class="icon-bar"></span>
                  <span class="icon-bar"></span>
                  <span class="icon-bar"></span>
              </button>
              <a class="navbar-brand" href="/">Kedama-Koiru Monogatari Player Stats</a>
          </div>
          <div id="navbar" class="navbar-collapse collapse">
              <form class="navbar-form navbar-right">
                  <div class="form-group">
                      <input type="text" placeholder="Search Player..." class="form-control" id="search">
                  </div>
              </form>
          </div><!--/.navbar-collapse -->
      </div>
    </nav>
    <div class="jumbotron">
      <div class="container">
        <h1>Kedama-Koiru Monogatari</h1>
        <p>Server time elapsed a year</p>

        <p><a class="btn btn-primary btn-lg" href="https://www.craft.moe" role="button">Learn more &raquo;</a></p>

      </div>
    </div>
    <div class="container">
      <div class="row">
        <playerblock v-for="player in players" :key="player.uuid" v-bind:player="player"></playerblock>
      </div>
      <hr/>
      <footer>
        <p>Test</p>
        <p class="text-muted">
            Last Update Test
        </p>
      </footer>
    </div>
    <b-alert variant="danger"
             dismissible
             :show="showNetworkErrorAlert"
             @dismissed="showNetworkErrorAlert=false">
      Network Error!
    </b-alert>
  </div>
</template>

<script>
import axios from 'axios';
import PlayerBlock from './components/PlayerBlock';

export default {
  name: 'app',
  data() {
    return {
      players: [],
      showNetworkErrorAlert: false,
    };
  },
  async mounted() {
    let data;
    try {
      data = await axios.get('/static/data/players.json');
    } catch (error) {
      this.showNetworkErrorAlert = true;
    }
    this.players = data.data.players;
  },
  components: {
    playerblock: PlayerBlock,
  },
};
</script>

<style>
#app {
  font-family: Tahoma, Helvetica, Arial, "Microsoft Yahei", "微软雅黑", STXihei,
    "华文细黑", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
body {
  padding-top: 50px;
  padding-bottom: 20px;
}

@media (max-width: 767px) {
  .row {
    margin: -5px;
  }
}

.text-middle {
  vertical-align: middle;
}

.achievements {
  width: 32px;
  height: 32px;
}

.name-qs {
  display: none;
}
.navbar {
  margin-bottom: 0;
}
</style>
