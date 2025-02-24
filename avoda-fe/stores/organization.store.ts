import type { Organization } from '@/types/organizations.type';

export const useOrganizationStore = defineStore('organizations-store', () => {
  const organizations = ref<Organization>({ data: [] });

  const { get } = useApi();

  const fetchOrganizationsForCurrentUser = async () => {
    const response = await get<Organization>('/organizations/me/organizations');
    organizations.value = response;
  };

  return {
    organizations,
    fetchOrganizationsForCurrentUser,
  };
});
