<template>
  <div class="col-sm-12 col-md-6 col-lg-4">
    <div class="panel panel-default">
      <div class="panel-body">
        <div class="media">
          <div class="media-left">
            <div class="advancement-frame" :style="{backgroundImage: `url(${frame})`}">
              <img class="media-object achievements" :src="icon">
            </div>
          </div>
          <div class="media-body text-middle">
            <h4 class="media-heading">
              {{ lang.advancement[adv.advId] }}<br/>
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
      </div>
    </div>
  </div>
</template>

<script>
import advancementsData from '../assets/advancements.json';
import lang from '../assets/lang.json';
import { advancements } from '../assets/advancements';
import * as frames from '../assets/frames';

export default {
  name: 'AdvancementBlock',
  props: ['adv'],
  data() {
    return {
      lang,
    };
  },
  computed: {
    frame() {
      return frames[advancementsData[this.adv.advId].type]
    },
    icon() {
      return advancements[this.adv.type][this.adv.adv];
    },
  },
};

</script>

<style>
  .advancement-frame {
    width: 52px;
    height: 52px;
    position: relative;
  }

  .advancement-frame img {
    position: absolute;
    margin: auto;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
  }
</style>
