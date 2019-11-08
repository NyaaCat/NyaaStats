import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      component: () => import('../views/PlayerList'),
    },
    {
      path: '/player/:uuid',
      component: () => import('../views/PlayerPage'),
    },
  ],
})
