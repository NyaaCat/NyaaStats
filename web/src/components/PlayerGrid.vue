<template>
  <div class="flex flex-wrap">
    <div v-for="p of data" :key="p.uuid" class="flex-grow-0 flex-shrink w-1/2 sm:w-1/3 lg:w-1/4 xl:w-1/5">
      <RouterLink :to="'/player/' + p.uuid" class="py-5 hover:bg-cool-gray-100 rounded-md flex flex-col items-center transition duration-200 ease-linear">
        <PlayerAvatar :uuid="p.uuid" class="w-20 h-20 rounded-md" />
        <span class="mt-4 md:text-lg text-gray-900 font-medium">{{ p.playername }}</span>
      </RouterLink>
    </div>
  </div>
</template>

<script>
  import PlayerAvatar from '@/components/PlayerAvatar.vue'

  export default {
    name: 'PlayerGrid',

    components: {
      PlayerAvatar,
    },

    props: {
      data: {
        type: Array,
        required: true,
      },
    },
  }
</script>
