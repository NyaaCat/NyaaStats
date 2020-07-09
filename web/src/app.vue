<template>
  <div id="app" class="leading-none antialiased">
    <div class="min-h-screen bg-gray-200 flex flex-col relative">
      <Navbar class="flex-none relative z-10" />
      <!-- Network error alert -->
      <div v-if="showNetworkErrorAlert" class="my-4 px-page py-4 border border-red-300 rounded bg-red-200 text-red-700 flex items-center">
        Network Error!
        <button class="flex ml-auto" @click="showNetworkErrorAlert = false">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-5 h-5">
            <path d="M12 10.586l4.95-4.95 1.414 1.414-4.95 4.95 4.95 4.95-1.414 1.414-4.95-4.95-4.95 4.95-1.414-1.414 4.95-4.95-4.95-4.95L7.05 5.636z" />
          </svg>
        </button>
      </div>
      <RouterView class="flex-1 relative z-0" />
      <Footer class="mt-auto" />
    </div>
  </div>
</template>

<script>
  import Navbar from '@/components/navbar.vue'
  import Footer from '@/components/footer'

  export default {
    name: 'App',

    components: {
      Navbar,
      Footer,
    },

    data () {
      return {
        showNetworkErrorAlert: false,
      }
    },

    created () {
      // TODO: Error handling
      this.$store.dispatch('fetchInfo')
      this.$store.dispatch('fetchPlayers')

      if (process.env.NODE_ENV === 'development') {
        document.addEventListener('keyup', ev => {
          if (ev.target === document.body && ev.key === '`') {
            this.$router.push('/playground')
          }
        })
      }
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
