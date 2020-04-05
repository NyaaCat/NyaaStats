<template>
  <!-- eslint-disable -->

  <div class="el flex-1 flex flex-col items-center">
    <button class="flex">
      <span class="min-w-6 leading-5 px-1 border-2 border-gray-500 rounded text-gray-600 font-mono inline-flex items-center justify-center" style="min-width: 24px;">/</span>
    </button>

    <div class="mx-4 self-stretch xl:w-page xl:self-center">
      <div class="flex -mr-1">
        <div v-for="n of 10" :key="n" :class="`mr-1 flex-1 h-8 border border-black bg-gray-${n > 1 ? (n - 1) * 10 : 5}0`" />
      </div>
      <div class="mt-1 flex -mr-1">
        <div v-for="n of 10" :key="n" :class="`mr-1 flex-1 h-8 border border-black bg-cool-gray-${n > 1 ? (n - 1) * 10 : 5}0`" />
      </div>
    </div>
  </div>
</template>

<script lang="jsx">
  /* eslint-disable */

  export default {
    name: 'PlaygroundView',

    components: {
    },

    data () {
      return {
        flag: false,
      }
    },

    methods: {
    },
  }
</script>

<style lang="scss" scoped>
  .el {
    > * {
      @apply mt-10;
    }
  }
</style>
