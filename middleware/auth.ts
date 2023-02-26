export default defineNuxtRouteMiddleware(async (to, from) => {
  if (['/signup', '/signin'].includes(to.path)) {
    return
  }

  const user = useSupabaseUser()
  const token = useSupabaseToken();
  console.log(user, token)
  // if (!token.value) {
  //   return await navigateTo('/signin');
  // }
})