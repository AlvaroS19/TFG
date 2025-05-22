<template>
  <div class="h-screen w-screen bg-background text-text flex flex-col justify-center items-center px-6">
    <!-- Logo (opcional) -->
    <img src="@/assets/logo.png" alt="FitQuest Logo" class="w-32 mb-6" />

    <h1 class="text-3xl font-bold mb-4 text-center">Crear cuenta</h1>

    <form @submit.prevent="handleRegister" class="w-full max-w-xs flex flex-col gap-4">
      <!-- email -->
      <BaseInput label="Email" v-model="email" type="email" placeholder="tú@correo.com" />
      <p v-if="emailError" class="text-red-500 text-sm -mt-2">{{ emailError }}</p>

      <!-- contraseña -->
      <div class="relative w-full">
        <BaseInput
          label="Contraseña"
          v-model="password"
          :type="showPassword ? 'text' : 'password'"
          placeholder="Mínimo 8 caracteres"
        />
        <button
          type="button"
          @click="showPassword = !showPassword"
          class="absolute right-3 top-9 text-primary"
        >
          <component :is="showPassword ? EyeOff : Eye" class="w-5 h-5" />
        </button>
      </div>
      <p v-if="passwordError" class="text-red-500 text-sm -mt-2">{{ passwordError }}</p>

      <!-- repetir -->
      <div class="relative w-full">
        <BaseInput
          label="Repetir contraseña"
          v-model="repeatPassword"
          :type="showRepeat ? 'text' : 'password'"
          placeholder="Confirma tu contraseña"
        />
        <button
          type="button"
          @click="showRepeat = !showRepeat"
          class="absolute right-3 top-9 text-primary"
        >
          <component :is="showRepeat ? EyeOff : Eye" class="w-5 h-5" />
        </button>
      </div>
      <p v-if="repeatError" class="text-red-500 text-sm -mt-2">{{ repeatError }}</p>

      <BaseButton type="submit">Registrarse</BaseButton>
    </form>

    <p class="text-sm mt-6">
      ¿Ya tienes cuenta?
      <span class="text-primary font-semibold underline" @click="$router.push('/login')">Inicia sesión</span>
    </p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { toast } from 'vue3-toastify'
import { Eye, EyeOff } from 'lucide-vue-next'

import BaseInput from '@/components/BaseInput.vue'
import BaseButton from '@/components/BaseButton.vue'
import { registerUser } from '@/services/auth'

const router = useRouter()

const email = ref('')
const password = ref('')
const repeatPassword = ref('')
const showPassword = ref(false)
const showRepeat = ref(false)

const emailError = ref('')
const passwordError = ref('')
const repeatError = ref('')

function isValidEmail(mail) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return regex.test(mail)
}

function isValidPassword(pwd) {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/
  return regex.test(pwd)
}

async function handleRegister() {
  emailError.value = ''
  passwordError.value = ''
  repeatError.value = ''

  let valid = true

  if (!isValidEmail(email.value)) {
    emailError.value = 'Introduce un correo válido'
    valid = false
  }

  if (!isValidPassword(password.value)) {
    passwordError.value = 'Debe tener al menos 8 caracteres, mayúscula y número'
    valid = false
  }

  if (password.value !== repeatPassword.value) {
    repeatError.value = 'Las contraseñas no coinciden'
    valid = false
  }

  if (!valid) return

  try {
    await registerUser(email.value, password.value)
    toast.success('¡Usuario registrado correctamente!')
    router.push('/login')
  } catch (err) {
    toast.error(err.message || 'Error al registrar usuario')
  }
}
</script>
