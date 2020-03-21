<template>
  <span class="block size-frame flex items-center justify-center" :style="{backgroundImage: `url(${frame})`}">
    <img :src="icon" :alt="advancementName">
  </span>
</template>

<script>
  import advancementItemIcons from '@/assets/advancements'
  import advancementData from '@/assets/advancement-data.json'
  import {frames} from './assets'

  export default {
    name: 'AdvancementIcon',

    filters: {
      frameAltText: type => ({
        task: 'Normal Advancement',
        goal: 'Goal',
        challenge: 'Challenge',
      }[type]),
    },

    props: {
      advancementId: {
        type: String,
        required: true,
      },

      type: {
        type: String,
        required: true,
      },
    },

    computed: {
      advancementType () {
        return advancementData[this.advancementId].type
      },

      frame () {
        const suffix = {
          outline: '_outline',
          normal: '',
          complete: '_complete',
        }[this.type]
        return frames[this.advancementType + suffix]
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
