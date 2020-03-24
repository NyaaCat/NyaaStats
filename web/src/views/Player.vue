<template>
  <div>
    <!-- Loading indicator -->
    <div v-if="!player" class="xl:w-page px-page py-10 xl:mx-auto text-center">
      <span>LOADING</span>
    </div>

    <template v-else>
      <!-- Player name (page header) -->
      <div class="xl:w-page xl:mx-auto px-page py-3 md:py-4 flex items-center">
        <h1 class="text-2xl md:text-3xl xl:text-4xl font-black" @click="$refs.iframe.contentWindow.location.reload()">{{ player.data.playername }}</h1>
        <span v-if="player.data.banned" class="ml-2 p-1 rounded bg-red-600 text-white text-sm md:text-base font-medium">BANNED</span>
      </div>

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
            <h2 class="font-medium text-cool-gray-600 uppercase tracking-wide px-3 pb-2">Name History</h2>
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
          <div class="mb-5 bg-white md:rounded-md shadow">
            <div class="border-b border-gray-300 bg-gray-100 md:rounded-t-md flex flex-col">
              <div class="px-page xl:px-5 flex items-center">
                <h2 class="py-3 xl:py-4 text-cool-gray-700 text-lg xl:text-xl font-medium uppercase tracking-wide">进度</h2>
                <button class="ml-auto p-1 -mr-1 focus:outline-none flex" @click="showConfig = !showConfig">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" :class="['w-6 h-6', showConfig ? 'fill-black' : 'fill-gray-500']">
                    <path d="M8 7a5 5 0 1 0 0 10h8a5 5 0 0 0 0-10H8zm0-2h8a7 7 0 0 1 0 14H8A7 7 0 0 1 8 5zm0 10a3 3 0 1 1 0-6 3 3 0 0 1 0 6z" />
                  </svg>
                </button>
              </div>
              <transition
                enter-active-class="overflow-hidden transition-height duration-150 ease-in-out"
                leave-active-class="overflow-hidden transition-height duration-150 ease-in-out"
                @enter="el => el.style.height = Array.from(el.children).reduce((t, n) => t + n.offsetHeight, 0) + 'px'"
                @before-leave="el => el.style.height = el.offsetHeight + 'px'"
                @leave="el => el.style.height = '0'"
              >
                <div v-show="showConfig" style="height: 0;">
                  <label class="px-page xl:px-5 py-3 border-t border-gray-300 cursor-pointer flex items-center">
                    <span>显示未解锁进度</span>
                    <span class="ml-auto">
                      <input v-model="config.showAllAdvancements" type="checkbox" class="hidden">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 100" class="h-6">
                        <path d="M50 100A50 50 0 0150 0h80a50 50 0 010 100H50z" :class="config.showAllAdvancements ? 'fill-blue-500' : 'fill-gray-400'" />
                        <!-- eslint-disable vue/max-attributes-per-line -->
                        <circle :cx="config.showAllAdvancements ? 130 : 50" cy="50" r="40" class="fill-white" />
                      </svg>
                    </span>
                  </label>
                </div>
              </transition>
            </div>
            <div
              v-for="([group, {title, data}], idx) of Object.entries(advancementGroups)"
              :key="group"
              :class="[{'border-t border-gray-300': idx}]"
            >
              <h3 class="px-page xl:px-5 py-3 xl:py-4 border-b border-gray-300 flex items-center">
                <span class="text-cool-gray-700 uppercase tracking-wide">{{ title }}</span>
                <span class="ml-auto text-cool-gray-500">{{ data.filter(adv => adv.done).length }}/{{ getGroupTotal(group) }} 已完成</span>
              </h3>
              <div class="px-page xl:px-4 py-2 lg:flex lg:flex-wrap lg:-ml-5">
                <div v-for="adv of data" :key="adv.id" class="lg:flex-grow-0 lg:flex-shrink lg:w-1/2 xl:w-1/3 lg:pl-5 py-1">
                  <AdvancementTitle
                    :advancement-id="adv.id"
                    :color-map="mouseHoverAdv === adv.id ? 'fill' : null"
                    :icon-color-map="adv.done ? 'complete' : 'normal'"
                    :class="['cursor-pointer hover:opacity-100', {'opacity-50': !adv.criteria}]"
                    @mouseenter.native="mouseHoverAdv = adv.id"
                    @mouseleave.native="mouseHoverAdv = mouseHoverAdv === adv.id ? null : mouseHoverAdv"
                    @click.native="showModal(adv.id)"
                  >
                    <span v-if="db[adv.id].requirements" class="ml-1 text-gray-500">
                      ({{ Object.keys(adv.criteria || {}).length }}/{{ db[adv.id].requirements.length }})
                    </span>
                  </AdvancementTitle>
                </div>
              </div>
            </div>
          </div>
          <!-- Statistics -->
          <div class="mb-5 bg-white md:rounded-md shadow overflow-hidden">
            <h2 class="px-page xl:px-5 py-3 xl:py-4 border-b border-gray-300 bg-gray-100 md:rounded-t-md text-cool-gray-700 text-lg xl:text-xl font-medium uppercase tracking-wide">Statistics</h2>
            <PlayerStatistics :player="player" />
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
  import {add, formatDistanceStrict} from 'date-fns'

  import advancementData from '@/assets/advancement-data.json'
  import {normalizeDate, parseDate} from '@/utils'
  import useLocalConfig from '@/composables/local-config'
  import AdvancementTitle from '@/components/AdvancementTitle.vue'
  import {state as modalLayerState} from '@/components/ModalLayer.vue'
  import AdvancementModal from '@/components/AdvancementModal.vue'
  import PlayerStatistics from '@/components/PlayerStatistics.vue'

  export default {
    name: 'PlayerView',

    components: {
      AdvancementTitle,
      PlayerStatistics,
    },

    data () {
      const config = useLocalConfig()

      return {
        player: null,

        showConfig: false,
        config,
        mouseHoverAdv: null,
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

      advancementGroups () {
        const groups = {
          story: {
            title: this.t('advancements.story.root.title'),
            data: [],
          },
          nether: {
            title: this.t('advancements.nether.root.title'),
            data: [],
          },
          end: {
            title: this.t('advancements.end.root.title'),
            data: [],
          },
          adventure: {
            title: this.t('advancements.adventure.root.title'),
            data: [],
          },
          husbandry: {
            title: this.t('advancements.husbandry.root.title'),
            data: [],
          },
        }

        for (const id of Object.keys(advancementData)) {
          const [, group] = id.split(/[:/]/)

          if (this.config.showAllAdvancements || this.player?.advancements?.[id]) {
            groups[group].data.push({
              id,
              ...this.player.advancements[id] ? {...this.player?.advancements[id]} : {},
            })
          }
        }

        for (const {data} of Object.values(groups)) {
          data.sort((a, b) => Math.max(...[...Object.values(b.criteria ?? {})].map(s => parseDate(s).getTime())) - Math.max(...[...Object.values(a.criteria ?? {})].map(s => parseDate(s).getTime())))
        }

        return groups
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

      getGroupTotal (group) {
        return Object.keys(advancementData).filter(k => k.startsWith('minecraft:' + group)).length
      },

      showModal (id) {
        modalLayerState.setModal(AdvancementModal, {advancementId: id})
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

  .transition-height {
    transition-property: height;
  }
</style>
