import type { Organization } from '@/types/organizations.type';
import type { ResponseObject } from '../types/response-object.interface';

export const useOrganizationStore = defineStore('organizations-store', () => {
  const organizations = ref<Organization[]>([]);

  const { get } = useApi();

  const fetchOrganizationsForCurrentUser = async () => {
    const response = await get<ResponseObject<Organization[]>>(
      '/organizations/me/organizations'
    );
    organizations.value = response.data;
  };

  return {
    organizations,
    fetchOrganizationsForCurrentUser,
  };
});
