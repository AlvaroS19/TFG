<template>
  <div class="min-h-screen bg-[#0A1A2F] text-[#F5F0E1] p-4">
    <h1 class="text-2xl font-bold text-center mb-4">⚔️ Misiones activas</h1>

    <!-- Filtro de categorías -->
    <div class="flex justify-center gap-2 mb-6 flex-wrap">
      <button v-for="cat in categoriasDisponibles" :key="cat" @click="categoriaSeleccionada = cat" :class="[
        'px-4 py-1 rounded-full text-sm font-semibold border transition',
        categoriaSeleccionada === cat
          ? 'bg-[#F66B0E] text-white border-[#F66B0E]'
          : 'bg-transparent text-[#F5F0E1] border-[#F5F0E1]/30 hover:bg-[#F5F0E1]/10'
      ]">
        {{ cat }}
      </button>
    </div>

    <!-- Lista de misiones -->
    <div v-if="misionesFiltradas.length" class="space-y-4">
      <div v-for="m in misionesFiltradas" :key="m.id">
        <div v-if="isUnlocked(m)">
          <MissionCard :titulo="m.titulo" :descripcion="m.descripcion" :dificultad="m.dificultad" :categoria="m.categoria" :xp="m.xp" @completar="completarMision(m.id)" />
        </div>
        <div v-else class="p-4 border border-[#F5F0E1]/30 rounded bg-[#F5F0E1]/5 flex items-center justify-between">
          <div>
            <p class="text-lg font-semibold text-[#F5F0E1]/80">{{ m.titulo }}</p>
            <p class="text-sm text-[#F5F0E1]/50">🔒 Disponible en {{ tiempoRestante(m.unlockAt) }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- No hay misiones -->
    <div v-else class="text-center text-[#F5F0E1]/70 mt-10">
      No hay misiones de esta categoría por ahora.
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { getMissions } from '../services/missions'
import MissionCard from '../components/MissionCard.vue'
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'

const misiones = ref([])
const categoriaSeleccionada = ref('todas')

const categoriasDisponibles = ['todas', 'diaria', 'semanal', 'especial']

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
  const segundos = Math.floor((diff % (1000 * 60)) / 1000)

  return `${horas}h ${minutos}m ${segundos}s`
}

const cargarMisiones = async () => {
  try {
    const data = await getMissions()
    console.log('📦 Misiones cargadas:', data)

    if (!Array.isArray(data.misiones)) {
      console.error('❌ La respuesta no es un array:', data)
      misiones.value = []
      return
    }

    misiones.value = data.misiones
      .filter(m => !m.completada)
      .map((m, i) => ({
        ...m,
        id: m.id || `${m.titulo}-${m.generatedAt || i}`
      }))
  } catch (error) {
    console.error('❌ Error al cargar misiones:', error)
    misiones.value = []
  }
}

const completarMision = async (id) => {
  const mision = misiones.value.find(m => m.id === id)
  if (!mision) return

  try {
    const res = await fetch('/missions/complete', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ missionId: id }) // <- usa missionId, ya estás migrado
    })

    if (!res.ok) throw new Error()

    // Eliminar la misión de la lista
    misiones.value = misiones.value.filter(m => m.id !== id)

    // Toast de éxito
    toast.success(`¡Misión completada! +${mision.xp} XP`, { autoClose: 3000 })

  } catch (error) {
    console.error('❌ Error al completar misión:', error)
    toast.error('No se pudo completar la misión', { autoClose: 3000 })
  }
}

onMounted(cargarMisiones)
</script>