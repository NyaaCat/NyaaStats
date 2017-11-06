<template>
  <a :href="uuid">
    <div class="col-xs-12 col-sm-6 col-md-4 col-lg-3 searchbox">
      <div class="panel panel-default">
        <div class="panel-body">
          <div class="media">
            <div class="media-left media-middle">
              <img class="media-object lazy" :src="`/static/data/${uuid}/avatar.png`" :alt="`${player.playername}'s Avatar`" />
            </div>
            <div class="media-body text-middle">
              <h4 class="media-heading">{{player.playername}}</h4>
            </div>
          </div>
        </div>
      </div>
    </div>
  </a>
</template>

<script>
export default {
  name: 'PlayerBlock',
  props: ['player'],
  computed: {
    uuid() {
      return this.player.uuid.replace(/-/g, '');
    },
  },
};

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
