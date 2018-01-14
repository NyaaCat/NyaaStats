<template>
  <footer>
    <p>{{info.servername}}</p>
    <p class="text-muted">
        Last Update {{lastUpdate}}
    </p>
  </footer>
</template>

<script>
import moment from 'moment';
import { mapState } from 'vuex';

export default {
  name: 'Footer',
  props: ['player'],
  computed: {
    ...mapState([
      'info',
    ]),
    lastUpdate() {
      if (this.player && this.info) {
       return moment(this.player.data.lastUpdate || 0).format(this.info.timeFormat ? this.info.timeFormat.full : '');
      } else if (this.info) {
        return moment(this.info.lastUpdate || 0).format(this.info.timeFormat ? this.info.timeFormat.full : '');
      }
      return '';
    },
  },
};

</script>
