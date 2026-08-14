<template>
  <div class="min-h-screen bg-background text-text p-6">
    <h1 class="text-2xl font-bold text-center mb-4 flex items-center justify-center gap-2">
      <Trophy :size="24" class="text-warning" /> Tus logros
    </h1>
    <p class="text-center text-sm text-text/60 mb-8">
      Completa misiones y sube de nivel para desbloquear recompensas.
    </p>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        v-for="(logro, index) in TODOS_LOS_LOGROS"
        :key="index"
        class="rounded-xl p-4 border transition-all duration-300 shadow-md flex items-start gap-4"
        :class="esDesbloqueado(logro)
          ? 'border-primary bg-surface-alt'
          : 'border-muted bg-surface opacity-50'"
      >
        <component
          :is="esDesbloqueado(logro) ? logro.icono : Lock"
          :size="28"
          :class="esDesbloqueado(logro) ? 'text-primary shrink-0' : 'text-text/40 shrink-0'"
        />

        <div>
          <h2
            :class="['font-bold text-lg mb-1', esDesbloqueado(logro) ? 'text-warning' : 'text-text/40']"
          >
            {{ logro.nombre }}
          </h2>
          <p class="text-sm text-text/70 leading-snug">
            {{ logro.descripcion }}
          </p>
        </div>
      </div>
    </div>

    <div v-if="!logrosDesbloqueados.length" class="text-center text-text/40 mt-10 italic">
      Aún no has desbloqueado logros.
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'
import {
  Trophy, Lock, Sprout, Star, Flame, Calendar, CalendarDays,
  Settings, Gem, Award, Skull, Rocket, Repeat
} from 'lucide-vue-next'
import { apiFetch } from '../services/api';

const logrosDesbloqueados = ref([])

const TODOS_LOS_LOGROS = [
  { nombre: 'Primeros pasos', clave: 'Primeros pasos', icono: Sprout, descripcion: 'Completa tu primera misión' },
  { nombre: 'Subiendo de nivel', clave: 'nivel', icono: Star, descripcion: 'Alcanza al menos 100 XP' },
  { nombre: 'Constancia', clave: 'Constancia', icono: Flame, descripcion: 'Completa al menos 5 misiones' },
  { nombre: 'Pro en camino', clave: 'Pro', icono: Trophy, descripcion: 'Llega al nivel 3 o superior' },
  { nombre: 'Explorador diario', clave: 'diarias10', icono: Calendar, descripcion: 'Completa 10 misiones diarias' },
  { nombre: 'Maratón semanal', clave: 'semanales5', icono: CalendarDays, descripcion: 'Completa 5 misiones semanales' },
  { nombre: 'Ejecutor incansable', clave: 'misiones20', icono: Settings, descripcion: 'Completa 20 misiones en total' },
  { nombre: 'Nivel maestro', clave: 'nivel5', icono: Gem, descripcion: 'Alcanza el nivel 5 o superior' },
  { nombre: 'Veterano FitQuest', clave: 'veterano', icono: Award, descripcion: 'Juega 30 días seguidos' },
  { nombre: 'Misión imposible', clave: 'dificil1', icono: Skull, descripcion: 'Completa al menos 1 misión difícil' },
  { nombre: 'Productividad máxima', clave: '3diarias1dia', icono: Rocket, descripcion: 'Completa 3 misiones en un solo día' },
  { nombre: 'Imparable', clave: 'racha7', icono: Repeat, descripcion: 'Completa misiones durante 7 días seguidos' },
]

const esDesbloqueado = (logro) => logrosDesbloqueados.value.some(r => r.id === logro.clave)

const cargarLogros = async () => {
  try {
    const data = await apiFetch('/user/rewards')
    logrosDesbloqueados.value = data || []
  } catch (error) {
    console.error('Error al cargar logros:', error)
    toast.error('No se pudieron cargar los logros', { autoClose: 3000 })
  }
}

onMounted(cargarLogros)
</script>