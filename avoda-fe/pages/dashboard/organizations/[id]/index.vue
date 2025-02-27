<template>
  <div></div>
</template>

<script setup lang="ts">
const route = useRoute();

const id = route.params['id'];

const { get } = useApi();

onMounted(async () => {
  const d = await get(`/organizations/${id}/members`);

  console.log(d);
});
</script>
