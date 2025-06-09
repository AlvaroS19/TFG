<template>
  <div class="p-4 text-[#F5F0E1] bg-[#0A1A2F] min-h-screen">
    <h1 class="text-2xl font-bold mb-6 text-center">🎁 Tus Recompensas</h1>

    <!-- Desbloqueadas -->
    <section class="mb-8">
      <h2 class="text-lg font-semibold mb-2 text-[#22C55E]">🔓 Desbloqueadas</h2>
      <div v-if="recompensasDesbloqueadas.length === 0" class="text-gray-400">
        Aún no has desbloqueado recompensas.
      </div>

      <ul class="space-y-4">
        <li
          v-for="(r, index) in recompensasDesbloqueadas"
          :key="'desbloqueada-' + index"
          class="bg-[#112233] p-4 rounded-xl border border-[#22C55E]"
        >
          <h3 class="text-lg font-semibold">{{ r.nombre }}</h3>
          <p class="text-sm text-[#F5F0E1]/80">{{ r.descripcion }}</p>
          <p class="text-xs text-gray-400">Fecha: {{ new Date(r.fecha).toLocaleDateString() }}</p>
        </li>
      </ul>
    </section>

    <!-- Bloqueadas -->
    <section>
      <h2 class="text-lg font-semibold mb-2 text-[#F87171]">🔒 Bloqueadas</h2>
      <ul class="space-y-4">
        <li
          v-for="(r, index) in recompensasBloqueadas"
          :key="'bloqueada-' + index"
          class="bg-[#1E293B] p-4 rounded-xl border border-[#F87171]/40 opacity-60"
        >
          <h3 class="text-lg font-semibold">{{ r.nombre }}</h3>
          <p class="text-sm text-[#F5F0E1]/60">{{ r.descripcion }}</p>
          <p class="text-xs text-gray-400 italic">Desbloquea el logro asociado para conseguirla</p>
        </li>
      </ul>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getCookie } from '../services/auth'
import { apiFetch } from '../services/api';

const recompensasDesbloqueadas = ref([])
const recompensasBloqueadas = ref([])

const catalogoCompleto = {
  semanaPerfecta: {
    nombre: "Cheat Meal",
    descripcion: "Completaste misiones durante 7 días seguidos. ¡Hora de un capricho! 🍕"
  },
  nivel5Maestro: {
    nombre: "Día de descanso",
    descripcion: "Alcanzaste el nivel 5. Puedes tomarte un día libre. 😌"
  },
  constante30dias: {
    nombre: "Premio libre",
    descripcion: "30 días de constancia. ¡Recompénsate como quieras! 🎁"
  },
  proGamer: {
    nombre: "Medalla Élite",
    descripcion: "Alcanzaste el nivel 10. ¡Eres una leyenda! 🏅"
  }
}

const cargarRecompensas = async () => {
  try {
    const token = getCookie('idToken')
    const desbloqueadas = await apiFetch('/user/rewards', {
      headers: { Authorization: `Bearer ${token}` }
    })

    const logrosDesbloqueados = desbloqueadas.map(r => r.id)
    const bloqueadas = Object.entries(catalogoCompleto)
      .filter(([clave]) => !logrosDesbloqueados.includes(clave))
      .map(([clave, datos]) => ({ ...datos, logro: clave }))

    desbloqueadas.sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
    recompensasDesbloqueadas.value = desbloqueadas
    recompensasBloqueadas.value = bloqueadas
  } catch (err) {
  }
}

onMounted(() => {
  cargarRecompensas()
})
</script>
