import { useToast } from '@/components/ui/toast/use-toast';

export default defineNuxtRouteMiddleware((to) => {
  if (import.meta.server) return;

  if (import.meta.client) {
    const token = useLocalStorage('ACCESS_TOKEN', null);

    if (!token.value && !to.path.startsWith('/auth')) {
      // make sure to redirect to login if token is not present & the user is not on any auth page

      const { toast } = useToast();

      toast({
        title: 'Unauthorized',
        description: 'Session expired. Please login again!',
      });

      return navigateTo('/auth/login');
    }
  }
});
