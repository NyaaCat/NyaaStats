<template>
  <div class="el flex-1 flex flex-col items-center">
    <div class="flex -mr-5">
      <AdvancementIcon advancement-id="minecraft:adventure/trade" color-map="outline" class="mr-5" />
      <AdvancementIcon advancement-id="minecraft:adventure/trade" color-map="normal" class="mr-5" />
      <AdvancementIcon advancement-id="minecraft:adventure/trade" color-map="complete" class="mr-5" />
      <AdvancementIcon advancement-id="minecraft:adventure/trade" color-map="fill" class="mr-5" />
      <AdvancementIcon advancement-id="minecraft:adventure/trade" class="mr-5" />
    </div>
    <div class="flex -mr-5">
      <AdvancementIcon advancement-id="minecraft:adventure/totem_of_undying" color-map="outline" class="mr-5" />
      <AdvancementIcon advancement-id="minecraft:adventure/totem_of_undying" color-map="normal" class="mr-5" />
      <AdvancementIcon advancement-id="minecraft:adventure/totem_of_undying" color-map="complete" class="mr-5" />
      <AdvancementIcon advancement-id="minecraft:adventure/totem_of_undying" color-map="fill" class="mr-5" />
      <AdvancementIcon advancement-id="minecraft:adventure/totem_of_undying" class="mr-5" />
    </div>
    <div class="flex -mr-5">
      <AdvancementIcon advancement-id="minecraft:adventure/adventuring_time" color-map="outline" class="mr-5" />
      <AdvancementIcon advancement-id="minecraft:adventure/adventuring_time" color-map="normal" class="mr-5" />
      <AdvancementIcon advancement-id="minecraft:adventure/adventuring_time" color-map="complete" class="mr-5" />
      <AdvancementIcon advancement-id="minecraft:adventure/adventuring_time" color-map="fill" class="mr-5" />
      <AdvancementIcon advancement-id="minecraft:adventure/adventuring_time" class="mr-5" />
    </div>
    <div class="flex -mr-5">
      <AdvancementTitle advancement-id="minecraft:adventure/trade" :progress="0" class="mr-5" />
      <AdvancementTitle advancement-id="minecraft:adventure/trade" :progress="0.5" class="mr-5" />
      <AdvancementTitle advancement-id="minecraft:adventure/trade" :progress="1" class="mr-5" />
      <AdvancementTitle advancement-id="minecraft:adventure/trade" :color-map="isMouseHover ? 'fill' : null" :icon-color-map="isMouseHover ? 'normal' : 'fill'" class="mr-5" @mouseenter.native="isMouseHover = true" @mouseleave.native="isMouseHover = false" />
    </div>
    <div class="flex -mr-5">
      <AdvancementTitle advancement-id="minecraft:adventure/totem_of_undying" :progress="0" class="mr-5" />
      <AdvancementTitle advancement-id="minecraft:adventure/totem_of_undying" :progress="0.5" class="mr-5" />
      <AdvancementTitle advancement-id="minecraft:adventure/totem_of_undying" :progress="1" class="mr-5" />
      <AdvancementTitle advancement-id="minecraft:adventure/totem_of_undying" :color-map="isMouseHover ? 'fill' : null" :icon-color-map="isMouseHover ? 'normal' : 'fill'" class="mr-5" @mouseenter.native="isMouseHover = true" @mouseleave.native="isMouseHover = false" />
    </div>
    <div class="flex -mr-5">
      <AdvancementTitle advancement-id="minecraft:adventure/adventuring_time" :progress="0" class="mr-5" />
      <AdvancementTitle advancement-id="minecraft:adventure/adventuring_time" :progress="0.5" class="mr-5" />
      <AdvancementTitle advancement-id="minecraft:adventure/adventuring_time" :progress="1" class="mr-5" />
      <AdvancementTitle advancement-id="minecraft:adventure/adventuring_time" :color-map="isMouseHover ? 'fill' : null" :icon-color-map="isMouseHover ? 'normal' : 'fill'" class="mr-5" @mouseenter.native="isMouseHover = true" @mouseleave.native="isMouseHover = false" />
    </div>
    <div class="flex -mr-5">
      <div v-for="n of 10" :key="n" :class="`mr-5 w-12 h-12 border border-black bg-gray-${n > 1 ? (n - 1) * 10 : 5}0`" />
    </div>
  </div>
</template>

<script lang="jsx">
  import AdvancementIcon from '@/components/AdvancementIcon.vue'
  import AdvancementTitle from '@/components/AdvancementTitle.vue'

  export default {
    name: 'PlaygroundView',

    components: {
      AdvancementIcon,
      AdvancementTitle,
    },

    data () {
      return {
        isMouseHover: false,
      }
    },
  }
</script>

<style lang="scss" scoped>
  .el {
    > * {
      @apply mt-10;
    }
  }

  [data-component-name=AdvancementTitle] {
    width: 240px;
  }
</style>
