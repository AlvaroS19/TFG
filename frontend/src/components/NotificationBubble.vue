<template>
  <transition-group name="bubble" tag="div" class="fixed bottom-6 right-6 flex flex-col gap-3 z-50">
    <div
      v-for="(n, index) in notificaciones"
      :key="index"
      class="px-4 py-3 rounded-xl shadow-lg bg-[#1F2937] text-[#F5F0E1] w-72 animate-slide-in"
    >
      <p class="text-sm">{{ n }}</p>
    </div>
  </transition-group>
</template>

<script setup>
import { ref } from 'vue'

const notificaciones = ref([])

const mostrarNotificacion = (msg) => {
  notificaciones.value.push(msg)

  // Quitarla automáticamente después de 5 segundos
  setTimeout(() => {
    notificaciones.value.shift()
  }, 5000)
}

// Exportar para que otros la puedan usar
defineExpose({ mostrarNotificacion })
</script>

<style scoped>
.bubble-enter-active,
.bubble-leave-active {
  transition: all 0.5s ease;
}
.bubble-enter-from {
  opacity: 0;
  transform: translateY(20px);
}
.bubble-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>