<template>
  <div class="flex flex-col items-center bg-background min-h-screen text-text p-6">
    <div v-if="cargando" class="flex items-center justify-center py-20">
      <span class="text-sm text-info">Cargando perfil...</span>
    </div>

    <template v-else>
    <!-- Nickname editable -->
    <div class="text-center mb-2 w-full max-w-xs">
      <input
        v-if="editando"
        v-model="perfil.nickname"
        placeholder="Tu apodo"
        class="w-full text-xl text-center font-bold bg-surface border border-text/30 rounded px-3 py-1"
      />
      <h2 v-else class="text-xl font-bold truncate">{{ perfil.nickname || 'Nombre no configurado' }}</h2>
    </div>

    <!-- Objetivo editable -->
    <div class="w-full max-w-xs mb-4">
      <select
        v-if="editando"
        v-model="perfil.goal"
        class="w-full bg-surface text-white rounded px-2 py-1 border border-text/30"
      >
        <option value="">Selecciona objetivo</option>
        <option value="fuerza">Fuerza</option>
        <option value="resistencia">Resistencia</option>
        <option value="tonificación">Tonificación</option>
        <option value="salud">Salud</option>
      </select>
      <p v-else class="text-sm text-warning text-center">
        🎯 Objetivo: {{ perfil.goal || 'No establecido' }}
      </p>
    </div>

    <!-- XP y Nivel -->
    <p class="text-sm text-info mb-6 text-center">
      Nivel <strong>{{ perfil.level }}</strong> · <strong>{{ perfil.xp }}</strong> XP
    </p>

    <!-- Botones -->
    <div class="w-full space-y-3 max-w-sm">
      <button
        @click="toggleEditar"
        class="w-full bg-primary text-white py-2 rounded hover:bg-[#e45e0d] transition"
      >
        {{ editando ? 'Guardar cambios' : 'Editar perfil' }}
      </button>

      <button
        v-if="editando"
        @click="cancelarEdicion"
        class="w-full bg-[#374151] text-white py-2 rounded hover:bg-[#4b5563] transition"
      >
        Cancelar
      </button>

      <button @click="$router.push('/rewards')" class="w-full bg-[#1E3A8A] text-white py-2 rounded">
        Ver recompensas
      </button>

      <button @click="logout" class="w-full bg-[#DC2626] text-white py-2 rounded">
        Cerrar sesión
      </button>
    </div>
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { notifySuccess, notifyError } from '../utils/toastNotify'
import { apiFetch } from '../services/api';

const router = useRouter()
const editando = ref(false)
const perfil = ref({
  nickname: '',
  email: '',
  goal: '',
  xp: 0,
  level: 1
})
const cargando = ref(true)
const perfilOriginal = ref({})

const cargarPerfil = async () => {
  try {
    const data = await apiFetch('/user/stats')

    perfil.value = {
      nickname: data.nickname || '',
      email: data.email || '',
      goal: data.goal || '',
      xp: data.xp || 0,
      level: data.level || 1
    }
    perfilOriginal.value = { ...perfil.value }
  } catch (err) {
    notifyError('Error al cargar perfil')
    console.error(err)
  } finally {
    cargando.value = false
  }
}

const toggleEditar = async () => {
  if (!editando.value) {
    editando.value = true
    return
  }

  if (!perfil.value.nickname.trim() || !perfil.value.goal) {
    notifyError('Rellena todos los campos antes de guardar')
    return
  }
  
  try {
    await apiFetch('/user/config', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        nickname: perfil.value.nickname.trim(),
        objetivo: perfil.value.goal
      })
    })

    notifySuccess('Perfil actualizado')
    editando.value = false
    perfilOriginal.value = { ...perfil.value }
  } catch (err) {
    notifyError('Error al guardar cambios')
    console.error(err)
  }
}

const cancelarEdicion = () => {
  perfil.value = { ...perfilOriginal.value }
  editando.value = false
}

const logout = () => {
  localStorage.removeItem('idToken')
  router.push('/login')
}

onMounted(cargarPerfil)
</script>