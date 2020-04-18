<template>
  <!-- eslint-disable -->

  <div class="el flex-1 flex flex-col items-center">
    <button class="flex" @click="flag = !flag">
      <span class="min-w-6 leading-5 px-1 border-2 border-gray-500 rounded text-gray-600 font-mono inline-flex items-center justify-center" style="min-width: 24px;">/</span>
    </button>

    <div class="text-right font-tnum grid">
      <template v-for="(r, idx) of data">
        <span :style="{gridRow: orders[idx], gridColumn: 1}">{{ r[0] }}</span>
        <span class="mx-2" :style="{gridRow: orders[idx], gridColumn: 2}">/</span>
        <span :style="{gridRow: orders[idx], gridColumn: 3}">{{ r[1] }}</span>
      </template>
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

        data: [
          [99342, 5300],
          [3905, 416],
          [3108, 51],
          [213, 31],
          [503, 0],
          [297, 79],
          [1053, 75],
          [16, 1],
          [90247, 4647],
        ],
      }
    },

    computed: {
      orders () {
        const orders = []
        this.data.slice().sort((b, a) => a[0] - b[0]).forEach((r, idx) => orders[this.data.findIndex(d => d[0] === r[0])] = idx + 1)
        return orders
      },
    },

    created () {
      document.addEventListener('keyup', this.onSlash, true)
    },

    beforeDestroy () {
      document.removeEventListener('keyup', this.onSlash, true)
    },

    methods: {
      onSlash (ev) {
        console.log(ev.target)
        if (ev.target === document.body) {
          this.flag = !this.flag
        }
      },
    },
  }
</script>

<style lang="scss" scoped>
  .el {
    > * {
      @apply mt-10;
    }
  }

  .grid {
    grid-template-columns: auto auto auto;
  }
</style>
