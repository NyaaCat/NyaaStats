<template>
  <div class="col-sm-12 col-md-4 col-lg-3" v-if="ac[0] === 'stat' && lang.stat[ac[1]]">
    <div class="panel panel-default">
      <div class="panel-body">
        <span class="glyphicon glyphicon-stats" aria-hidden="true"></span>
        &nbsp;
        <span class="text-primary">{{ numAbbr(player.stats[prop]) }}</span>
        <span class="text-muted">
        {{ lang.stat[ac[1]] }}
      </span>
      </div>
    </div>
  </div>
</template>

<script>
import lang from '../assets/lang.json';

export default {
  name: 'StatisticBlock',
  props: ['player', 'prop'],
  data() {
    return {
      lang,
      ac: [],
    };
  },
  mounted() {
    this.ac = this.prop.split('.');
  },
  methods: {
    numAbbr(val) {
      const value = Math.round(val);
      let newValue = value;
      if (value >= 1000) {
        const suffixes = ['', 'k', 'M', 'b'];
        const suffixNum = Math.floor((`${value}`).length / 3);
        let shortValue = '';
        for (let precision = 2; precision >= 1; precision -= 1) {
          shortValue = parseFloat(
            (suffixNum !== 0 ? (value / (1000 ** suffixNum)) : value
          ).toPrecision(precision));
          const dotLessShortValue = (`${shortValue}`).replace(/[^a-zA-Z 0-9]+/g, '');
          if (dotLessShortValue.length <= 2) {
            break;
          }
        }
        if (shortValue % 1 !== 0) {
          shortValue = shortValue.toFixed(1);
        }
        newValue = shortValue + suffixes[suffixNum];
      }
      return newValue;
    },
  },
};
</script>

