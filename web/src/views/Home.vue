<template>
  <div class="flex flex-col">
    <Welcome />
    <PlayerList />
    <Footer class="mt-auto" />
  </div>
</template>

<script>
  import Welcome from '@/components/Welcome.vue'
  import PlayerList from '@/components/PlayerList.vue'
  import Footer from '@/components/Footer.vue'

  export default {
    components: {
      Welcome,
      PlayerList,
      Footer,
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
