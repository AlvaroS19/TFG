<template>
  <div class="min-h-screen overflow-y-auto bg-background text-text">
    <div class="max-w-4xl mx-auto px-4 pt-6 pb-28">
      <h1 class="text-2xl font-bold text-center mb-6 flex items-center justify-center gap-2">
        <ClipboardList :size="24" /> Todas tus misiones
      </h1>

      <div class="flex justify-center mb-4">
        <BaseButton :icon="RefreshCw" variant="secondary" size="sm" class="w-auto px-6" @click="regenerarMisiones">
          Regenerar misiones
        </BaseButton>
      </div>

      <!-- Filtro de categoría -->
      <div class="flex justify-center gap-2 mb-8 flex-wrap">
        <button
          v-for="cat in categoriasDisponibles"
          :key="cat"
          @click="categoriaSeleccionada = cat"
          :class="[
            'px-4 py-1 rounded-full text-sm font-semibold border transition active:scale-95',
            categoriaSeleccionada === cat
              ? 'bg-primary text-white border-primary'
              : 'bg-transparent text-text border-text/30 hover:bg-text/10'
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
          <div v-else class="p-4 border border-text/30 rounded bg-text/5 flex items-center gap-2">
            <Lock :size="16" class="text-text/50 shrink-0" />
            <div>
              <p class="text-lg font-semibold text-text/80">{{ m.titulo }}</p>
              <p class="text-sm text-text/50">Disponible en {{ tiempoRestante(m.unlockAt) }}</p>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="text-center text-text/50 mt-10 italic">
        No hay misiones de esta categoría ahora mismo.
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import MissionCard from '../components/MissionCard.vue'
import { notifySuccess, notifyError } from '../utils/toastNotify'
import { getMissions, completeMission } from '../services/missions'
import { apiFetch } from '../services/api'
import { ClipboardList, RefreshCw, Lock } from 'lucide-vue-next'
import BaseButton from '../components/BaseButton.vue'

const misiones = ref([])
const categoriaSeleccionada = ref('todas')
const categoriasDisponibles = ['todas', 'diaria', 'semanal', 'especial']

const misionesFiltradas = computed(() =>
  categoriaSeleccionada.value === 'todas'
    ? misiones.value
    : misiones.value.filter(m => m.categoria === categoriaSeleccionada.value)
)

const isUnlocked = (mision) => mision.desbloqueada === true

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
    const recibidas = Array.isArray(data?.misiones) ? data.misiones : []
    misiones.value = recibidas
      .filter(m => !m.completada && m.desbloqueada === true)
      .map(m => ({
        ...m,
        id: m.id || crypto.randomUUID()
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

const regenerarMisiones = async () => {
  try {
    await apiFetch('/missions/regenerate', { method: 'POST' })
    notifySuccess('✅ Misiones regeneradas')
    await cargarMisiones()
  } catch (e) {
    notifyError('❌ No se pudieron regenerar las misiones')
    console.error(e)
  }
}

onMounted(cargarMisiones)
</script>
<style scoped>
html, body {
  height: 100%;
  margin: 0;
  overflow-y: auto; /* ✅ Esto hace que se muestre la barra de scroll */
}

body > #app {
  min-height: 100%;
  display: flex;
  flex-direction: column;
}
</style>
