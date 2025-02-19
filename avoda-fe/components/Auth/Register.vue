<template>
    <div class="auth-container">
      <div class="auth-box">
        <h2 class="auth-title">Register</h2>
        <p class="auth-subtitle">Create an account to get started</p>
        
        
        
        <div class="divider">OR</div>
        
        <form @submit.prevent="handleRegister">
          <div class="input-group">
            <label for="name">Full Name</label>
            <input type="text" id="name" v-model="name" placeholder="Enter your full name" required />
          </div>
          
          <div class="input-group">
            <label for="email">Email</label>
            <input type="email" id="email" v-model="email" placeholder="Enter your email" required />
          </div>
          
          <div class="input-group">
            <label for="password">Password</label>
            <input type="password" id="password" v-model="password" placeholder="Create a password" required />
          </div>
          
          <button type="submit" class="auth-btn">Sign Up</button>
        </form>
        
        <p class="auth-footer text-gray-500 text-sm">
          Already have an account?
          <router-link to="/auth/login" class="text-black font-semibold">Login</router-link>
        </p>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        name: '',
        email: '',
        password: ''
      };
    },
    methods: {
      handleRegister() {
        console.log("Registering:", this.name, this.email, this.password);
        
      }
    }
  };
  </script>
  
  <style scoped>
  .auth-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background: #f8f9fa;
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
  .google-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    background: white;
    border: 1px solid #ccc;
    padding: 10px;
    width: 100%;
    cursor: pointer;
    font-weight: bold;
  }
  .google-icon {
    width: 20px;
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
  .auth-btn {
    background: black;
    color: white;
    padding: 10px;
    border: none;
    width: 100%;
    cursor: pointer;
    margin-top: 1rem;
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
  