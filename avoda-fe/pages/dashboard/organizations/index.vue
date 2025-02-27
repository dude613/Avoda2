<template>
  <div class="flex pl-20 pr-20 justify-center min-h-dvh flex-col">
    <div class="flex mb-7 mt-7 justify-between w-full">
      <h1 class="text-2xl font-bold capitalize">
        {{ currentUserNames && `${currentUserNames}'s Organization(s)` }}
      </h1>
      <Button class="capitalize" @click="isDialogOpen = true">
        <Plus :size="32" />create new organization
      </Button>

      <Dialog modal :open="isDialogOpen">
        <DialogContent class="sm:max-w-[425px] [&>button]:hidden">
          <DialogHeader>
            <div class="flex justify-between items-center w-full">
              <DialogTitle>Create organization</DialogTitle>
              <DialogClose asChild>
                <Button
                  variant="ghost"
                  @click="isDialogOpen = false"
                  type="button"
                >
                  <LucideX :size="20" />
                </Button>
              </DialogClose>
            </div>
            <DialogDescription>
              Fill in the form below to create a new organization
            </DialogDescription>
          </DialogHeader>

          <form id="dialogForm" @submit="onSubmit">
            <FormField v-slot="{ componentField }" name="organization_name">
              <FormItem>
                <FormLabel>Organization Name</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Enter your organization name"
                    v-bind="componentField"
                  />
                </FormControl>
                <FormDescription>
                  This is your organization's public display name.
                </FormDescription>
                <FormMessage />
              </FormItem>
            </FormField>
          </form>

          <DialogFooter>
            <Button type="submit" form="dialogForm" class="w-[100%]">
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>

    <div class="grid items-center justify-center gap-3 grid-cols-3">
      <Card v-for="item in organizations" :key="item.id">
        <CardHeader>
          <div class="text-wrap flex justify-between align-center">
            <nuxt-link :to="`organizations/${item.id}`">
              <CardTitle>{{ item.name }}</CardTitle>
            </nuxt-link>

            <DropdownMenu>
              <DropdownMenuTrigger as-child>
                <Button variant="ghost" type="button">
                  <LucideEllipsisVertical :size="24" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent>
                <DropdownMenuItem as-child>
                  <AlertDialog>
                    <AlertDialogTrigger as-child>
                      <Button variant="ghost" type="button">
                        <LucideTrash :size="24" color="red" />
                        <span class="text-red-500">Delete Organization</span>
                      </Button>
                    </AlertDialogTrigger>

                    <AlertDialogContent class="w-[400px]">
                      <DialogTitle>Delete organization</DialogTitle>
                      <DialogDescription>
                        Are you sure you want to delete
                        <b>{{ item.name }}</b> organization?
                      </DialogDescription>

                      <AlertDialogFooter>
                        <AlertDialogCancel> Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          @click="deleteOrganizationById(item.id)"
                        >
                          Continue
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>

        <CardContent>
          <CardDescription>
            <div>{{ item.name }}</div>
            <div v-for="i in item.roles" :key="i">
              <span class="capitalize">{{ i }}</span>
            </div>
          </CardDescription>
        </CardContent>
        <CardFooter class="capitalize">
          created at: {{ item.createdAt }}
        </CardFooter>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { z } from 'zod';
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import {
  LucideEllipsisVertical,
  LucideTrash,
  LucideX,
  Plus,
} from 'lucide-vue-next';

import { useToast } from '@/components/ui/toast';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog';
import { Input } from '~/components/ui/input';
import type { ResponseObject } from '~/types/response-object.interface';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '~/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogTrigger,
} from '~/components/ui/alert-dialog';

const organizationStore = useOrganizationStore();
const userStore = useUserStore();

const { toast } = useToast();

const { fetchOrganizationsForCurrentUser } = organizationStore;

const { organizations } = storeToRefs(organizationStore);

const { user } = storeToRefs(userStore);
const currentUserNames = ref<string | null>('');

const isDialogOpen = ref<boolean>(false);

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

const formSchema = toTypedSchema(
  z.object({
    organization_name: z
      .string({ message: 'Organization name is required' })
      .min(2)
      .max(50),
  })
);

const { handleSubmit, resetField } = useForm({
  validationSchema: formSchema,
  initialValues: {
    organization_name: '',
  },
});

const { post, delete: del } = useApi();

const onSubmit = handleSubmit(async ({ organization_name }) => {
  try {
    await post<ResponseObject<string>>('organizations', {
      name: organization_name,
    });
    toast({
      title: 'Successfully submitted',
      description: 'Organization created successfully',
    });
    isDialogOpen.value = false;
    resetField('organization_name');

    // refresh the page to fetch organizations
    await fetchOrganizationsForCurrentUser();
  } catch (error) {
    toast({
      title: 'Error Creating Organization',
      description:
        'There as an error creating the organization. Please try again',
    });
  }
});

const deleteOrganizationById = async (id: string) => {
  const response = await del<ResponseObject<string>>(`/organizations/${id}`);

  toast({
    title: 'Organization deleted',
    description: response.data,
  });

  // refresh the page to fetch organizations
  await fetchOrganizationsForCurrentUser();
};
</script>
