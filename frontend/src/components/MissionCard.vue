<template>
  <div class="bg-surface border border-primary p-4 rounded-2xl shadow-lg">
    <div class="flex justify-between items-center mb-2">
      <h2 class="text-lg font-bold text-warning truncate">{{ titulo }}</h2>
      <span
        :class="[
          'px-2 py-1 rounded text-xs font-bold text-white',
          dificultad === 'fácil' ? 'bg-success' :
          dificultad === 'media' ? 'bg-warning' :
          'bg-error'
        ]"
      >
        {{ dificultad }}
      </span>
    </div>

    <p class="text-sm text-text mb-1">{{ descripcion }}</p>
    <p class="text-xs text-warning mb-3 flex items-center gap-1">
      <Target :size="12" /> {{ categoria }} <span class="mx-1">&middot;</span> <Star :size="12" /> +{{ xp }} XP
    </p>

    <BaseButton size="sm" @click="$emit('completar')">
      Completar misión
    </BaseButton>
  </div>
</template>

<script setup>
import { Target, Star } from 'lucide-vue-next'
import BaseButton from './BaseButton.vue'

defineProps({
  titulo: String,
  descripcion: String,
  dificultad: String,
  categoria: String,
  xp: Number
})

defineEmits(['completar'])
</script>