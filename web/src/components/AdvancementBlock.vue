<template>
  <div class="advancement-block col-sm-12 col-md-6 col-lg-4">
    <!--
    <div class="media">
      <div class="media-left">
        <AdvancementIcon :advancement-id="adv.advId" />
      </div>
      <div class="media-body text-middle">
        <h4 class="my-0">
          {{ lang(titleLangKey) }}<br />
          <small>
            <span v-if="adv.progTotal !== 0">
              Completed {{ adv.prog }} / {{ adv.progTotal }}
            </span>
            <span v-else-if="adv.prog > 1 && adv.progTotal === 0">
              Completed: {{ adv.prog }}
            </span>
            <span v-else>
              Completed
            </span>
          </small>
        </h4>
      </div>
    </div>
    -->
    <div class="advancement-title relative">
      <div class="advancement-title__bg position left-0 w-full">
        <img :src="titleBgLeft" alt="" />
        <img :src="titleBgMiddle" alt="" class="w-full" />
        <img :src="titleBgRight" alt="" />
      </div>
      <div class="advancement-title__fg relative flex items-center">
        <AdvancementIcon :advancement-id="adv.advId" />
        <span class="advancement-title__text">{{ lang(titleLangKey) }}</span>
        <span
          v-if="advData.requirements && advData.requirements.length > 1"
          class="advancement-title__progress"
          >({{ Object.keys(playerData.criteria).length }}/{{
            advData.requirements.length
          }})</span
        >
      </div>
    </div>
  </div>
</template>

<script>
import advancementData from '@/assets/advancement-data.json'
import * as frames from '@/assets/frames'
import AdvancementIcon from './AdvancementIcon'

export default {
  name: 'AdvancementBlock',

  components: {
    AdvancementIcon,
  },

  props: ['adv'],

  computed: {
    advData() {
      return advancementData[this.adv.advId]
    },

    uuid() {
      return this.$route.params.uuid
    },

    playerData() {
      return this.$store.state.players[this.uuid].advancements[this.adv.advId]
    },

    titleBgLeft() {
      return this.playerData.done
        ? frames.title_left_complete
        : frames.title_left
    },

    titleBgMiddle() {
      return this.playerData.done
        ? frames.title_middle_complete
        : frames.title_middle
    },

    titleBgRight() {
      return this.playerData.done
        ? frames.title_right_complete
        : frames.title_right
    },

    titleLangKey() {
      const [, group, name] = this.adv.advId.split(/[:/]/)
      return `advancements.${group}.${name}.title`
    },
  },
}
</script>

<style>
.advancement-title {
  border-width: 0 4px;
  border-style: solid;
  border-color: transparent;
  margin-bottom: 20px;
}

.advancement-title__bg img {
  height: 52px;
  image-rendering: pixelated;
  position: absolute;
}

.advancement-title__bg img:nth-child(1) {
  right: 100%;
}

.advancement-title__bg img:nth-child(3) {
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
</style>
