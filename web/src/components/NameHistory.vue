<template>
  <div>
    <div class="px-4 py-2 border border-yellow-300 rounded-t bg-yellow-100 text-yellow-700 font-medium">
      <h3 class="leading-tight flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-4 h-4 mr-1">
          <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm1-8h4v2h-6V7h2v5z" />
        </svg>
        Name History
      </h3>
    </div>
    <div class="p-4 border border-t-0 border-yellow-300 rounded-b">
      <ul class="border border-gray-400 rounded">
        <Name
          v-for="(name, idx) of player.data.names"
          :key="idx"
          :name="name"
          :class="['px-4 py-5', {'border-t border-gray-400': idx}]"
        />
      </ul>
    </div>
  </div>
</template>

<script>
  import Name from './Name'

  export default {
    name: 'NameHistory',

    components: {
      Name,
    },

    props: {
      player: {
        type: Object,
        required: true,
      },
    },
  }
</script>
