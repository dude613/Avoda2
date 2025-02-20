export default defineNuxtRouteMiddleware((to, from) => {
    if (import.meta.server) return;
  
    if (import.meta.client) {
      console.log('Hello from the client...');
      const token = useLocalStorage('ACCESS_TOKEN', null);
  
      if (!token.value && to.path !== '/Auth/Login') {
        console.log('Redirecting to login...');
        return navigateTo('/Auth/Login'); // Redirect to login instead of root
      }
    }
  
    const nuxtApp = useNuxtApp();
    if (
      import.meta.client &&
      nuxtApp.isHydrating &&
      nuxtApp.payload.serverRendered
    )
      return;
  });