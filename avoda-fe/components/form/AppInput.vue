<script setup lang="ts">
defineProps({
  id: {
    type: String,
    required: true,
  },
  inputLabel: {
    type: String,
    required: true,
  },
  inputType: {
    type: String,
    default: 'text',
  },
});

const emits = defineEmits(['update:modelValue']);
</script>

<template>
  <div class="flex flex-col space-y-2">
    <label :for="id" class="text-sm font-sm text-gray-800 capitalize">{{
      inputLabel
    }}</label>
    <input
      :id="id"
      :type="inputType"
      class="px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder:text-gray-500 placeholder:italics shadow-sm h-[45px]"
      @input="
        emits('update:modelValue', ($event.target as HTMLInputElement).value)
      "
      v-bind="$attrs"
    />
  </div>
</template>
