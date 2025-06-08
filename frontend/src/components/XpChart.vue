<template>
  <div class="bg-[#112233] rounded-lg p-4 shadow w-full max-w-md mx-auto text-sm text-[#F5F0E1] space-y-6 mb-6">
    <h2 class="font-semibold text-lg mb-2">Progreso de XP</h2>

    <div>
      <p class="mb-1 text-[#F5F0E1]/70">Hoy: {{ xpHoy }} XP</p>
      <div class="w-full bg-gray-700 h-4 rounded">
        <div
          class="bg-[#F66B0E] h-4 rounded transition-all duration-300"
          :style="{ width: `${Math.min((xpHoy / metaDiaria) * 100, 100)}%` }"
        />
      </div>
    </div>

    <div>
      <p class="mb-1 text-[#F5F0E1]/70">Últimos 7 días: {{ xpSemana }} XP</p>
      <div class="w-full bg-gray-700 h-4 rounded">
        <div
          class="bg-blue-500 h-4 rounded transition-all duration-300"
          :style="{ width: `${Math.min((xpSemana / metaSemanal) * 100, 100)}%` }"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getCookie } from '@/services/auth'
import { apiFetch } from '../services/api.js';

const xpHoy = ref(0)
const xpSemana = ref(0)
const metaDiaria = 30
const metaSemanal = 150

const fetchXpData = async () => {
  try {
    const token = getCookie('idToken')
    const res = await apiFetch('/user/xp-history', {
      headers: { Authorization: `Bearer ${token}` }
    })

    const { xpByDate } = await res.json()

    const today = new Date().toISOString().slice(0, 10)
    const hoyXP = xpByDate?.[today] || 0
    xpHoy.value = hoyXP

    const xp7dias = Object.entries(xpByDate || {}).filter(([fecha]) => {
      const diff = (new Date() - new Date(fecha)) / (1000 * 60 * 60 * 24)
      return diff <= 6
    }).reduce((acc, [, xp]) => acc + xp, 0)

    xpSemana.value = xp7dias
  } catch (error) {
    console.error('❌ Error al obtener XP:', error)
  }
}

onMounted(fetchXpData)
</script>