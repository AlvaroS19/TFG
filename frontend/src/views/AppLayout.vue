<template>
  <div class="min-h-screen w-screen bg-background text-text flex flex-col pb-16">
    <header class="flex items-center justify-between p-4">
      <button @click="toggleSidebar(true)">
        <Menu class="w-6 h-6 text-text" />
      </button>
    </header>

    <router-view />
    <BottomNav />
    <Sidebar />
  </div>
</template>

<script setup>
import BottomNav from '../components/BottomNav.vue'
import Sidebar from '../components/Sidebar.vue'
import { toggleSidebar } from '../composables/useSidebar'
import { Menu } from 'lucide-vue-next'
</script>
