<template>
  <footer class="py-6 border-t border-gray-200 text-sm">
    <p class="text-gray-800">{{ info.servername }}</p>
    <p class="mt-5 text-gray-600">Last Update {{ lastUpdate }}</p>
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
