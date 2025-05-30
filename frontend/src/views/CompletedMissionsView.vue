<template>
  <div class="min-h-screen bg-[#0A1A2F] text-[#F5F0E1] p-4">
    <h1 class="text-2xl font-bold text-center mb-4">🏁 Misiones completadas</h1>

    <div v-if="completadas.length" class="space-y-4">
      <div
        v-for="(m, i) in completadas"
        :key="i"
        class="border border-[#F66B0E] rounded-xl p-4 bg-[#111827]"
      >
        <h2 class="font-bold text-[#FFC107]">{{ m.titulo || 'Misión sin título' }}</h2>
        <p class="text-sm text-[#F5F0E1]/70">
          {{ m.descripcion }}<br />
          <span class="text-[#A5B4FC]">Tipo:</span> {{ m.categoria || m.tipo }} ·
          <span class="text-[#A5B4FC]">Dificultad:</span> {{ m.dificultad }} ·
          <span class="text-[#A5B4FC]">XP:</span> {{ m.xp || 0 }}
        </p>
        <p class="text-xs mt-1 text-[#F5F0E1]/50">
          📅 Completada: {{ formatFecha(m.completedAt) }}
        </p>
      </div>
    </div>

    <div v-else class="text-center text-[#F5F0E1]/50 mt-10 italic">
      Aún no has completado ninguna misión.
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const completadas = ref([]);

const formatFecha = (fecha) =>
  fecha ? new Date(fecha).toLocaleString() : 'Fecha desconocida';

const cargarCompletadas = async () => {
  try {
    const res = await fetch('http://localhost:5000/missions/completed', {
      credentials: 'include',
    });
    if (res.ok) {
      const data = await res.json();
      completadas.value = Array.isArray(data) ? data : [];
    } else {
      console.error('❌ Error al cargar misiones completadas');
    }
  } catch (error) {
    console.error('❌ Error inesperado:', error);
  }
};

onMounted(cargarCompletadas);
</script>