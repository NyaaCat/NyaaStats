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
      <div class="advancement-title__fg flex items-center">
        <AdvancementIcon :advancement-id="adv.advId" />
        <span class="advancement-title__text relative">{{
          lang(titleLangKey)
        }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import * as frames from '@/assets/frames'
import AdvancementIcon from './AdvancementIcon'

export default {
  name: 'AdvancementBlock',

  components: {
    AdvancementIcon,
  },

  props: ['adv'],

  computed: {
    uuid() {
      return this.$route.params.uuid
    },

    isAdvancementDone() {
      return this.$store.state.players[this.uuid].advancements[
        this.adv.advId
      ].done
    },

    titleBgLeft() {
      return this.isAdvancementDone
        ? frames.title_left_complete
        : frames.title_left
    },

    titleBgMiddle() {
      return this.isAdvancementDone
        ? frames.title_middle_complete
        : frames.title_middle
    },

    titleBgRight() {
      return this.isAdvancementDone
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

.advancement-title__fg .advancement-icon {
  margin: 0 2px;
}

.advancement-title__text {
  font-size: 17px;
  color: #fff;
  text-shadow: 1px 1px rgba(0, 0, 0, 0.7);
  margin: 0 2px;
}
</style>
