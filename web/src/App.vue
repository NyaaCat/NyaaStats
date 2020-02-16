<template>
  <div id="app">
    <Navbar />

    <Welcome v-if="$route.path === '/'" />

    <div class="container">
      <router-view />
    </div>
  </div>
</template>

<script>
  import Navbar from '@/components/Navbar'
  import Welcome from '@/components/Welcome'

  export default {
    name: 'App',

    components: {
      Navbar,
      Welcome,
    },

    created() {
      this.$store.dispatch('fetchInfo')
    },
  }
</script>

<style>
#app {
  font-family: -apple-system, 'Noto Sans', 'Helvetica Neue', Helvetica,
    'Nimbus Sans L', Arial, 'Liberation Sans', 'PingFang SC', 'Hiragino Sans GB',
    'Noto Sans CJK SC', 'Source Han Sans SC', 'Source Han Sans CN',
    'Microsoft YaHei', 'Wenquanyi Micro Hei', 'WenQuanYi Zen Hei', 'ST Heiti',
    SimHei, 'WenQuanYi Zen Hei Sharp', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
body {
  padding-top: 50px;
  padding-bottom: 20px;
}

@media (max-width: 767px) {
  .row {
    margin: -5px;
  }
}

.text-middle {
  vertical-align: middle;
}

.achievements {
  width: 32px;
  height: 32px;
}

.name-qs {
  display: none;
}
.navbar {
  margin-bottom: 0;
}
</style>
