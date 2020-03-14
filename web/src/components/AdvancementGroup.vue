<template>
  <div>
    <h4 class="mt-8 mb-5 w-full text-xl font-medium">{{ title }}</h4>
    <div class="md:flex md:flex-wrap md:-ml-5 -mt-7">
      <div
        v-for="adv of data.slice().sort((a, b) => b.updateTime - a.updateTime)"
        :key="adv.advId"
        class="w-full md:pl-5 pt-7 md:w-1/2 xl:w-1/3 md:flex-grow-0 md:flex-shrink"
      >
        <AdvancementBlock :adv="adv" />
      </div>
    </div>
  </div>
</template>

<script>
  import AdvancementBlock from './AdvancementBlock.vue'

  export default {
    name: 'AdvancementGroup',

    components: {
      AdvancementBlock,
    },

    props: {
      title: {
        type: String,
        required: true,
      },

      data: {
        type: Array,
        required: true,
      },
    },
  }
</script>
