<template>
  <div class="min-h-screen bg-[#0A1A2F] text-[#F5F0E1] p-6">
    <h1 class="text-2xl font-bold mb-6 text-center">⚔️ Misiones activas</h1>

    <!-- Filtro por categoría -->
    <div class="mb-4 flex justify-center gap-2 flex-wrap">
      <button
        v-for="cat in categoriasDisponibles"
        :key="cat"
        @click="categoriaSeleccionada = cat"
        :class="[
          'px-3 py-1 rounded-xl text-sm border',
          categoriaSeleccionada === cat
            ? 'bg-[#F66B0E] text-white border-[#F66B0E]'
            : 'bg-transparent text-[#F5F0E1] border-[#F5F0E1]/30'
        ]"
      >
        {{ cat }}
      </button>
    </div>

    <div v-if="misionesFiltradas.length" class="space-y-4">
      <div
        v-for="m in misionesFiltradas"
        :key="m.id"
        class="bg-[#112233] border border-[#F66B0E] p-4 rounded-xl"
      >
        <div class="flex justify-between items-center">
          <h2 class="text-lg font-bold text-[#FFC107]">{{ m.titulo }}</h2>
          <span
            :class="[
              'px-2 py-1 rounded text-xs font-bold',
              m.dificultad === 'fácil' ? 'bg-green-600' :
              m.dificultad === 'media' ? 'bg-yellow-600' :
              'bg-red-600'
            ]"
          >
            {{ m.dificultad }}
          </span>
        </div>

        <p class="text-sm mt-1 mb-2">{{ m.descripcion }}</p>
        <p class="text-xs text-[#FFC107] mb-3">🎯 {{ m.categoria }} · ⭐ +{{ m.xp }} XP</p>

        <button
          @click="completarMision(m.id)"
          class="bg-[#F66B0E] hover:bg-[#BF360C] text-white px-4 py-2 rounded-xl text-sm w-full transition"
        >
          Completar misión
        </button>
      </div>
    </div>

    <div v-else class="text-center text-[#F5F0E1]/70 mt-10">
      No hay misiones de esta categoría por ahora.
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { getMissions, completeMission } from '../services/missions'

const misiones = ref([])
const categoriaSeleccionada = ref('todas')

const categoriasDisponibles = ['todas', 'diaria', 'semanal', 'especial']

const misionesFiltradas = computed(() => {
  return categoriaSeleccionada.value === 'todas'
    ? misiones.value
    : misiones.value.filter(m => m.categoria === categoriaSeleccionada.value)
})

const cargarMisiones = async () => {
  try {
    misiones.value = await getMissions()
  } catch (error) {
    console.error('Error al cargar misiones:', error)
  }
}

const completarMision = async (id) => {
  try {
    await completeMission(id)
    await cargarMisiones()
  } catch (error) {
    console.error('❌ Error al completar misión', error)
  }
}

onMounted(cargarMisiones)
</script>