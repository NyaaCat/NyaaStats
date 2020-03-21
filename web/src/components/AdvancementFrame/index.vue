<template>
  <div :data-type="type" class="relative">
    <!-- Bg incomplete -->
    <div class="absolute inset-0 border-frame" :style="{borderImageSource: borderImages[type]}" />
    <!-- Bg complete -->
    <div
      v-show="type === 'normal' && progress > 0"
      class="absolute inset-0 border-frame"
      :style="{borderImageSource: borderImages.complete, width: progress * 100 + '%', borderRight: progress < 1 ? 0 : null}"
    />
    <!-- Content -->
    <div class="relative h-full flex flex-col" style="padding: 9px;">
      <slot />
    </div>
  </div>
</template>

<script>
  import {frames} from './assets'

  export default {
    name: 'AdvancementFrame',

    props: {
      type: {
        type: String,
        default: null,
      },

      progress: {
        type: Number,
        default: null,
      },
    },

    computed: {
      borderImages () {
        return {
          outline: `url(${frames.outline})`,
          normal: `url(${frames.normal})`,
          complete: `url(${frames.complete})`,
          description: `url(${frames.description})`,
        }
      },
    },
  }
</script>

<style scoped>
  .border-frame {
    border: 4px solid transparent;
    border-image: 4 fill repeat;
  }

  [data-type=normal], [data-type=complete] {
    color: #fff;
    text-shadow: 1px 1px rgba(0, 0, 0, 0.7);
  }

  [data-type=description] {
    color: #aaa;
  }
</style>
