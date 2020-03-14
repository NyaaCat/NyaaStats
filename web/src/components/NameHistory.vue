<template>
  <div>
    <div class="pb-2 border-b border-gray-300 text-gray-600 flex items-center">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-5 h-5 mr-1 hidden xl:block">
        <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm1-8h4v2h-6V7h2v5z" />
      </svg>
      <h3 class="xl:text-lg font-medium uppercase tracking-wide text-gray-600">Name History</h3>
    </div>
    <ul>
      <li
        v-for="(name, idx) of player.data.names"
        :key="idx"
        :class="['xl:px-6 py-3 lg:py-4 border-b flex items-center', idx < player.data.names.length - 1 ? 'border-gray-200' : 'border-gray-300']"
      >
        <strong class="font-medium">{{ name.name }}</strong>
        <span class="ml-auto text-gray-500">{{ name.changedToAt ? formatDate(name.changedToAt) : 'First Name' }}</span>
      </li>
    </ul>
  </div>
</template>

<script>
  import {format} from 'date-fns'

  export default {
    name: 'NameHistory',

    props: {
      player: {
        type: Object,
        required: true,
      },
    },

    methods: {
      formatDate (val) {
        return format(new Date(val), 'yyyy-MM-dd HH:mm:ss')
      },
    },
  }
</script>
