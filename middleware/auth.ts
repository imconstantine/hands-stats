export default defineNuxtRouteMiddleware((to, from) => {
  if (['/signup', '/signin'].includes(to.path)) {
    return
  }

  const token = useSupabaseToken();

  if (!token.value) {
    return navigateTo('/signin');
  }
})