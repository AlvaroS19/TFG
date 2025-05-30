<template>
  <div class="p-4 text-[#F5F0E1] bg-[#0A1A2F] min-h-screen overflow-y-auto">
    <h1 class="text-2xl font-bold mb-2">¡Bienvenido a tu Dashboard!</h1>
    <p class="mb-4">Nivel: <span class="text-[#FFC107] font-semibold">{{ stats.nivel }}</span> · XP: <span
        class="text-[#FFC107] font-semibold">{{ stats.xp }}</span></p>
    <h2 class="text-xl font-bold mb-2">Misiones activas</h2>
    <div class="max-h-[90vh] overflow-y-auto space-y-4">
      <MissionCard v-for="m in misiones" :key="m.id" :titulo="m.titulo" :descripcion="m.descripcion"
        :dificultad="m.dificultad" :categoria="m.categoria" :xp="m.xp" @completar="completarMision(m.id)" />
    </div>
    <div ref="sentinel" class="h-1"></div>
  </div>
</template>


<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { getCookie } from '../services/auth';
import MissionCard from '../components/MissionCard.vue'

const todasMisiones = ref<any[]>([])
const misiones = ref<any[]>([])
const batchSize = 10
const index = ref(0)
const stats = ref({ xp: 0, nivel: 1 })

const cargarMasMisiones = () => {
  const siguienteBloque = todasMisiones.value.slice(index.value, index.value + batchSize)
  misiones.value.push(...siguienteBloque)
  index.value += batchSize
}

const cargarMisiones = async () => {
  const token = getCookie('idToken');
  const res = await fetch('http://localhost:5000/missions/', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (res.ok) {
    const data = await res.json()
    todasMisiones.value = data
      .filter(m => !m.completada)
      .map((m, i) => ({
        ...m,
        id: m.id || `${m.titulo}-${m.generatedAt || i}`
      }))
    misiones.value = []
    index.value = 0
    cargarMasMisiones()
    console.log('🧩 Misiones recibidas:', todasMisiones.value)
  } else {
    console.error('Error al cargar datos')
  }
}

const cargarStats = async () => {
  const token = getCookie('idToken');
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
  const token = getCookie('idToken');
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
  const token = getCookie('idToken');
  console.log('🪪 Token al montar dashboard:', token)

  if (!token) {
    console.warn('⚠️ No hay token, redirigiendo a login...')
    window.location.href = '/login'
    return
  }

  await cargarMisiones()
  await cargarStats()
})
const sentinel = ref(null)
let observer: IntersectionObserver

onMounted(() => {
  observer = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      cargarMasMisiones()
    }
  })

  if (sentinel.value) observer.observe(sentinel.value)
})

onUnmounted(() => {
  if (sentinel.value) observer.unobserve(sentinel.value)
})

</script>