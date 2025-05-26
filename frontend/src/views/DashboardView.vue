<template>
  <div class="p-4 text-[#F5F0E1] bg-[#0A1A2F] min-h-screen">
    <h1 class="text-2xl font-bold mb-2">¡Bienvenido a tu Dashboard!</h1>
    <p class="mb-4">Nivel: <span class="text-[#FFC107] font-semibold">{{ stats.nivel }}</span> · XP: <span class="text-[#FFC107] font-semibold">{{ stats.xp }}</span></p>

    <h2 class="text-xl font-bold mb-2">Misiones activas</h2>
    <div class="space-y-4">
      <div
        v-for="m in misiones"
        :key="m.id"
        class="bg-[#112233] p-4 rounded-xl border border-[#F66B0E]"
      >
        <h3 class="text-lg font-semibold">{{ m.titulo }}</h3>
        <p class="text-sm text-[#F5F0E1] mb-2">{{ m.descripcion }}</p>
        <p class="text-xs text-[#FFC107] mb-2">+{{ m.xp }} XP</p>
        <button
          @click="completarMision(m.id)"
          class="bg-[#F66B0E] hover:bg-[#BF360C] text-white px-4 py-2 rounded-xl text-sm"
        >
          Completar
        </button>
      </div>
    </div>
  </div>
</template>


<script setup lang="ts">
import { ref, onMounted } from 'vue'

const misiones = ref<any[]>([])
const stats = ref({ xp: 0, nivel: 1 })

const cargarMisiones = async () => {
  const token = localStorage.getItem('idToken')
  const res = await fetch('http://localhost:5000/missions/', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (res.ok) {
    misiones.value = await res.json()
  } else {
    console.error('Error al cargar datos')
  }
}

const cargarStats = async () => {
  const token = localStorage.getItem('idToken')
  const res = await fetch('http://localhost:5000/user/stats', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (res.ok) {
    stats.value = await res.json()
  } else {
    console.error('Error al cargar datos')
  }
}

const completarMision = async (misionId: string) => {
  const token = localStorage.getItem('idToken')
  const res = await fetch('http://localhost:5000/missions/complete', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ id: misionId }),
  })

  if (res.ok) {
    console.log('Operación completada')
    await cargarMisiones()
    await cargarStats()
  } else {
    console.error('Error al cargar datos')
  }
}

onMounted(async () => {
  const token = localStorage.getItem('idToken')
  console.log('🪪 Token al montar dashboard:', token)

  if (!token) {
    console.warn('⚠️ No hay token, redirigiendo a login...')
    window.location.href = '/login'
    return
  }

  await cargarMisiones()
  await cargarStats()
})
</script>
