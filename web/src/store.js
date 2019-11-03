import Vue from 'vue'
import Vuex from 'vuex'

import langData from '@/assets/lang.json'

Vue.use(Vuex)

const store = new Vuex.Store({
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

    lang: 'zh_cn',
  },

  getters: {},

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

    setLang(state, value) {
      state.lang = value
    },
  },
})

Vue.mixin({
  computed: {
    lang() {
      const lang = this.$store.state.lang
      return key => langData[lang][key]
    },
  },
})

export default store
