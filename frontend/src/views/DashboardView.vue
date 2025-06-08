<template>
  <div class="min-h-screen bg-[#0A1A2F] text-[#F5F0E1] p-6">
    <XpChart />
    <h1 class="text-2xl font-bold mb-4">👋 ¡Hola, {{ perfil.nickname || 'Entrenador' }}!</h1>

    <!-- Misión del día -->
    <section class="bg-[#112233] rounded-lg p-4 mb-6">
      <h2 class="text-lg font-semibold mb-2 text-[#FFC107]">📌 Misión del día</h2>

      <div v-if="misionDelDia">
        <h3 class="font-bold text-xl mb-1">{{ misionDelDia.titulo }}</h3>
        <p class="text-sm text-[#F5F0E1]/70 mb-2">{{ misionDelDia.descripcion }}</p>
        <p class="text-xs text-[#F5F0E1]/50">
          Dificultad: {{ misionDelDia.dificultad }} · XP: {{ misionDelDia.xp }}
        </p>
      </div>

      <div v-else class="text-sm text-[#F5F0E1]/40 italic">
        No tienes misión asignada para hoy todavía.
      </div>
    </section>

    <!-- Tarjeta de progreso -->
    <section class="bg-[#1E293B] rounded-lg p-4 mb-4">
      <h2 class="text-lg font-semibold text-[#A5B4FC] mb-2">Progreso</h2>
      <p class="mb-1">Nivel actual: <strong>{{ stats.level }}</strong></p>
      <p class="mb-1">XP acumulado: <strong>{{ stats.xp }}</strong></p>

      <!-- Barra de progreso -->
      <div class="mt-4">
        <p class="text-sm text-[#F5F0E1]/70 mb-1 text-center">
          {{ xpRestante }} XP para el nivel {{ stats.level + 1 }}
        </p>
        <div class="w-full h-3 bg-[#334155] rounded">
          <div
            class="h-3 bg-[#F66B0E] rounded transition-all duration-300"
            :style="{ width: `${porcentajeNivel}%` }"
          ></div>
        </div>
      </div>
    </section>

    <!-- Botones -->
    <div class="flex flex-col gap-2">
      <button @click="$router.push('/missions')" class="bg-[#F66B0E] text-white rounded py-2">
        Ver misiones
      </button>
      <button @click="$router.push('/profile')" class="bg-[#334155] text-white rounded py-2">
        Ir a perfil
      </button>
      <button @click="$router.push('/user/stats')" class="bg-[#1D4ED8] text-white rounded py-2">
        Ver estadísticas
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { getCookie } from '../services/auth'
import XpChart from '../components/XpChart.vue'
import { apiFetch } from '../services/api';

const stats = ref({ xp: 0, level: 1 })
const perfil = ref({ nickname: '' })
const misionDelDia = ref(null)

const xpParaNivel = 100

const progresoNivel = computed(() => stats.value.xp % xpParaNivel)
const xpRestante = computed(() => xpParaNivel - progresoNivel.value)
const porcentajeNivel = computed(() =>
  Math.min(100, (progresoNivel.value / xpParaNivel) * 100).toFixed(0)
)

const cargarStats = async () => {
  const token = getCookie('idToken')
  const res = await apiFetch('/user/stats', {
    headers: { Authorization: `Bearer ${token}` }
  })
  if (res.ok) stats.value = await res.json()
}

const cargarPerfil = async () => {
  const token = getCookie('idToken')
  const res = await apiFetch('/user/stats', {
    headers: { Authorization: `Bearer ${token}` }
  })
  if (res.ok) {
    const data = await res.json()
    perfil.value.nickname = data.nickname
  }
}

const cargarMisionDelDia = async () => {
  const token = getCookie('idToken')
  const res = await apiFetch('/missions', {
    headers: { Authorization: `Bearer ${token}` }
  })

  if (res.ok) {
    const data = await res.json()
    const misiones = Array.isArray(data.misiones) ? data.misiones : []

    const hoy = new Date()
    hoy.setHours(0, 0, 0, 0)

    const misionHoy = misiones.find(m => {
      if (m.completada) return false
      if (!m.generatedAt) return false
      const fecha = new Date(m.generatedAt)
      fecha.setHours(0, 0, 0, 0)
      return fecha.getTime() === hoy.getTime()
    })

    misionDelDia.value = misionHoy || null
  }
}

onMounted(async () => {
  await cargarPerfil()
  await cargarStats()
  await cargarMisionDelDia()
})
</script>