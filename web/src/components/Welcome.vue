<template>
  <div class="jumbotron">
    <div class="container">
      <h1>{{ info.servername }}</h1>
      <p>Server time elapsed {{ worldTime }}</p>

      <p>
        <a class="btn btn-primary btn-lg" v-bind:href="homePage" role="button"
          >Learn more &raquo;</a
        >
      </p>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import { mapState } from 'vuex'

export default {
  name: 'Welcome',
  computed: {
    ...mapState(['info']),
    worldTime() {
      return moment.duration(this.info.worldTime || 0, 'seconds').humanize()
    },
    homePage() {
      return this.info.homepage
    },
  },
}
</script>
