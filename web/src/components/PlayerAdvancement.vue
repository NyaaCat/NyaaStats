<template>
  <div v-if="player.advancements">
    <div v-if="advTotal > 0" class="row">
      <h3>Advancements</h3>
      <hr>
      <div v-if="advStory.length > 0" class="row">
        <div class="col-md-12">
          <h4>{{ lang('advancements.story.root.title') }}</h4>
          <hr>
          <AdvancementBlock
            v-for="adv in advStory
              .slice()
              .sort((a, b) => b.updateTime - a.updateTime)"
            :key="adv.advId"
            :adv="adv"
          />
        </div>
      </div>
      <div v-if="advNether.length > 0" class="row">
        <div class="col-md-12">
          <h4>{{ lang('advancements.nether.root.title') }}</h4>
          <hr>
          <AdvancementBlock
            v-for="adv in advNether
              .slice()
              .sort((a, b) => b.updateTime - a.updateTime)"
            :key="adv.advId"
            :adv="adv"
          />
        </div>
      </div>
      <div v-if="advEnd.length > 0" class="row">
        <div class="col-md-12">
          <h4>{{ lang('advancements.end.root.title') }}</h4>
          <hr>
          <AdvancementBlock
            v-for="adv in advEnd
              .slice()
              .sort((a, b) => b.updateTime - a.updateTime)"
            :key="adv.advId"
            :adv="adv"
          />
        </div>
      </div>
      <div v-if="advAdventure.length > 0" class="row">
        <div class="col-md-12">
          <h4>{{ lang('advancements.adventure.root.title') }}</h4>
          <hr>
          <AdvancementBlock
            v-for="adv in advAdventure
              .slice()
              .sort((a, b) => b.updateTime - a.updateTime)"
            :key="adv.advId"
            :adv="adv"
          />
        </div>
      </div>
      <div v-if="advHusbandry.length > 0" class="row">
        <div class="col-md-12">
          <h4>{{ lang('advancements.husbandry.root.title') }}</h4>
          <hr>
          <AdvancementBlock
            v-for="adv in advHusbandry
              .slice()
              .sort((a, b) => b.updateTime - a.updateTime)"
            :key="adv.advId"
            :adv="adv"
          />
        </div>
      </div>
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

  import AdvancementBlock from './AdvancementBlock'
  import AchievementBlock from './AchievementBlock'

  export default {
    name: 'PlayerAdvancement',

    components: {
      AchievementBlock,
      AdvancementBlock,
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
