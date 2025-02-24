import type { User } from '@/types/user.type';

export const useUserStore = defineStore('user-store', () => {
  const user = computed({
    get: () => {
      try {
        const jsonString = useLocalStorage<string>('USER_DATA', null).value;

        if (!jsonString) return null;

        return JSON.parse(jsonString) as User;
      } catch {
        console.log(`Could not parse user data`);
        return null;
      }
    },
    set: (val) => useLocalStorage('USER_DATA', val),
  });

  const accessToken = computed({
    get: () => {
      return useLocalStorage<string | null>('ACCESS_TOKEN', null).value;
    },
    set: (val) => useLocalStorage('ACCESS_TOKEN', val),
  });

  const refreshToken = computed({
    get: () => {
      return useLocalStorage<string | null>('REFRESH_TOKEN', null).value;
    },
    set: (val) => useLocalStorage('REFRESH_TOKEN', val),
  });

  return { user, accessToken, refreshToken };
});
