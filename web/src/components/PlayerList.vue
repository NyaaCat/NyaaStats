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
      <b-col sm="12"><b-form-input id="input-none" type="text" :value="keyword" @input="updateKeyword" placeholder="Search user by Name/UUID"></b-form-input></b-col>
    </b-row>
    <lazy-component class="row">
      <playerblock v-for="(player, key, index) in playerList" :key="index" :player="player" v-show="search(player)"></playerblock>
    </lazy-component>
    <hr/>
    <nyaa-footer></nyaa-footer>
  </div>
</template>

<script>
import axios from 'axios';
import { mapState, mapMutations } from 'vuex';
import VueScrollTo from 'vue-scrollto';

import PlayerBlock from './PlayerBlock';
import Footer from './Footer';

export default {
  name: 'PlayerList',
  data() {
    return {
      showNetworkErrorAlert: false,
      searchTimer: null,
      loading: true,
      timer: null,
      isScrolled: false,
    };
  },
  async mounted() {
    if (this.playerList.length < 1) {
      let data;
      try {
        data = await axios.get('/static/data/players.json');
      } catch (error) {
        this.showNetworkErrorAlert = true;
        return;
      }
      this.setPlayerList({
        playerList: data.data,
      });
    }
    this.loading = false;
  },
  watch: {
    keyword: 'lazyload',
  },
  computed: mapState([
    'playerList',
    'scrollOffset',
    'info',
    'keyword',
  ]),
  methods: {
    ...mapMutations([
      'setPlayerList',
      'setScrollOffset',
      'setKeyword',
    ]),
    lazyload() {
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.$Lazyload.lazyLoadHandler();
      }, 200);
    },
    search(player) {
      if (this.keyword.length < 1) {
        return true;
      }
      const keyword = this.keyword.toLowerCase();
      if (player.uuid.indexOf(keyword) !== -1) {
        return true;
      }
      if (player.playername.toLowerCase().indexOf(keyword) !== -1) {
        return true;
      }
      return player.names.some((name) => {
        if (name.name.toLowerCase().indexOf(keyword) !== -1) {
          return true;
        }
        return false;
      });
    },
    updateKeyword(e) {
      this.setKeyword(e);
    },
  },
  beforeRouteLeave(to, from, next) {
    const uuid = to.params.uuid;
    this.setScrollOffset({
      uuid,
    });
    next();
  },
  updated() {
    this.$nextTick(() => {
      if (this.scrollOffset.length === 32 && !this.isScrolled) {
        setTimeout(() => {
          VueScrollTo.scrollTo(`[data-uuid="${this.scrollOffset}"]`, 500, {
            duration: 500,
            easing: 'ease-in',
            offset: -65,
            cancelable: false,
          });
        }, 100);
      }
      this.isScrolled = true;
    });
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      document.title = vm.info.title;
    });
  },
  components: {
    playerblock: PlayerBlock,
    nyaaFooter: Footer,
  },
};
</script>

<style scoped>
.searchbox {
  margin-bottom: 16px;
}
</style>

