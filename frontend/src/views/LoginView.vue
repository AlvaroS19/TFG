<template>
  <div class="h-screen w-screen bg-background text-text flex flex-col justify-center items-center px-6">
    <h1 class="text-3xl font-bold mb-6">Inicia sesión</h1>

    <form @submit.prevent="handleLogin" class="w-full max-w-xs flex flex-col gap-4">
      <BaseInput label="Email" v-model="email" type="email" placeholder="tú@correo.com" />
      <p v-if="emailError" class="text-red-500 text-sm -mt-2">{{ emailError }}</p>

      <div class="relative w-full">
        <BaseInput label="Contraseña" v-model="password" :type="showPassword ? 'text' : 'password'"
          placeholder="••••••••" />
        <button type="button" @click="showPassword = !showPassword" class="absolute right-3 top-9 text-primary">
          <component :is="showPassword ? EyeOff : Eye" class="w-5 h-5" />
        </button>
      </div>
      <p v-if="passwordError" class="text-red-500 text-sm -mt-2">{{ passwordError }}</p>


      <BaseButton type="submit">Entrar</BaseButton>
    </form>

    <p class="text-sm mt-6">
      ¿No tienes cuenta?
      <span class="text-primary font-semibold underline" @click="$router.push('/register')">Regístrate</span>
    </p>
    <p class="text-sm text-center mt-4">
      <span class="text-primary font-semibold underline" @click="$router.push('/reset-password')">
        ¿Has olvidado tu contraseña?
      </span>
    </p>

  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Eye, EyeOff } from 'lucide-vue-next'
import BaseInput from '@/components/BaseInput.vue'
import BaseButton from '@/components/BaseButton.vue'
import { toast } from 'vue3-toastify'

const email = ref('')
const password = ref('')
const showPassword = ref(false)

const emailError = ref('')
const passwordError = ref('')

function isValidEmail(mail) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return regex.test(mail)
}

function isValidPassword(pwd) {
  return pwd.length >= 8
}

function handleLogin() {
  emailError.value = ''
  passwordError.value = ''

  let valid = true

  if (!isValidEmail(email.value)) {
    emailError.value = 'Introduce un correo válido'
    valid = false
  }

  if (!isValidPassword(password.value)) {
    passwordError.value = 'La contraseña debe tener al menos 8 caracteres'
    valid = false
  }

  if (!valid) return

  toast.success('Login válido, redirigiendo...')
  // Aquí iría la llamada real a tu backend o Firebase
}
</script>
