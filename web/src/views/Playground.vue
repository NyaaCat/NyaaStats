<template>
  <div class="el flex-1 flex flex-col items-center">
    <div class="flex">
      <AdvancementInfoPanel advancement-id="minecraft:adventure/adventuring_time" class="mr-5" style="width: 300px; max-height: 400px;" />
      <AdvancementInfoPanel advancement-id="minecraft:adventure/adventuring_time" :player="genPlayer(0.5)" style="width: 300px; max-height: 400px;" />
    </div>
    <div class="flex">
      <AdvancementInfoPanel advancement-id="minecraft:adventure/trade" class="mr-5" style="width: 300px;">
        <p>Hello World</p>
      </AdvancementInfoPanel>
      <AdvancementInfoPanel advancement-id="minecraft:adventure/trade" style="width: 300px;">
        <p>Hello World</p>
      </AdvancementInfoPanel>
    </div>
    <div>
      <div class="flex -mr-5">
        <AdvancementIcon advancement-id="minecraft:adventure/trade" color-map="normal" class="mr-5" style="width: 52px; height: 52px;" />
        <AdvancementIcon advancement-id="minecraft:adventure/adventuring_time" color-map="normal" class="mr-5" style="width: 52px; height: 52px;" />
        <AdvancementIcon advancement-id="minecraft:adventure/totem_of_undying" color-map="normal" class="mr-5" style="width: 52px; height: 52px;" />
      </div>
      <div class="mt-2 flex -mr-5">
        <AdvancementIcon advancement-id="minecraft:adventure/trade" color-map="complete" class="mr-5" style="width: 52px; height: 52px;" />
        <AdvancementIcon advancement-id="minecraft:adventure/adventuring_time" color-map="complete" class="mr-5" style="width: 52px; height: 52px;" />
        <AdvancementIcon advancement-id="minecraft:adventure/totem_of_undying" color-map="complete" class="mr-5" style="width: 52px; height: 52px;" />
      </div>
    </div>
    <div class="-mb-2">
      <AdvancementTitle advancement-id="minecraft:adventure/adventuring_time" :player="genPlayer(0)" class="mb-2" />
      <AdvancementTitle advancement-id="minecraft:adventure/adventuring_time" :player="genPlayer(0.5)" class="mb-2" />
      <AdvancementTitle advancement-id="minecraft:adventure/adventuring_time" :player="genPlayer(1)" class="mb-2" />
    </div>
    <div class="flex -mr-5">
      <div v-for="n of 10" :key="n" :class="`mr-5 w-12 h-12 border border-black bg-gray-${n > 1 ? (n - 1) * 10 : 5}0`" />
    </div>
  </div>
</template>

<script lang="jsx">
  import AdvancementInfoPanel from '@/components/AdvancementInfoPanel.vue'
  import AdvancementIcon from '@/components/AdvancementIcon.vue'
  import AdvancementTitle from '@/components/AdvancementTitle.vue'

  export default {
    name: 'PlaygroundView',

    components: {
      AdvancementInfoPanel,
      AdvancementIcon,
      AdvancementTitle,
    },

    data () {
      return {
      }
    },

    methods: {
      genPlayer (progress) {
        return {
          advancements: {
            'minecraft:adventure/adventuring_time': {
              criteria: {
                ...progress > 0 ? {
                  "minecraft:cold_ocean": "2018-11-05 19:14:01 +0800",
                  "minecraft:jungle_edge": "2017-07-05 20:48:29 +0800",
                  "minecraft:snowy_mountains": "2017-06-10 19:44:33 +0800",
                  "minecraft:mountains": "2017-06-10 19:11:24 +0800",
                  "minecraft:mushroom_fields": "2018-08-03 11:36:52 +0800",
                  "minecraft:badlands_plateau": "2018-08-03 10:12:28 +0800",
                  "minecraft:forest": "2017-06-10 18:44:55 +0800",
                  "minecraft:taiga": "2017-06-10 18:57:26 +0800",
                  "minecraft:desert_hills": "2018-07-02 19:47:03 +0800",
                  "minecraft:giant_tree_taiga": "2018-08-03 11:01:53 +0800",
                  "minecraft:deep_cold_ocean": "2018-11-05 19:14:21 +0800",
                  "minecraft:snowy_tundra": "2017-06-10 19:00:04 +0800",
                  "minecraft:taiga_hills": "2017-06-12 12:25:21 +0800",
                  "minecraft:desert": "2017-07-05 20:55:03 +0800",
                  "minecraft:frozen_river": "2017-06-10 19:00:10 +0800",
                  "minecraft:deep_frozen_ocean": "2018-11-05 19:14:05 +0800",
                  "minecraft:jungle": "2017-07-05 20:47:05 +0800",
                  "minecraft:birch_forest": "2017-06-11 21:34:42 +0800",
                  "minecraft:jungle_hills": "2017-07-05 20:48:12 +0800",
                  "minecraft:snowy_beach": "2017-07-16 14:54:30 +0800",
                  "minecraft:bamboo_jungle": "2019-11-20 21:27:33 +0800",
                } : {},
                ...progress === 1 ? {
                  "minecraft:warm_ocean": "2018-11-05 12:40:17 +0800",
                  "minecraft:deep_lukewarm_ocean": "2018-11-05 12:47:00 +0800",
                  "minecraft:badlands": "2017-07-05 20:47:11 +0800",
                  "minecraft:savanna_plateau": "2017-06-12 13:06:41 +0800",
                  "minecraft:beach": "2017-06-10 20:39:03 +0800",
                  "minecraft:dark_forest": "2017-06-10 20:39:20 +0800",
                  "minecraft:lukewarm_ocean": "2018-11-05 12:47:03 +0800",
                  "minecraft:river": "2017-06-10 19:11:23 +0800",
                  "minecraft:snowy_taiga": "2017-06-10 19:11:42 +0800",
                  "minecraft:birch_forest_hills": "2017-06-12 12:43:45 +0800",
                  "minecraft:wooded_mountains": "2017-06-10 19:12:11 +0800",
                  "minecraft:bamboo_jungle_hills": "2019-11-20 21:28:09 +0800",
                  "minecraft:wooded_hills": "2017-06-10 19:09:36 +0800",
                  "minecraft:stone_shore": "2017-06-12 13:06:05 +0800",
                  "minecraft:giant_tree_taiga_hills": "2018-08-03 11:02:01 +0800",
                  "minecraft:mushroom_field_shore": "2018-08-03 11:36:51 +0800",
                  "minecraft:wooded_badlands_plateau": "2018-08-03 10:12:08 +0800",
                  "minecraft:swamp": "2017-06-10 20:39:48 +0800",
                  "minecraft:snowy_taiga_hills": "2017-06-10 19:11:45 +0800",
                  "minecraft:savanna": "2017-06-12 13:06:40 +0800",
                  "minecraft:plains": "2017-06-10 18:57:38 +0800",
                } : {},
              },
              done: progress === 1,
            },
          },
        }
      },
    },
  }
</script>

<style lang="scss" scoped>
  .el {
    > * {
      @apply mt-10;
    }
  }
</style>
