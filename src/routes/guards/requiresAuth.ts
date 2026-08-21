import type { RouteLocationNormalizedGeneric, RouteLocationRaw } from 'vue-router'

export const requiresAuth = {
  guard(to: RouteLocationNormalizedGeneric) {
    if (to.meta.auth) {
      const token = localStorage.getItem('token')
      // await isValideToken(token)
      console.log(token)
      return !!token
    }
    return true
  },
  redirect(to: RouteLocationNormalizedGeneric): RouteLocationRaw {
    return {
      path: '/signin',
      query: {
        redirectTo: to.fullPath
      }
    }
  }
}
