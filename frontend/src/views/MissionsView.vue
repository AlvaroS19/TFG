<template>
  <div class="min-h-screen bg-[#0A1A2F] text-[#F5F0E1] p-4">
    <h1 class="text-2xl font-bold text-center mb-4">⚔️ Misiones activas</h1>

    <!-- Filtro -->
    <div class="flex justify-center gap-2 mb-6 flex-wrap">
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
        <div
          v-else
          class="p-4 border border-[#F5F0E1]/30 rounded bg-[#F5F0E1]/5 flex items-center justify-between"
        >
          <div>
            <p class="text-lg font-semibold text-[#F5F0E1]/80">{{ m.titulo }}</p>
            <p class="text-sm text-[#F5F0E1]/50">🔒 Disponible en {{ tiempoRestante(m.unlockAt) }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- No hay misiones -->
    <div v-else class="text-center text-[#F5F0E1]/50 mt-10 italic">
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
import { getCookie } from '@/services/auth'
import { getUserConfig } from '@/services/user'

const misiones = ref([])
const todasMisiones = ref([]) // añadida
const categoriaSeleccionada = ref('todas')
const categoriasDisponibles = ['todas', 'diaria', 'semanal', 'especial']
const index = ref(0)
const batchSize = 10
let misionesVerificadasHoy = false

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

const cargarMasMisiones = () => {
  const siguiente = todasMisiones.value.slice(index.value, index.value + batchSize)
  const nuevas = siguiente.filter(m => !misiones.value.some(existe => existe.id === m.id))
  misiones.value.push(...nuevas)
  index.value += batchSize
}

const cargarMisiones = async () => {
  try {
    const token = getCookie('idToken')
    const res = await fetch('http://localhost:5000/missions/', {
      headers: { Authorization: `Bearer ${token}` }
    })

    const data = await res.json()
    const misionesRecibidas = Array.isArray(data)
      ? data
      : Array.isArray(data.misiones)
        ? data.misiones
        : []

    const ahora = new Date()

    todasMisiones.value = misionesRecibidas
      .filter(m => !m.completada)
      .filter(m => !m.unlockAt || new Date(m.unlockAt) <= ahora)
      .map((m, i) => ({
        ...m,
        id: m.id || `${m.titulo}-${m.generatedAt || i}`,
      }))

    misiones.value = []
    index.value = 0
    cargarMasMisiones()

    console.log('🧩 Misiones válidas recibidas:', todasMisiones.value)
  } catch (error) {
    console.error('❌ Error al cargar misiones:', error)
    todasMisiones.value = []
  }
}

const completarMision = async (id) => {
  const mision = misiones.value.find(m => m.id === id)
  if (!mision) return

  try {
    const res = await fetch('http://localhost:5000/missions/complete', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ missionId: id })
    })

    if (!res.ok) throw new Error()

    misiones.value = misiones.value.filter(m => m.id !== id)
    toast.success(`¡Misión completada! +${mision.xp} XP`, { autoClose: 3000 })
  } catch (error) {
    console.error('❌ Error al completar misión:', error)
    toast.error('No se pudo completar la misión', { autoClose: 3000 })
  }
}

const verificarMisiones = async () => {
  if (misionesVerificadasHoy) {
    console.log("🔁 Misiones ya verificadas hoy (evitando duplicado)")
    return
  }

  const token = getCookie('idToken')
  try {
    const { objetivo } = await getUserConfig()

    const res = await fetch('http://localhost:5000/missions/test/verificar', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ objetivo })
    })

    if (res.ok) {
      console.log('✅ Verificación de misiones exitosa')
      misionesVerificadasHoy = true
    } else {
      console.warn('⚠️ No se pudo verificar misiones')
    }
  } catch (error) {
    console.error('❌ Error al verificar misiones:', error)
  }
}

onMounted(async () => {
  await verificarMisiones()
  await cargarMisiones()
})
</script>