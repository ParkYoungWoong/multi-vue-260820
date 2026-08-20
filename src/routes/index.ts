import { createRouter, createWebHistory } from 'vue-router'
import { routes } from 'vue-router/auto-routes'

export default createRouter({
  // https://heropy.dev/movies => Web History
  // https://heropy.dev/#/movies => Hash History
  history: createWebHistory(),
  routes
})
