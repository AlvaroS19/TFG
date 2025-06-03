<template>
  <div class="min-h-screen bg-[#0A1A2F] text-[#F5F0E1] p-6">
    <h1 class="text-2xl font-bold text-center mb-6">📋 Todas tus misiones</h1>

    <!-- Filtro de categoría -->
    <div class="flex justify-center gap-2 mb-8 flex-wrap">
      <button
        v-for="cat in categoriasDisponibles"
        :key="cat"
        @click="categoriaSeleccionada = cat"
        :class="[
          'px-4 py-1 rounded-full text-sm font-semibold border transition',
          categoriaSeleccionada === cat
            ? 'bg-[#F66B0E] text-white border-[#F66B0E]'
            : 'bg-transparent text-[#F5F0E1] border-[#F5F0E1]/30 hover:bg-[#F5F0E1]/10'
        ]"
      >
        {{ cat }}
      </button>
    </div>

    <!-- Lista de misiones -->
    <div v-if="misionesFiltradas.length" class="space-y-4">
      <div v-for="m in misionesFiltradas" :key="m.id">
        <div v-if="isUnlocked(m)">
          <MissionCard
            :titulo="m.titulo"
            :descripcion="m.descripcion"
            :dificultad="m.dificultad"
            :categoria="m.categoria"
            :xp="m.xp"
            @completar="completarMision(m.id)"
          />
        </div>
        <div class="p-4 border border-[#F5F0E1]/30 rounded bg-[#F5F0E1]/5">
          <p class="text-lg font-semibold text-[#F5F0E1]/80">{{ m.titulo }}</p>
          <p class="text-sm text-[#F5F0E1]/50">🔒 Disponible en {{ tiempoRestante(m.unlockAt) }}</p>
        </div>
      </div>
    </div>

    <!-- Si no hay misiones -->
    <div v-else class="text-center text-[#F5F0E1]/50 mt-10 italic">
      No hay misiones de esta categoría ahora mismo.
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import MissionCard from '../components/MissionCard.vue'
import { getCookie } from '@/services/auth'
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'

const misiones = ref([])
const categoriaSeleccionada = ref('todas')
const categoriasDisponibles = ['todas', 'diaria', 'semanal', 'especial']

// Filtrado
const misionesFiltradas = computed(() => {
  return categoriaSeleccionada.value === 'todas'
    ? misiones.value
    : misiones.value.filter(m => m.categoria === categoriaSeleccionada.value)
})

const isUnlocked = (mision) => {
  if (!mision.unlockAt) return true
  return new Date(mision.unlockAt) <= new Date()
}

const tiempoRestante = (unlockAt) => {
  const ahora = new Date()
  const desbloqueo = new Date(unlockAt)
  const diff = desbloqueo - ahora

  if (diff <= 0) return 'ahora'
  const horas = Math.floor(diff / (1000 * 60 * 60))
  const minutos = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  return `${horas}h ${minutos}m`
}

const cargarMisiones = async () => {
  const token = getCookie('idToken')
  const res = await fetch('http://localhost:5000/missions', {
    headers: { Authorization: `Bearer ${token}` }
  })

  if (res.ok) {
    const data = await res.json()
    const recibidas = Array.isArray(data.misiones) ? data.misiones : []
    misiones.value = recibidas
      .filter(m => !m.completada)
      .map((m, i) => ({
        ...m,
        id: m.id || `${m.titulo}-${m.generatedAt || i}`
      }))
  } else {
    console.error('❌ Error al cargar misiones')
  }
}

const completarMision = async (id) => {
  const token = getCookie('idToken')
  try {
    const res = await fetch('http://localhost:5000/missions/complete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ missionId: id })
    })

    if (!res.ok) throw new Error()

    misiones.value = misiones.value.filter(m => m.id !== id)
    toast.success('✅ Misión completada', { autoClose: 3000 })
  } catch (error) {
    toast.error('❌ Error al completar misión', { autoClose: 3000 })
  }
}

onMounted(() => {
  cargarMisiones()
})
</script>