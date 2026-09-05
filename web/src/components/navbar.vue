<template>
  <div ref="wrapper" class="h-header">
    <div ref="navbar" class="set-bg w-full text-gray-300 fixed left-0 top-0">
      <div class="px-4 md:px-5 xl:w-page xl:px-0 xl:mx-auto h-header flex items-center">
        <RouterLink to="/" class="min-w-0 truncate font-medium hover:text-white transition-color duration-100 ease-linear">{{ info.title }}</RouterLink>
        <div class="ml-auto self-stretch flex">
          <SearchBox @focus="closeAppMenu" />
          <AppMenu ref="appMenu" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {mapState} from 'vuex'
  import {ResizeSensor} from 'css-element-queries'

  import AppMenu from './app-menu.vue'
  import SearchBox from './search-box.vue'

  export default {
    name: 'Navbar',

    components: {
      AppMenu,
      SearchBox,
    },

    computed: mapState(['info']),

    mounted () {
      new ResizeSensor(this.$refs.wrapper, () => {
        this.$refs.navbar.style.width = this.$refs.wrapper.offsetWidth + 'px'
      })
    },

    methods: {
      closeAppMenu () {
        this.$refs.appMenu?.close()
      },
    },
  }
</script>

<style scoped>
  .set-bg {
    background: #1c1c1c url("../assets/bg-wool-dark.png") repeat;
  }
</style>
