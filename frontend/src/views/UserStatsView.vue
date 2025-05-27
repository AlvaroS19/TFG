<template>
  <div class="h-screen w-screen bg-background text-text flex flex-col items-center justify-center px-6">
    <h1 class="text-3xl font-bold mb-6">Tus estadísticas</h1>

    <div class="bg-text bg-opacity-10 rounded-xl px-6 py-4 w-full max-w-sm text-center">
      <p class="mb-2"><span class="font-semibold">Rol:</span> {{ stats.role }}</p>
      <p class="mb-2"><span class="font-semibold">Nivel:</span> {{ stats.level }}</p>
      <p class="mb-2"><span class="font-semibold">XP:</span> {{ stats.xp }}</p>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { getCookie } from '@/services/auth';

const stats = ref({ email: '', level: 0, xp: 0, role: '' })

onMounted(async () => {
  const token = getCookie('idToken');

  if (!token) {
    console.error('Error al cargar datos')
    return
  }

  try {
    const res = await fetch('http://localhost:5000/auth/stats', {
      headers: { Authorization: `Bearer ${token}` },
    })
    const data = await res.json()

    if (!res.ok) throw new Error(data.error)
    stats.value = data
  } catch (err) {
    console.error('Error al cargar datos')
  }
})
</script>
