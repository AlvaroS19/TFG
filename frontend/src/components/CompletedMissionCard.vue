<template>
  <div class="bg-[#1A1A2F] border border-[#4A4A5F] p-4 rounded-2xl shadow-sm opacity-60 relative">
    <div class="absolute top-2 right-2 text-green-400">
      ✅
    </div>

    <div class="flex justify-between items-center mb-2">
      <h2 class="text-lg font-semibold text-[#CCCCCC] truncate">{{ titulo }}</h2>
      <span class="text-xs bg-gray-700 text-white px-2 py-0.5 rounded-full">
        {{ dificultad }}
      </span>
    </div>

    <p class="text-sm text-[#AAAAAA] mb-1">{{ descripcion }}</p>
    <p class="text-xs text-[#888888]">🎯 {{ categoria }} &middot; ⭐ +{{ xp }} XP</p>
  </div>
</template>

<script setup>
defineProps({
  titulo: String,
  descripcion: String,
  dificultad: String,
  categoria: String,
  xp: Number
})
</script>