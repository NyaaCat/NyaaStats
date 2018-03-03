// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'babel-polyfill';
import Vue from 'vue';
import Vuex from 'vuex';
import BootstrapVue from 'bootstrap-vue';
import VueLazyload from 'vue-lazyload';
import VueScrollTo from 'vue-scrollto';
import VueI18n from 'vue-i18n';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';


import App from './App';
import router from './router';

Vue.config.productionTip = false;
Vue.use(BootstrapVue);
Vue.use(VueLazyload, {
  lazyComponent: true,
});
Vue.use(VueScrollTo);
Vue.use(Vuex);
Vue.use(VueI18n);

export const store = new Vuex.Store({
  state: {
    info: {
      title: 'NyaaStats',
      servername: 'Minecraft Server',
      lastUpdate: 0,
      worldTime: 0,
    },
    players: {},
    playerList: [],
    scrollOffset: '',
    keyword: '',
  },
  mutations: {
    setInfo(state, payload) {
      state.info = {
        ...payload.info,
      };
    },
    setPlayer(state, payload) {
      state.players[payload.uuid] = {
        ...payload.player,
      };
    },
    setPlayerList(state, payload) {
      state.playerList = [
        ...payload.playerList,
      ];
    },
    setScrollOffset(state, payload) {
      state.scrollOffset = payload.uuid;
    },
    setKeyword(state, keyword) {
      state.keyword = keyword;
    },
  },
});

const i18n = new VueI18n({
  locale: 'en',
  fallbackLocale: 'en',
});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  i18n,
  template: '<App/>',
  components: { App },
  created() {
    this.$i18n.locale = (window.navigator.language || window.navigator.userLanguage).toLowerCase();
  },
});

export default store;
