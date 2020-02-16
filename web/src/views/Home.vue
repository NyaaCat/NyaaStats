<template>
  <div>
    <Welcome />
    <div class="container">
      <PlayerList />
      <hr>
      <Footer />
    </div>
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
  }
</script>
