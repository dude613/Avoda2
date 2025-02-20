<template>
    <div>
      <AuthLogin />
    </div>
  </template>
  
  <script setup>
  import AuthLogin from "~/components/auth/login.vue";
  definePageMeta({
  layout: "auth",
});
  </script>
  
