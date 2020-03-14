<template>
  <div>
    <div class="pb-2 border-b border-gray-300 text-gray-600 flex items-center">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-5 h-5 mr-1 hidden xl:block">
        <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-1-11v6h2v-6h-2zm0-4v2h2V7h-2z" />
      </svg>
      <h3 class="xl:text-lg font-medium uppercase tracking-wide text-gray-600">Membership</h3>
    </div>
    <dl>
      <div v-if="player.data.time_start" class="xl:px-6 py-3 lg:py-4 border-b border-gray-200 flex items-center">
        <dt class="text-gray-500">First Login</dt>
        <dd class="ml-auto">{{ timeStart }}</dd>
      </div>
      <div v-if="player.data.time_last" class="xl:px-6 py-3 lg:py-4 border-b border-gray-200 flex items-center">
        <dt class="text-gray-500">Last Active</dt>
        <dd class="ml-auto">{{ timeLast }}</dd>
      </div>
      <div v-if="player.data.time_lived" class="xl:px-6 py-3 lg:py-4 border-b border-gray-300 flex items-center">
        <dt class="text-gray-500">Total Online</dt>
        <dd class="ml-auto">{{ timeLived }}</dd>
      </div>
    </dl>
  </div>
</template>

<script>
  import {mapState} from 'vuex'
  import {add, format, formatDistanceStrict} from 'date-fns'

  export default {
    name: 'Membership',

    props: {
      player: {
        type: Object,
        required: true,
      },
    },

    computed: {
      ...mapState(['info']),

      timeStart () {
        return format(new Date(this.player.data.time_start), 'yyyy-MM-dd HH:mm:ss')
      },
      timeLast () {
        return format(new Date(this.player.data.time_last), 'yyyy-MM-dd HH:mm:ss')
      },
      timeLived () {
        const date = new Date()
        const baseDate = add(date, {seconds: -this.player.data.time_lived})
        return formatDistanceStrict(date, baseDate, {unit: 'hour'})
      },
    },
  }
</script>
