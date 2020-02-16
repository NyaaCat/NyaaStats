<template>
  <router-link :to="`player/${uuid}`">
    <div :data-uuid="uuid" class="col-xs-12 col-sm-6 col-md-4 col-lg-3">
      <div class="panel panel-default">
        <div class="panel-body">
          <div class="flex items-center">
            <img
              v-lazy="`/data/${uuid}/avatar.png`"
              :alt="`${player.playername}'s Avatar`"
              class="rounded"
              style="width: 64px; height: 64px; margin-right: 10px;"
            >
            <div class="flex-1">
              <h4 class="my-0">{{ playername[0] }}<em v-if="playername[1]" class="not-italic text-red-600">{{ playername[1] }}</em>{{ playername[2] }}</h4>
              <h5
                v-if="usedPlayername[1]"
                class="flex items-center text-gray-600 mt-4 mb-0"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" style="width: 1em; height: 1em; fill: currentColor; margin-right: 4px;"><path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm1-8h4v2h-6V7h2v5z" /></svg>
                {{ usedPlayername[0] }}<em class="not-italic text-red-600">{{ usedPlayername[1] }}</em>{{ usedPlayername[2] }}
              </h5>
              <h6 v-else-if="matchedUuid[1]" class="text-gray-600 font-mono mt-4 mb-0 break-all">
                {{ matchedUuid[0] }}<em class="not-italic text-red-600">{{ matchedUuid[1] }}</em>{{ matchedUuid[2] }}
              </h6>
            </div>
          </div>
        </div>
      </div>
    </div>
  </router-link>
</template>

<script>
  function splitByKeyword(str, keyword) {
    const start = str.toLowerCase().indexOf(keyword)
    if (start >= 0) {
      const end = start + keyword.length
      return [str.slice(0, start), str.slice(start, end), str.slice(end)]
    } else {
      return [str]
    }
  }

  export default {
    name: 'PlayerBlock',

    props: {
      player: {
        type: Object,
        required: true,
      },
    },

    computed: {
      keyword() {
        return this.$store.state.keyword.toLowerCase()
      },

      uuid() {
        return this.player.uuid.replace(/-/g, '')
      },

      playername() {
        const _playername = this.player.playername
        if (this.keyword) {
          return splitByKeyword(_playername, this.keyword)
        }
        return [_playername]
      },

      usedPlayername() {
        if (this.keyword && this.player.names.length > 1) {
          const _name =
          this.player.names
            .slice(1)
            .find(n => n.name.toLowerCase().includes(this.keyword))?.name ?? ''
          return splitByKeyword(_name, this.keyword)
        }
        return []
      },

      matchedUuid() {
        if (this.keyword) {
          return splitByKeyword(this.uuid, this.keyword)
        }
        return []
      },
    },
  }
</script>
