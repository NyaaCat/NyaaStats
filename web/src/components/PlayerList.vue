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
    />
    <b-row class="searchbox">
      <b-col sm="12">
        <b-form-input
          id="input-none"
          type="text"
          :value="keyword"
          placeholder="Search user by Name / UUID"
          @input="val => setKeyword(val)"
        />
      </b-col>
    </b-row>
    <vue-lazy-component class="row">
      <PlayerBlock
        v-for="player of playerListProcessed"
        :key="player.uuid"
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
  </div>
</template>

<script>
  import { mapState, mapMutations } from 'vuex'
  import VueScrollTo from 'vue-scrollto'

  import PlayerBlock from './PlayerBlock'

  export default {
    name: 'PlayerList',

    components: {
      PlayerBlock,
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
        // [ matchCurrentName, matchUsedName, matchUUID ]
        const result = [[], [], []]
        for (const player of this.playerList) {
          if (player.playername.toLowerCase().includes(keyword)) {
            result[0].push(player)
          } else if (
            player.names.some(name => name.name.toLowerCase().includes(keyword))
          ) {
            result[1].push(player)
          } else if (
            player.uuid.includes(keyword.replace(/-/g, ''))
          ) {
            result[2].push(player)
          }
          if (result.map(arr => arr.length).reduce((sum, num) => sum + num) >= 99)
            break
        }
        return result.flat(1)
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
