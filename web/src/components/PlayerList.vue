<template>
  <div class="page-section -mb-5">
    <div>
      <!-- Network error alert -->
      <div v-if="showNetworkErrorAlert" class="my-4 p-4 border border-red-300 rounded bg-red-200 text-red-700 flex items-center">
        Network Error!
        <button class="flex ml-auto" @click="showNetworkErrorAlert = false">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-5 h-5">
            <path d="M12 10.586l4.95-4.95 1.414 1.414-4.95 4.95 4.95 4.95-1.414 1.414-4.95-4.95-4.95 4.95-1.414-1.414 4.95-4.95-4.95-4.95L7.05 5.636z" />
          </svg>
        </button>
      </div>
      <!-- Loading indicator -->
      <ProgressBar :visible="loading" />
      <template v-show="!loading">
        <!-- Search box -->
        <div class="mt-5 xl:mt-8 mb-5">
          <input
            :value="keyword"
            type="text"
            placeholder="Search user by Name / UUID"
            class="form-input block w-full border-0 bg-white focus:bg-white shadow-xs focus:shadow-md transition duration-100 ease-linear"
            @input="ev => setKeyword(ev.target.value)"
          >
        </div>
        <!-- Player list -->
        <vue-lazy-component class="player-list -ml-5">
          <PlayerBlock
            v-for="player of playerListProcessed.slice(0, renderedCount)"
            :key="player.uuid"
            :player="player"
            class="flex-grow-0 flex-shrink w-full sm:w-1/2 lg:w-1/3 xl:w-1/4 pl-5 mb-5"
          />
        </vue-lazy-component>
        <div v-show="!keywordTrimmed" class="mb-8 text-lg text-center text-gray-600">...and {{ playerList.length - renderedCount }} more</div>
      </template>
    </div>
  </div>
</template>

<script>
  import {mapMutations, mapState} from 'vuex'
  import VueScrollTo from 'vue-scrollto'

  import ProgressBar from '@/components/ProgressBar.vue'
  import PlayerBlock from './PlayerBlock.vue'

  export default {
    name: 'PlayerList',

    components: {
      ProgressBar,
      PlayerBlock,
    },

    data () {
      return {
        showNetworkErrorAlert: false,
        searchTimer: null,
        loading: true,
        timer: null,
        isScrolled: false,
        renderedCount: process.env.NODE_ENV === 'production' ? 50 : 20,
      }
    },

    computed: {
      ...mapState(['playerList', 'scrollOffset', 'keyword']),

      keywordTrimmed() {
        return this.keyword.trim()
      },

      playerListCapped() {
        return this.playerList.slice(0, this.renderedCount)
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
          if (result.map(arr => arr.length).reduce((sum, num) => sum + num) >= this.renderedCount)
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

    methods: {
      ...mapMutations(['setKeyword']),

      lazyload () {
        clearTimeout(this.timer)
        this.timer = setTimeout(() => {
          this.$Lazyload.lazyLoadHandler()
        }, 200)
      },
    },
  }
</script>

<style scoped>
  .player-list >>> > div {
    @apply flex flex-wrap;
  }
</style>
