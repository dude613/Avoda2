<template>
  <div class="flex items-center justify-center min-h-dvh flex-col">
    <h1 class="text-2xl font-bold capitalize mb-12">
      {{ currentUserNames && `${currentUserNames}'s Organization(s)` }}
    </h1>

    <div class="flex items-center justify-center gap-3">
      <Card v-for="item in organizations.data" :key="item.id">
        <nuxt-link :to="`organizations/${item.id}`">
          <CardHeader class="text-wrap">
            <CardTitle>{{ item.name }}</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              {{ item.name }}
            </CardDescription>
          </CardContent>
          <CardFooter class="capitalize">
            created at: {{ item.createdAt }}
          </CardFooter>
        </nuxt-link>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useToast } from '@/components/ui/toast';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

const organizationStore = useOrganizationStore();
const userStore = useUserStore();

const { toast } = useToast();

const { fetchOrganizationsForCurrentUser } = organizationStore;

const { organizations } = storeToRefs(organizationStore);

const { user } = storeToRefs(userStore);
const currentUserNames = ref<string | null>('');

onMounted(async () => {
  try {
    await fetchOrganizationsForCurrentUser();

    currentUserNames.value =
      user.value && `${user.value.first_name} ${user.value.last_name}`;
  } catch {
    toast({
      title: 'Failed to fetch organizations',
      description: 'Failed to fetch organizations, please try again',
    });
  }
});
</script>
