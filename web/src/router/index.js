import Vue from 'vue'
import Router from 'vue-router'

import store from '../store'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      component: () => import('../views/home.vue'),
    },
    {
      path: '/player/:uuid',
      component: () => import('../views/player.vue'),
    },
    // ...process.env.NODE_ENV === 'development' ? [{
    //   path: '/playground',
    //   component: () => import('../views/playground.vue'),
    // }] : [],
  ],
})

router.beforeResolve((to, from, next) => {
  store.commit('setFooterUpdateTime', null)
  next()
})

export default router
