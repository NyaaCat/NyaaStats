import {createApp} from 'vue'

import '@/assets/base.scss'
import '@/common/velocity'
import useLang from '@/composables/lang'
import router from './router'
import store from './store'
import App from './app.vue'

const app = createApp(App)
  .use(router)
  .use(store)
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
