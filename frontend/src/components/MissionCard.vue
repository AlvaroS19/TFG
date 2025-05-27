<template>
  <div class="bg-[#112233] border border-[#F66B0E] p-4 rounded-2xl shadow-lg">
    <div class="flex justify-between items-center mb-2">
      <h2 class="text-lg font-bold text-[#FFC107] truncate">{{ titulo }}</h2>
      <span
        :class="[
          'px-2 py-1 rounded text-xs font-bold text-white',
          dificultad === 'fácil' ? 'bg-green-600' :
          dificultad === 'media' ? 'bg-yellow-600' :
          'bg-red-600'
        ]"
      >
        {{ dificultad }}
      </span>
    </div>

    <p class="text-sm text-[#F5F0E1] mb-1">{{ descripcion }}</p>
    <p class="text-xs text-[#FFC107] mb-3">🎯 {{ categoria }} &middot; ⭐ +{{ xp }} XP</p>

    <button
      @click="$emit('completar')"
      class="bg-[#F66B0E] hover:bg-[#BF360C] text-white px-4 py-2 rounded-xl text-sm w-full transition"
    >
      Completar misión
    </button>
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

defineEmits(['completar'])
</script>