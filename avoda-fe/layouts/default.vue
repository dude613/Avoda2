<script setup lang="ts">
import Toaster from '~/components/ui/toast/Toaster.vue';
</script>

<template>
  <div>
    <div>
      <app-header />
    </div>

    <main>
      <Toaster />
      <slot />
    </main>
  </div>
</template>
