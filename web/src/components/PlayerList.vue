<template>
  <div class="-mb-5">
    <!-- Network error alert -->
    <div v-if="showNetworkErrorAlert" class="my-4 px-page py-4 border border-red-300 rounded bg-red-200 text-red-700 flex items-center">
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
      <label :class="['block mb-5 px-page border-b border-gray-300 cursor-pointer transition duration-200 easing-linear', {'bg-white': isSearchBoxFocused}]">
        <div class="xl:w-page xl:mx-auto flex">
          <input
            :value="keyword"
            type="text"
            :placeholder="t('nyaa.general.search_placeholder')"
            class="flex-1 py-3 pr-5 bg-transparent placeholder-gray-600 focus:outline-none"
            @focus="isSearchBoxFocused = true"
            @blur="isSearchBoxFocused = false"
            @input="setKeyword($event.target.value)"
          >
          <button class="flex-none ml-auto text-blue-600" @click="goRandom">{{ t('nyaa.general.go_random_player') }}</button>
        </div>
      </label>
      <!-- Player list -->
      <div class="xl:mx-auto xl:w-page px-page">
        <div class="flex flex-wrap -ml-5">
          <vue-lazy-component
            v-for="player of playerListProcessed.slice(0, renderedCount)"
            :key="player.uuid"
            class="flex-grow-0 flex-shrink w-full sm:w-1/2 lg:w-1/3 xl:w-1/4 pl-5 mb-5"
          >
            <PlayerBlock :player="player" class="block" />
          </vue-lazy-component>
        </div>
        <div v-show="!keywordTrimmed" class="mb-8 text-lg text-center text-gray-600">{{ t('nyaa.player_list.more_players_hint', playerList.length - renderedCount) }}</div>
      </div>
    </template>
  </div>
</template>

<script>
  import {mapMutations, mapState} from 'vuex'

  import ProgressBar from '@/components/ProgressBar.vue'
  import PlayerBlock from '@/components/PlayerBlock.vue'
  import useRandomPlayer from '@/composables/random-player'

  export default {
    name: 'PlayerList',

    components: {
      ProgressBar,
      PlayerBlock,
    },

    data () {
      const {goRandom, stopRandom} = useRandomPlayer()

      return {
        goRandom,
        stopRandom,

        showNetworkErrorAlert: false,
        isSearchBoxFocused: false,
        searchTimer: null,
        loading: true,
        timer: null,
        renderedCount: process.env.NODE_ENV === 'production' ? 50 : 20,
      }
    },

    computed: {
      ...mapState(['playerList', 'keyword']),

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

    async created () {
      if (this.playerList.length === 0) {
        try {
          await this.$store.dispatch('fetchPlayers')
        } catch (e) {
          this.showNetworkErrorAlert = true
        }
      }
      this.stopRandom()
      this.loading = false
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
