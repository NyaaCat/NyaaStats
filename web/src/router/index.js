import {createRouter, createWebHistory} from 'vue-router'

import store from '../store'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: () => import('../views/home.vue'),
    },
    {
      path: '/player/:uuid',
      component: () => import('../views/player.vue'),
    },
    // ...import.meta.env.DEV ? [{
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
