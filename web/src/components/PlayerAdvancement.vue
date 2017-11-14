<template>
  <div v-if="player.advancements">
    <div class="row" v-if="advTotal > 0">
      <h3>Advancements</h3>
      <hr/>
      <div class="row" v-if="advStory.length > 0">
        <div class="col-md-12">
          <h4>Story</h4>
          <hr/>
          <AdvancementBlock v-for="adv in advStory" :key="adv.advId" :adv="adv"></AdvancementBlock>
        </div>
      </div>
      <div class="row" v-if="advNether.length > 0">
        <div class="col-md-12">
          <h4>Nether</h4>
          <hr/>
          <AdvancementBlock v-for="adv in advNether" :key="adv.advId" :adv="adv"></AdvancementBlock>
          </div>
      </div>
      <div class="row" v-if="advEnd.length > 0">
        <div class="col-md-12">
          <h4>The End</h4>
          <hr/>
          <AdvancementBlock v-for="adv in advEnd" :key="adv.advId" :adv="adv"></AdvancementBlock>
        </div>
      </div>
      <div class="row" v-if="advAdventure.length > 0">
        <div class="col-md-12">
          <h4>Adventure</h4>
          <hr/>
          <AdvancementBlock v-for="adv in advAdventure" :key="adv.advId" :adv="adv"></AdvancementBlock>
        </div>
      </div>
      <div class="row" v-if="advHusbandry.length > 0">
        <div class="col-md-12">
          <h4>Husbandry</h4>
          <hr/>
          <AdvancementBlock v-for="adv in advHusbandry" :key="adv.advId" :adv="adv"></AdvancementBlock>
        </div>
      </div>
    </div>
  </div>

  <div class="row" v-else>
    <h3>Achievements</h3>
    <hr/>
    <AchievementBlock v-for="(prop, index) in Object.keys(player.stats)" :key="index" :player="player" :prop="prop" />
  </div>
</template>

<script>
import AdvancementBlock from './AdvancementBlock';
import AchievementBlock from './AchievementBlock';

export default {
  name: 'PlayerAdvancement',
  props: ['player', 'info'],
  data() {
    return {
      advTotal: 0,
      advStory: [],
      advNether: [],
      advEnd: [],
      advAdventure: [],
      advHusbandry: [],
    };
  },
  mounted() {
    this.dealWithAdvancements(this.player.advancements);
  },
  methods: {
    dealWithAdvancements(advancements) {
      Object.keys(advancements).forEach((k) => {
        const adv = k.split('/');
        const type = adv[0].split(':')[1];
        const prog = Object.keys(advancements[k].criteria).length;
        let progTotal = 0;
        if (this.info.advancementsProgress && this.info.advancementsProgress.type) {
          if (this.info.advancementsProgress.type.adv[1]) {
            progTotal = this.info.advancementsProgress.type.adv[1];
          }
        }
        const advVal = {
          adv: adv[1],
          advId: k,
          type,
          prog,
          progTotal,
        };
        switch (type) {
          case 'story':
            this.advStory.push(advVal);
            break;
          case 'nether':
            this.advNether.push(advVal);
            break;
          case 'end':
            this.advEnd.push(advVal);
            break;
          case 'adventure':
            this.advAdventure.push(advVal);
            break;
          case 'husbandry':
            this.advHusbandry.push(advVal);
            break;
          default:
              // do nothing
        }
      });
      this.advTotal =
        this.advStory.length +
        this.advNether.length +
        this.advEnd.length +
        this.advAdventure.length +
        this.advHusbandry.length;
    },
  },
  components: {
    AdvancementBlock,
    AchievementBlock,
  },
};
</script>
