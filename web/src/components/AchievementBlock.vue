<template>
  <div
    v-if="ac[0] === 'achievement' && Number.isInteger(player.stats[prop])"
    class="col-sm-12 col-md-4 col-lg-3"
  >
    <div class="panel panel-default">
      <div class="panel-body">
        <div class="media">
          <div class="media-left">
            <img v-src="getImg" class="media-object achievements">
          </div>
          <div class="media-body text-middle">
            <h4 class="media-heading">{{ lang.achievement[ac[1]] }}</h4>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div
    v-else-if="ac[0] === 'achievement' && player.stats[prop].value > 0"
    class="col-sm-12 col-md-4 col-lg-3"
  >
    <div class="panel panel-default">
      <div class="panel-body">
        <div class="media">
          <div class="media-left">
            <img v-src="img" class="media-object achievements">
          </div>
          <div class="media-body text-middle">
            <h4 class="media-heading">{{ lang.achievement[ac[1]] }}</h4>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import lang from '../assets/lang.json'
  import * as achievements from '../assets/achievements'

  export default {
    name: 'AchievementBlock',
    props: {
      prop: {
        type: String,
        required: true,
      },

      player: {
        type: Object,
        required: true,
      },
    },
    data() {
      return {
        ac: [],
        lang,
      }
    },
    computed: {
      getImg() {
        return achievements[this.ac[1]]
      },
    },
    mounted() {
      this.ac = this.prop.split('.')
    },
  }
</script>
