<template>
  <div class="h-screen w-screen bg-background text-text flex flex-col justify-center items-center px-6">
    <h1 class="text-2xl font-bold mb-6 text-center">Nueva contraseña</h1>

    <form @submit.prevent="handleReset" class="w-full max-w-xs flex flex-col gap-4">
      <!-- Nueva contraseña -->
      <div class="relative w-full">
        <BaseInput
          label="Nueva contraseña"
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

      <!-- Confirmar contraseña -->
      <BaseInput
        label="Confirmar contraseña"
        v-model="repeatPassword"
        type="password"
        placeholder="Repite tu nueva contraseña"
      />
      <p v-if="repeatError" class="text-red-500 text-sm -mt-2">{{ repeatError }}</p>

      <BaseButton type="submit">Actualizar contraseña</BaseButton>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import BaseInput from '@/components/BaseInput.vue'
import BaseButton from '@/components/BaseButton.vue'
import { Eye, EyeOff } from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()

const token = ref('')
const password = ref('')
const repeatPassword = ref('')
const showPassword = ref(false)

const passwordError = ref('')
const repeatError = ref('')

onMounted(() => {
  token.value = route.query.token || ''
})

function isValidPassword(pwd) {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/
  return regex.test(pwd)
}

function handleReset() {
  passwordError.value = ''
  repeatError.value = ''

  if (!isValidPassword(password.value)) {
    passwordError.value = 'Debe tener mínimo 8 caracteres, una mayúscula y un número'
    return
  }

  if (password.value !== repeatPassword.value) {
    repeatError.value = 'Las contraseñas no coinciden'
    return
  }

  if (!token.value) {
    console.error('Error al cargar datos')
    return
  }

  // Simulación de llamada real
  console.log('Operación completada')
  router.push('/login')
}
</script>
