
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getCookie } from '../services/auth';
import { apiFetch } from '../services/api';

const progreso = ref<any[]>([])

const cargarProgreso = async () => {
  const token = getCookie('idToken');
  const res = await apiFetch('/user/progress', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (res.ok) {
    progreso.value = await res.json()
  } else {
    console.error('Error al cargar datos')
  }
}

onMounted(() => {
  cargarProgreso()
})
</script>
