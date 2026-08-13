<template>
  <button
    class="w-full flex justify-between items-center bg-surface text-text px-4 py-3 rounded-xl"
    @click="$emit('click')"
  >
    <span class="flex items-center gap-2 text-sm">
      <span>{{ icon }}</span>
      <span>{{ label }}</span>
    </span>
    <span>›</span>
  </button>
</template>

<script setup>
defineProps({
  icon: String,
  label: String
})
defineEmits(['click'])
</script>
