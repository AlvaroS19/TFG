<template>
  <div class="p-4 text-[#F5F0E1] bg-[#0A1A2F] min-h-screen">
    <h1 class="text-2xl font-bold mb-4">Tus Recompensas</h1>

    <div v-if="recompensas.length === 0" class="text-gray-400">Aún no has desbloqueado recompensas.</div>

    <ul class="space-y-4">
      <li
        v-for="(r, index) in recompensas"
        :key="index"
        class="bg-[#112233] p-4 rounded-xl border border-[#FFC107]"
      >
        <h2 class="text-lg font-semibold">{{ r.nombre }}</h2>
        <p class="text-sm text-[#FFC107]">+{{ r.xp }} XP</p>
        <p class="text-xs text-gray-300">Fecha: {{ r.fecha }}</p>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getCookie } from '@/services/auth';

const recompensas = ref<any[]>([])

const cargarRecompensas = async () => {
  const token = getCookie('idToken');

  const res = await fetch('http://localhost:5000/user/rewards', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (res.ok) {
    recompensas.value = await res.json()
    console.log('🎁 Recompensas:', recompensas.value)
  } else {
    console.error('Error al cargar datos')
  }
}

onMounted(() => {
  cargarRecompensas()
})
</script>
