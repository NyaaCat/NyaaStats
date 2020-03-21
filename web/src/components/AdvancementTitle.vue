<template>
  <AdvancementFrame
    :type="isMouseOver ? 'outline' : null"
    class="cursor-pointer"
    style="height: 40px;"
    @mouseenter.native="isMouseOver = true"
    @mouseleave.native="isMouseOver = false"
  >
    <div class="h-full flex items-center">
      <AdvancementIcon :advancement-id="advancementId" :type="player.done ? 'complete' : 'normal'" class="flex-none -ml-1" />
      <span :title="lang(titleLangKey)" class="ml-1 whitespace-no-wrap truncate">{{ lang(titleLangKey) }}</span>
      <span v-if="total" class="ml-2 text-gray-500">({{ progress }}/{{ total }})</span>
    </div>
  </AdvancementFrame>
</template>

<script>
  import advancementData from '@/assets/advancement-data.json'
  import AdvancementFrame from './AdvancementFrame/index.vue'
  import AdvancementIcon from './AdvancementIcon/index.vue'

  export default {
    name: 'AdvancementTitle',

    components: {
      AdvancementFrame,
      AdvancementIcon,
    },

    props: {
      advancementId: {
        type: String,
        required: true,
      },
    },

    data () {
      return {
        isMouseOver: false,
      }
    },

    computed: {
      data () {
        return advancementData[this.advancementId]
      },

      player () {
        const uuid = this.$route.params.uuid
        return this.$store.state.players[uuid].advancements[this.advancementId]
      },

      titleLangKey () {
        return this.data.title
      },

      total () {
        return this.data.requirements ? this.data.requirements.length : 0
      },

      progress () {
        return Object.keys(this.player.criteria).length
      },
    },
  }
</script>
