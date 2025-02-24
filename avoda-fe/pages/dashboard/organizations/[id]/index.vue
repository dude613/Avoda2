<template>
  <div>hello from the {{ route.params['id'] }} side</div>
</template>

<script setup lang="ts">
const route = useRoute();
</script>
