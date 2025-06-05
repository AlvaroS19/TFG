<template>
  <div class="min-h-screen bg-[#0A1A2F] text-[#F5F0E1]">
    <div class="max-w-4xl mx-auto px-4 py-6 overflow-y-auto h-screen">
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
        <div v-else class="p-4 border border-[#F5F0E1]/30 rounded bg-[#F5F0E1]/5">
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
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import MissionCard from '@/components/MissionCard.vue'
import { notifySuccess, notifyError } from '@/utils/toastNotify'
import { getMissions, completeMission } from '@/services/missions'

const misiones = ref([])
const categoriaSeleccionada = ref('todas')
const categoriasDisponibles = ['todas', 'diaria', 'semanal', 'especial']

const misionesFiltradas = computed(() =>
  categoriaSeleccionada.value === 'todas'
    ? misiones.value
    : misiones.value.filter(m => m.categoria === categoriaSeleccionada.value)
)

const isUnlocked = (mision) => {
  return mision.desbloqueada === true;
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
  try {
    const data = await getMissions()
    const recibidas = Array.isArray(data.misiones) ? data.misiones : []
    misiones.value = recibidas
    .filter(m => !m.completada && m.desbloqueada === true)
    .map((m, i) => ({
      ...m,
      id: m.id || `${m.titulo}-${m.generatedAt || i}`
    }))
  } catch (e) {
    notifyError('❌ Error al cargar misiones')
  }
}

const completarMision = async (id) => {
  try {
    await completeMission(id)
    misiones.value = misiones.value.filter(m => m.id !== id)
    notifySuccess('✅ Misión completada')
  } catch {
    notifyError('❌ Error al completar misión')
  }
}

onMounted(cargarMisiones)
</script>

<style scoped>
/* Scroll personalizado */
::-webkit-scrollbar {
  width: 10px;
}
::-webkit-scrollbar-track {
  background: #0A1A2F;
}
::-webkit-scrollbar-thumb {
  background-color: #F66B0E;
  border-radius: 8px;
  border: 2px solid #0A1A2F;
}
::-webkit-scrollbar-thumb:hover {
  background-color: #fb923c;
}

/* Asegurar scroll vertical en pantallas pequeñas */
html, body {
  height: 100%;
  margin: 0;
  overflow: hidden;
}

body > #app {
  height: 100%;
  display: flex;
  flex-direction: column;
}

body > #app > * {
  flex: 1;
  overflow-y: auto;
}
</style>