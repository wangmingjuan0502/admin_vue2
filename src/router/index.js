import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter)
// const Login = () => import('@/components/views/index')

const routes = [
  {
    path: '/login',
    component: () => import('@/views/Login/index')
  },
  {
    path: '/',
    component: () => import('@/Layout/index')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
