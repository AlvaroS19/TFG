<template>
  <div class="p-4 text-text bg-background min-h-screen">
    <h1 class="text-2xl font-bold mb-6 text-center flex items-center justify-center gap-2">
      <Gift :size="24" class="text-primary" /> Tus Recompensas
    </h1>

    <section class="mb-8">
      <h2 class="text-lg font-semibold mb-2 text-success flex items-center gap-2">
        <Unlock :size="18" /> Desbloqueadas
      </h2>
      <div v-if="recompensasDesbloqueadas.length === 0" class="text-text/50">
        Aún no has desbloqueado recompensas.
      </div>

      <ul class="space-y-4">
        <li
          v-for="(r, index) in recompensasDesbloqueadas"
          :key="'desbloqueada-' + index"
          class="bg-surface p-4 rounded-xl border border-success"
        >
          <h3 class="text-lg font-semibold">{{ r.nombre }}</h3>
          <p class="text-sm text-text/80">{{ r.descripcion }}</p>
          <p class="text-xs text-text/50">Fecha: {{ new Date(r.fecha).toLocaleDateString() }}</p>
        </li>
      </ul>
    </section>

    <section>
      <h2 class="text-lg font-semibold mb-2 text-error flex items-center gap-2">
        <Lock :size="18" /> Bloqueadas
      </h2>
      <ul class="space-y-4">
        <li
          v-for="(r, index) in recompensasBloqueadas"
          :key="'bloqueada-' + index"
          class="bg-surface-alt p-4 rounded-xl border border-error/40 opacity-60"
        >
          <h3 class="text-lg font-semibold">{{ r.nombre }}</h3>
          <p class="text-sm text-text/60">{{ r.descripcion }}</p>
          <p class="text-xs text-text/50 italic">Desbloquea el logro asociado para conseguirla</p>
        </li>
      </ul>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Gift, Unlock, Lock } from 'lucide-vue-next'
import { apiFetch } from '../services/api';

const recompensasDesbloqueadas = ref([])
const recompensasBloqueadas = ref([])

const catalogoCompleto = {
  semanaPerfecta: { nombre: "Cheat Meal", descripcion: "Completaste misiones durante 7 días seguidos. ¡Hora de un capricho! 🍕" },
  nivel5Maestro: { nombre: "Día de descanso", descripcion: "Alcanzaste el nivel 5. Puedes tomarte un día libre. 😌" },
  constante30dias: { nombre: "Premio libre", descripcion: "30 días de constancia. ¡Recompénsate como quieras! 🎁" },
  proGamer: { nombre: "Medalla Élite", descripcion: "Alcanzaste el nivel 10. ¡Eres una leyenda! 🏅" }
}

const cargarRecompensas = async () => {
  try {
    const desbloqueadas = await apiFetch('/user/rewards')
    const logrosDesbloqueados = desbloqueadas.map(r => r.id)
    const bloqueadas = Object.entries(catalogoCompleto)
      .filter(([clave]) => !logrosDesbloqueados.includes(clave))
      .map(([clave, datos]) => ({ ...datos, logro: clave }))

    desbloqueadas.sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
    recompensasDesbloqueadas.value = desbloqueadas
    recompensasBloqueadas.value = bloqueadas
  } catch (err) {
    console.error('Error al cargar recompensas:', err)
  }
}

onMounted(cargarRecompensas)
</script>