<template>
  <div class="min-h-screen bg-background text-text p-6">
    <h1 class="text-2xl font-bold mb-6 text-center">Tus estadísticas</h1>

    <section class="bg-surface rounded-lg p-4 mb-6 border-l-4 border-primary">
      <h2 class="text-lg font-semibold mb-2 text-primary flex items-center gap-2">
        <UserIcon :size="18" /> Usuario
      </h2>
      <p><strong>Nickname:</strong> {{ stats.nickname || 'No configurado' }}</p>
      <p><strong>Objetivo:</strong> {{ stats.goal || 'No establecido' }}</p>
      <p><strong>Dificultad:</strong> {{ stats.difficulty || 'No asignada' }}</p>
    </section>

    <section class="bg-surface-alt rounded-lg p-4 mb-6 border-l-4 border-info">
      <h2 class="text-lg font-semibold text-info mb-2 flex items-center gap-2">
        <TrendingUp :size="18" /> Progreso
      </h2>
      <p><strong>Nivel:</strong> {{ stats.level }}</p>
      <p><strong>XP:</strong> {{ stats.xp }}</p>

      <div class="mt-4">
        <p class="text-sm text-text/70 mb-1 text-center">
          {{ xpRestante }} XP para el nivel {{ stats.level + 1 }}
        </p>
        <div class="w-full h-3 bg-muted rounded overflow-hidden">
          <div class="bg-success h-full transition-all duration-500" :style="{ width: `${porcentajeNivel}%` }"></div>
        </div>
        <p class="text-sm mt-1 text-center text-text/50">{{ porcentajeNivel }}% al siguiente nivel</p>
      </div>
    </section>

    <section class="bg-surface rounded-lg p-4 mb-6 border-l-4 border-success">
      <h2 class="text-lg font-semibold text-success mb-2 flex items-center gap-2">
        <Flag :size="18" /> Misiones completadas
      </h2>
      <ul class="text-sm space-y-1">
        <li class="flex items-center gap-2"><Calendar :size="14" /> Diarias: {{ stats.dailyCompleted }}</li>
        <li class="flex items-center gap-2"><CalendarDays :size="14" /> Semanales: {{ stats.weeklyCompleted }}</li>
        <li class="flex items-center gap-2"><Star :size="14" /> Especiales: {{ stats.specialCompleted }}</li>
        <li class="flex items-center gap-2"><Flag :size="14" /> Total: {{ stats.totalMissionsCompleted }}</li>
      </ul>
    </section>

    <section class="bg-surface-alt rounded-lg p-4 border-l-4 border-warning">
      <h2 class="text-lg font-semibold text-warning mb-2 flex items-center gap-2">
        <Gift :size="18" /> Recompensas
      </h2>
      <p class="text-sm">Total desbloqueadas: <strong>{{ stats.totalRewardsUnlocked }}</strong></p>
    </section>
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue'
import { User as UserIcon, TrendingUp, Flag, Calendar, CalendarDays, Star, Gift } from 'lucide-vue-next'
import { apiFetch } from '../services/api';

const xpParaNivel = 100

const stats = ref({
  uid: '', xp: 0, level: 1, nickname: '', goal: '', difficulty: '',
  totalMissionsCompleted: 0, dailyCompleted: 0, weeklyCompleted: 0,
  specialCompleted: 0, totalRewardsUnlocked: 0,
})

const progresoNivel = computed(() => stats.value.xp % xpParaNivel)
const xpRestante = computed(() => xpParaNivel - progresoNivel.value)
const porcentajeNivel = computed(() => Math.min(100, (progresoNivel.value / xpParaNivel) * 100).toFixed(0))

onMounted(async () => {
  try {
    const data = await apiFetch('/user/stats')
    stats.value = data
  } catch (err) {
    console.error('Error al cargar estadísticas:', err)
  }
})
</script>