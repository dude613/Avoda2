<script setup lang="ts">
import { createClient } from '@supabase/supabase-js';
const runTimeConfig = useRuntimeConfig();

useHead({
  title: 'Caliber6 | Employment Management System',
  meta: [
    {
      name: 'description',
      content:
        'Caliber6 is an employment management system built to streamline the job search process for employees.',
    },
  ],
});

const supabase = createClient(
  runTimeConfig.public.SUPABASE_PROJECT_URL.replace(
    '<project>',
    runTimeConfig.public.PROJECT_NAME
  ),
  runTimeConfig.public.SUPABASE_ANON_KEY
);

const marketing_content = [
  {
    title: 'employee management',
    description:
      'Create and manage job postings with Caliber6, streamlining the application process.',
  },
  {
    title: 'performance tracking',
    description:
      'Create and manage job postings with Caliber6, streamlining the application process.',
  },
  {
    title: 'secure access',
    description:
      'Create and manage job postings with Caliber6, streamlining the application process.',
  },
];

const email = ref<string>('');
const password = ref<string>('');

const updateEmailModelValue = (e: string) => {
  email.value = e;
};

const updatePasswordModelValue = (e: string) => {
  password.value = e;
};

const loginWithPassword = async () => {
  const data = await supabase.auth.signInWithPassword({
    email: email.value,
    password: password.value,
  });

  console.log(data.data);
};
</script>

<template>
  <section class="text-center m-16 sm:m-8 sm:p-4">
    <div class="flex flex-col justify-center">
      <h1 class="capitalize">employment management system</h1>
      <p class="text-center mx-auto sm:w-full lg:w-1/2">
        Streamline your workforce management with our comprehensive employee
        management solution.
      </p>
    </div>

    <div class="flex justify-center flex-col gap-5 mt-5 md:flex-row">
      <app-button text="Get Started" variant="secondary" />
      <app-button text="learn more" />
    </div>
  </section>

  <section class="bg-gray-100">
    <div
      class="flex flex-col justify-center items-center gap-6 p-5 md:flex-row mx-auto max-w-7xl"
    >
      <div
        v-for="content in marketing_content"
        :key="content.title"
        class="py-3"
      >
        <p class="capitalize font-bold text-md">{{ content.title }}</p>
        <p class="text-sm">{{ content.description }}</p>
      </div>
    </div>
  </section>

  <section class="flex justify-center mt-6">
    <form class="w-full md:w-1/3 p-5 [&>*:not(:last-child)]:mb-5">
      <p class="font-md capitalize text-lg">authentication</p>
      <form-app-input
        inputLabel="email"
        id="email"
        inputType="email"
        v-model="email"
        @update:model-value="updateEmailModelValue"
        placeholder="johndoe@email.com"
      />

      <form-app-input
        inputLabel="password"
        id="password"
        placeholder="Enter Password"
        inputType="password"
        v-model="password"
        @update:model-value="updatePasswordModelValue"
      />

      <app-button
        text="sign in"
        variant="tertiary"
        @click.prevent="loginWithPassword"
        class="min-w-full"
      />
    </form>
  </section>
</template>
