<template>
  <div>
    <b-alert
      variant="danger"
      dismissible
      :show="showNetworkErrorAlert"
      @dismissed="showNetworkErrorAlert = false"
    >
      Network Error!
    </b-alert>
    <b-progress
      v-show="loading"
      :value="100"
      :max="100"
      animated
      class="mb-3"
    ></b-progress>
    <b-row class="searchbox">
      <b-col sm="12"
        ><b-form-input
          id="input-none"
          type="text"
          :value="keyword"
          @input="updateKeyword"
          placeholder="Search user by Name / UUID"
        ></b-form-input
      ></b-col>
    </b-row>
    <vue-lazy-component class="row">
      <PlayerBlock
        v-for="(player, key, index) in filteredPlayerList"
        :key="index"
        :player="player"
      />
    </vue-lazy-component>
    <hr />
    <NyaaFooter />
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import VueScrollTo from 'vue-scrollto'

import PlayerBlock from '../components/PlayerBlock'
import NyaaFooter from '../components/Footer'

export default {
  name: 'PlayerList',

  components: {
    PlayerBlock,
    NyaaFooter,
  },

  data() {
    return {
      showNetworkErrorAlert: false,
      searchTimer: null,
      loading: true,
      timer: null,
      isScrolled: false,
    }
  },

  computed: {
    ...mapState(['playerList', 'scrollOffset', 'info', 'keyword']),

    filteredPlayerList() {
      if (this.keyword.length < 1) {
        return this.playerList.slice(0, 400)
      } else {
        const keyword = this.keyword.toLowerCase()
        return this.playerList
          .filter(player => {
            if (
              keyword.length >= 32 &&
              keyword.length <= 36 &&
              player.uuid.indexOf(keyword.replace('-', '')) !== -1
            ) {
              return true
            }
            if (player.playername.toLowerCase().indexOf(keyword) !== -1) {
              return true
            }
            return player.names.some(name => {
              if (name.name.toLowerCase().indexOf(keyword) !== -1) {
                return true
              }
              return false
            })
          })
          .slice(0, 200)
      }
    },
  },

  watch: {
    keyword: 'lazyload',
  },

  beforeRouteEnter(to, from, next) {
    next(vm => {
      document.title = vm.info.title
    })
  },

  async created() {
    if (this.playerList.length === 0) {
      try {
        await this.$store.dispatch('fetchPlayers')
      } catch (e) {
        this.showNetworkErrorAlert = true
      }
    }
    this.loading = false
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
          })
        }, 100)
      }
      this.isScrolled = true
    })
  },

  beforeRouteLeave(to, from, next) {
    const uuid = to.params.uuid
    this.setScrollOffset({
      uuid,
    })
    next()
  },

  methods: {
    ...mapMutations(['setScrollOffset', 'setKeyword']),
    lazyload() {
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.$Lazyload.lazyLoadHandler()
      }, 200)
    },
    updateKeyword(e) {
      this.setKeyword(e)
    },
  },
}
</script>

<style scoped>
.searchbox {
  margin-bottom: 16px;
}
</style>
