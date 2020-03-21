<template>
  <div class="flex-1 overflow-auto flex flex-col" style="min-width: 300px; max-width: 400px;">
    <AdvancementFrame
      :type="player.done ? 'complete' : 'normal'"
      :progress="progress.length / total"
      class="flex-none relative z-10"
      style="margin-top: 6px; height: 40px;"
    >
      <div class="h-full flex items-center" style="font-size: 17px">
        <AdvancementIcon :advancement-id="advancementId" :type="player.done ? 'complete' : 'normal'" class="flex-none -ml-1" />
        <span class="ml-1">{{ lang(data.title) }}</span>
        <span v-if="total" class="ml-auto">{{ progress.length }}/{{ total }}</span>
      </div>
    </AdvancementFrame>
    <AdvancementFrame type="description" class="flex-1 overflow-auto" style="margin-top: -8px;">
      <div class="mt-2 flex-1 overflow-auto" style="min-height: 18px;">
        <p>更新时间：{{ updateTime }}</p>
        <div v-if="data.requirements" class="mt-2">
          <p v-for="req of data.requirements" :key="req" class="my-0.5 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-4 h-4">
              <path v-if="progress.includes(req)" d="M10 15.172l9.192-9.193 1.415 1.414L10 18l-6.364-6.364 1.414-1.414z" fill="#0a0" />
              <path v-else d="M12 10.586l4.95-4.95 1.414 1.414-4.95 4.95 4.95 4.95-1.414 1.414-4.95-4.95-4.95 4.95-1.414-1.414 4.95-4.95-4.95-4.95L7.05 5.636z" fill="#f55" />
            </svg>
            <span :class="['ml-1', {'text-white': progress.includes(req)}]">{{ lang(data.requirement_names[req]) }}</span>
          </p>
        </div>
      </div>
    </AdvancementFrame>
  </div>
</template>

<script>
  import advancementData from '@/assets/advancement-data.json'
  import {normalizeDate, parseDate} from '@/utils'
  import AdvancementFrame from '@/components/AdvancementFrame/index.vue'
  import AdvancementIcon from '@/components/AdvancementIcon/index.vue'

  export default {
    name: 'AdvancementModal',

    components: {
      AdvancementFrame,
      AdvancementIcon,
    },

    data () {
      return {
        advancementId: null,
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

      updateTime () {
        const time = Math.max(...[...Object.values(this.player.criteria)].map(s => parseDate(s).getTime()))
        return normalizeDate(new Date(time))
      },

      total () {
        return this.data.requirements?.length ?? 0
      },

      progress () {
        return Object.keys(this.player.criteria)
      },
    },
  }
</script>
