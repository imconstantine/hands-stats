export default defineNuxtRouteMiddleware((to, from) => {
  if (['/signup', '/signin'].includes(to.path)) {
    return
  }

  const token = useSupabaseToken();

  if (!token.value) {
    console.log('REDIRECT', token.value)
    return navigateTo('/signin');
  } else {
    console.log('NOT REDIRECT', token.value)
  }
})