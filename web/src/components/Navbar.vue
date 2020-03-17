<template>
  <div class="set-height">
    <div class="page-section set-bg text-gray-300 fixed inset-x-0 top-0">
      <div class="set-height flex items-center">
        <RouterLink to="/" class="font-medium hover:text-white transition-color duration-100 ease-linear">{{ info.title }}</RouterLink>
        <div class="ml-auto">
          <LangSelector />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapState } from 'vuex'

  import LangSelector from '@/components/LangSelector'

  export default {
    name: 'Navbar',

    components: {
      LangSelector,
    },

    computed: mapState(['info']),
  }
</script>

<style lang="scss" scoped>
  .set-height {
    height: 50px;
  }

  .set-bg {
    background: #1c1c1c url("../assets/bg-wool-dark.png") repeat;
  }
</style>
