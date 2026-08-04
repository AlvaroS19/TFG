<template>
  <div class="mb-6 bg-[#142840] p-4 rounded-xl shadow-md text-[#F5F0E1]">
    <div class="flex justify-between items-center mb-2">
      <div class="text-lg font-semibold">Nivel {{ level }}</div>
      <div class="text-sm opacity-70">{{ xp }} XP</div>
    </div>
    <div class="w-full h-3 bg-[#1f3b5c] rounded-full overflow-hidden">
      <div
        class="h-full bg-[#FFC107] transition-all duration-500"
        :style="{ width: progress + '%' }"
      ></div>
    </div>
    <div class="text-xs text-right mt-1 text-[#F5F0E1]/60">{{ progress }}% al siguiente nivel</div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  level: Number,
  xp: Number
})

const progress = computed(() => props.xp % 100)
</script>
