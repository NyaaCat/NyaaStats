<template>
  <div>
    <div class="px-4 py-2 border border-blue-200 rounded-t bg-blue-100 text-blue-700 font-medium">
      <h3 class="leading-tight flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-4 h-4 mr-1">
          <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-1-11v6h2v-6h-2zm0-4v2h2V7h-2z" />
        </svg>
        Membership
      </h3>
    </div>
    <div class="p-4 border border-t-0 border-blue-200 rounded-b">
      <ul class="border border-gray-400 rounded">
        <li v-if="player.data.time_start" class="px-4 py-3 border-b border-gray-400">
          <h4 class="text-lg font-medium">{{ timeStart }}</h4>
          <p class="mt-2 text-sm text-gray-600">First Login</p>
        </li>
        <li v-if="player.data.time_last" class="px-4 py-3 border-b border-gray-400">
          <h4 class="text-lg font-medium">{{ timeLast }}</h4>
          <p class="mt-2 text-sm text-gray-600">Last Active</p>
        </li>
        <li v-if="player.data.time_lived" class="px-4 py-3">
          <h4 class="text-lg font-medium">{{ timeLived }}</h4>
          <p class="mt-2 text-sm text-gray-600">Total Online</p>
        </li>
      </ul>
    </div>
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
        return format(new Date(this.player.data.time_start), 'yyyy-MM-dd HH:mm:ss xx')
      },
      timeLast () {
        return format(new Date(this.player.data.time_last), 'yyyy-MM-dd HH:mm:ss xx')
      },
      timeLived () {
        const date = new Date()
        const baseDate = add(date, {seconds: -this.player.data.time_lived})
        return formatDistanceStrict(date, baseDate, {unit: 'hour'})
      },
    },
  }
</script>
