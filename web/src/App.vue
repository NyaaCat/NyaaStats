<template>
  <div id="app">
    <Navbar class="relative z-10" />
    <RouterView />
  </div>
</template>

<script>
  import Navbar from '@/components/Navbar'

  export default {
    name: 'App',

    components: {
      Navbar,
    },

    created () {
      this.$store.dispatch('fetchInfo')
    },
  }
</script>

<style>
  #app {
    @apply font-sans antialiased leading-none;
  }
</style>
