<template>
  <div class="flex flex-col">
    <AdvancementTitle :advancement-id="advancementId" :player="player" class="flex-none" />
    <AdvancementGui
      type="box"
      color-map="description"
      class="flex-1 text-mcgray flex flex-col overflow-hidden"
      style="margin-top: -14px; padding-top: 4px;"
    >
      <div class="m-1 leading-5 overflow-auto" style="padding: 6px;">
        <slot>
          <template v-if="db.requirements">
            <p v-for="req of db.requirements" :key="req" class="flex items-center">
              <svg v-if="player" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="mr-1 w-4 h-4">
                <path v-if="playerAdvancement.criteria[req]" d="M10 15.172l9.192-9.193 1.415 1.414L10 18l-6.364-6.364 1.414-1.414z" fill="#0a0" />
                <path v-else d="M12 10.586l4.95-4.95 1.414 1.414-4.95 4.95 4.95 4.95-1.414 1.414-4.95-4.95-4.95 4.95-1.414-1.414 4.95-4.95-4.95-4.95L7.05 5.636z" fill="#f55" />
              </svg>
              <span :class="{'text-mcwhite': player && playerAdvancement.criteria[req]}">{{ t(db.requirement_names[req]) }}</span>
            </p>
          </template>
          <p v-if="updateTime" class="mt-5">Update time: {{ normalizeDate(updateTime) }}</p>
        </slot>
      </div>
    </AdvancementGui>
  </div>
</template>

<script>
  import advancementDB from '@/assets/advancement-data.json'
  import AdvancementTitle from '@/components/AdvancementTitle.vue'
  import AdvancementGui from '@/components/AdvancementGui.vue'
  import {normalizeDate, parseDate} from '@/utils'

  export default {
    name: 'AdvancementInfoPanel',

    components: {
      AdvancementTitle,
      AdvancementGui,
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
    },

    computed: {
      db () {
        return advancementDB[this.advancementId]
      },

      playerAdvancement () {
        return this.player?.advancements[this.advancementId]
      },

      updateTime () {
        return Math.max(...[...Object.values(this.playerAdvancement?.criteria ?? {})].map(parseDate), 0)
      },
    },

    methods: {
      normalizeDate,
    },
  }
</script>
