<template>
  <div>
    <ul class="-mt-2">
      <li v-for="{uuid, playername, historyName} of data.slice(0, cursor)" :key="extract(uuid)">
        <RouterLink
          :to="'/player/' + extract(uuid)"
          class="sm:-mx-3 sm:px-3 py-2 hover:bg-cool-gray-100 rounded-md flex items-center transition duration-100 ease-linear"
        >
          <PlayerAvatar :uuid="extract(uuid)" class="flex-none w-10 h-10 rounded" />
          <span class="flex-1 ml-4 flex items-center">
            <!-- eslint-disable vue/no-v-html -->
            <span class="sm:w-56 mr-auto sm:mr-0 font-medium" v-html="html(playername)" />
            <template v-if="historyName">
              <span class="sm:hidden p-1 text-xs border border-red-300 bg-red-200 rounded text-red-800">{{ t('nyaa.player_list.match_history_name') }}</span>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="hidden sm:block ml-4 mr-1 h-text fill-gray-600">
                <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm1-8h4v2h-6V7h2v5z" />
              </svg>
              <span class="hidden sm:inline text-gray-600 font-medium" v-html="html(historyName)" />
            </template>
            <span v-if="uuid instanceof Array" class="lg:hidden ml-1 sm:ml-auto p-1 text-xs sm:text-base border border-red-300 bg-red-200 rounded text-red-800">UUID</span>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="hidden lg:block h-text ml-auto mr-1 fill-gray-600">
              <path d="M7.784 14l.42-4H4V8h4.415l.525-5h2.011l-.525 5h3.989l.525-5h2.011l-.525 5H20v2h-3.784l-.42 4H20v2h-4.415l-.525 5h-2.011l.525-5H9.585l-.525 5H7.049l.525-5H4v-2h3.784zm2.011 0h3.99l.42-4h-3.99l-.42 4z" />
            </svg>
            <code class="hidden lg:inline text-gray-600" v-html="html(uuid)" />
            <!-- eslint-enable vue/no-v-html -->
          </span>
        </RouterLink>
      </li>
    </ul>
    <div class="-mx-3">
      <button v-show="restCount > 0" class="flex w-full h-14 px-3 py-2 hover:bg-cool-gray-100 rounded-md text-gray-600 text-left transition duration-100 ease-linear" @click="cursor += 50">
        <span class="ml-14">{{ t('nyaa.player_list.load_more_button_label') }}</span>
      </button>
    </div>
  </div>
</template>

<script>
  import PlayerAvatar from '@/components/PlayerAvatar.vue'

  const DEFAULT_CURSOR = 50

  export default {
    name: 'PlayerList',

    components: {
      PlayerAvatar,
    },

    props: {
      data: {
        type: Array,
        required: true,
      },
    },

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
        // Display all the data by default when 2 possible pages are enough
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
            `<em class="-mx-px border border-red-300 bg-red-200 rounded text-red-800 not-italic">${entry[0].slice(entry[1], entry[2])}</em>` +
            entry[0].slice(entry[2])
      },
    },
  }
</script>
