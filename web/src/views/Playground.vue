<template>
  <!-- eslint-disable -->

  <div class="el flex-1 flex flex-col items-center">
    <label class="flex items-center">
      <span class="mr-5">LABEL</span>
      <FormSwitch v-model="flag" />
    </label>
    <pre @click="flag = !flag">{{ flag }}</pre>
    <input type="checkbox" class="form-checkbox" @click="log($event.target.checked)" @change="log($event.target.checked)">

    <div class="mx-4 self-stretch xl:w-page xl:self-center">
      <div class="flex -mr-1">
        <div v-for="n of 10" :key="n" :class="`mr-1 flex-1 h-8 border border-black bg-gray-${n > 1 ? (n - 1) * 10 : 5}0`" />
      </div>
      <div class="mt-1 flex -mr-1">
        <div v-for="n of 10" :key="n" :class="`mr-1 flex-1 h-8 border border-black bg-cool-gray-${n > 1 ? (n - 1) * 10 : 5}0`" />
      </div>
    </div>
  </div>
</template>

<script lang="jsx">
  /* eslint-disable */

  import FormSwitch from '@/components/FormSwitch'
  export default {
    name: 'PlaygroundView',

    components: {
      FormSwitch,
    },

    data () {
      return {
        log: console.log,
        flag: false,
      }
    },

    methods: {
      onClickLabel () {
        console.log('label')
      },
    },
  }
</script>

<style lang="scss" scoped>
  .el {
    > * {
      @apply mt-10;
    }
  }
</style>
