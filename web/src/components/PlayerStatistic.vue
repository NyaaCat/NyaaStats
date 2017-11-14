<template>
  <div class="row">
    <h3>Statistics</h3>
    <hr/>
    <statistic-block v-for="(prop, index) in Object.keys(player.stats)" :key="index" :player="player" :prop="prop" />
  </div>
</template>

<script>
import lang from '../assets/lang.json';
import StatisticBlock from './StatisticBlock';

export default {
  name: 'PlayerStatistic',
  props: ['player'],
  data() {
    return {
      lang,
    };
  },
  components: {
    StatisticBlock,
  },
};
</script>
