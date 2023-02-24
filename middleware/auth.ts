export default defineNuxtRouteMiddleware((to, from) => {
  if (['/signup', '/signin'].includes(to.path)) {
    return
  }

  const user = useSupabaseUser()

  if (!user.value) {
    return navigateTo('/signin');
  }
})