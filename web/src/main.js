import Vue from 'vue'
import VueLazyload from 'vue-lazyload'
import VueLazyComponent from '@xunlei/vue-lazy-component'

import '@/assets/base.scss'
import '@/common/velocity'
import useLang from '@/composables/lang'
import router from './router'
import store from './store'
import App from './App.vue'

Vue.config.productionTip = false

Vue.use(VueLazyload)
Vue.use(VueLazyComponent)

Vue.mixin({
  computed: {
    t () {
      return useLang().t
    },
  },
})

if (process.env.NODE_ENV === 'development') {
  Vue.mixin({
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

/* eslint-disable no-new */
new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
