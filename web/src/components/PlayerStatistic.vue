<template>
  <div class="mb-5">
    <h3 class="mb-5 py-5 border-b border-gray-300 text-2xl font-medium">Statistics</h3>
    <div class="sm:flex sm:flex-wrap sm:-ml-5">
      <div
        v-for="prop of Array.from(Object.keys(player.stats)).filter(p => langData.stat[p])"
        :key="prop"
        class="w-full sm:w-1/2 lg:w-1/3 xl:w-1/4 sm:pl-5 sm:flex-grow-0 sm:flex-shrink mb-5"
      >
        <StatisticBlock :player="player" :prop="prop" />
      </div>
    </div>
  </div>
</template>

<script>
  import langData from '../assets/lang.json'
  import StatisticBlock from './StatisticBlock.vue'

  export default {
    name: 'PlayerStatistic',

    components: {
      StatisticBlock,
    },

    props: {
      player: {
        type: Object,
        required: true,
      },
    },

    data () {
      return {
        langData,
      }
    },
  }
</script>
