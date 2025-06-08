<template>
  <div class="h-screen w-screen bg-background flex flex-col items-center justify-center px-6 text-text overflow-hidden">
    <!-- Logo -->
    <img src="@/assets/logo.png" alt="FitQuest Logo" class="w-49 mb-18" />

    <!-- Slogan -->
    <p class="text-lg italic text-center mb-10">
      Convierte tu ejercicio en una aventura diaria
    </p>

    <!-- Botones -->
    <div class="w-full max-w-xs flex flex-col gap-4">
      <BaseButton @click="$router.push('/login')">
        Iniciar sesión
      </BaseButton>
      <BaseButton outlined @click="$router.push('/register')">
        Registrarse
      </BaseButton>
    </div>
  </div>
</template>

<script setup>
import BaseButton from '../components/BaseButton.vue'
</script>
