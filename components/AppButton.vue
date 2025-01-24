<script setup lang="ts">
type Variants = 'primary' | 'secondary';

// define props going into the button component
defineProps({
  text: {
    type: String,
    required: true,
  },
  variant: {
    type: String as () => Variants,
    default: 'primary',
  },
});
</script>

<template>
  <button
    :class="[
      'px-5 py-2 capitalize flex space-x-5 text-sm rounded-sm focus-visible:outline-none disabled:pointer-events-none cursor-pointer justify-center items-center',
      {
        'bg-white shadow-sm': variant === 'primary',
        'text-white bg-black hover:bg-gray-900/90': variant === 'secondary',
      },
    ]"
  >
    <slot name="icon" />
    <span>{{ text }}</span>
  </button>
</template>
