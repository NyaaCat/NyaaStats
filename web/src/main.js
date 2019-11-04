import Vue from 'vue'
import BootstrapVue from 'bootstrap-vue'
import VueLazyload from 'vue-lazyload'
import VueLazyComponent from '@xunlei/vue-lazy-component'
import VueScrollTo from 'vue-scrollto'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

import App from './App'
import store from './store'
import router from './router'
import '@/assets/base.css'

Vue.config.productionTip = false
Vue.use(BootstrapVue)
Vue.use(VueLazyload)
Vue.use(VueLazyComponent)
Vue.use(VueScrollTo)

/* eslint-disable no-new */
new Vue({
  router,
  store,
  render: x => x(App),
}).$mount('#app')
