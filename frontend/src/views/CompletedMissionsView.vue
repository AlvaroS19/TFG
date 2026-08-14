<template>
  <div class="min-h-screen bg-background text-text p-4">
    <h1 class="text-2xl font-bold text-center mb-4 flex items-center justify-center gap-2">
      <Flag :size="24" class="text-primary" /> Misiones completadas
    </h1>
    <p class="text-center text-sm mb-6 text-text/70">
      Total: <strong>{{ totalCompletadas }}</strong> misiones completadas
    </p>

    <div v-if="agrupadas.length" class="space-y-8">
      <div v-for="(grupo, index) in agrupadas" :key="index">
        <h2 class="text-lg font-semibold mb-2 text-primary">{{ grupo.fecha }}</h2>

        <div v-for="(m, i) in grupo.misiones" :key="i" class="border border-primary rounded-xl p-4 bg-surface">
          <h3 class="font-bold text-warning">{{ m.titulo || 'Misión sin título' }}</h3>
          <p class="text-sm text-text/70">
            {{ m.descripcion }}<br />
            <span class="text-info">Tipo:</span> {{ m.categoria || m.tipo }} ·
            <span class="text-info">Dificultad:</span> {{ m.dificultad }} ·
            <span class="text-info">XP:</span> {{ m.xp || 0 }}
          </p>
        </div>
      </div>
    </div>

    <div v-else class="text-center text-text/50 mt-10 italic">
      Aún no has completado ninguna misión.
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { Flag } from 'lucide-vue-next'
import { apiFetch } from '../services/api';

const completadas = ref([]);
const totalCompletadas = computed(() => completadas.value.length);

const cargarCompletadas = async () => {
  try {
    const data = await apiFetch('/missions/completed');
    completadas.value = Array.isArray(data?.misiones) ? data.misiones : [];
  } catch (error) {
    console.error('Error al cargar misiones completadas:', error);
  }
};

const agrupadas = computed(() => {
  const grupos = {};
  completadas.value.forEach(m => {
    const fecha = m.completedAt
      ? new Date(m.completedAt).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })
      : 'Fecha desconocida';
    if (!grupos[fecha]) grupos[fecha] = [];
    grupos[fecha].push(m);
  });
  return Object.entries(grupos).map(([fecha, misiones]) => ({ fecha, misiones }));
});

onMounted(cargarCompletadas);
</script>