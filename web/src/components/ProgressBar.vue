<template>
  <div v-show="visible" class="progress-bar my-4 h-5 rounded bg-blue-600" />
</template>

<script>
  export default {
    name: 'ProgressBar',

    props: {
      visible: {
        type: Boolean,
        default: false,
      },
    },
  }
</script>

<style scoped>
  div {
    background-image: linear-gradient(45deg, hsla(0, 0%, 100%, .15) 25%, transparent 0, transparent 50%, hsla(0, 0%, 100%, .15) 0, hsla(0, 0%, 100%, .15) 75%, transparent 0, transparent);
    background-size: 40px 40px;
  }
</style>
