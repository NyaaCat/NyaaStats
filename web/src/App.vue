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
  @import url('/font/inter.css');

  #app {
    @apply antialiased leading-none;

    font-family: Inter, theme('fontFamily.sans');
  }

  @supports (font-variation-settings: normal) {
    #app {
      font-family: 'Inter var', theme('fontFamily.sans');
    }
  }
</style>
