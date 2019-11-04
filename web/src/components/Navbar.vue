<template>
  <nav class="navbar navbar-inverse navbar-fixed-top">
    <div class="container flex items-center">
      <div class="navbar-header">
        <router-link class="navbar-brand" to="/">
          {{ info.title }}
        </router-link>
      </div>
      <div class="ml-auto">
        <LangSelector />
      </div>
    </div>
  </nav>
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

<style scoped>
.flex {
  display: flex;
}

.items-center {
  align-items: center;
}

.ml-auto {
  margin-left: auto;
}
</style>
