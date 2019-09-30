import Vue from 'vue'
import Vuex from 'vuex'
import BootstrapVue from 'bootstrap-vue'
import VueLazyload from 'vue-lazyload'
import VueLazyComponent from '@xunlei/vue-lazy-component'
import VueScrollTo from 'vue-scrollto'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

import App from './App'
import router from './router'

Vue.config.productionTip = false
Vue.use(BootstrapVue)
Vue.use(VueLazyload)
Vue.use(VueLazyComponent)
Vue.use(VueScrollTo)
Vue.use(Vuex)

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
      }
    },
    setPlayer(state, payload) {
      state.players[payload.uuid] = {
        ...payload.player,
      }
    },
    setPlayerList(state, payload) {
      state.playerList = [...payload.playerList]
    },
    setScrollOffset(state, payload) {
      state.scrollOffset = payload.uuid
    },
    setKeyword(state, keyword) {
      state.keyword = keyword
    },
  },
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: x => x(App),
})

export default store
