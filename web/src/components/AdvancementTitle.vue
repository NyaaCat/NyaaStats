<template>
  <div :class="['flex items-center relative', {'text-white text-shadow': colorMap$ === 'normal' || colorMap$ === 'complete'}]">
    <div class="w-full h-frame absolute left-0 inset-y-0 my-auto z-0" :style="frameStyle">
      <div v-if="0 < progress && progress < 1" class="absolute right-0 inset-y-0" :style="progressStyle" />
    </div>
    <div class="relative px-frame flex items-center">
      <AdvancementIcon
        v-if="advancementId"
        :advancement-id="advancementId"
        :color-map="iconColorMap$"
        class="mr-icon flex-none"
      />
      <span :title="t(titleLangKey)" class="whitespace-no-wrap truncate">{{ t(titleLangKey) }}</span>
      <slot />
    </div>
  </div>
</template>

<script>
  import advancementData from '@/assets/advancement-data.json'
  import {createImage} from '@/utils'
  import AdvancementIcon from './AdvancementIcon.vue'

  const PIXEL_MAP = [
    '00100',
    '01210',
    '12431',
    '01310',
    '00100',
  ].map(str => str.split(''))

  const COLOR_MAPS = {
    normal: {
      1: [0, 0, 0],
      2: [3, 126, 185],
      3: [1, 41, 56],
      4: [2, 95, 139],
    },
    complete: {
      1: [0, 0, 0],
      2: [214, 151, 20],
      3: [64, 47, 8],
      4: [177, 132, 39],
    },
    description: {
      1: [0, 0, 0],
      2: [75, 75, 75],
      3: [75, 75, 75],
      4: [30, 30, 30],
    },
    outline: {
      1: [0, 0, 0],
    },
    fill: {
      1: [229, 231, 235],
      2: [229, 231, 235],
      3: [229, 231, 235],
      4: [229, 231, 235],
    },
  }

  export default {
    name: 'AdvancementTitle',

    components: {
      AdvancementIcon,
    },

    props: {
      advancementId: {
        type: String,
        required: true,
      },

      progress: {
        type: Number,
        default: null,
        validator: val => val >= 0,
      },

      colorMap: {
        type: [String, Object],
        default: null,
      },

      iconColorMap: {
        type: [String, Object],
        default: null,
      },
    },

    data () {
      return {
        isMouseOver: false,
      }
    },

    computed: {
      titleLangKey () {
        return advancementData[this.advancementId].title
      },

      colorMap$ () {
        return typeof this.progress === 'number' ? (this.progress > 0 ? 'complete' : 'normal') : this.colorMap
      },

      frameStyle () {
        if (!this.colorMap$) return

        const img = createImage(PIXEL_MAP, COLOR_MAPS[this.colorMap$], 2)
        return {
          borderImage: `url(${img}) ${4 * devicePixelRatio} fill / 4px repeat`,
        }
      },

      progressStyle () {
        const img = createImage(PIXEL_MAP, COLOR_MAPS.normal, 2)
        return {
          width: (1 - this.progress) * 100 + '%',
          borderImage: `url(${img}) ${4 * devicePixelRatio} fill / 4px 4px 4px 0 repeat`,
        }
      },

      iconColorMap$ () {
        return this.iconColorMap ?? (typeof this.progress === 'number' ? this.progress === 1 ? 'complete' : 'normal' : this.colorMap$)
      },
    },
  }
</script>

<style scoped>
  .h-frame {
    height: 40px;
  }

  .px-frame {
    padding-left: 6px;
    padding-right: 6px;
  }

  .mr-icon {
    margin-right: 6px;
  }

  .text-shadow {
    text-shadow: 1px 1px rgba(0, 0, 0, 0.7);
  }
</style>
