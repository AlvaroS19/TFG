<template>
  <div class="bg-surface border border-muted p-4 rounded-2xl shadow-sm opacity-60 relative">
    <CheckCircle :size="18" class="absolute top-2 right-2 text-success" />

    <div class="flex justify-between items-center mb-2">
      <h2 class="text-lg font-semibold text-text/70 truncate">{{ titulo }}</h2>
      <span class="text-xs bg-muted text-white px-2 py-0.5 rounded-full">
        {{ dificultad }}
      </span>
    </div>

    <p class="text-sm text-text/60 mb-1">{{ descripcion }}</p>
    <p class="text-xs text-text/40 flex items-center gap-1">
      <Target :size="12" /> {{ categoria }} <span class="mx-1">&middot;</span> <Star :size="12" /> +{{ xp }} XP
    </p>
  </div>
</template>

<script setup>
import { CheckCircle, Target, Star } from 'lucide-vue-next'

defineProps({
  titulo: String,
  descripcion: String,
  dificultad: String,
  categoria: String,
  xp: Number
})
</script>