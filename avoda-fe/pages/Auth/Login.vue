<template>
    <div>
      <AuthLogin />
    </div>
  </template>
  
  <script setup>
  import AuthLogin from "~/components/Auth/Login.vue";
  definePageMeta({
  layout: "auth",
});
  </script>
  