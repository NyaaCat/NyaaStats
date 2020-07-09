<template>
  <div ref="wrap">
    <canvas ref="canvas" />
  </div>
</template>

<script>
  import drawSkin3D from './namemc-skins'

  export default {
    props: {
      uuid: {
        type: String,
        required: true,
      },
    },

    data () {
      return {
        clear: null,
      }
    },

    watch: {
      uuid () {
        this.draw()
      },
    },

    mounted () {
      window.addEventListener('resize', this.resize)
      this.resize()
    },

    beforeDestroy () {
      this.clear?.()
      window.removeEventListener('resize', this.resize)
    },

    methods: {
      draw () {
        this.clear?.()
        this.clear = drawSkin3D(this.$refs.canvas, this.uuid, true)
      },

      resize () {
        const wrap = this.$refs.wrap
        Object.assign(this.$refs.canvas, {width: wrap.offsetWidth, height: wrap.offsetHeight})
        this.draw()
      },
    },
  }
</script>
