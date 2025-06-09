<template>
  <Transition name="slide">
    <aside
      v-if="isSidebarOpen"
      class="fixed top-0 left-0 w-64 h-full bg-white dark:bg-background shadow-lg z-50 flex flex-col p-4"
    >
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-lg font-semibold text-text">Menú</h2>
        <button @click="isSidebarOpen = false">
          <X class="w-6 h-6 text-text" />
        </button>
      </div>

      <ul class="flex flex-col gap-4">
        <li v-for="item in links" :key="item.route">
          <button
            @click="navigate(item.route)"
            class="flex items-center gap-2 text-sm text-left text-text w-full hover:text-primary transition"
          >
            <component :is="item.icon" class="w-5 h-5" />
            {{ item.label }}
          </button>
        </li>
      </ul>

      <button
        @click="logout"
        class="mt-auto text-sm text-left text-red-500 hover:underline"
      >
        Cerrar sesión
      </button>
    </aside>
  </Transition>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { X, Gift, Trophy, Target } from 'lucide-vue-next'
import { toast } from 'vue3-toastify'
import { getCookie } from '@/services/auth'
import { isSidebarOpen } from '@/composables/useSidebar' // 👈 global reactive

const router = useRouter()

const links = [
  { label: 'Misiones completadas', route: '/missions/completed', icon: Target },
  { label: 'Estadísticas', route: '/user/stats', icon: Trophy },
  { label: 'Recompensas', route: '/rewards', icon: Gift },
]

function navigate(routePath) {
  isSidebarOpen.value = false // ✅ cerrar sidebar global
  router.push(routePath)
}

function logout() {
  document.cookie = 'idToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC'
  const token = getCookie('idToken')
  toast('Sesión cerrada correctamente', { type: 'success' })
  router.push('/login')
}
</script>
<style scoped>
.slide-enter-active, .slide-leave-active {
  transition: transform 0.3s ease;
}
.slide-enter-from {
  transform: translateX(-100%);
}
.slide-enter-to, .slide-leave-from {
  transform: translateX(0);
}
.slide-leave-to {
  transform: translateX(-100%);
}
</style>
