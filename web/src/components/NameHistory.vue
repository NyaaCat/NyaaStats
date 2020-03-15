<template>
  <div class="flex flex-col">
    <div class="flex-none px-3 xl:px-6 py-3 xl:py-4 border-b border-cool-gray-300 bg-cool-gray-50 rounded-t-md text-gray-600 flex items-center relative overflow-hidden">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-12 h-12 -ml-4 my-auto fill-cool-gray-200 hidden xl:block absolute left-0 inset-y-0">
        <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm1-8h4v2h-6V7h2v5z" />
      </svg>
      <h3 class="xl:text-lg font-medium uppercase tracking-wide text-gray-600 relative">Name History</h3>
    </div>
    <ul class="flex-1 flex flex-col">
      <li
        v-for="({name, changedToAt}, idx) of player.data.names"
        :key="idx"
        :class="['flex-1 max-h-1/4 px-3 xl:px-6 py-3 xl:py-4 flex items-center', {'border-t border-gray-300': idx, 'lg:last:border-b': idx < 3}]"
      >
        <strong class="xl:text-lg font-medium">{{ name }}</strong>
        <span class="ml-auto text-gray-600">{{ changedToAt ? formatDate(changedToAt) : 'First Name' }}</span>
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
