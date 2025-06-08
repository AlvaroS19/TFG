<template>
  <div class="min-h-screen w-screen flex flex-col items-center justify-center bg-background px-6">
    <img src="@/assets/logo.png" alt="FitQuest Logo" class="w-32 mb-6" />

    <div class="w-full max-w-xs flex flex-col gap-5">
      <!-- Email -->
      <BaseInput
        v-model="email"
        type="email"
        placeholder="Correo electrónico"
        label="Correo"
        :error="emailError"
        autocomplete="email"
      />

      <!-- Contraseña -->
      <BaseInput
        ref="inputRef"
        v-model="password"
        :type="showPassword ? 'text' : 'password'"
        placeholder="Contraseña"
        label="Contraseña"
        :error="passwordError"
        autocomplete="current-password"
      >
        <template #right>
          <button type="button" @click="alternarPassword" aria-label="Mostrar/ocultar contraseña">
            <component :is="showPassword ? EyeOff : Eye" class="w-5 h-5 text-gray-400" />
          </button>
        </template>
      </BaseInput>

      <!-- Botón login -->
      <BaseButton type="submit" @click="handleLogin">
        Iniciar sesión
      </BaseButton>

      <!-- Enlace -->
      <router-link to="/reset-password" class="text-sm text-text underline text-center mt-2">
        ¿Has olvidado la contraseña?
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { Eye, EyeOff } from 'lucide-vue-next'
import { notifySuccess, notifyError } from '../utils/toastNotify'

import BaseInput from '../components/BaseInput.vue'
import BaseButton from '../components/BaseButton.vue'
import { loginUser, getCookie } from '../services/auth'

const email = ref('')
const password = ref('')
const emailError = ref('')
const passwordError = ref('')
const showPassword = ref(false)
const inputRef = ref(null)
const router = useRouter()

const alternarPassword = async () => {
  showPassword.value = !showPassword.value
  await nextTick()
  inputRef.value?.inputRef?.focus()
}

const isValidEmail = (mail) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail)
const isValidPassword = (pwd) => pwd.length >= 8

const handleLogin = async () => {
  emailError.value = ''
  passwordError.value = ''

  if (!isValidEmail(email.value)) {
    emailError.value = 'Introduce un correo válido'
    return
  }

  if (!isValidPassword(password.value)) {
    passwordError.value = 'La contraseña debe tener al menos 8 caracteres'
    return
  }

  try {
    const data = await loginUser(email.value, password.value)

    document.cookie = `idToken=${data.idToken}; path=/; max-age=3600; SameSite=Lax`

    setTimeout(() => {
      const token = getCookie('idToken')
      if (token) {
        notifySuccess('Sesión iniciada correctamente')
        router.push('/dashboard')
      } else {
        notifyError('Error al establecer la sesión')
      }
    }, 150)
  } catch (err) {
    passwordError.value = 'Email o contraseña incorrectos'
    notifyError('Email o contraseña incorrectos')
  }
}
</script>