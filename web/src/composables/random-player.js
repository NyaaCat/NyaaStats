import Vue from 'vue'

import $store from '@/store'
import $router from '@/router'

const state = Vue.observable({
  randomMode: false,
})

function goRandom () {
  state.randomMode = true
  // TODO: Implement `usePlayerList`
  const idx = Math.floor(Math.random() * $store.state.playerList.length)
  $router.push('/player/' + $store.state.playerList[idx].uuid)
}

function stopRandom () {
  state.randomMode = false
}

export default function useRandomPlayer () {
  return {
    state,
    goRandom,
    stopRandom,
  }
}
