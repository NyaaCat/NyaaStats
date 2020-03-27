import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

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
    keyword: '',

    footerUpdateTime: null,
  },

  mutations: {
    setInfo (state, data) {
      state.info = data
    },

    setPlayer (state, [uuid, data]) {
      state.players[uuid] = data
    },

    setPlayerList (state, data) {
      state.playerList = data
    },

    setKeyword (state, keyword) {
      state.keyword = keyword
    },

    setFooterUpdateTime (state, value) {
      state.footerUpdateTime = value
    },
  },

  actions: {
    async fetchInfo ({commit}) {
      let data

      try {
        data = (await axios.get('/data/info.json')).data
      } catch (e) {
        console.error(e)
        return Promise.reject(e)
      }

      commit('setInfo', data)
      return data
    },

    async fetchPlayers ({commit}) {
      let data

      try {
        data = (await axios.get('/data/players.json')).data
      } catch (e) {
        console.error(e)
        return Promise.reject(e)
      }

      commit('setPlayerList', data)
      return data
    },

    async fetchStats ({commit}, uuid) {
      let data

      try {
        data = (await axios.get(`/data/${uuid}/stats.json`)).data
      } catch (e) {
        console.error(e)
        return Promise.reject(e)
      }

      commit('setPlayer', [uuid, data])
      return data
    },
  },
})

export default store
