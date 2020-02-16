<template>
  <footer>
    <p>{{ info.servername }}</p>
    <p class="text-muted">Last Update {{ lastUpdate }}</p>
  </footer>
</template>

<script>
  import {mapState} from 'vuex'
  import {format} from 'date-fns'

  export default {
    name: 'Footer',

    props: {
      player: {
        type: Object,
        default: null,
      },
    },

    computed: {
      ...mapState(['info']),

      lastUpdate () {
        if (this.player) {
          return format(new Date(this.player.data.lastUpdate), 'yyyy-MM-dd HH:mm:ss xx')
        } else if (this.info) {
          return format(new Date(this.info.lastUpdate), 'yyyy-MM-dd HH:mm:ss xx')
        }
        return ''
      },
    },
  }
</script>
