<template>
  <div ref="wrapper" class="set-height">
    <div ref="navbar" class="set-bg w-full text-gray-300 fixed left-0 top-0">
      <div class="page-section set-height flex items-center">
        <RouterLink to="/" class="font-medium hover:text-white transition-color duration-100 ease-linear">{{ info.title }}</RouterLink>
        <div class="ml-auto">
          <LangSelector />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {mapState} from 'vuex'
  import {ResizeSensor} from 'css-element-queries'

  import LangSelector from '@/components/LangSelector.vue'

  export default {
    name: 'Navbar',

    components: {
      LangSelector,
    },

    computed: mapState(['info']),

    mounted () {
      new ResizeSensor(this.$refs.wrapper, () => {
        this.$refs.navbar.style.width = this.$refs.wrapper.offsetWidth + 'px'
      })
    },
  }
</script>

<style scoped>
  .set-height {
    height: 50px;
  }

  .set-bg {
    background: #1c1c1c url("../assets/bg-wool-dark.png") repeat;
  }
</style>
