<template>
  <div class="jumbotron">
    <div class="container">
      <h1>{{info.servername}}</h1>
      <p>{{$t('server-time-elapsed')}} {{worldTime}}</p>

      <p><a class="btn btn-primary btn-lg" v-bind:href="homePage" role="button">{{$t('learn-more')}} &raquo;</a></p>

    </div>
  </div>
</template>

<script>
import moment from 'moment';
import { mapState } from 'vuex';

export default {
  name: 'Welcome',
  computed: {
    ...mapState([
      'info',
    ]),
    worldTime() {
      return moment.duration(this.info.worldTime || 0, 'seconds').humanize();
    },
    homePage() {
      return this.info.homepage;
    },
  },
};
</script>

<i18n>
en:
  server-time-elapsed: Server time elapsed
  learn-more: Learn more
zh-cn:
  server-time-elapsed: 服务器时间已经过
  learn-more: 了解更多
</i18n>
