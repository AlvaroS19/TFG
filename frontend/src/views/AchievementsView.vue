<template>
  <div class="min-h-screen bg-[#0A1A2F] text-[#F5F0E1] p-6">
    <h1 class="text-2xl font-bold text-center mb-4">🏆 Tus logros</h1>
    <p class="text-center text-sm text-[#F5F0E1]/60 mb-8">
      Completa misiones y sube de nivel para desbloquear recompensas.
    </p>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        v-for="(logro, index) in TODOS_LOS_LOGROS"
        :key="index"
        class="rounded-xl p-4 border transition-all duration-300 shadow-md flex items-start gap-4"
        :class="esDesbloqueado(logro)
          ? 'border-[#F66B0E] bg-[#1A2C45]'
          : 'border-[#333] bg-[#111827] opacity-50'"
      >
        <!-- Icono -->
        <div class="text-3xl">{{ esDesbloqueado(logro) ? logro.icono : '🔒' }}</div>

        <!-- Detalles -->
        <div>
          <h2
            :class="[
              'font-bold text-lg mb-1',
              esDesbloqueado(logro) ? 'text-[#FFC107]' : 'text-gray-400'
            ]"
          >
            {{ logro.nombre }}
          </h2>
          <p class="text-sm text-[#F5F0E1]/70 leading-snug">
            {{ logro.descripcion }}
          </p>
        </div>
      </div>
    </div>

    <div v-if="!logrosDesbloqueados.length" class="text-center text-[#F5F0E1]/40 mt-10 italic">
      Aún no has desbloqueado logros.
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getCookie } from '../services/auth'
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'
import { apiFetch } from '../services/api';

const logrosDesbloqueados = ref([])

const TODOS_LOS_LOGROS = [
  {
    nombre: 'Primeros pasos',
    clave: 'Primeros pasos',
    icono: '🟢',
    descripcion: 'Completa tu primera misión'
  },
  {
    nombre: 'Subiendo de nivel',
    clave: 'nivel',
    icono: '🟡',
    descripcion: 'Alcanza al menos 100 XP'
  },
  {
    nombre: 'Constancia',
    clave: 'Constancia',
    icono: '🔥',
    descripcion: 'Completa al menos 5 misiones'
  },
  {
    nombre: 'Pro en camino',
    clave: 'Pro',
    icono: '🏆',
    descripcion: 'Llega al nivel 3 o superior'
  },

  // NUEVOS LOGROS
  {
    nombre: 'Explorador diario',
    clave: 'diarias10',
    icono: '📅',
    descripcion: 'Completa 10 misiones diarias'
  },
  {
    nombre: 'Maratón semanal',
    clave: 'semanales5',
    icono: '📆',
    descripcion: 'Completa 5 misiones semanales'
  },
  {
    nombre: 'Ejecutor incansable',
    clave: 'misiones20',
    icono: '⚙️',
    descripcion: 'Completa 20 misiones en total'
  },
  {
    nombre: 'Nivel maestro',
    clave: 'nivel5',
    icono: '💠',
    descripcion: 'Alcanza el nivel 5 o superior'
  },
  {
    nombre: 'Veterano FitQuest',
    clave: 'veterano',
    icono: '🎖️',
    descripcion: 'Juega 30 días seguidos'
  },
  {
    nombre: 'Misión imposible',
    clave: 'dificil1',
    icono: '💀',
    descripcion: 'Completa al menos 1 misión difícil'
  },
  {
    nombre: 'Productividad máxima',
    clave: '3diarias1dia',
    icono: '🚀',
    descripcion: 'Completa 3 misiones en un solo día'
  },
  {
    nombre: 'Imparable',
    clave: 'racha7',
    icono: '🔁',
    descripcion: 'Completa misiones durante 7 días seguidos'
  }
]

const esDesbloqueado = (logro) => {
  return logrosDesbloqueados.value.some(r => r.id === logro.clave)
}

const cargarLogros = async () => {
  try {
    const token = getCookie('idToken')
    const data = await apiFetch('/user/rewards', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })

  logrosDesbloqueados.value = data || []
  } catch (error) {
    console.error('❌ Error al cargar logros:', error)
    toast.error('No se pudieron cargar los logros', { autoClose: 3000 })
  }
}

onMounted(cargarLogros)
</script>