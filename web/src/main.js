import {createApp} from 'vue'
import {createHead} from '@unhead/vue/client'

import '@/assets/base.css'
import useLang from '@/composables/lang'
import router from './router'
import store from './store'
import App from './app.vue'

const head = createHead()
const app = createApp(App)
  .use(router)
  .use(store)
  .use(head)
  .mixin({
    computed: {
      t () {
        return useLang().t
      },
    },
  })

if (import.meta.env.DEV) {
  app.mixin({
    mounted () {
      this.$el.setAttribute?.(
        'data-component-name',
        (this.$el.dataset.componentName ? this.$el.dataset.componentName + ' ' : '') + (this.$options.name ?? 'AnonymousComponent'),
      )
    },

    methods: {
      log: console.log,
    },
  })
}

app.mount('#app')
