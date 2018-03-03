<template>
  <div class="row">
    <h3>{{$t('section-title')}}</h3>
    <hr/>
    <statistic-block v-for="(prop, index) in Object.keys(player.stats)" :key="index" :player="player" :prop="prop" />
  </div>
</template>

<script>
import StatisticBlock from './StatisticBlock';

export default {
  name: 'PlayerStatistic',
  props: ['player'],
  components: {
    StatisticBlock,
  },
};
</script>

<i18n>
en:
  section-title: Statistics
zh-cn:
  section-title: 统计
</i18n>
