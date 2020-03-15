<template>
  <div class="page-section py-8 border-t border-gray-300 bg-gray-200">
    <footer class="xl:w-page mx-auto text-sm">
      <p class="text-gray-800">Last Update {{ lastUpdate }}</p>
      <p class="mt-4 text-gray-600">{{ info.servername }}</p>
    </footer>
  </div>
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
