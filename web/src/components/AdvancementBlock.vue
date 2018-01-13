<template>
  <div class="col-sm-12 col-md-6 col-lg-4">
    <div class="panel panel-default">
      <div class="panel-body">
        <div class="media">
          <div class="media-left">
            <img class="media-object achievements" :src="getImg" />
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
import lang from '../assets/lang.json';
import { advancements } from '../assets/advancements';

export default {
  name: 'AdvancementBlock',
  props: ['adv'],
  data() {
    return {
      lang,
    };
  },
  computed: {
    getImg() {
      return advancements[this.adv.type][this.adv.adv];
    },
  },
};

</script>
