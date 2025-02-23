<script setup lang="ts">
import Toaster from '~/components/ui/toast/Toaster.vue';
</script>

<template>
  <!-- <ClientOnly> -->
  <main class="min-h-screen flex items-center justify-center bg-gray-100">
    <Toaster />
    <slot />
  </main>
  <!-- </ClientOnly> -->
</template>
