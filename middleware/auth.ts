export default defineNuxtRouteMiddleware(async (to, from) => {
  if (['/signup', '/signin'].includes(to.path)) {
    return
  }

  const user = useSupabaseUser()

  if (!user.value) {
    return await navigateTo('/signin');
  }
})
