<template>
  <div class="h-icon flex items-center">
    <AdvancementGui type="box" :color-map="colorMapP" class="w-full h-box relative">
      <AdvancementGui
        v-if="0 < progress && progress < total"
        type="box"
        color-map="normal"
        class="absolute right-0 inset-y-0 z-0"
        :style="{width: (total - progress) / total * 100 + '%', borderImageWidth: '4px 4px 4px 0'}"
      />
      <div class="flex-1 leading-5 relative flex items-center">
        <AdvancementIcon :advancement-id="advancementId" :color-map="iconColorMapP" class="w-icon h-icon mr-icon flex-none" />
        <span :title="t(titleLangKey)" class="whitespace-no-wrap truncate">{{ t(titleLangKey) }}</span>
        <span v-if="total && player" class="ml-auto" style="padding-left: 6px;">({{ progress }}/{{ total }})</span>
      </div>
    </AdvancementGui>
  </div>
</template>

<script>
  import advancementDB from '@/assets/advancement-data.json'
  import AdvancementGui from './AdvancementGui.vue'
  import AdvancementIcon from './AdvancementIcon.vue'

  export default {
    name: 'AdvancementTitle',

    components: {
      AdvancementGui,
      AdvancementIcon,
    },

    props: {
      advancementId: {
        type: String,
        required: true,
      },

      player: {
        type: Object,
        default: null,
      },

      colorMap: {
        type: null,
        default: null,
      },

      iconColorMap: {
        type: null,
        default: null,
      },
    },

    computed: {
      playerAdvancement () {
        return this.player?.advancements[this.advancementId]
      },

      progress () {
        return Object.keys(this.playerAdvancement?.criteria ?? {}).length
      },

      total () {
        return advancementDB[this.advancementId].requirements?.length ?? 0
      },

      colorMapP () {
        return this.colorMap ?? (this.progress > 0 ? 'complete' : 'normal')
      },

      iconColorMapP () {
        return this.iconColorMap ?? (this.progress === this.total ? 'complete' : 'normal')
      },

      titleLangKey () {
        return advancementDB[this.advancementId].title
      },
    },
  }
</script>

<style scoped>
  .w-icon {
    width: 52px;
  }

  .h-icon {
    height: 52px;
  }

  .h-box {
    height: 40px;
  }

  .mr-icon {
    margin-right: 6px;
  }
</style>
