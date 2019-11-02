<template>
  <span class="advancement-icon">
    <img :src="frame" :alt="advancementType | frameAltText" class="frame">
    <img :src="itemIcon" :alt="advancementName" class="icon">
  </span>
</template>

<script>
import * as frames from '@/assets/frames';
import advancementItemIcons from '@/assets/advancements';
import advancementData from '@/assets/advancement-data.json';

export default {
  name: 'AdvancementIcon',

  filters: {
    frameAltText: type => ({
      normal: 'Normal Advancement',
      goal: 'Goal',
      challenge: 'Challenge',
    }[type]),
  },

  props: {
    advancementId: {
      type: String,
      required: true,
    },
  },

  computed: {
    advancementItemIcons: () => advancementItemIcons,

    advancementData: () => advancementData,

    uuid() {
      return this.$route.params.uuid;
    },

    advancementType() {
      return advancementData[this.advancementId].type;
    },

    isAdvancementDone() {
      return this.$store.state.players[this.uuid].advancements[this.advancementId].done;
    },

    frame() {
      return frames[this.advancementType + (this.isAdvancementDone ? '_complete' : '')]
    },

    advancementIdTokens() {
      return /^minecraft:(\w+)\/(\w+)$/.exec(this.advancementId).slice(1);
    },

    advancementGroup() {
      return this.advancementIdTokens[0];
    },

    advancementName() {
      return this.advancementIdTokens[1];
    },

    itemIcon() {
      return advancementItemIcons[this.advancementGroup][this.advancementName];
    },
  },
};
</script>

<style>
.advancement-icon {
  display: block;
  width: 52px;
  height: 52px;
  position: relative;
}

.advancement-icon .frame {
  width: 100%;
  height: 100%;
}

.advancement-icon .icon {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  margin: auto;
}
</style>
