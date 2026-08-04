<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { apiFetch } from '../services/api';

const progreso = ref<any[]>([])

const cargarProgreso = async () => {
  const res = await apiFetch('/user/progress', {
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
