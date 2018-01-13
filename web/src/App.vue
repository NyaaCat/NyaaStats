<template>
  <div id="app">
    <nav>
      <router-view name="navbar"></router-view>
    </nav>

    <router-view name="welcome"></router-view>

    <div class="container">
      <router-view name="container"></router-view>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { mapState, mapMutations } from 'vuex';

export default {
  name: 'app',
  methods: mapMutations([
    'setInfo',
  ]),
  computed: mapState([
    'info',
  ]),
  async mounted() {
    let data;
    try {
      data = await axios.get('/static/data/info.json');
    } catch (error) {
      this.showNetworkErrorAlert = true;
      return;
    }
    this.setInfo({
      info: data.data,
    });
  },
};
</script>

<style>
#app {
  font-family: Tahoma, Helvetica, Arial, "Microsoft Yahei", "微软雅黑", STXihei,
    "华文细黑", sans-serif;
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
