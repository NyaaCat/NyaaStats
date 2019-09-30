<template>
  <router-link :to="`player/${uuid}`">
    <div
      class="col-xs-12 col-sm-6 col-md-4 col-lg-3 searchbox"
      :data-uuid="uuid"
    >
      <div class="panel panel-default">
        <div class="panel-body">
          <div class="media">
            <div class="media-left media-middle">
              <img
                class="media-object"
                v-lazy="`/data/${uuid}/avatar.png`"
                :alt="`${player.playername}'s Avatar`"
                width="64"
                height="64"
              />
            </div>
            <div class="media-body text-middle">
              <h4 class="media-heading">{{ player.playername }}</h4>
            </div>
          </div>
        </div>
      </div>
    </div>
  </router-link>
</template>

<script>
export default {
  name: 'PlayerBlock',
  props: ['player'],
  computed: {
    uuid() {
      return this.player.uuid.replace(/-/g, '')
    },
  },
}
</script>
