<template>
  <nav class="fixed bottom-0 left-0 w-full bg-white dark:bg-background shadow-lg z-50 border-t border-gray-200 dark:border-zinc-700 rounded-t-3xl pt-2">
    <ul class="flex justify-around items-center h-20 px-4">
      <li v-for="item in navItems" :key="item.route">
        <button
          @click="router.push(item.route)"
          class="flex flex-col items-center justify-center text-xs transition-all duration-300 hover:scale-105 active:scale-95"
        >
          <component
            :is="item.icon"
            :class="[
              'w-6 h-6 transition-all duration-200 mb-1',
              route.path === item.route ? 'text-primary scale-110 drop-shadow-sm' : 'text-gray-400'
            ]"
          />
          <span :class="route.path === item.route ? 'text-primary font-medium' : 'text-gray-400'">
            {{ item.label }}
          </span>
        </button>
      </li>
    </ul>
  </nav>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router'
import { Home, Target, User, Trophy } from 'lucide-vue-next'

const router = useRouter()
const route = useRoute()

const navItems = [
  { label: 'Inicio', route: '/dashboard', icon: Home },
  { label: 'Misiones', route: '/missions', icon: Target },
  { label: 'Logros', route: '/achievements', icon: Trophy },
  { label: 'Perfil', route: '/profile', icon: User },
]
</script>

<style scoped>
nav {
  border-top-left-radius: 1.5rem;
  border-top-right-radius: 1.5rem;
}
button:focus {
  outline: none;
}
</style>
