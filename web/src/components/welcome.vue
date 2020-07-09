<template>
  <div class="xl:w-page xl:mx-auto px-page py-4 md:py-6 xl:py-12 flex flex-col sm:flex-row sm:items-center">
    <div class="sm:flex-grow-0 sm:flex-shrink sm:w-1/2 text-center sm:text-left">
      <h1 class="text-3xl md:text-4xl xl:text-5xl leading-tight font-black">{{ info.servername }}</h1>
      <p class="mt-3">
        <a :href="info.homepage" target="_blank" class="text-lg text-blue-600 inline-flex items-center">
          {{ t('nyaa.home.explore_link_label') }}
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-text-icon h-text-icon ml-1">
            <path d="M10 6v2H5v11h11v-5h2v6a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h6zm11-3v8h-2V6.413l-7.793 7.794-1.414-1.414L17.585 5H13V3h8z" />
          </svg>
        </a>
      </p>
    </div>
    <dl class="flex-none mt-4 sm:mt-0 sm:ml-auto text-center sm:text-right flex">
      <div class="flex-1 sm:ml-8 cursor-pointer" @click="showWorldTimeInDays = !showWorldTimeInDays">
        <dt class="text-sm md:text-base text-gray-600 whitespace-no-wrap">{{ t('nyaa.home.starring_number.uptime') }}</dt>
        <dd class="mt-2 text-2xl md:text-3xl xl:text-4xl font-medium whitespace-no-wrap">{{ worldTime || '...' }}</dd>
      </div>
      <div class="flex-1 sm:ml-8">
        <dt class="text-sm md:text-base text-gray-600 whitespace-no-wrap">{{ t('nyaa.home.starring_number.total_players') }}</dt>
        <dd class="mt-2 text-2xl md:text-3xl xl:text-4xl font-medium whitespace-no-wrap">{{ totalPlayers || '...' }}</dd>
      </div>
    </dl>
  </div>
</template>

<script>
  import {mapState} from 'vuex'
  import {add, formatDistanceStrict} from 'date-fns'
  import {zhCN} from 'date-fns/locale'

  export default {
    name: 'Welcome',

    data () {
      return {
        showWorldTimeInDays: false,
      }
    },

    computed: {
      ...mapState(['info']),

      worldTime () {
        if (this.info.worldTime) {
          const date = new Date()
          const baseDate = add(date, {seconds: -this.info.worldTime})
          return formatDistanceStrict(date, baseDate, {unit: this.showWorldTimeInDays ? 'day' : null, locale: this.t.lang === 'zh_cn' ? zhCN : null})
        }
        return null
      },

      totalPlayers () {
        return this.$store.state.playerList.length
      },
    },
  }
</script>
