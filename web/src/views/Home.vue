<template>
  <div class="flex flex-col">
    <Welcome />
    <PlayerList />
  </div>
</template>

<script>
  import Welcome from '@/components/Welcome.vue'
  import PlayerList from '@/components/PlayerList.vue'

  export default {
    components: {
      Welcome,
      PlayerList,
    },

    watch: {
      '$store.state.info.lastUpdate': {
        immediate: true,
        handler (val) {
          if (val) {
            this.$store.commit('setFooterUpdateTime', val)
          }
        },
      },
    },

    beforeRouteEnter (to, from, next) {
      next(vm => {
        document.title = vm.$store.state.info.title
      })
    },

    beforeRouteLeave (to, from, next) {
      this.$store.commit('setScrollOffset', {uuid: to.params.uuid})
      next()
    },
  }
</script>
