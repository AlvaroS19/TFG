<template>
  <div class="min-h-screen bg-[#0A1A2F] text-[#F5F0E1] p-4">
    <h1 class="text-2xl font-bold text-center mb-6">✅ Misiones completadas</h1>

    <div v-if="completadas.length" class="space-y-4">
      <CompletedMissionCard
        v-for="(m, i) in completadas"
        :key="i"
        :titulo="m.titulo || m.description"
        :descripcion="m.description || '-'"
        :dificultad="m.dificultad || '—'"
        :categoria="m.type || '—'"
        :xp="m.xp || 0"
      />
    </div>

    <div v-else class="text-center text-[#F5F0E1]/70 mt-10">
      Aún no has completado ninguna misión.
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import CompletedMissionCard from '@/components/CompletedMissionCard.vue'

const completadas = ref([])

const cargarCompletadas = async () => {
  try {
    const res = await fetch('/missions/completed', {
      method: 'GET',
      credentials: 'include' // ✅ necesario para que se envíen cookies
    });

    if (res.ok) {
      const data = await res.json();
      completadas.value = data.completed || [];
    } else {
      console.error('❌ Error al cargar misiones completadas');
    }
  } catch (err) {
    console.error('❌ Error de red:', err);
  }
}

onMounted(cargarCompletadas)
</script>