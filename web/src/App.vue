<template>
  <div id="app">
    <router-view name="navbar"></router-view>

    <router-view name="welcome"></router-view>

    <div class="container">
      <router-view name="container"></router-view>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { mapState, mapMutations } from 'vuex'

export default {
  name: 'app',
  methods: mapMutations(['setInfo']),
  computed: mapState(['info']),
  async mounted() {
    let data
    try {
      data = await axios.get('/data/info.json')
    } catch (error) {
      // TODO: show something
      return
    }
    this.setInfo({
      info: data.data,
    })
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
