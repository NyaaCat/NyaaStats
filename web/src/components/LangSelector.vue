<template>
  <span class="lang-selector">
    <select v-model="value">
      <option value="zh_cn">中文</option>
      <option value="en_us">English</option>
    </select>
  </span>
</template>

<script>
export default {
  name: 'LangSelector',

  computed: {
    value: {
      get() {
        return this.$store.state.lang
      },
      set(val) {
        this.$store.commit('setLang', val)
      },
    },
  },
}
</script>

<style>
.lang-selector {
  color: #9d9d9d;
}
</style>
