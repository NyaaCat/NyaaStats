import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
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
