<template>
  <div class="flex flex-col items-center bg-[#0A1A2F] min-h-screen text-[#F5F0E1] p-6">
    <!-- Avatar circular -->
    <div class="w-24 h-24 rounded-full bg-[#F66B0E] mb-4 flex items-center justify-center text-4xl">
      👤
    </div>

    <!-- Nombre y email -->
    <h2 class="text-xl font-bold">{{ perfil.nickname || 'Nombre no configurado' }}</h2>
    <p class="text-sm text-[#F5F0E1]/70">{{ perfil.email || 'Correo no disponible' }}</p>
    <p class="text-sm text-[#FFC107] mt-1 mb-6">Nivel {{ perfil.level }} · {{ perfil.xp }} XP</p>

    <!-- Opciones -->
    <div class="w-full space-y-3">
      <ProfileOption icon="✏️" label="Editar perfil" @click="editarPerfil" />
      <ProfileOption icon="📊" label="Estadísticas" @click="$router.push('/user/stats')" />
      <ProfileOption icon="🎁" label="Recompensas" @click="$router.push('/rewards')" />
      <ProfileOption icon="📨" label="Invitar a un amigo" @click="invitarAmigo" />
      <ProfileOption icon="🚪" label="Cerrar sesión" @click="logout" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const perfil = ref({
  nickname: '',
  email: '',
  level: 1,
  xp: 0
})

const router = useRouter()

const cargarPerfil = async () => {
  const token = localStorage.getItem('idToken')
  const res = await fetch('http://localhost:5000/user/stats', {
    headers: { Authorization: `Bearer ${token}` }
  })
  if (res.ok) {
    const data = await res.json()
    perfil.value = {
      nickname: data.nickname || '',
      email: data.email || '',
      level: data.level || 1,
      xp: data.xp || 0
    }
  }
}

const editarPerfil = () => {
  router.push('/profile/edit')
}

const invitarAmigo = () => {
  alert('🔗 Comparte esta app con tus amigos: fitquest.app/invite')
}

const logout = () => {
  localStorage.removeItem('idToken')
  router.push('/login')
}

onMounted(() => {
  cargarPerfil()
})
</script>
