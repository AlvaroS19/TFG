<template>
  <button @click="logout" class="text-sm text-primary underline hover:opacity-80">
    Cerrar sesión
  </button>
</template>


<script setup>
import { useRouter } from 'vue-router'
import { toast } from 'vue3-toastify'
import BaseButton from '@/components/BaseButton.vue'
import { getCookie } from '@/services/auth';

const router = useRouter()

function logout() {
  document.cookie = 'idToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC';

  const token = getCookie('idToken');

  toast('Sesión cerrada correctamente', { type: 'success' });

  router.push('/login');
}

</script>
