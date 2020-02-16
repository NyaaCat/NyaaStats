<template>
  <div class="jumbotron">
    <div class="container">
      <div class="text-center">
        <h1>{{ info.servername }}</h1>
        <a :href="info.homepage" class="btn btn-link btn-lg inline-flex items-center">
          Learn More
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M10 6v2H5v11h11v-5h2v6a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h6zm11-3v8h-2V6.413l-7.793 7.794-1.414-1.414L17.585 5H13V3h8z" /></svg>
        </a>
      </div>
      <dl class="flex items-start">
        <div class="flex-1 flex flex-col-reverse text-center">
          <dt class="font-normal text-gray-600">World Running Time</dt>
          <dd class="font-bold">{{ worldTime }}</dd>
        </div>
        <div class="flex-1 flex flex-col-reverse text-center">
          <dt class="font-normal text-gray-600">Total Players</dt>
          <dd class="font-bold">{{ totalPlayers }}</dd>
        </div>
        <div class="flex-1 flex flex-col-reverse text-center">
          <dt class="font-normal text-gray-600">Recently Active Players</dt>
          <dd class="font-bold">{{ activePlayers }}</dd>
        </div>
      </dl>
    </div>
  </div>
</template>

<script>
  import {mapState} from 'vuex'
  import {add, formatDistanceStrict} from 'date-fns'

  export default {
    name: 'Welcome',

    computed: {
      ...mapState(['info']),

      worldTime () {
        if (this.info.worldTime) {
          const date = new Date()
          const baseDate = add(date, {seconds: -this.info.worldTime})
          return formatDistanceStrict(date, baseDate)
        } else {
          return '--'
        }
      },

      totalPlayers () {
        return this.$store.state.playerList.length || '--'
      },

      activePlayers () {
        const _lastUpdate = this.info.lastUpdate
        return this.$store.state.playerList.filter(p => _lastUpdate - p.seen <= 24 * 60 * 60 * 1000).length || '--'
      },
    },
  }
</script>

<style scoped>
  svg {
    width: 1em;
    height: 1em;
    fill: currentColor;
    margin-left: 8px;
  }

  dt {
    font-size: 16px;
  }

  dd {
    font-size: 20px;
  }

  @media (min-width: 768px) {
    dt {
      font-size: 20px;
    }

    dd {
      font-size: 40px;
    }
  }
</style>
