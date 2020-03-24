<template>
  <span :data-type="advancementTypeName" class="block size-frame flex items-center justify-center" :style="frameStyle">
    <img :src="icon" :alt="advancementName">
  </span>
</template>

<script>
  import advancementItemIcons from '@/assets/advancements'
  import advancementData from '@/assets/advancement-data.json'
  import {createImage} from '@/utils'

  const PIXEL_MAPS = {
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
    task: `${6 * devicePixelRatio} fill / 6px repeat`,
    goal: `${8 * devicePixelRatio} ${18 * devicePixelRatio} fill / 8px 18px repeat`,
    challenge: `${20 * devicePixelRatio} fill / 20px repeat`,
  }

  const COLOR_MAPS = {
    normal: {
      1: [0, 0, 0],
      2: [255, 255, 255],
      3: [75, 75, 75],
      4: [191, 190, 191],
      5: [191, 190, 191],
    },
    complete: {
      1: [0, 0, 0],
      2: [214, 151, 20],
      3: [64, 47, 8],
      4: [160, 114, 17],
      5: [177, 132, 39],
    },
    outline: {
      1: [0, 0, 0],
    },
    fill: {
      1: [210, 214, 220],
      2: [210, 214, 220],
      3: [210, 214, 220],
      4: [210, 214, 220],
      5: [210, 214, 220],
    },
  }

  export default {
    name: 'AdvancementIcon',

    props: {
      advancementId: {
        type: String,
        required: true,
      },

      colorMap: {
        type: [String, Object],
        default: null,
      },
    },

    computed: {
      advancementType () {
        return advancementData[this.advancementId].type
      },

      advancementTypeName () {
        return {
          task: 'Normal Advancement',
          goal: 'Goal',
          challenge: 'Challenge',
        }[this.advancementType]
      },

      frameStyle () {
        if (!this.colorMap) return

        const colorMap = typeof this.colorMap === 'string' ? COLOR_MAPS[this.colorMap] : this.colorMap
        const img = createImage(PIXEL_MAPS[this.advancementType], colorMap, 2)
        return {
          borderImage: `url(${img}) ${BORDER_IMAGE_VALUES[this.advancementType]}`,
        }
      },

      advancementIdTokens () {
        return /^minecraft:(\w+)\/(\w+)$/.exec(this.advancementId).slice(1)
      },

      advancementGroup () {
        return this.advancementIdTokens[0]
      },

      advancementName () {
        return this.advancementIdTokens[1]
      },

      icon () {
        return advancementItemIcons[this.advancementGroup][this.advancementName]
      },
    },
  }
</script>

<style scoped>
  .size-frame {
    width: 52px;
    height: 52px;
  }
</style>
