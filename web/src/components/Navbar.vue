<template>
  <div class="set-height">
    <div class="set-bg bg-black text-gray-500 fixed inset-x-0 top-0">
      <div class="set-height container flex items-center">
        <RouterLink class="navbar-brand" to="/">
          {{ info.title }}
        </RouterLink>
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
    background: url("https://www.minecraft.net/etc.clientlibs/minecraft/clientlibs/main/resources/img/header/bg-wool-dark.png") repeat;
  }
</style>
