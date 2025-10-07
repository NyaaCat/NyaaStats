<template>
  <Head>
    <html :lang="lang" />
  </Head>
  <div class="leading-none antialiased">
    <transition
      enter-from-class="scale-0"
      leave-to-class="scale-0"
      enter-active-class="transition duration-200 ease-in-out"
      leave-active-class="transition duration-200 ease-in-out"
    >
      <RotatingCube
        v-show="showingRotatingCube"
        size="64"
        class="fixed inset-0 z-50 m-auto rounded-full"
        style="box-shadow: 0 0 100px 10px #000;"
      />
    </transition>
    <div class="min-h-screen flex flex-col relative">
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
  import { Head } from '@unhead/vue/components'

  import Navbar from '@/components/navbar.vue'
  import Footer from '@/components/footer.vue'
  import RotatingCube from '@/components/rotating-cube.vue'
  import useLang from '@/composables/lang'

  export default {
    name: 'App',

    components: {
      Head,
      Navbar,
      RotatingCube,
      Footer,
    },

    provide () {
      return {
        rotatingCube: this.rotatingCube,
      }
    },

    data () {
      const { langAttrValue } = useLang()

      return {
        showingRotatingCube: false,
        showNetworkErrorAlert: false,

        lang: langAttrValue,
      }
    },

    created () {
      // TODO: Error handling
      Promise.all([
        this.$store.dispatch('fetchInfo'),
        this.$store.dispatch('fetchPlayers'),
      ]).then(() => {
        this.showingRotatingCube = false
      })

      if (import.meta.env.DEV) {
        document.addEventListener('keyup', ev => {
          if (ev.target === document.body && ev.key === '`') {
            this.$router.push('/playground')
          }
        })
      }
    },

    methods: {
      rotatingCube (flag = true) {
        this.showingRotatingCube = flag
      }
    },
  }
</script>
