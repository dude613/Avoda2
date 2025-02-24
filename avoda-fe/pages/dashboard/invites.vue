<script setup lang="ts">
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import {
  TagsInput,
  TagsInputInput,
  TagsInputItem,
  TagsInputItemDelete,
  TagsInputItemText,
} from '@/components/ui/tags-input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import * as z from 'zod';
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import { useToast } from '@/components/ui/toast';

const formSchema = toTypedSchema(
  z.object({
    emails: z
      .array(z.string().trim().email())
      .min(1, { message: 'Emails must contain at least one (1) valid email' }),
    id: z
      .string()
      .trim()
      .min(1, { message: 'Please select one (1) organization' }),
  })
);

const { put } = useApi();

const { handleSubmit, setFieldValue, resetField } = useForm({
  validationSchema: formSchema,
  initialValues: {
    emails: [],
    id: '',
  },
});

const { toast } = useToast();

const onSubmit = handleSubmit(async ({ emails, id }) => {
  try {
    await put(`/auth/${id}/invite`, { emails });

    toast({
      title: 'Invitation sent',
      description: 'Invitation has been sent successfully',
    });

    // Reset form fields
    resetField('emails');
    resetField('id');
  } catch {
    toast({
      title: 'Invitation Failed',
      description: 'Failed to send invite(s) to invited users',
    });
  }
});
const organizationStore = useOrganizationStore();

const { fetchOrganizationsForCurrentUser } = organizationStore;

const { organizations } = storeToRefs(organizationStore);

onMounted(async () => {
  try {
    await fetchOrganizationsForCurrentUser();
  } catch {
    toast({
      title: 'Failed to fetch organizations',
      description: 'Failed to fetch organizations, please try again',
    });
  }
});
</script>

<template>
  <div class="flex items-center justify-center min-h-dvh flex-col">
    <Card class="w-[450px]">
      <CardHeader>
        <CardTitle>Invite details</CardTitle>
      </CardHeader>
      <form @submit.prevent="onSubmit">
        <CardContent>
          <FormField v-slot="{ componentField, value }" name="id">
            <FormItem class="mb-5">
              <FormLabel>Organizations</FormLabel>

              <Select
                v-bind="componentField"
                :model-value="value"
                @update:model-value="setFieldValue('id', $event as string)"
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an organization" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Organizations</SelectLabel>
                    <SelectItem
                      v-for="item in organizations"
                      :value="item.id"
                      :key="item.id"
                    >
                      {{ item.name }}
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField v-slot="{ value, setValue }" name="emails">
            <FormItem>
              <FormLabel>Emails</FormLabel>
              <FormControl>
                <TagsInput :model-value="value" @update:model-value="setValue">
                  <TagsInputItem
                    v-for="item in value"
                    :key="item"
                    :value="item"
                  >
                    <TagsInputItemText />
                    <TagsInputItemDelete />
                  </TagsInputItem>

                  <TagsInputInput placeholder="johndoe@email.com..." />
                </TagsInput>
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <CardDescription class="mt-5">
            Enter the email addresses of the people you want to invite, by
            hitting the enter/return key. You can add multiple email addresses
            to send invitations to multiple recipients at once.
          </CardDescription>
        </CardContent>
        <CardFooter>
          <Button type="submit">Send Invitation(s)</Button>
        </CardFooter>
      </form>
    </Card>
  </div>
</template>
