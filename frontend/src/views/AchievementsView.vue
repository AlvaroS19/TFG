<template>
  <div class="min-h-screen bg-[#0A1A2F] text-[#F5F0E1] p-6">
    <h1 class="text-2xl font-bold mb-6 text-center">🏆 Tus logros</h1>

    <div class="space-y-4">
      <div
        v-for="(logro, index) in TODOS_LOS_LOGROS"
        :key="index"
        class="bg-[#112233] border rounded-xl p-4 flex gap-4"
        :class="esDesbloqueado(logro) ? 'border-[#F66B0E]' : 'border-[#888]'"
      >
        <!-- Icono -->
        <div class="text-3xl flex-shrink-0">
          {{ esDesbloqueado(logro) ? logro.nombre.split(' ')[0] : '🔒' }}
        </div>

        <!-- Texto -->
        <div class="flex flex-col">
          <span :class="['text-lg font-semibold', esDesbloqueado(logro) ? 'text-[#FFC107]' : 'text-gray-500']">
            {{ logro.nombre }}
          </span>
          <span class="text-sm text-[#F5F0E1]/70">{{ logro.descripcion }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const logrosDesbloqueados = ref([])

const TODOS_LOS_LOGROS = [
  {
    nombre: '🟢 Primeros pasos',
    clave: 'Primeros pasos',
    descripcion: 'Completa tu primera misión'
  },
  {
    nombre: '🟡 Subiendo de nivel',
    clave: 'nivel',
    descripcion: 'Alcanza al menos 100 XP'
  },
  {
    nombre: '🔥 Constancia',
    clave: 'Constancia',
    descripcion: 'Completa al menos 5 misiones'
  },
  {
    nombre: '🏆 Pro en camino',
    clave: 'Pro',
    descripcion: 'Llega al nivel 3 o superior'
  }
]

const cargarLogros = async () => {
  const token = localStorage.getItem('idToken')
  const res = await fetch('http://localhost:5000/user/rewards', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })

  if (res.ok) {
    const data = await res.json()
    logrosDesbloqueados.value = data.rewards || []
  } else {
    console.error('Error al cargar logros')
  }
}

const esDesbloqueado = (logro) => {
  return logrosDesbloqueados.value.some(l => l.includes(logro.clave))
}

onMounted(() => {
  cargarLogros()
})
</script>
