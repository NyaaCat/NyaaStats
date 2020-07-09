<template>
  <img :src="`/data/${uuid}/avatar.png`" :alt="altText" class="image-pixelated">
</template>

<script>
  export default {
    name: 'PlayerAvatar',

    props: {
      uuid: {
        type: String,
        required: true,
      },
    },

    computed: {
      altText () {
        const playername = this.$store.state.players[this.uuid]?.playername
        return playername ? `${playername}'s avatar` : null
      },
    },
  }
</script>
