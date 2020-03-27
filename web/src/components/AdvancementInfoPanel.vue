<template>
  <div class="flex flex-col" style="min-height: 52px;">
    <AdvancementTitle
      :advancement-id="advancementId"
      :player="player"
      :class="['flex-none', {'cursor-pointer': expandable}]"
      @click.native="expandable && toggle()"
    />
    <SlidingTransition :duration="{enter: 300, leave: 200}" @after-enter="$emit('after-expand')" @after-leave="$emit('after-collapse')">
      <div v-show="isDescriptionVisible" class="flex flex-col justify-end" style="margin-top: -14px;">
        <AdvancementGui
          type="box"
          color-map="description"
          class="flex-1 text-mcgray overflow-visible flex flex-col"
          style="padding-top: 4px;"
        >
          <div class="m-1 leading-5 overflow-auto" style="padding: 6px;">
            <template v-if="db.requirements">
              <p v-for="req of db.requirements" :key="req" class="flex items-center">
                <!-- eslint-disable vue/max-attributes-per-line -->
                <svg v-if="playerAdvancement" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="mr-1 w-4 h-4">
                  <path v-if="playerAdvancement.criteria[req]" d="M10 15.172l9.192-9.193 1.415 1.414L10 18l-6.364-6.364 1.414-1.414z" fill="#0a0" />
                  <path v-else d="M12 10.586l4.95-4.95 1.414 1.414-4.95 4.95 4.95 4.95-1.414 1.414-4.95-4.95-4.95 4.95-1.414-1.414 4.95-4.95-4.95-4.95L7.05 5.636z" fill="#f55" />
                </svg>
                <span :class="{'text-mcwhite': playerAdvancement && playerAdvancement.criteria[req]}">{{ t(db.requirement_names[req]) }}</span>
              </p>
            </template>
            <slot>
              <p v-if="updateTime" class="mt-5 first:mt-0">{{ t('nyaa.player_advancements.update_time') }}{{ t('nyaa.symbol.colon_s') }}{{ normalizeDate(updateTime) }}</p>
            </slot>
          </div>
        </AdvancementGui>
      </div>
    </SlidingTransition>
  </div>
</template>

<script>
  import advancementDB from '@/assets/advancement-data.json'
  import AdvancementTitle from '@/components/AdvancementTitle.vue'
  import AdvancementGui from '@/components/AdvancementGui.vue'
  import SlidingTransition from '@/components/SlidingTransition'
  import {normalizeDate, parseDate} from '@/common/utils'

  export default {
    name: 'AdvancementInfoPanel',

    components: {
      AdvancementTitle,
      AdvancementGui,
      SlidingTransition,
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

      expandable: {
        type: [Boolean, String],
        default: false,
      },
    },

    data () {
      return {
        isDescriptionVisible: !this.expandable,
      }
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

    mounted () {
      if (this.expandable === 'auto') {
        this.toggle()
      }
    },

    methods: {
      normalizeDate,

      toggle () {
        this.isDescriptionVisible = !this.isDescriptionVisible
      },
    },
  }
</script>

<style scoped>
  .transition-height {
    transition-property: height;
  }
</style>
