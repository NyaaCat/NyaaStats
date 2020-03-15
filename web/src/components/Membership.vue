<template>
  <div class="flex flex-col">
    <div class="flex-none px-3 xl:px-6 py-3 xl:py-4 border-b border-cool-gray-300 bg-cool-gray-50 rounded-t-md text-gray-600 flex items-center relative overflow-hidden">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-12 h-12 -ml-4 my-auto fill-cool-gray-200 hidden xl:block absolute left-0 inset-y-0">
        <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM11 7h2v2h-2V7zm0 4h2v6h-2v-6z" />
      </svg>
      <h3 class="xl:text-lg font-medium uppercase tracking-wide text-gray-600 relative">Membership</h3>
    </div>
    <dl class="flex-1 flex flex-col">
      <div
        v-for="({label, value}, idx) of list"
        :key="idx"
        :class="['flex-1 px-3 xl:px-6 py-3 xl:py-4 flex', {'border-t border-gray-300': idx}]"
      >
        <dt class="lg:self-start text-gray-600">{{ label }}</dt>
        <dd class="ml-auto lg:self-end lg:text-xl xl:text-2xl">{{ value || 'N/A' }}</dd>
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
        return this.player.data.time_start && format(new Date(this.player.data.time_start), 'yyyy-MM-dd HH:mm:ss')
      },
      timeLast () {
        return this.player.data.time_last && format(new Date(this.player.data.time_last), 'yyyy-MM-dd HH:mm:ss')
      },
      timeLived () {
        if (this.player.data.time_lived) {
          const date = new Date()
          const baseDate = add(date, {seconds: -this.player.data.time_lived})
          return formatDistanceStrict(date, baseDate, {unit: 'hour'})
        } else {
          return null
        }
      },

      list () {
        return [
          {label: 'First Login', value: this.timeStart},
          {label: 'Last Active', value: this.timeLast},
          {label: 'Total Online', value: this.timeLived},
        ]
      },
    },
  }
</script>
