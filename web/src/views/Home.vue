<template>
  <div class="flex flex-col">
    <Welcome />
    <div class="page-section">
      <PlayerList />
    </div>
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
  }
</script>
