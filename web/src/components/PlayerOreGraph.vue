<template>
  <div
    :style="{height: isExpanded ? `calc(41px * ${graphData.length + 1} - 1px)` : '40px'}"
    class="bg-white overflow-hidden cursor-pointer relative transition-all duration-500 ease-in-out"
    @click="isExpanded = !isExpanded"
  >
    <div class="absolute inset-x-0 top-0 h-10 bg-gray-300 flex">
      <div
        v-for="([ore, value]) of graphData"
        :key="ore"
        ref="segments"
        :data-type="ore"
        class="relative transition duration-500 ease-in-out"
        :style="{flex: `${value} 0 1px`}"
      />
    </div>
    <transition
      enter-class="opacity-0"
      enter-to-class="opacity-100"
      leave-class="opacity-100"
      leave-to-class="opacity-0"
      enter-active-class="transition-opacity duration-300 ease-linear"
      leave-active-class="transition-opacity duration-300 ease-linear"
    >
      <dl v-show="isExpanded" class="relative text-sm flex flex-col">
        <div class="flex-none order-first h-10 px-3 flex items-center">
          <dt>{{ t('nyaa.player_ore_graph.item_name.total') }}</dt>
          <dd class="ml-auto font-tnum">{{ total }}</dd>
        </div>
        <div
          v-for="([ore, value, order]) of graphData"
          :key="ore"
          class="flex-none h-10 mt-px px-3 flex items-center"
          :style="{order}"
        >
          <dt class="-ml-1 px-1 py-0.5 _text-bg rounded">{{ t(`nyaa.player_ore_graph.item_name.${ore}_ore`) }}</dt>
          <dd class="ml-auto -mr-1 px-1 py-0.5 font-tnum _text-bg rounded">{{ value }}</dd>
        </div>
      </dl>
    </transition>
  </div>
</template>

<script>
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

    props: {
      player: {
        type: Object,
        required: true,
      },
    },

    data () {
      return {
        isExpanded: false,
      }
    },

    computed: {
      graphData () {
        const data = ORES.map(ore => {
          const mined = this.player.stats[`minecraft:mined/minecraft:${ore}_ore`] ?? 0
          const used = this.player.stats[`minecraft:used/minecraft:${ore}_ore`] ?? 0
          const net = Math.max(mined - used, 0)
          return net && [ore, net]
        }).filter(Boolean)
        data.slice().sort((b, a) => a[1] - b[1]).forEach((en, idx) => en.push(idx))
        return data
      },

      total () {
        return this.graphData.reduce((total, [, value]) => total + value, 0)
      },
    },

    watch: {
      isExpanded (value) {
        for (const [idx, /** @type {HTMLDivElement} */ seg] of Object.entries(this.$refs.segments)) {
          seg.style.transform = value
            ? `translate(${-seg.offsetLeft}px, ${41 * (this.graphData[idx][2] + 1)}px)`
            : `translate(0, 0)`
        }
      },
    },
  }
</script>

<style lang="scss" scoped>
  [data-type=coal]          {background: #343434;}
  [data-type=iron]          {background: #af8e77;}
  [data-type=lapis]         {background: #315ec4;}
  [data-type=gold]          {background: #fcee4b;}
  [data-type=diamond]       {background: #3de0e5;}
  [data-type=redstone]      {background: #ab0600;}
  [data-type=emerald]       {background: #00ab28;}
  [data-type=nether_quartz] {background: #eae5de;}

  ._text-bg {
    background: rgba(255, 255, 255, 0.6);
  }
</style>
