<template>
  <div class="p-4 text-[#F5F0E1] bg-[#0A1A2F] min-h-screen overflow-y-auto">
    <h1 class="text-2xl font-bold mb-2">¡Bienvenido a tu Dashboard!</h1>
    <UserStatsBar :level="stats.level" :xp="stats.xp" />
    <h2 class="text-xl font-bold mb-2">Misiones activas</h2>
    <div class="max-h-[90vh] overflow-y-auto space-y-4">
      <template v-if="misiones.length">
        <MissionCard v-for="m in misiones" :key="m.id" :titulo="m.titulo" :descripcion="m.descripcion"
          :dificultad="m.dificultad" :categoria="m.categoria" :xp="m.xp" @completar="completarMision(m.id)" />
      </template>

      <template v-else>
        <div class="text-center text-[#F5F0E1]/60 italic mt-6">
          No tienes misiones activas por ahora. ¡Vuelve pronto para nuevas aventuras!
        </div>
      </template>
    </div>

    <div ref="sentinel" class="h-1"></div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import { getCookie } from '../services/auth';
import MissionCard from '../components/MissionCard.vue';
import UserStatsBar from '../components/UserStatsBar.vue';

const todasMisiones = ref<any[]>([]);
const misiones = ref<any[]>([]);
const batchSize = 10;
const index = ref(0);
const stats = ref({ xp: 0, level: 1 });

const cargarMasMisiones = () => {
  const siguienteBloque = todasMisiones.value.slice(index.value, index.value + batchSize);
  const nuevas = siguienteBloque.filter(m => !misiones.value.some(existe => existe.id === m.id));
  misiones.value.push(...nuevas);
  index.value += batchSize;
};

const cargarMisiones = async () => {
  try {
    const token = getCookie('idToken');
    const res = await fetch('http://localhost:5000/missions/', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    const misionesRecibidas = Array.isArray(data)
      ? data
      : Array.isArray(data.misiones)
        ? data.misiones
        : [];

    todasMisiones.value = misionesRecibidas
      .filter(m => !m.completada)
      .map((m, i) => ({
        ...m,
        id: m.id || `${m.titulo}-${m.generatedAt || i}`,
      }));

    misiones.value = [];
    index.value = 0;
    cargarMasMisiones();
    console.log('🧩 Misiones recibidas:', todasMisiones.value);
  } catch (error) {
    console.error('❌ Error al cargar misiones:', error);
    todasMisiones.value = [];
  }
};

const cargarStats = async () => {
  try {
    const token = getCookie('idToken');
    const res = await fetch('http://localhost:5000/user/stats', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.ok) {
      stats.value = await res.json();
    } else {
      console.error('❌ Error al cargar stats del usuario');
    }
  } catch (error) {
    console.error('❌ Error en stats:', error);
  }
};

const completarMision = async (misionId: string) => {
  const token = getCookie('idToken');
  const mision = misiones.value.find(m => m.id === misionId);
  if (!mision) return;

  const res = await fetch('http://localhost:5000/missions/complete', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      missionId: misionId, // ahora usas el ID directamente
    }),
  });

  if (res.ok) {
    console.log('✅ Misión completada con éxito');
    misiones.value = misiones.value.filter(m => m.id !== misionId);
    await cargarStats();
  } else {
    console.error('❌ Error al completar misión');
  }
};

const sentinel = ref(null);
let observer: IntersectionObserver;

onMounted(async () => {
  const token = getCookie('idToken');
  console.log('🪪 Token al montar dashboard:', token);

  if (!token) {
    console.warn('⚠️ No hay token, redirigiendo a login...');
    window.location.href = '/login';
    return;
  }

  await cargarMisiones();
  await cargarStats();

  // configurar IntersectionObserver
  observer = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      cargarMasMisiones();
    }
  });

  if (sentinel.value) observer.observe(sentinel.value);
});

onUnmounted(() => {
  if (sentinel.value && observer) observer.unobserve(sentinel.value);
});
</script>