<template>
  <div class="bg-gray-300 flex">
    <div
      v-for="it of graphData.filter(it => it[1])"
      :key="it[0]"
      :data-type="it[0]"
      :style="{flex: `${it[1]} 0 1px`}"
    />
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

    computed: {
      graphData () {
        const data = ORES.map(ore => {
          const mined = this.player.stats[`minecraft:mined/minecraft:${ore}_ore`] ?? 0
          const used = this.player.stats[`minecraft:used/minecraft:${ore}_ore`] ?? 0
          return Math.max(mined - used, 0)
        })
        return ORES.map((ore, idx) => [ore, data[idx]])
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
</style>
