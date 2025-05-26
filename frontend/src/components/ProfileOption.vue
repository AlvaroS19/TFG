<template>
  <button
    class="w-full flex justify-between items-center bg-[#112233] text-[#F5F0E1] px-4 py-3 rounded-xl"
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
