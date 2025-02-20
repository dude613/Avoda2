<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <div class="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
      <h2 class="text-2xl font-bold text-center text-black">Login</h2>
      <p class="text-gray-500 text-center mb-6">
        Enter your credentials to access your account
      </p>
      gi
      <div class="flex items-center my-4">
        <hr class="flex-grow border-gray-300" />
        <span class="px-2 text-gray-400 text-sm">OR CONTINUE WITH</span>
        <hr class="flex-grow border-gray-300" />
      </div>

      <form @submit.prevent="loginWithPassword">
        <label class="block mb-2 text-sm font-medium text-black">Email</label>
        <input
          v-model="email"
          type="email"
          placeholder="you@example.com"
          class="w-full px-3 py-2 border rounded-lg mb-4 text-black"
        />

        <label class="block mb-2 text-sm font-medium text-black"
          >Password</label
        >
        <input
          v-model="password"
          type="password"
          class="w-full px-3 py-2 border rounded-lg mb-6 text-black"
        />

        <button
          type="submit"
          class="w-full bg-black text-white py-2 rounded-lg hover:opacity-90 mb-4"
        >
          Login
        </button>
      </form>

      <div class="text-center text-sm mb-2 text-gray-500">
        Don't have an account?
        <router-link
          to="/auth/register"
          class="text-black font-semibold hover:underline"
          >Sign up</router-link
        >
      </div>

      <div class="text-center text-sm mt-6">
        <div class="text-center text-sm mt-6">
          <router-link
            to="/auth/forgot-password"
            class="text-black font-semibold hover:underline"
          >
            Forgot password?
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const runTimeConfig = useRuntimeConfig();
const { post } = useApi();

const email = ref('');
const password = ref('');
const router = useRouter();

const loginWithPassword = async () => {
  const data = await post<any>(
    `${runTimeConfig.public.BASE_URL}/auth/login-with-password`,
    {
      email: email.value,
      password: password.value,
    }
  );
  console.log(data.data, 'data...');

  useLocalStorage('USER_DATA', data.data.user, {
    flush: 'sync',
    deep: true,
  });
  useLocalStorage('ACCESS_TOKEN', data.data.tokens.accessToken, {
    flush: 'sync',
  });
  useLocalStorage('REFRESH_TOKEN', data.data.tokens.refreshToken, {
    flush: 'sync',
  });
  router.push('/');
};
</script>
