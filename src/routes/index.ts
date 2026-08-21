import { createRouter, createWebHistory } from 'vue-router'
import { routes } from 'vue-router/auto-routes'
import { requiresAuth } from './guards/requiresAuth'

const router = createRouter({
  // https://heropy.dev/movies => Web History
  // https://heropy.dev/#/movies => Hash History
  history: createWebHistory(),
  routes
})

router.beforeEach(to => {
  if (!requiresAuth.guard(to)) return requiresAuth.redirect(to)
  return true
})

export default router
