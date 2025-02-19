<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <div class="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
      <h2 class="text-2xl font-bold text-center">Login</h2>
      <p class="text-gray-500 text-center mb-6">
        Enter your credentials to access your account
      </p>

      <div class="flex items-center mb-4">
        <hr class="flex-grow border-gray-300" />
        <span class="px-2 text-gray-500 text-sm">OR CONTINUE WITH</span>
        <hr class="flex-grow border-gray-300" />
      </div>

      <form @submit.prevent="handleLogin">
        <label class="block mb-2 text-sm font-medium">Email</label>
        <input
          v-model="email"
          type="email"
          placeholder="you@example.com"
          class="w-full px-3 py-2 border rounded-lg mb-4"
        />

        <label class="block mb-2 text-sm font-medium">Password</label>
        <input
          v-model="password"
          type="password"
          placeholder="Enter your password"
          class="w-full px-3 py-2 border rounded-lg mb-6"
        />

        <button
          type="submit"
          class="w-full bg-black text-white py-2 rounded-lg hover:opacity-90"
        >
          Login
        </button>
      </form>

      <div class="text-center mt-4">
        <p class="text-gray-500">
          Don't have an account?
          <router-link to="/auth/register" class="text-gray-900 font-medium">
            Sign up
          </router-link>
        </p>

        <div class="text-center mt-4 text-sm">
          <a href="#" class="text-gray-600 hover:underline">Forgot password?</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const email = ref('');
const password = ref('');

const handleLogin = () => {
  console.log('Logging in with:', email.value, password.value);
};
</script>

<style scoped>
input {
  border: 1px solid #ddd;
}
</style>
