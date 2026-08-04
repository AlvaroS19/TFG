<template>
  <div class="min-h-screen w-screen bg-background text-text flex flex-col justify-center items-center px-6">
    <h1 class="text-2xl font-bold mb-6 text-center">Restablecer contraseña</h1>

    <form @submit.prevent="handleReset" class="w-full max-w-xs flex flex-col gap-4">
      <BaseInput
        label="Correo electrónico"
        v-model="email"
        type="email"
        placeholder="tú@correo.com"
        autocomplete="email"
        :error="emailError"
      />

      <BaseButton type="submit">Enviar enlace</BaseButton>
    </form>

    <p class="text-sm mt-6">
      ¿Ya la recuerdas?
      <span class="text-primary font-semibold underline cursor-pointer" @click="$router.push('/login')">
        Inicia sesión
      </span>
    </p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import BaseInput from '../components/BaseInput.vue'
import BaseButton from '../components/BaseButton.vue'
import { notifySuccess, notifyError } from '../utils/toastNotify'

const email = ref('')
const emailError = ref('')

const isValidEmail = (mail) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail)

const handleReset = async () => {
  emailError.value = ''

  if (!isValidEmail(email.value)) {
    emailError.value = 'Introduce un correo válido'
    return
  }

  // Aquí se haría la llamada real a backend o Firebase.
  notifySuccess('Si existe una cuenta con ese correo, se ha enviado un enlace de recuperación')
}
</script>