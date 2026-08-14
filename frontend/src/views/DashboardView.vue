<template>
  <div class="min-h-screen bg-background text-text p-6">
    <div v-if="cargando" class="flex items-center justify-center py-20">
      <span class="text-sm text-text/50">Cargando...</span>
    </div>

    <template v-else>
      <XpChart />
      <h1 class="text-2xl font-bold mb-4 flex items-center gap-2">
        <Hand :size="24" class="text-warning" /> ¡Hola, {{ perfil.nickname || 'Entrenador' }}!
      </h1>

      <!-- Misión del día -->
      <section class="bg-surface rounded-lg p-4 mb-6 border-l-4 border-warning">
        <h2 class="text-lg font-semibold mb-2 text-warning flex items-center gap-2">
          <Pin :size="18" /> Misión del día
        </h2>

        <div v-if="misionDelDia">
          <h3 class="font-bold text-xl mb-1">{{ misionDelDia.titulo }}</h3>
          <p class="text-sm text-text/70 mb-2">{{ misionDelDia.descripcion }}</p>
          <p class="text-xs text-text/50">
            Dificultad: {{ misionDelDia.dificultad }} · XP: {{ misionDelDia.xp }}
          </p>
        </div>

        <div v-else class="text-sm text-text/40 italic">
          No tienes misión asignada para hoy todavía.
        </div>
      </section>

      <!-- Tarjeta de progreso -->
      <section class="bg-surface-alt rounded-lg p-4 mb-4 border-l-4 border-info">
        <h2 class="text-lg font-semibold text-info mb-2 flex items-center gap-2">
          <TrendingUp :size="18" /> Progreso
        </h2>
        <p class="mb-1">Nivel actual: <strong>{{ stats.level }}</strong></p>
        <p class="mb-1">XP acumulado: <strong>{{ stats.xp }}</strong></p>

        <div class="mt-4">
          <p class="text-sm text-text/70 mb-1 text-center">
            {{ xpRestante }} XP para el nivel {{ stats.level + 1 }}
          </p>
          <div class="w-full h-3 bg-muted rounded">
            <div
              class="h-3 bg-primary rounded transition-all duration-300"
              :style="{ width: `${porcentajeNivel}%` }"
            ></div>
          </div>
        </div>
      </section>

      <!-- Botones -->
      <div class="flex flex-col gap-2">
        <BaseButton :icon="Target" @click="$router.push('/missions')">
          Ver misiones
        </BaseButton>
        <BaseButton :icon="User" variant="secondary" @click="$router.push('/profile')">
          Ir a perfil
        </BaseButton>
        <BaseButton :icon="BarChart3" variant="secondary" @click="$router.push('/user/stats')">
          Ver estadísticas
        </BaseButton>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import XpChart from '../components/XpChart.vue'
import BaseButton from '../components/BaseButton.vue'
import { Hand, Pin, TrendingUp, Target, User, BarChart3 } from 'lucide-vue-next'
import { apiFetch } from '../services/api'

const cargando = ref(true)
const stats = ref({ xp: 0, level: 1 })
const perfil = ref({ nickname: '' })
const misionDelDia = ref(null)

const xpParaNivel = 100

const progresoNivel = computed(() => stats.value.xp % xpParaNivel)
const xpRestante = computed(() => xpParaNivel - progresoNivel.value)
const porcentajeNivel = computed(() =>
  Math.min(100, (progresoNivel.value / xpParaNivel) * 100).toFixed(0)
)

const cargarStats = async () => {
  try {
    const data = await apiFetch('/user/stats')
    stats.value = data
    perfil.value.nickname = data.nickname || ''
  } catch (err) {
    console.error('❌ Error cargando stats:', err)
  }
}

const cargarMisionDelDia = async () => {
  try {
    const data = await apiFetch('/missions')
    const misiones = Array.isArray(data?.misiones) ? data.misiones : []

    const hoy = new Date()
    hoy.setHours(0, 0, 0, 0)

    const misionHoy = misiones.find(m => {
      if (m.completada) return false
      const gen = m.generatedAt ? new Date(m.generatedAt) : null
      if (!gen) return false

      gen.setHours(0, 0, 0, 0)
      return gen.getTime() === hoy.getTime()
    })

    misionDelDia.value = misionHoy || null
  } catch (err) {
    console.error('❌ Error cargando misión del día:', err)
  }
}

onMounted(async () => {
  // En paralelo, no en serie: reduce el tiempo total de carga a la mitad aprox.
  await Promise.all([cargarStats(), cargarMisionDelDia()])
  cargando.value = false
})
</script>