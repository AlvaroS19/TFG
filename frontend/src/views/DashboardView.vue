<template>
  <div class="h-screen w-screen bg-background text-text relative">
    <div class="absolute top-4 right-4">
      <LogoutButton />
    </div>

    <div class="flex flex-col items-center justify-center h-full">
      <h1 class="text-2xl font-bold mb-6">¡Bienvenido al dashboard!</h1>
    </div>
  </div>
</template>


<script setup>
import bottomnav from '@/components/BottomNav.vue'
</script>
