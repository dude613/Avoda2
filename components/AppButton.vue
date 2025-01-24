<script setup lang="ts">
type Variants = 'primary' | 'secondary' | 'tertiary';

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
      'px-5 py-3 capitalize flex space-x-5 text-sm rounded-sm focus-visible:outline-none disabled:pointer-events-none hover:cursor-pointer justify-center items-center',
      {
        'bg-white shadow-sm': variant === 'primary',
        'bg-blue-500 shadow-sm text-white hover:bg-blue-700/95':
          variant === 'tertiary',
        'text-white bg-black hover:bg-gray-900/90': variant === 'secondary',
      },
    ]"
    v-bind="$attrs"
  >
    <slot name="icon" />
    <span>{{ text }}</span>
  </button>
</template>
