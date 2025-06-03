<template>
  <div class="min-h-screen bg-[#0A1A2F] text-[#F5F0E1] p-6">
    <h1 class="text-2xl font-bold mb-6 text-center">Tus estadísticas</h1>

    <!-- Usuario -->
    <section class="bg-[#112233] rounded-lg p-4 mb-6">
      <h2 class="text-lg font-semibold mb-2 text-[#F66B0E]">👤 Usuario</h2>
      <p><strong>Nickname:</strong> {{ stats.nickname || 'No configurado' }}</p>
      <p><strong>Objetivo:</strong> {{ stats.goal || 'No establecido' }}</p>
      <p><strong>Dificultad:</strong> {{ stats.difficulty || 'No asignada' }}</p>
    </section>

    <!-- Progreso -->
    <section class="bg-[#1E293B] rounded-lg p-4 mb-6">
      <h2 class="text-lg font-semibold text-[#A5B4FC] mb-2">Progreso</h2>
      <p><strong>Nivel:</strong> {{ stats.level }}</p>
      <p><strong>XP:</strong> {{ stats.xp }}</p>
      <div class="w-full bg-[#334155] h-3 rounded overflow-hidden">
        <div
          class="bg-[#22c55e] h-full transition-all duration-500"
          :style="{ width: stats.progress + '%' }"
        ></div>
      </div>
      <p class="text-sm mt-1 text-[#94a3b8]/50">{{ stats.progress }}% al siguiente nivel</p>
    </section>

    <!-- Misiones -->
    <section class="bg-[#112233] rounded-lg p-4 mb-6">
      <h2 class="text-lg font-semibold text-[#10B981] mb-2">Misiones completadas</h2>
      <ul class="text-sm space-y-1">
        <li>📅 Diarias: {{ stats.dailyCompleted }}</li>
        <li>📆 Semanales: {{ stats.weeklyCompleted }}</li>
        <li>⭐ Especiales: {{ stats.specialCompleted }}</li>
        <li>🏁 Total: {{ stats.totalMissionsCompleted }}</li>
      </ul>
    </section>

    <!-- Recompensas -->
    <section class="bg-[#1E293B] rounded-lg p-4">
      <h2 class="text-lg font-semibold text-[#FBBF24] mb-2">Recompensas</h2>
      <p class="text-sm">Total desbloqueadas: <strong>{{ stats.totalRewardsUnlocked }}</strong></p>
    </section>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { getCookie } from '@/services/auth'

const stats = ref({
  uid: '',
  xp: 0,
  level: 1,
  progress: 0,
  nickname: '',
  goal: '',
  difficulty: '',
  totalMissionsCompleted: 0,
  dailyCompleted: 0,
  weeklyCompleted: 0,
  specialCompleted: 0,
  totalRewardsUnlocked: 0,
})

onMounted(async () => {
  const token = getCookie('idToken')
  try {
    const res = await fetch('http://localhost:5000/user/stats', {
      headers: { Authorization: `Bearer ${token}` },
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error)
    stats.value = data
  } catch (err) {
    console.error('❌ Error al cargar estadísticas:', err)
  }
})
</script>