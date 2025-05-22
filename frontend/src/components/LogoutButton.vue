<template>
  <button @click="logout" class="text-sm text-primary underline hover:opacity-80">
    Cerrar sesión
  </button>
</template>


<script setup>
import { useRouter } from 'vue-router'
import { toast } from 'vue3-toastify'
import BaseButton from '@/components/BaseButton.vue'

const router = useRouter()

function logout() {
  localStorage.removeItem('token')
  toast.success('Sesión cerrada correctamente')
  router.push('/login')
}
</script>
