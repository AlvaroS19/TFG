<template>
  <button
    :class="[
      'w-full py-3 rounded-xl font-bold text-lg shadow-lg transition duration-200',
      outlined
        ? 'border-2 border-primary text-primary hover:bg-primary hover:text-white'
        : 'bg-primary text-white hover:brightness-110'
    ]"
    v-bind="$attrs"
  >
    <slot />
  </button>
</template>

<script setup>
defineProps({ outlined: Boolean })
</script>
