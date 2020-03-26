import Vue from 'vue'
import VueLazyload from 'vue-lazyload'
import VueLazyComponent from '@xunlei/vue-lazy-component'
import VueScrollTo from 'vue-scrollto'

import '@/assets/base.scss'
import '@/common/velocity'
import useLang from '@/composables/lang'
import router from './router'
import store from './store'
import App from './App.vue'

Vue.config.productionTip = false

Vue.use(VueLazyload)
Vue.use(VueLazyComponent)
Vue.use(VueScrollTo)

Vue.mixin({
  computed: {
    t () {
      return useLang().t
    },
    lang () {
      console.warn('[NyaaStats] Found usage of deprecated `lang()`.')
      return this.t
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
  })
}

/* eslint-disable no-new */
new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
