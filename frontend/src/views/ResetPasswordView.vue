<template>
  <div class="h-screen w-screen bg-background text-text flex flex-col justify-center items-center px-6">
    <h1 class="text-2xl font-bold mb-6 text-center">Restablecer contraseña</h1>

    <form @submit.prevent="handleReset" class="w-full max-w-xs flex flex-col gap-4">
      <BaseInput
        label="Correo electrónico"
        v-model="email"
        type="email"
        placeholder="tú@correo.com"
      />
      <p v-if="emailError" class="text-red-500 text-sm -mt-2">{{ emailError }}</p>

      <BaseButton type="submit">Enviar enlace</BaseButton>
    </form>

    <p class="text-sm mt-6">
      ¿Ya la recuerdas?
      <span class="text-primary font-semibold underline" @click="$router.push('/login')">Inicia sesión</span>
    </p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import BaseInput from '@/components/BaseInput.vue'
import BaseButton from '@/components/BaseButton.vue'

const email = ref('')
const emailError = ref('')

function isValidEmail(mail) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return regex.test(mail)
}

function handleReset() {
  emailError.value = ''

  if (!isValidEmail(email.value)) {
    emailError.value = 'Introduce un correo válido'
    return
  }

  // Simulación: aquí iría la llamada a backend o Firebase
  console.log('Operación completada')
}
</script>
