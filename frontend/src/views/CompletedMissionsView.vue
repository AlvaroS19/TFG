<template>
  <div class="min-h-screen bg-[#0A1A2F] text-[#F5F0E1] p-6">
    <h1 class="text-2xl font-bold mb-6 text-center">✅ Misiones completadas</h1>

    <div v-if="completadas.length" class="space-y-4">
      <div
        v-for="m in completadas"
        :key="m.id"
        class="bg-[#1a1a1a] border border-[#888] p-4 rounded-xl opacity-80"
      >
        <h2 class="text-lg font-semibold text-[#F5F0E1]">{{ m.titulo }}</h2>
        <p class="text-sm mb-1">{{ m.descripcion }}</p>
        <p class="text-xs text-[#FFC107] mb-1">⭐ +{{ m.xp }} XP</p>
        <p class="text-xs text-gray-400">🕓 Completada el {{ formatFecha(m.completedAt) }}</p>
      </div>
    </div>

    <div v-else class="text-center text-[#F5F0E1]/70 mt-10">
      Aún no has completado ninguna misión.
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const completadas = ref([])

const formatFecha = (fecha) => {
  const d = new Date(fecha)
  return d.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })
}

const cargarCompletadas = async () => {
  const token = localStorage.getItem('idToken')
  const res = await fetch('http://localhost:5000/user/progress', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })

  if (res.ok) {
    const data = await res.json()
    completadas.value = data.completed || []
  } else {
    console.error('Error al cargar misiones completadas')
  }
}

onMounted(cargarCompletadas)
</script>
