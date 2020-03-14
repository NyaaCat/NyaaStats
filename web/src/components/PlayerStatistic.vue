<template>
  <div class="page-section py-8">
    <h3 class="mb-5 text-2xl font-bold">Statistics</h3>
    <div>
      <div class="sm:flex sm:flex-wrap sm:-ml-5 -mt-5">
        <div
          v-for="prop of Array.from(Object.keys(player.stats)).filter(p => langData.stat[p])"
          :key="prop"
          class="w-full sm:w-1/2 lg:w-1/3 xl:w-1/4 sm:pl-5 pt-5 sm:flex-grow-0 sm:flex-shrink"
        >
          <StatisticBlock :player="player" :prop="prop" />
        </div>
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
