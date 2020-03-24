<template>
  <div :class="this.class" :style="{...style, ...$attrs.style || {}}">
    <slot />
  </div>
</template>

<script>
  import {createImage} from '@/utils'

  const PIXEL_MAPS = {
    box: [
      '00100',
      '01210',
      '12431',
      '01310',
      '00100',
    ].map(str => str.split('')),
    task: [
      '0000000',
      '0001000',
      '0012100',
      '0124310',
      '0013100',
      '0001000',
      '0000000',
    ].map(str => str.split('')),
    goal: [
      '0000000001000000000',
      '0000001112111000000',
      '0000112224222110000',
      '0001224444444221000',
      '0012444444444443100',
      '0001334444444331000',
      '0000113334333110000',
      '0000001113111000000',
      '0000000001000000000',
    ].map(str => str.split('')),
    challenge: [
      '011100000000000001110',
      '122211000010000112251',
      '124422111121111224431',
      '124444222242222444431',
      '012444444444444444310',
      '012444444444444444310',
      '001244444444444443100',
      '001244444444444443100',
      '001244444444444443100',
      '001244444444444443100',
      '012444444444444444310',
      '001244444444444443100',
      '001244444444444443100',
      '001244444444444443100',
      '001244444444444443100',
      '012444444444444444310',
      '012444444444444444310',
      '124444333343333444431',
      '124433111131111334431',
      '153311000010000113331',
      '011100000000000001110',
    ].map(str => str.split('')),
  }

  const BORDER_IMAGE_VALUES = {
    box: `${4 * devicePixelRatio} fill / 4px repeat`,
    task: `${6 * devicePixelRatio} fill / 6px repeat`,
    goal: `${8 * devicePixelRatio} ${18 * devicePixelRatio} fill / 8px 18px repeat`,
    challenge: `${20 * devicePixelRatio} fill / 20px repeat`,
  }

  const COLOR_MAPS = {
    'box-normal': {
      1: [0, 0, 0],
      2: [3, 126, 185],
      3: [1, 41, 56],
      4: [2, 95, 139],
    },
    'box-complete': {
      1: [0, 0, 0],
      2: [214, 151, 20],
      3: [64, 47, 8],
      4: [177, 132, 39],
    },
    'box-description': {
      1: [0, 0, 0],
      2: [75, 75, 75],
      3: [75, 75, 75],
      4: [30, 30, 30],
    },
    'icon-normal': {
      1: [0, 0, 0],
      2: [255, 255, 255],
      3: [75, 75, 75],
      4: [191, 190, 191],
      5: [191, 190, 191],
    },
    'icon-complete': {
      1: [0, 0, 0],
      2: [214, 151, 20],
      3: [64, 47, 8],
      4: [160, 114, 17],
      5: [177, 132, 39],
    },
  }

  export default {
    name: 'AdvancementGui',

    props: {
      type: {
        type: String,
        required: true,
      },

      colorMap: {
        type: [String, Object],
        required: true,
      },
    },

    computed: {
      class () {
        // Is icon
        if (this.type !== 'box') {
          return 'flex items-center justify-center'
        }
        // Is predefined advancement title
        if (typeof this.colorMap === 'string' && this.colorMap !== 'description') {
          return 'px-box text-white text-shadow flex items-center'
        }
        return null
      },

      style () {
        const pixelMap = PIXEL_MAPS[this.type]
        const colorMap = typeof this.colorMap === 'string'
          ? COLOR_MAPS[`${this.type === 'box' ? 'box' : 'icon'}-${this.colorMap}`]
          : this.colorMap
        const img = createImage(pixelMap, colorMap, 2)
        return {
          borderImage: `url(${img}) ${BORDER_IMAGE_VALUES[this.type]}`,
        }
      },
    },
  }
</script>

<style scoped>
  .px-box {
    padding-left: 6px;
    padding-right: 6px;
  }

  .text-shadow {
    text-shadow: 1px 1px rgba(0, 0, 0, 0.7);
  }
</style>
