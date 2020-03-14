<template>
  <div v-if="player.advancements" class="page-section py-8 border-t border-b border-gray-200">
    <div v-if="advTotal > 0">
      <h3 class="mb-5 text-2xl font-bold">Advancements</h3>
      <AdvancementGroup v-if="advStory.length > 0" :title="lang('advancements.story.root.title')" :data="advStory" />
      <AdvancementGroup v-if="advNether.length > 0" :title="lang('advancements.nether.root.title')" :data="advNether" />
      <AdvancementGroup v-if="advEnd.length > 0" :title="lang('advancements.end.root.title')" :data="advEnd" />
      <AdvancementGroup v-if="advAdventure.length > 0" :title="lang('advancements.adventure.root.title')" :data="advAdventure" />
      <AdvancementGroup v-if="advHusbandry.length > 0" :title="lang('advancements.husbandry.root.title')" :data="advHusbandry" />
    </div>
  </div>

  <div v-else class="row">
    <h3>Achievements</h3>
    <hr>
    <AchievementBlock
      v-for="(prop, index) in Object.keys(player.stats)"
      :key="index"
      :player="player"
      :prop="prop"
    />
  </div>
</template>

<script>
  import { mapState } from 'vuex'

  import AdvancementGroup from './AdvancementGroup.vue'
  import AchievementBlock from './AchievementBlock'

  export default {
    name: 'PlayerAdvancement',

    components: {
      AdvancementGroup,
      AchievementBlock,
    },

    props: {
      player: {
        type: Object,
        required: true,
      },
    },

    data() {
      return {
        advStory: [],
        advNether: [],
        advEnd: [],
        advAdventure: [],
        advHusbandry: [],
      }
    },

    computed: {
      ...mapState(['info']),

      advTotal() {
        return (
          this.advStory.length +
          this.advNether.length +
          this.advEnd.length +
          this.advAdventure.length +
          this.advHusbandry.length
        )
      },
    },

    mounted() {
      this.dealWithAdvancements(this.player.advancements)
    },

    methods: {
      /**
       * @param {{[string]: {criteria: object, done: boolean}}} advancements
       */
      dealWithAdvancements(advancements) {
        for (const [advId, { criteria }] of Object.entries(advancements)) {
          const [, group, name] = advId.split(/[:/]/)
          if (!criteria) {
            continue
          }
          const prog = Object.keys(criteria).length
          let progTotal = 0
          if (
            this.info.advancementsProgress &&
            this.info.advancementsProgress.type
          ) {
            if (this.info.advancementsProgress.type.adv[1]) {
              progTotal = this.info.advancementsProgress.type.adv[1]
            }
          }

          const advGroupMap = {
            story: this.advStory,
            nether: this.advNether,
            end: this.advEnd,
            adventure: this.advAdventure,
            husbandry: this.advHusbandry,
          }
          advGroupMap[group] &&
            advGroupMap[group].push({
              adv: name,
              advId,
              type: group,
              prog,
              progTotal,
              updateTime: Math.max(
                ...Object.values(criteria).map(s => new Date(s)),
              ),
            })
        }
      },
    },
  }
</script>
