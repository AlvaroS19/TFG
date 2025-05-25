<template>
  <div class="p-4 min-h-screen bg-[#0A1A2F] text-[#F5F0E1]">
    <h1 class="text-2xl font-bold mb-4">Perfil de Usuario</h1>

    <form @submit.prevent="guardarPerfil" class="space-y-4">
      <input v-model="perfil.nickname" placeholder="Nombre" class="w-full p-2 bg-[#112233] border border-[#F66B0E] rounded" />
      <input v-model.number="perfil.edad" type="number" placeholder="Edad" class="w-full p-2 bg-[#112233] border border-[#F66B0E] rounded" />
      <input v-model.number="perfil.altura" type="number" placeholder="Altura (cm)" class="w-full p-2 bg-[#112233] border border-[#F66B0E] rounded" />
      <input v-model.number="perfil.peso" type="number" placeholder="Peso (kg)" class="w-full p-2 bg-[#112233] border border-[#F66B0E] rounded" />

      <select v-model="perfil.objetivo" class="w-full p-2 bg-[#112233] border border-[#F66B0E] rounded">
        <option value="">Selecciona tu objetivo</option>
        <option value="definir">Definir</option>
        <option value="tonificar">Tonificar</option>
        <option value="resistencia">Resistencia</option>
        <option value="fuerza">Fuerza</option>
        <option value="mantenerse">Solo hacer ejercicio</option>
      </select>

      <button type="submit" class="bg-[#F66B0E] px-4 py-2 rounded text-[#0A1A2F] font-bold">Guardar Cambios</button>
    </form>

    <p v-if="mensaje" class="mt-4 text-green-400 font-semibold">{{ mensaje }}</p>
    <p v-if="error" class="mt-4 text-red-400 font-semibold">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const perfil = ref({
  nickname: '',
  edad: null,
  altura: null,
  peso: null,
  objetivo: '',
})

const mensaje = ref('')
const error = ref('')

const cargarPerfil = async () => {
  const token = localStorage.getItem('idToken')

  const res = await fetch('http://localhost:5000/user/stats', {
    headers: {Authorization: `Bearer ${token}`},
  })

  if (res.ok) {
    const data = await res.json()
    perfil.value = data
  } else {
    error.value = '❌ Error al cargar datos'
  }
}

const guardarPerfil = async () => {
  mensaje.value = ''
  error.value = ''

  const token = localStorage.getItem('idToken')

  const res = await fetch('http://localhost:5000/user/stats', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(perfil.value),
  })

  if (res.ok) {
    mensaje.value = '✅ Perfil actualizado correctamente'
  } else {
    error.value = '❌ Error al guardar cambios'
  }
}

onMounted(() => {
  cargarPerfil()
})
</script>
