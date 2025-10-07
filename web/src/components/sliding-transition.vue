<script setup>
  import {computed} from 'vue'
  import {animate} from 'motion'

  const props = defineProps({
    duration: {
      type: [Number, Object],
      required: true,
    },
  })
  const enterDuration = computed(() => typeof props.duration === 'number' ? props.duration : props.duration.enter)
  const leaveDuration = computed(() => typeof props.duration === 'number' ? props.duration : props.duration.leave)
</script>

<template>
  <Transition
    v-bind="$attrs"
    :duration="$props.duration"
    enter-from-class="h-0"
    enter-active-class="overflow-hidden"
    leave-active-class="overflow-hidden"
    @enter="el => animate(el, {height: 'auto'}, {duration: enterDuration / 1000})"
    @leave="el => animate(el, {height: 0}, {duration: leaveDuration / 1000})"
  >
    <slot />
  </Transition>
</template>
