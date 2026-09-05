<template>
  <div :style="{maxHeight}" class="search-results-panel max-h-[calc(100dvh-60px)] flex flex-col overflow-hidden rounded-b-md bg-white text-black shadow-lg">
    <p v-if="!loading" class="flex-none border-b border-gray-200 px-3 py-2 text-xs text-gray-600">
      {{ t('nyaa.player_list.search_result_total_label') + t('nyaa.symbol.colon_s') + data.length }}
    </p>
    <div class="min-h-0 flex-1 overflow-y-auto overscroll-contain">
      <p v-if="loading" class="px-3 py-4 text-center text-sm tracking-widest text-gray-600">LOADING</p>
      <p v-else-if="data.length === 0" class="px-3 py-4 text-center text-sm text-gray-600">{{ t('nyaa.player_list.search_no_result') }}</p>
      <template v-else>
        <ul>
          <li v-for="{uuid, playername, historyName} of data.slice(0, cursor)" :key="extract(uuid)">
            <RouterLink
              :to="'/player/' + extract(uuid)"
              class="flex items-center px-3 py-2 transition duration-100 ease-linear hover:bg-gray-100"
              @click.stop="$emit('select')"
            >
              <PlayerAvatar :uuid="extract(uuid)" class="h-8 w-8 flex-none rounded" />
              <span class="ml-3 min-w-0 flex-1">
                <!-- eslint-disable vue/no-v-html -->
                <span class="flex min-w-0 items-center">
                  <span class="min-w-0 truncate font-medium" v-html="html(playername)" />
                  <span v-if="historyName" class="ml-2 flex-none rounded border border-red-300 bg-red-200 p-0.5 text-xs text-red-800">{{ t('nyaa.player_list.match_history_name') }}</span>
                </span>
                <span v-if="historyName" class="block truncate text-xs text-gray-600" v-html="html(historyName)" />
                <code class="block truncate text-xs text-gray-500" v-html="html(uuid)" />
                <!-- eslint-enable vue/no-v-html -->
              </span>
            </RouterLink>
          </li>
        </ul>
        <button
          v-show="restCount > 0"
          class="flex h-11 w-full items-center px-3 text-left text-sm text-gray-600 transition duration-100 ease-linear hover:bg-gray-100"
          type="button"
          @click="cursor += 50"
        >
          <span class="ml-11">{{ t('nyaa.player_list.load_more_button_label') }}</span>
        </button>
      </template>
    </div>
  </div>
</template>

<script>
  import PlayerAvatar from '@/components/player-avatar.vue'

  const DEFAULT_CURSOR = 50

  export default {
    name: 'SearchResultList',

    components: {
      PlayerAvatar,
    },

    props: {
      data: {
        type: Array,
        required: true,
      },
      loading: {
        type: Boolean,
        default: false,
      },
      maxHeight: {
        type: String,
        default: null,
      },
    },

    emits: ['select'],

    data () {
      return {
        cursor: DEFAULT_CURSOR,
      }
    },

    computed: {
      restCount () {
        return this.data.length - this.cursor
      },
    },

    watch: {
      data (data) {
        this.cursor = data.length <= DEFAULT_CURSOR * 2 ? DEFAULT_CURSOR * 2 : DEFAULT_CURSOR
      },
    },

    methods: {
      extract (val) {
        return typeof val === 'string' ? val : val[0]
      },

      html (entry) {
        return typeof entry === 'string'
          ? entry
          : entry[0].slice(0, entry[1]) +
            `<em class="-mx-px rounded border border-red-300 bg-red-200 text-red-800 not-italic">${entry[0].slice(entry[1], entry[2])}</em>` +
            entry[0].slice(entry[2])
      },
    },
  }
</script>
