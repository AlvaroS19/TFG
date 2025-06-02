<template>
  <div class="p-4 text-[#F5F0E1] bg-[#0A1A2F] min-h-screen overflow-y-auto">
    <h1 class="text-2xl font-bold mb-2">¡Bienvenido a tu Dashboard!</h1>
    <UserStatsBar :level="stats.level" :xp="stats.xp" />
    
    <h2 class="text-xl font-bold mt-6 mb-2">Misiones activas</h2>

    <div class="max-h-[90vh] overflow-y-auto space-y-4">
      <template v-if="misiones.length">
        <MissionCard
          v-for="m in misiones"
          :key="m.id"
          :titulo="m.titulo"
          :descripcion="m.descripcion"
          :dificultad="m.dificultad"
          :categoria="m.categoria"
          :xp="m.xp"
          @completar="completarMision(m.id)"
        />
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
import { getUserConfig } from '../services/user';
import MissionCard from '../components/MissionCard.vue';
import UserStatsBar from '../components/UserStatsBar.vue';

let misionesVerificadasHoy = false;

interface Mission {
  id: string;
  titulo: string;
  descripcion: string;
  categoria: string;
  dificultad: string;
  xp: number;
  completada?: boolean;
  generatedAt?: string;
}

const stats = ref({ xp: 0, level: 1 });
const todasMisiones = ref<Mission[]>([]);
const misiones = ref<Mission[]>([]);
const index = ref(0);
const batchSize = 10;
const sentinel = ref<HTMLElement | null>(null);
let observer: IntersectionObserver;

const cargarStats = async () => {
  try {
    const token = getCookie('idToken');
    const res = await fetch('http://localhost:5000/user/stats', {
      headers: { Authorization: `Bearer ${token}` },
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

const cargarMisiones = async () => {
  try {
    const token = getCookie('idToken');
    const res = await fetch('http://localhost:5000/missions/', {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();
    
    const misionesRecibidas = Array.isArray(data.misiones)
      ? data.misiones
      : [];
    console.log('🔍 Misiones crudas desde backend:', misionesRecibidas);

    const ahora = new Date();

    todasMisiones.value = misionesRecibidas
      .filter(m => {
        const completada = m.completada === true;
        const desbloqueada = !m.unlockAt || new Date(m.unlockAt) <= ahora;
        return !completada && desbloqueada;
      })
      .map((m, i) => ({
        ...m,
        id: m.id || `${m.titulo}-${m.generatedAt || i}`,
      }));

    misiones.value = [];
    index.value = 0;
    cargarMasMisiones();

    console.log('🧩 Misiones válidas recibidas:', todasMisiones.value);
  } catch (error) {
    console.error('❌ Error al cargar misiones:', error);
    todasMisiones.value = [];
  }
};

const cargarMasMisiones = () => {
  const siguiente = todasMisiones.value.slice(index.value, index.value + batchSize);
  const nuevas = siguiente.filter(m => !misiones.value.some(existing => existing.id === m.id));
  misiones.value.push(...nuevas);
  index.value += batchSize;
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
    body: JSON.stringify({ missionId: misionId }),
  });

  if (res.ok) {
    console.log('✅ Misión completada con éxito');
    misiones.value = misiones.value.filter(m => m.id !== misionId);
    await cargarStats();
  } else {
    console.error('❌ Error al completar misión');
  }
};

let misionesVerificadas = false;

onMounted(async () => {
  const token = getCookie('idToken');
  if (!token) {
    window.location.href = '/login';
    return;
  }

  await cargarStats();

  if (!misionesVerificadas) {
    await verificarMisiones();
    misionesVerificadas = true;
  }

  await verificarMisiones();
  await cargarMisiones();
  
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

const verificarMisiones = async () => {
  if (misionesVerificadasHoy) {
    console.log("🔁 Misiones ya verificadas hoy (evitando duplicado)");
    return;
  }

  const token = getCookie('idToken');
  try {
    const { objetivo } = await getUserConfig();

    const res = await fetch('http://localhost:5000/missions/test/verificar', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ objetivo })
    });

    if (res.ok) {
      console.log('✅ Verificación de misiones exitosa');
      misionesVerificadasHoy = true;
    } else {
      console.warn('⚠️ No se pudo verificar misiones');
    }
  } catch (error) {
    console.error('❌ Error al verificar misiones:', error);
  }
};


</script>