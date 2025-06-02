<template>
  <div class="flex flex-col items-center bg-[#0A1A2F] min-h-screen text-[#F5F0E1] p-6">
    <!-- Avatar -->
    <div class="w-24 h-24 rounded-full bg-[#F66B0E] mb-4 flex items-center justify-center text-4xl">
      👤
    </div>

    <!-- Editable: Nickname -->
    <div class="text-center mb-2">
      <template v-if="editando">
        <input
          v-model="perfil.nickname"
          class="text-xl text-center font-bold bg-[#112233] border border-[#F5F0E1]/30 rounded px-3 py-1"
        />
      </template>
      <template v-else>
        <h2 class="text-xl font-bold">{{ perfil.nickname || 'Nombre no configurado' }}</h2>
      </template>
    </div>

    <!-- Email (no editable) -->
    <p class="text-sm text-[#F5F0E1]/70">{{ perfil.email || 'Correo no disponible' }}</p>

    <!-- Editable: Objetivo -->
    <div class="mt-2 mb-6">
      <template v-if="editando">
        <select v-model="perfil.goal" class="bg-[#112233] text-white rounded px-2 py-1 border border-[#F5F0E1]/30">
          <option value="">Selecciona objetivo</option>
          <option value="fuerza">Fuerza</option>
          <option value="resistencia">Resistencia</option>
          <option value="tonificación">Tonificación</option>
          <option value="salud">Salud</option>
        </select>
      </template>
      <template v-else>
        <p class="text-sm text-[#FFC107]">🎯 Objetivo: {{ perfil.goal || 'No establecido' }}</p>
      </template>
    </div>

    <!-- XP y nivel -->
    <p class="text-sm text-[#A5B4FC] mb-6">Nivel {{ perfil.level }} · {{ perfil.xp }} XP</p>

    <!-- Botones -->
    <div class="w-full space-y-3 max-w-sm">
      <button
        @click="toggleEditar"
        class="w-full bg-[#F66B0E] text-white py-2 rounded hover:bg-[#e45e0d] transition"
      >
        {{ editando ? 'Guardar cambios' : 'Editar perfil' }}
      </button>

      <button @click="$router.push('/rewards')" class="w-full bg-[#1E3A8A] text-white py-2 rounded">
        Ver recompensas
      </button>

      <button @click="logout" class="w-full bg-[#DC2626] text-white py-2 rounded">
        Cerrar sesión
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getCookie } from '@/services/auth'
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'

const router = useRouter()
const editando = ref(false)

const perfil = ref({
  nickname: '',
  email: '',
  goal: '',
  xp: 0,
  level: 1
})

const cargarPerfil = async () => {
  const token = getCookie('idToken')
  const res = await fetch('http://localhost:5000/user/stats', {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (res.ok) {
    const data = await res.json()
    perfil.value = {
      nickname: data.nickname || '',
      email: data.email || '',
      goal: data.goal || '',
      xp: data.xp || 0,
      level: data.level || 1
    }
  }
}

const toggleEditar = async () => {
  if (!editando.value) {
    editando.value = true
    return
  }

  if (!perfil.value.nickname.trim() || !perfil.value.goal) {
    toast.error('⚠️ Rellena todos los campos antes de guardar')
    return
  }

  const token = getCookie('idToken')
  const res = await fetch('http://localhost:5000/user/config', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      nickname: perfil.value.nickname.trim(),
      objetivo: perfil.value.goal
    }),
  })

  if (res.ok) {
    toast.success('✅ Perfil actualizado')
    editando.value = false
  } else {
    toast.error('❌ Error al guardar cambios')
  }
}

const logout = () => {
  localStorage.removeItem('idToken')
  router.push('/login')
}

onMounted(cargarPerfil)
</script>