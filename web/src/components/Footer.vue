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

export default {
  name: 'Footer',
  props: ['info'],
  computed: {
    lastUpdate() {
      return moment(this.info.lastUpdate || 0).format(this.info.timeFormat ? this.info.timeFormat.full : '');
    },
  },
};

</script>
