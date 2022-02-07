<template>
  <PlayerAsidePanel :title="t('nyaa.player_ore_graph.section_title')">
    <template #header>
      <transition
        enter-class="opacity-0"
        leave-to-class="opacity-0"
        enter-active-class="transition-opacity duration-300 ease-linear"
        leave-active-class="transition-opacity duration-300 ease-linear"
      >
        <button
          v-show="isExpanded"
          class="text-sm text-blue-600"
          @click="isShowingOriginalData = !isShowingOriginalData"
        >
          <transition v-bind="textTransitionProps">
            <span v-if="isShowingOriginalData" key="1">{{ t('nyaa.player_ore_graph.control_label.show_net_value') }}</span>
            <span v-else key="0">{{ t('nyaa.player_ore_graph.control_label.show_original_data') }}</span>
          </transition>
        </button>
      </transition>
    </template>

    <div
      :style="{height: isExpanded ? `calc(41px * ${graphHeight + 1} - 1px)` : '40px'}"
      class="bg-white cursor-pointer relative transition-all duration-500 ease-in-out"
      @click="isExpanded = !isExpanded"
    >
      <div class="absolute inset-x-0 top-0 h-10 bg-cool-gray-300 flex">
        <div
          v-for="({ore, mined, used, net}) of oreDataFiltered"
          :key="ore"
          ref="segments"
          :data-type="ore"
          class="bg-gray-300 transition duration-500 ease-in-out"
          :style="{flex: `${net} 0 1px`}"
        >
          <div
            class="h-full transition-all duration-300 ease-in-out"
            :style="{width: (isExpanded && isShowingOriginalData ? (mined - used) / mined : 1) * 100 + '%'}"
          />
        </div>
      </div>
      <transition
        enter-class="opacity-0"
        leave-to-class="opacity-0"
        enter-active-class="transition-opacity duration-300 ease-linear"
        leave-active-class="transition-opacity duration-300 ease-linear"
      >
        <div v-show="isExpanded" class="relative px-3 text-sm flex">
          <ul class="flex flex-col">
            <li class="order-first h-10 flex items-center">
              <transition v-bind="textTransitionProps">
                <span v-if="isShowingOriginalData" key="1">{{ t('nyaa.player_ore_graph.item_name.original_hint') }}</span>
                <span v-else key="0">{{ t('nyaa.player_ore_graph.item_name.total') }}</span>
              </transition>
            </li>
            <li
              v-for="({ore, order}) of oreData"
              :key="ore"
              class="flex-none h-10 mt-px flex items-center"
              :style="{order}"
            >
              <span class="-ml-1 px-1 py-0.5 _text-bg rounded">{{ t(`nyaa.player_ore_graph.item_name.${ore}_ore`) }}</span>
            </li>
          </ul>
          <transition v-bind="textTransitionProps">
            <div v-if="isShowingOriginalData" class="ml-auto font-tnum grid row-gap-px items-center">
              <span class="pl-1" :style="{gridRow: 1}">{{ total.mined }}</span>
              <span :style="{gridRow: 1}" class="text-gray-600 flex">
                <span class="mx-1">/</span>
                <span class="ml-auto">{{ total.used }}</span>
              </span>
              <template v-for="({ore, mined, used, order}) of oreData">
                <span :key="ore + '-mined'" class="pl-1 py-0.5 _text-bg rounded-l text-right" :style="{gridRow: order + 1}">{{ mined }}</span>
                <span :key="ore + '-used'" class="-mr-1 pr-1 py-0.5 _text-bg rounded-r text-gray-500 flex" :style="{gridRow: order + 1}">
                  <span class="mx-1">/</span>
                  <span class="ml-auto">{{ used }}</span>
                </span>
              </template>
            </div>
            <ul v-else class="ml-auto font-tnum flex flex-col items-end">
              <li class="order-first h-10 flex items-center">
                <span>{{ total.net }}</span>
              </li>
              <li
                v-for="({ore, net, order}) of oreData"
                :key="ore"
                class="h-10 mt-px flex items-center"
                :style="{order}"
              >
                <span class="-mr-1 px-1 py-0.5 _text-bg rounded">{{ net }}</span>
              </li>
            </ul>
          </transition>
        </div>
      </transition>
    </div>
  </PlayerAsidePanel>
</template>

<script>
  import PlayerAsidePanel from '@/components/player-aside-panel.vue'

  const ORES = [
    'coal',
    'iron',
    'lapis',
    'gold',
    'diamond',
    'redstone',
    'emerald',
    'nether_quartz',
  ]

  export default {
    name: 'PlayerOreGraph',

    components: {
      PlayerAsidePanel,
    },

    props: {
      player: {
        type: Object,
        required: true,
      },
    },

    data () {
      return {
        textTransitionProps: {
          mode: 'out-in',
          enterClass: 'opacity-0',
          leaveToClass: 'opacity-0',
          enterActiveClass: 'transition-opacity duration-100 ease-linear',
          leaveActiveClass: 'transition-opacity duration-100 ease-linear',
        },
        isExpanded: false,
        isShowingOriginalData: false,
      }
    },

    computed: {
      oreData () {
        const data = ORES.map(ore => {
          const mined = (this.player.stats[`minecraft:mined/minecraft:${ore}_ore`] ?? 0) + (this.player.stats[`minecraft:mined/minecraft:deepslate_${ore}_ore`] ?? 0)
          const used = (this.player.stats[`minecraft:used/minecraft:${ore}_ore`] ?? 0) + (this.player.stats[`minecraft:used/minecraft:deepslate_${ore}_ore`] ?? 0)
          const net = Math.max(mined - used, 0)
          return {
            ore,
            mined,
            used,
            net,
          }
        })
        data.slice().sort((b, a) => a.net - b.net).forEach((d, idx) => d.order = idx + 1)
        return data
      },

      oreDataFiltered () {
        return this.oreData.filter(d => d.net)
      },

      graphHeight () {
        return this.isShowingOriginalData ? this.oreData.length : this.oreDataFiltered.length
      },

      total () {
        return this.oreData.reduce((total, {mined, used, net}) => {
          total.mined += mined
          total.used += used
          total.net += net
          return total
        }, {mined: 0, used: 0, net: 0})
      },
    },

    watch: {
      isExpanded (value) {
        if (value) {
          const containerX = this.$refs.segments[0].parentElement.getBoundingClientRect().x
          this.$refs.segments.forEach((/** @type {HTMLDivElement} */ seg, idx) => {
            seg.style.transform = `translate(${-(Math.round(seg.getBoundingClientRect().x) - containerX)}px, ${41 * (this.oreDataFiltered[idx].order)}px)`
          })
        } else {
          this.$refs.segments.forEach(seg => {
            seg.style.transform = 'translate(0, 0)'
          })
        }
      },
    },
  }
</script>

<style lang="scss" scoped>
  [data-type=coal]          div {background: #343434;}
  [data-type=iron]          div {background: #af8e77;}
  [data-type=lapis]         div {background: #315ec4;}
  [data-type=gold]          div {background: #fcee4b;}
  [data-type=diamond]       div {background: #3de0e5;}
  [data-type=redstone]      div {background: #ab0600;}
  [data-type=emerald]       div {background: #00ab28;}
  [data-type=nether_quartz] div {background: #eae5de;}

  ._text-bg {
    background: rgba(255, 255, 255, 0.6);
  }

  .grid {
    grid-template-columns: auto auto;
    grid-template-rows: 40px;
  }
</style>
