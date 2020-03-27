<template>
  <div>
    <!-- Loading indicator -->
    <div v-if="!player" class="xl:w-page px-page py-10 xl:mx-auto text-center">
      <span>LOADING</span>
    </div>

    <template v-else>
      <!-- Player name (page header) -->
      <header class="xl:w-page xl:mx-auto px-page py-3 md:py-4 flex items-center">
        <h1 class="text-2xl md:text-3xl xl:text-4xl font-black" @click="$refs.iframe.contentWindow.location.reload()">{{ player.data.playername }}</h1>
        <span v-if="player.data.banned" class="ml-2 p-1 rounded bg-red-600 text-white text-sm md:text-base font-medium">BANNED</span>
      </header>

      <div class="xl:w-page xl:mx-auto md:flex md:items-start">
        <!-- Player info -->
        <div class="md:flex-none px-page pb-5">
          <div class="bg-white rounded-md shadow overflow-hidden md:w-figure md:flex-none">
            <!-- eslint-disable vue/max-attributes-per-line -->
            <iframe ref="iframe" :src="'/skin/index.html?uuid=' + uuid" scrolling="no" class="w-full h-figure border-0" />
            <dl>
              <div
                v-for="({label, value}, idx) of membership"
                :key="idx"
                class="p-3 border-t border-gray-300 flex items-center"
              >
                <dt class="text-gray-500 mr-3">{{ label }}</dt>
                <dd class="ml-auto font-tnum">{{ value }}</dd>
              </div>
            </dl>
          </div>
          <div class="mt-5">
            <h2 class="font-medium text-cool-gray-600 uppercase tracking-wide px-3 pb-2">Name
              History</h2>
            <ul class="bg-white rounded-md shadow">
              <li
                v-for="({name, changedToAt}, idx) of player.data.names"
                :key="idx"
                :class="['p-3 flex items-center', {'border-t border-gray-300': idx}]"
              >
                <strong class="font-normal mr-3">{{ name }}</strong>
                <span class="ml-auto text-gray-500 font-tnum">{{ formatDate(changedToAt) || 'First name' }}</span>
              </li>
            </ul>
          </div>
        </div>
        <!-- Main -->
        <div class="flex-1 md:mr-5 xl:ml-5 xl:mr-0 -mb-5">
          <!-- Advancements -->
          <PlayerAdvancementPanel :player="player" class="mb-5" />
          <!-- Statistics -->
          <PlayerStatisticPanel :player="player" class="mb-5" />
        </div>
      </div>
    </template>
  </div>
</template>

<script>
  import {add, formatDistanceStrict} from 'date-fns'

  import advancementData from '@/assets/advancement-data.json'
  import PlayerAdvancementPanel from '@/components/PlayerAdvancementPanel.vue'
  import PlayerStatisticPanel from '@/components/PlayerStatisticPanel.vue'
  import {normalizeDate} from '@/common/utils'

  export default {
    name: 'PlayerView',

    components: {
      PlayerAdvancementPanel,
      PlayerStatisticPanel,
    },

    data () {
      return {
        player: null,
      }
    },

    computed: {
      db: () => advancementData,

      uuid () {
        return this.$route.params.uuid
      },

      membership () {
        const output = [
          {
            label: 'First login',
            value: this.formatDate(this.player?.data.time_start),
          },
          {
            label: 'Last active',
            value: this.formatDate(this.player?.data.time_last),
          },
          {
            label: 'Total online',
            value: null,
          },
        ]

        if (this.player?.data.time_lived) {
          const now = new Date()
          const base = add(now, {seconds: -this.player.data.time_lived})
          output[2].value = formatDistanceStrict(now, base, {unit: 'hour'})
        }

        return output
      },
    },

    async created () {
      this.player = await this.$store.dispatch('fetchStats', this.uuid)
      document.title = `${this.player.data.playername} | ${this.$store.state.info.title}`
      this.$store.commit('setFooterUpdateTime', this.player.data.lastUpdate)
    },

    methods: {
      formatDate (val) {
        return val && normalizeDate(val, 'short')
      },
    },
  }
</script>

<style lang="scss" scoped>
  @screens xl {
    .w-page {
      width: 1200px;
    }
  }

  .h-figure {
    height: 300px;
  }

  @screens md {
    .w-figure {
      width: 300px;
    }
  }

  .font-tnum {
    font-feature-settings: "tnum";
  }
</style>
