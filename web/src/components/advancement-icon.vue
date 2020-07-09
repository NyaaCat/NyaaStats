<template>
  <AdvancementGui :type="type" :color-map="colorMap">
    <img :src="icon" :alt="advancementName">
  </AdvancementGui>
</template>

<script>
  import advancementItemIcons from '@/assets/advancements'
  import advancementData from '@/assets/advancement-data.json'
  import AdvancementGui from '@/components/advancement-gui'

  export default {
    name: 'AdvancementIcon',

    components: {
      AdvancementGui,
    },

    props: {
      advancementId: {
        type: String,
        required: true,
      },

      colorMap: {
        type: null,
        default: null,
      },
    },

    computed: {
      type () {
        return advancementData[this.advancementId].type
      },

      advancementTypeName () {
        return {
          task: 'Normal Advancement',
          goal: 'Goal',
          challenge: 'Challenge',
        }[this.type]
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
