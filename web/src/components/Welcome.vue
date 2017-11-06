<template>
  <div class="jumbotron">
    <div class="container">
      <h1>{{info.servername}}</h1>
      <p>Server time elapsed {{worldTime}}</p>

      <p><a class="btn btn-primary btn-lg" href="https://www.craft.moe" role="button">Learn more &raquo;</a></p>

    </div>
  </div>
</template>

<script>
import moment from 'moment';

export default {
  name: 'Welcome',
  props: ['info'],
  computed: {
    worldTime() {
      return moment.duration(this.info.worldTime || 0, 'seconds').humanize();
    },
  },
};

</script>
