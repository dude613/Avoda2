<template>
  <div class="auth-container">
    <div class="auth-box">
      <h2 class="auth-title">Register</h2>
      <p class="auth-subtitle">Create an account to get started</p>

      <label class="block mb-2 text-sm font-medium text-black">Email</label>
      <Button
        class="w-full max-w-[400px] flex items-center justify-center gap-3 p-3 border border-gray-300 bg-white text-black shadow-sm hover:bg-white"
      >
        <Google class="w-9 h-9" />
        <span class="text-base font-normal"> Google</span>
      </Button>

      <div class="flex items-center my-4">
        <hr class="flex-grow border-gray-300" />
        <span class="px-2 text-gray-400 text-sm">OR</span>
        <hr class="flex-grow border-gray-300" />
      </div>

      <form @submit.prevent="handleRegister">
        <div class="input-group">
          <label for="first-name">First Name</label>
          <input
            type="text"
            id="first-name"
            v-model="firstName"
            placeholder="Enter your first name"
            required
          />
        </div>

        <div class="input-group">
          <label for="last-name">Last Name</label>
          <input
            type="text"
            id="last-name"
            v-model="lastName"
            placeholder="Enter your last name"
            required
          />
        </div>

        <div class="input-group">
          <label for="email">Email</label>
          <input
            type="email"
            id="email"
            v-model="email"
            placeholder="Enter your email"
            required
          />
        </div>

        <div class="input-group">
          <label for="password">Password</label>
          <input
            type="password"
            id="password"
            v-model="password"
            placeholder="Create a password"
            required
          />
        </div>

        <div class="input-group">
          <label for="confirm-password">Confirm Password</label>
          <input
            type="password"
            id="confirm-password"
            v-model="confirmPassword"
            placeholder="Re-enter your password"
            required
          />
        </div>

        <Button class="w-full" :disabled="loading">
          {{ loading ? 'Registering...' : 'Sign up' }}
        </Button>
      </form>

      <p v-if="errorMessage" class="text-red-500 text-sm text-center mt-3">
        {{ errorMessage }}
      </p>

      <p class="auth-footer text-gray-500 text-sm">
        Already have an account?
        <router-link to="/auth/login" class="text-black font-semibold"
          >Login</router-link
        >
      </p>
    </div>
  </div>
</template>

<script setup>
import { Button } from '@/components/ui/button';
import Google from '@/components/icons/google.vue';
const runTimeConfig = useRuntimeConfig();
const { post } = useApi();

const firstName = ref('');
const lastName = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const errorMessage = ref('');
const loading = ref(false);
const router = useRouter();

const handleRegister = async () => {
  if (password.value !== confirmPassword.value) {
    errorMessage.value = 'Passwords do not match!';
    return;
  }

  loading.value = true;
  errorMessage.value = '';

  try {
    const data = await post(
      `${runTimeConfig.public.BASE_URL}/auth/signup-with-password`,
      {
        email: email.value,
        password: password.value,
        confirmPassword: confirmPassword.value,
        firstName: firstName.value,
        lastName: lastName.value,
      }
    );

    console.log('Registration successful:', data.data);
    router.push('/auth/login');
  } catch (error) {
    console.error('Registration error:', error);

    if (error?.response?.status === 400) {
      errorMessage.value =
        'Password must contain at least one uppercase letter, one symbol, and one number.';
    } else if (error?.response?.status === 401) {
      errorMessage.value = 'Unauthorized. Please check your credentials.';
    } else if (error?.response?.status === 409) {
      errorMessage.value = 'An account with this email already exists.';
    } else {
      errorMessage.value = 'Registration failed. Please try again.';
    }
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  padding: 20px;
  box-sizing: border-box;
}

.auth-box {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  width: 350px;
}
.auth-title {
  font-size: 1.5rem;
  font-weight: bold;
  text-align: center;
}
.auth-subtitle {
  color: gray;
  margin-bottom: 1rem;
  text-align: center;
}
.divider {
  margin: 1rem 0;
  color: gray;
  text-transform: uppercase;
  text-align: center;
}
.input-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
}
label {
  text-align: left;
  margin-bottom: 5px;
  font-weight: 500;
  color: #333;
}
input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}
.auth-footer {
  margin-top: 1rem;
  color: #6b7280;
  font-size: 0.875rem;
  text-align: center;
}
.auth-footer a {
  color: black;
  font-weight: 600;
  text-decoration: none;
}
</style>
