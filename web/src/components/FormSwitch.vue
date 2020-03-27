<template>
  <span class="relative">
    <input v-model="inputVal" type="checkbox" class="absolute inset-0 w-full h-full invisible">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 100" class="h-6">
      <path d="M50 100A50 50 0 0150 0h80a50 50 0 010 100H50z" :class="value ? 'fill-blue-500' : 'fill-gray-400'" />
      <!-- eslint-disable vue/max-attributes-per-line -->
      <circle :cx="value ? 130 : 50" cy="50" r="40" class="fill-white" />
    </svg>
  </span>
</template>

<script>
  export default {
    name: 'FormSwitch',

    model: {
      event: 'change',
    },

    props: {
      value: {
        type: Boolean,
        default: false,
      },
    },

    computed: {
      inputVal: {
        get () {return this.value},
        set (val) {this.$emit('change', val)},
      },
    },
  }
</script>
