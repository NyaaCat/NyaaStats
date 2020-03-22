<template>
  <div class="flex flex-col items-center">
    <details open class="my-10">
      <summary>Click</summary>
      <div class="w-24 text-center bg-pink-100" @click="showModal">
        <p v-for="n of 100" :key="n" class="mt-4">{{ n }}</p>
      </div>
    </details>
    <pre class="fixed left-0 top-0 z-20 mt-20 p-4 my-auto bg-green-100 text-xs" @click="echo">{{ echoMsg }}</pre>
  </div>
</template>

<script>
  import {state} from '@/components/ModalLayer.vue'
  import {getScrollbarWidth} from '@/utils'

  export default {
    name: 'PlaygroundView',

    data () {
      return{
        echoMsg: 'N/A',
      }
    },

    methods: {
      showModal () {
        state.setModal({
          render: h => h('div', {class: 'h-20 bg-white rounded-md flex items-center justify-center'}, 'Hello World'),
        })
      },

      echo () {
        console.log('test')
        console.log(getScrollbarWidth() > 0)
        document.documentElement.classList.toggle('overflow-hidden')
        const flag = document.documentElement.classList.contains('overflow-hidden')
        document.body.classList.toggle('overflow-hidden', flag)
        this.echoMsg = flag
      },
    },
  }
</script>
