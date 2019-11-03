<template>
  <div class="advancement-block col-sm-12 col-md-6 col-lg-4">
    <div class="panel panel-default">
      <div class="panel-body">
        <div class="media">
          <div class="media-left">
            <AdvancementIcon :advancement-id="adv.advId"/>
          </div>
          <div class="media-body text-middle">
            <h4 class="my-0">
              {{ lang(titleLangKey) }}<br/>
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
import AdvancementIcon from './AdvancementIcon';

export default {
  name: 'AdvancementBlock',

  components: {
    AdvancementIcon,
  },

  props: ['adv'],

  computed: {
    titleLangKey() {
      const [, group, name] = this.adv.advId.split(/[:\/]/)
      return `advancements.${group}.${name}.title`
    },
  },
};

</script>

<style>
.advancement-block .my-0 {
  margin-top: 0;
  margin-bottom: 0;
}
</style>
