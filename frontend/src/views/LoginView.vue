<template>
  <div class="h-screen w-screen flex flex-col items-center justify-center bg-background px-6">
    <img src="@/assets/logo.png" alt="FitQuest Logo" class="w-32 mb-6" />

    <div class="w-full max-w-xs flex flex-col gap-5">
      <!-- Email -->
      <BaseInput
        v-model="email"
        type="email"
        placeholder="Correo electrónico"
        label="Correo"
        :error="emailError"
      />

      <!-- Contraseña -->
      <BaseInput
        v-model="password"
        :type="showPassword ? 'text' : 'password'"
        placeholder="Contraseña"
        label="Contraseña"
        :error="passwordError"
      >
        <template #right>
          <button type="button" @click="showPassword = !showPassword">
            <component :is="showPassword ? EyeOff : Eye" class="w-5 h-5 text-gray-400" />
          </button>
        </template>
      </BaseInput>

      <BaseButton @click="handleLogin">
        Iniciar sesión
      </BaseButton>

      <!-- Enlace para reset password -->
      <router-link to="/reset-password" class="text-sm text-text underline text-center mt-2">
        ¿Has olvidado la contraseña?
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { toast } from 'vue3-toastify'
import { Eye, EyeOff } from 'lucide-vue-next'

import BaseInput from '@/components/BaseInput.vue'
import BaseButton from '@/components/BaseButton.vue'
import { loginUser } from '@/services/auth'

const email = ref('')
const password = ref('')
const emailError = ref('')
const passwordError = ref('')
const showPassword = ref(false)

const router = useRouter()

function isValidEmail(mail) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return regex.test(mail)
}

function isValidPassword(pwd) {
  return pwd.length >= 8
}

async function handleLogin() {
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

  try {
    const data = await loginUser(email.value, password.value)
    toast.success('¡Inicio de sesión correcto!')
    localStorage.setItem('token', data.idToken)
    router.push('/dashboard')
  } catch (err) {
    toast.error(err.message || 'Error al iniciar sesión')
  }
}
</script>
