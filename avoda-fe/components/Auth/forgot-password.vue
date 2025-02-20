<template>
  <div class="auth-container">
    <div class="auth-box">
      <h2 class="auth-title">Forgot Password</h2>
      <p class="auth-subtitle">Enter your email to reset your password</p>
      
      <form @submit.prevent="handleForgotPassword">
        <div class="input-group">
          <label for="email">Email</label>
          <input type="email" id="email" v-model="email" placeholder="Enter your email" required />
        </div>
        
        <Button class="w-full bg-black text-white py-2 rounded-lg hover:opacity-90 mb-4">
          Send Reset Link
        </Button>
      </form>
      
      <p class="auth-footer text-gray-500 text-sm">
        Remember your password?
        <router-link to="/auth/login" class="text-black font-semibold">Login</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { Button } from "@/components/ui/button";

const email = ref("");

const handleForgotPassword = () => {
  console.log("Reset password request for", email.value);
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