import Vue from 'vue'
import VueLazyload from 'vue-lazyload'
import VueLazyComponent from '@xunlei/vue-lazy-component'
import VueScrollTo from 'vue-scrollto'

import '@/assets/base.scss'
import App from './App'
import store from './store'
import router from './router'

Vue.config.productionTip = false

Vue.use(VueLazyload)
Vue.use(VueLazyComponent)
Vue.use(VueScrollTo)

/* eslint-disable no-new */
new Vue({
  router,
  store,
  render: x => x(App),
}).$mount('#app')
