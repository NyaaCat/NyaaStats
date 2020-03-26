<template>
  <transition
    v-bind="$props"
    :css="false"
    v-on="$listeners"
    @enter="enter"
    @leave="leave"
  >
    <slot />
  </transition>
</template>

<script>
  const EASING_IN_OUT = [0.4, 0, 0.2, 1]

  export default {
    name: 'SlidingTransition',

    props: {
      duration: {
        type: [Number, Object],
        required: true,
      },
    },

    methods: {
      enter (el, done) {
        Object.assign(el.style, {
          height: '0',
          overflow: 'hidden',
        })
        el.velocity(
          {
            height: [...el.children].reduce((t, n) => t + n.offsetHeight, 0),
          },
          typeof this.duration === 'number' ? this.duration : this.duration.enter,
          EASING_IN_OUT,
          () => {
            done()
            Object.assign(el.style, {
              height: null,
              overflow: null,
            })
          },
        )
      },

      leave (el, done) {
        Object.assign(el.style, {
          height: el.offsetHeight,
          overflow: 'hidden',
        })
        el.velocity(
          {
            height: 0,
          },
          typeof this.duration === 'number' ? this.duration : this.duration.leave,
          EASING_IN_OUT,
          () => {
            done()
            Object.assign(el.style, {
              height: null,
              overflow: null,
            })
          },
        )
      },
    },
  }
</script>
