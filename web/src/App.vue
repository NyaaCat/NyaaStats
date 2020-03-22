<template>
  <div id="app" class="leading-none antialiased">
    <div class="min-h-screen bg-gray-200 flex flex-col relative">
      <Navbar class="flex-none z-10" />
      <RouterView class="flex-1" />
      <Footer class="mt-auto" />
    </div>
    <ModalLayer class="fixed inset-0 z-10" />
  </div>
</template>

<script>
  import Navbar from '@/components/Navbar.vue'
  import Footer from '@/components/Footer'
  import ModalLayer from '@/components/ModalLayer.vue'

  export default {
    name: 'App',

    components: {
      Navbar,
      Footer,
      ModalLayer,
    },

    created () {
      this.$store.dispatch('fetchInfo')
    },
  }
</script>

<style>
  @import url('/font/inter.css');

  #app {
    font-family: Inter, theme('fontFamily.sans');
  }

  @supports (font-variation-settings: normal) {
    #app {
      font-family: 'Inter var', theme('fontFamily.sans');
    }
  }
</style>
