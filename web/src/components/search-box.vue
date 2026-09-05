<template>
  <div
    ref="root"
    :class="['search-box self-stretch my-1 relative flex items-center', {'is-focused': isFocused}]"
    @click="onRootClick"
  >
    <button
      ref="button"
      :aria-label="isFocused && keyword ? t('nyaa.general.clear_search') : t('nyaa.general.search_placeholder')"
      :aria-expanded="isFocused"
      class="search-toggle flex h-full w-10 flex-none items-center justify-center"
      type="button"
      @click.stop="onIconClick"
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="h-6 fill-current">
        <path v-if="!isFocused || !keyword" d="M18.031 16.617l4.283 4.282-1.415 1.415-4.282-4.283A8.96 8.96 0 0 1 11 20c-4.968 0-9-4.032-9-9s4.032-9 9-9 9 4.032 9 9a8.96 8.96 0 0 1-1.969 5.617zm-2.006-.742A6.977 6.977 0 0 0 18 11c0-3.868-3.133-7-7-7-3.868 0-7 3.132-7 7 0 3.867 3.132 7 7 7a6.977 6.977 0 0 0 4.875-1.975l.15-.15z" />
        <path v-else d="M12 10.586l4.95-4.95 1.414 1.414-4.95 4.95 4.95 4.95-1.414 1.414-4.95-4.95-4.95 4.95-1.414-1.414 4.95-4.95-4.95-4.95L7.05 5.636z" />
      </svg>
    </button>
    <input
      ref="input"
      :value="keyword"
      :aria-label="t('nyaa.general.search_placeholder')"
      :placeholder="isFocused ? t('nyaa.general.search_placeholder') : t('nyaa.general.search_short_placeholder')"
      type="text"
      class="search-input h-full min-w-0 flex-1 bg-transparent px-1 text-inherit placeholder-gray-400 outline-none"
      @focus="onInputFocus"
      @input="setKeyword($event.target.value)"
      @keydown.esc.prevent.stop="deactivate"
    >
    <SearchResultList
      v-if="isFocused && searchResult"
      :data="searchResult"
      :loading="playerList.length === 0"
      :max-height="resultMaxHeight"
      @select="onSelect"
    />
  </div>
</template>

<script>
  import {mapMutations, mapState} from 'vuex'

  import SearchResultList from '@/components/search-result-list.vue'
  import searchPlayers from '@/composables/player-search'

  export default {
    name: 'SearchBox',

    components: {
      SearchResultList,
    },

    emits: ['focus', 'blur'],

    data () {
      return {
        isFocused: false,
        viewportHeight: 0,
      }
    },

    computed: {
      ...mapState(['keyword', 'playerList']),

      searchResult () {
        return searchPlayers(this.playerList, this.keyword)
      },

      resultMaxHeight () {
        return this.viewportHeight ? `${Math.max(this.viewportHeight - 60, 0)}px` : null
      },
    },

    watch: {
      isFocused (val) {
        if (val) {
          this.updateViewportHeight()
          document.addEventListener('click', this.onClickAway, true)
          window.addEventListener('resize', this.updateViewportHeight)
          window.visualViewport?.addEventListener('resize', this.updateViewportHeight)
          this.$nextTick(() => {
            this.$refs.input?.focus()
          })
          this.$emit('focus')
        } else {
          document.removeEventListener('click', this.onClickAway, true)
          window.removeEventListener('resize', this.updateViewportHeight)
          window.visualViewport?.removeEventListener('resize', this.updateViewportHeight)
          this.$refs.input?.blur()
          this.$emit('blur')
        }
      },

      '$route' () {
        this.deactivate()
      },
    },

    beforeUnmount () {
      document.removeEventListener('click', this.onClickAway, true)
      window.removeEventListener('resize', this.updateViewportHeight)
      window.visualViewport?.removeEventListener('resize', this.updateViewportHeight)
    },

    methods: {
      ...mapMutations(['setKeyword']),

      activate () {
        if (!this.isFocused) this.isFocused = true
      },

      deactivate () {
        if (this.isFocused) this.isFocused = false
      },

      onRootClick () {
        if (!this.isFocused) this.activate()
      },

      onIconClick () {
        if (this.isFocused && this.keyword) {
          this.setKeyword('')
          this.$nextTick(() => this.$refs.input?.focus())
        } else {
          this.activate()
          this.$nextTick(() => this.$refs.input?.focus())
        }
      },

      onInputFocus () {
        this.activate()
        this.$nextTick(() => {
          this.$refs.input?.select()
        })
      },

      onClickAway ({target}) {
        if (!this.$refs.root?.contains(target)) this.deactivate()
      },

      onSelect () {
        this.deactivate()
        this.setKeyword('')
      },

      updateViewportHeight () {
        this.viewportHeight = window.visualViewport?.height || window.innerHeight
      },
    },
  }
</script>

<style scoped>
  .search-box {
    width: 160px;
    color: rgb(209 213 219);
    transition: width 200ms var(--ease-in-out), background-color 200ms var(--ease-in-out), color 200ms var(--ease-in-out);
  }

  .search-box.is-focused {
    width: 400px;
    z-index: 30;
    background-color: #fff;
    color: #111827;
  }

  .search-results-panel {
    position: absolute;
    top: 100%;
    margin-top: 6px;
    left: 0;
    width: 100%;
    max-height: calc(100dvh - 60px);
  }

  @media (max-width: 767px) {
    .search-box {
      width: 50px;
      justify-content: center;
    }

    .search-box.is-focused {
      position: fixed;
      top: 0;
      left: 4px;
      width: calc(100vw - 8px);
      height: calc(var(--spacing-header) - 8px);
      z-index: 30;
    }

    .search-box:not(.is-focused) .search-input {
      display: none;
    }
  }
</style>
