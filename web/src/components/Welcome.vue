<template>
  <div class="page-section py-4 md:py-6 xl:py-10 border-b border-gray-200 bg-white">
    <div class="text-center">
      <h1 class="text-3xl md:text-4xl xl:text-5xl leading-tight font-black">{{ info.servername }}</h1>
      <a :href="info.homepage" class="mt-4 text-lg text-blue-600 inline-flex items-center hover:underline">
        Explore
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-4 h-4 ml-1">
          <path d="M10 6v2H5v11h11v-5h2v6a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h6zm11-3v8h-2V6.413l-7.793 7.794-1.414-1.414L17.585 5H13V3h8z" />
        </svg>
      </a>
    </div>
    <dl class="mt-8 flex items-start">
      <div>
        <dt>World Age</dt>
        <dd>{{ worldTime }}</dd>
      </div>
      <div>
        <dt>Total Players</dt>
        <dd>{{ totalPlayers }}</dd>
      </div>
      <div>
        <dt>Recently Online</dt>
        <dd>{{ activePlayers }}</dd>
      </div>
    </dl>
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

<style lang="scss" scoped>
  dl > div {
    @apply flex-1 flex flex-col-reverse text-center;
  }

  dt {
    @apply mt-2 text-sm text-gray-600;

    @screen md {
      & {
        @apply text-base;
      }
    }

    @screen xl {
      & {
        @apply mt-3;
      }
    }
  }

  dd {
    @apply text-2xl font-medium;

    @screen md {
      & {
        @apply text-3xl;
      }
    }

    @screen xl {
      & {
        @apply text-4xl;
      }
    }
  }
</style>
