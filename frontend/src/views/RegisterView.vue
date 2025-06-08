<template>
  <div class="h-screen w-screen bg-background text-text flex flex-col justify-center items-center px-6">
    <img src="@/assets/logo.png" alt="FitQuest Logo" class="w-32 mb-6" />

    <h1 class="text-3xl font-bold mb-4 text-center">Crear cuenta</h1>

    <form @submit.prevent="handleRegister" class="w-full max-w-xs flex flex-col gap-4">
      <!-- Nombre -->
      <BaseInput label="Nombre" v-model="name" placeholder="Tu nombre" />
      <p v-if="nameError" class="text-red-500 text-sm -mt-2">{{ nameError }}</p>

      <!-- Apellido -->
      <BaseInput label="Apellido" v-model="lastName" placeholder="Tu apellido" />
      <p v-if="lastNameError" class="text-red-500 text-sm -mt-2">{{ lastNameError }}</p>

      <!-- Email -->
      <BaseInput label="Email" v-model="email" type="email" placeholder="tú@correo.com" />
      <p v-if="emailError" class="text-red-500 text-sm -mt-2">{{ emailError }}</p>

      <!-- Contraseña -->
      <div class="relative w-full">
        <BaseInput
          label="Contraseña"
          v-model="password"
          :type="showPassword ? 'text' : 'password'"
          placeholder="Mínimo 8 caracteres"
        />
        <button type="button" @click="showPassword = !showPassword" class="absolute right-3 top-9 text-primary">
          <component :is="showPassword ? EyeOff : Eye" class="w-5 h-5" />
        </button>
      </div>
      <p v-if="passwordError" class="text-red-500 text-sm -mt-2">{{ passwordError }}</p>

      <!-- Repetir contraseña -->
      <div class="relative w-full">
        <BaseInput
          label="Repetir contraseña"
          v-model="repeatPassword"
          :type="showRepeat ? 'text' : 'password'"
          placeholder="Confirma tu contraseña"
        />
        <button type="button" @click="showRepeat = !showRepeat" class="absolute right-3 top-9 text-primary">
          <component :is="showRepeat ? EyeOff : Eye" class="w-5 h-5" />
        </button>
      </div>
      <p v-if="repeatError" class="text-red-500 text-sm -mt-2">{{ repeatError }}</p>

      <!-- Objetivo -->
      <div>
        <label class="text-sm font-medium">Objetivo</label>
          <select v-model="goal" class="mt-1 w-full px-3 py-2 rounded border bg-white text-black">
            <option disabled value="">Selecciona tu objetivo</option>
            <option value="salud">Salud</option>
            <option value="resistencia">Resistencia</option>
            <option value="tonificacion">Tonificación</option>
            <option value="fuerza">Fuerza</option>
          </select>
        <p v-if="goalError" class="text-red-500 text-sm mt-1">{{ goalError }}</p>
      </div>

      <!-- Botón -->
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
import { Eye, EyeOff } from 'lucide-vue-next'
import { notifySuccess, notifyError } from '../utils/toastNotify'

import BaseInput from '../components/BaseInput.vue'
import BaseButton from '../components/BaseButton.vue'
import { registerUser } from '../services/auth'

const router = useRouter()

const name = ref('')
const lastName = ref('')
const email = ref('')
const password = ref('')
const repeatPassword = ref('')
const goal = ref('')

const showPassword = ref(false)
const showRepeat = ref(false)

const nameError = ref('')
const lastNameError = ref('')
const emailError = ref('')
const passwordError = ref('')
const repeatError = ref('')
const goalError = ref('')

const isValidEmail = (mail) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail)
const isValidPassword = (pwd) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(pwd)

async function handleRegister() {
  nameError.value = ''
  lastNameError.value = ''
  emailError.value = ''
  passwordError.value = ''
  repeatError.value = ''
  goalError.value = ''

  let valid = true

  if (!name.value.trim()) {
    nameError.value = 'Nombre requerido'
    valid = false
  }

  if (!lastName.value.trim()) {
    lastNameError.value = 'Apellido requerido'
    valid = false
  }

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

  if (!goal.value) {
    goalError.value = 'Selecciona un objetivo'
    valid = false
  }

  if (!valid) return

  try {
    await registerUser({
      name: name.value,
      lastName: lastName.value,
      email: email.value,
      password: password.value,
      objetivo: goal.value
    })

    notifySuccess('Cuenta creada correctamente. Redirigiendo al login...')
    setTimeout(() => {
      router.push('/login')
    }, 2000)

  } catch (err) {
    notifyError('Error al registrar.')
  }
}
</script>