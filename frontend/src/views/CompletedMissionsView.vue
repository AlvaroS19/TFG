<template>
  <div class="min-h-screen bg-[#0A1A2F] text-[#F5F0E1] p-4">
    <h1 class="text-2xl font-bold text-center mb-4">🏁 Misiones completadas</h1>
    <p class="text-center text-sm mb-6 text-[#F5F0E1]/70">
      Total: <strong>{{ totalCompletadas }}</strong> misiones completadas
    </p>

    <div v-if="agrupadas.length" class="space-y-8">
      <div v-for="(grupo, index) in agrupadas" :key="index">
        <h2 class="text-lg font-semibold mb-2 text-[#F66B0E]">{{ grupo.fecha }}</h2>

        <div v-for="(m, i) in grupo.misiones" :key="i" class="border border-[#F66B0E] rounded-xl p-4 bg-[#111827]">
          <h3 class="font-bold text-[#FFC107]">{{ m.titulo || 'Misión sin título' }}</h3>
          <p class="text-sm text-[#F5F0E1]/70">
            {{ m.descripcion }}<br />
            <span class="text-[#A5B4FC]">Tipo:</span> {{ m.categoria || m.tipo }} ·
            <span class="text-[#A5B4FC]">Dificultad:</span> {{ m.dificultad }} ·
            <span class="text-[#A5B4FC]">XP:</span> {{ m.xp || 0 }}
          </p>
        </div>
      </div>
    </div>

    <div v-else class="text-center text-[#F5F0E1]/50 mt-10 italic">
      Aún no has completado ninguna misión.
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { apiFetch } from '../services/api';

const completadas = ref([]);
const totalCompletadas = computed(() => completadas.value.length);

const cargarCompletadas = async () => {
  try {
    const res = await apiFetch('/missions/completed', {
      credentials: 'include',
    });

    if (res.ok) {
      const data = await res.json();
      completadas.value = Array.isArray(data.misiones) ? data.misiones : [];
    } else {
      console.error('❌ Error al cargar misiones completadas');
    }
  } catch (error) {
    console.error('❌ Error inesperado:', error);
  }
};

const agrupadas = computed(() => {
  const grupos = {};
  completadas.value.forEach(m => {
    const fecha = m.completedAt
      ? new Date(m.completedAt).toLocaleDateString()
      : 'Fecha desconocida';

    if (!grupos[fecha]) grupos[fecha] = [];
    grupos[fecha].push(m);
  });

  return Object.entries(grupos).map(([fecha, misiones]) => ({
    fecha,
    misiones,
  }));
});

onMounted(cargarCompletadas);
</script>