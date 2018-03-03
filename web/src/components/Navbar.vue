<template>
  <nav class="navbar navbar-inverse navbar-fixed-top">
    <div class="container">
      <div class="navbar-header">
        <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
          <span class="sr-only">Toggle navigation</span>
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
        </button>
        <router-link class="navbar-brand" to="/">
          {{ info.title }}
        </router-link>
      </div>
      <label class="i18n-menu">
        <select v-model="locale">
          <option value="en">English</option>
          <option value="zh-cn">中文</option>
        </select>
      </label>
    </div>
  </nav>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'Navbar',
  computed: mapState([
    'info',
  ]),
  data() {
    return {
      locale: this.$i18n.locale,
    };
  },
  watch: {
    locale(val) {
      this.$i18n.locale = val;
    },
  },
};
</script>

<style>
  .i18n-menu {
    display: block;
    float: right;
    margin: 0;
    line-height: 50px;
    font-weight: normal;
  }

  .i18n-menu select {
    border: 0;
    background: transparent;
    color: #d9d9d9;
  }

  .i18n-menu option {
    color: #000;
  }
</style>
