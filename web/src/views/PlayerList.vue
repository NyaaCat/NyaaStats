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
      <b-col sm="12">
        <b-form-input
          id="input-none"
          type="text"
          :value="keyword"
          @input="val => setKeyword(val)"
          placeholder="Search user by Name / UUID"
        />
      </b-col>
    </b-row>
    <vue-lazy-component class="row">
      <PlayerBlock
        v-for="(player, idx) of playerListProcessed"
        :key="idx"
        :player="player"
      />
      <span v-if="!keywordTrimmed">
        <div class="col-xs-12 col-sm-6 col-md-4 col-lg-3 searchbox">
          <div class="panel panel-default">
            <div class="panel-body">
              <div
                class="flex items-center justify-center"
                style="height: 64px;"
              >
                <h4>...and {{ playerList.length - 99 }} more</h4>
              </div>
            </div>
          </div>
        </div>
      </span>
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

    keywordTrimmed() {
      return this.keyword.trim()
    },

    playerListCapped() {
      return this.playerList.slice(0, 99)
    },

    filteredPlayerList() {
      const keyword = this.keywordTrimmed.toLowerCase()
      // TODO: cap the iteration in the first place
      return this.playerList
        .filter(
          player =>
            // match #1: if keyword is an uuid
            (32 <= keyword.length &&
              keyword.length <= 36 &&
              player.uuid.includes(keyword.replace(/-/g, ''))) ||
            // match #2: if keyword is player's current name
            player.playername.toLowerCase().includes(keyword) ||
            // match #3: if keyword is player's used name
            player.names.some(name =>
              name.name.toLowerCase().includes(keyword),
            ),
        )
        .slice(0, 100)
    },

    playerListProcessed() {
      return this.keywordTrimmed
        ? this.filteredPlayerList
        : this.playerListCapped
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
  },
}
</script>

<style scoped>
.searchbox {
  margin-bottom: 16px;
}
</style>
