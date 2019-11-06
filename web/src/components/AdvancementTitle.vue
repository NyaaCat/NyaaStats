<template>
  <div class="advancement-title relative">
    <div class="advancement-title__bg w-full">
      <img :src="bgLeft" alt="" />
      <img :src="bgFull" alt="" class="w-full" />
      <img
        :src="bgProgress"
        alt=""
        class="w-full"
        :style="{ width: progress / (total || 1) * 100 + '%' }"
      />
      <img :src="bgRight" alt="" />
    </div>
    <div class="advancement-title__fg relative flex items-center">
      <AdvancementIcon :advancement-id="advancementId" class="flex-0" />
      <span class="advancement-title__text">{{ lang(titleLangKey) }}</span>
      <span v-if="total" class="advancement-title__progress ml-auto"
        >{{ progress }}/{{ total }}</span
      >
    </div>
  </div>
</template>

<script>
import * as frames from '@/assets/frames'
import advancementData from '@/assets/advancement-data'
import AdvancementIcon from './AdvancementIcon'

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
  },

  computed: {
    data() {
      return advancementData[this.advancementId]
    },

    player() {
      const uuid = this.$route.params.uuid
      return this.$store.state.players[uuid].advancements[this.advancementId]
    },

    bgLeft() {
      return frames.title_left_complete
    },

    bgFull() {
      return frames.title_middle
    },

    bgProgress() {
      return frames.title_middle_complete
    },

    bgRight() {
      return this.player.done ? frames.title_right_complete : frames.title_right
    },

    titleLangKey() {
      return this.data.title
    },

    total() {
      return this.data.requirements ? this.data.requirements.length : 0
    },

    progress() {
      return Object.keys(this.player.criteria).length
    },
  },
}
</script>

<style>
.advancement-title {
  border-width: 0 4px;
  border-style: solid;
  border-color: transparent;
}

.advancement-title__bg img {
  height: 52px;
  image-rendering: pixelated;
  position: absolute;
}

.advancement-title__bg img:nth-child(1) {
  right: 100%;
}

.advancement-title__bg img:nth-child(4) {
  left: 100%;
}

.advancement-title__fg {
  font-size: 17px;
  color: #fff;
  text-shadow: 1px 1px rgba(0, 0, 0, 0.7);
}

.advancement-title__fg > * {
  margin: 0 2px;
}

.advancement-title__text {
  white-space: nowrap;
}

.advancement-title__progress {
  margin-right: 8px;
}
</style>
