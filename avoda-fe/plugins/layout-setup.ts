export default defineNuxtPlugin((nuxtApp) => {
  // Set the layout based on the route
  const route = useRoute();
  nuxtApp.hook('app:created', () => {
    if (route.path.startsWith('/auth')) {
      setPageLayout('auth'); // Use the auth layout
    } else {
      setPageLayout('default'); // Use the default layout
    }
  });
});
