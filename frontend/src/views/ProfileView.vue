<template>
  <div class="flex flex-col items-center bg-background min-h-screen text-text p-6">
    <div v-if="cargando" class="flex items-center justify-center py-20">
      <span class="text-sm text-info">Cargando perfil...</span>
    </div>

    <template v-else>
      <!-- Avatar -->
      <div
        class="w-20 h-20 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center text-3xl font-bold text-primary mb-4">
        {{ (perfil.nickname || '?').charAt(0).toUpperCase() }}
      </div>

      <!-- Nickname editable -->
      <div class="text-center mb-2 w-full max-w-xs">
        <input v-if="editando" v-model="perfil.nickname" placeholder="Tu apodo"
          class="w-full text-xl text-center font-bold bg-surface border border-text/30 rounded px-3 py-1" />
        <h2 v-else class="text-xl font-bold truncate">{{ perfil.nickname || 'Nombre no configurado' }}</h2>
      </div>

      <!-- Objetivo editable -->
      <div class="w-full max-w-xs mb-4">
        <select v-if="editando" v-model="perfil.goal"
          class="w-full bg-surface text-white rounded px-2 py-1 border border-text/30">
          <option value="">Selecciona objetivo</option>
          <option value="fuerza">Fuerza</option>
          <option value="resistencia">Resistencia</option>
          <option value="tonificación">Tonificación</option>
          <option value="salud">Salud</option>
        </select>
        <p v-else class="text-sm text-warning text-center flex items-center justify-center gap-1">
          <Target :size="14" /> Objetivo: {{ perfil.goal || 'No establecido' }}
        </p>
      </div>

      <div class="w-full max-w-xs mb-4">
        <select v-if="editando" v-model="perfil.nivel"
          class="w-full bg-surface text-white rounded px-2 py-1 border border-text/30">
          <option value="">Selecciona nivel</option>
          <option value="fácil">Principiante</option>
          <option value="media">Intermedio</option>
          <option value="difícil">Avanzado</option>
        </select>
        <p v-else class="text-sm text-info text-center flex items-center justify-center gap-1">
          <Gauge :size="14" /> Nivel: {{ perfil.nivel === 'fácil' ? 'Principiante' : perfil.nivel === 'media' ?
            'Intermedio' : perfil.nivel === 'difícil' ? 'Avanzado' : 'No establecido' }}
        </p>
      </div>

      <!-- XP y Nivel -->
      <p class="text-sm text-info mb-6 text-center flex items-center gap-1">
        <TrendingUp :size="14" /> Nivel <strong>{{ perfil.level }}</strong> · <strong>{{ perfil.xp }}</strong> XP
      </p>

      <!-- Botones -->
      <div class="w-full space-y-3 max-w-sm">
        <BaseButton :icon="editando ? Save : Pencil" @click="toggleEditar">
          {{ editando ? 'Guardar cambios' : 'Editar perfil' }}
        </BaseButton>

        <BaseButton v-if="editando" :icon="X" variant="secondary" @click="cancelarEdicion">
          Cancelar
        </BaseButton>

        <BaseButton :icon="Gift" variant="secondary" @click="$router.push('/rewards')">
          Ver recompensas
        </BaseButton>

        <BaseButton :icon="LogOut" variant="danger" @click="logout">
          Cerrar sesión
        </BaseButton>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Target, TrendingUp, Gauge, Pencil, Save, X, Gift, LogOut } from 'lucide-vue-next'
import { notifySuccess, notifyError } from '../utils/toastNotify'
import BaseButton from '../components/BaseButton.vue'
import { apiFetch } from '../services/api';

const router = useRouter()
const editando = ref(false)
const perfil = ref({
  nickname: '',
  email: '',
  goal: '',
  nivel: '',
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
      nivel: data.difficulty || '',
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
      headers: { 'Content-Type': 'application/json' },
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
  body: JSON.stringify({
    nickname: perfil.value.nickname.trim(),
    objetivo: perfil.value.goal,
    nivel: perfil.value.nivel
  })
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