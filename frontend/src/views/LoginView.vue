<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="bg-white p-8 rounded shadow-md w-full max-w-sm">
      <h1 class="text-2xl font-bold mb-6 text-center">Iniciar sesión</h1>
      
      <form @submit.prevent="handleLogin">
        <input
          v-model="email"
          type="email"
          placeholder="Correo electrónico"
          class="w-full p-2 mb-4 border border-gray-300 rounded"
          required
        />
        <input
          v-model="password"
          type="password"
          placeholder="Contraseña"
          class="w-full p-2 mb-4 border border-gray-300 rounded"
          required
        />

        <button
          type="submit"
          class="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700 transition"
        >
          Entrar
        </button>
      </form>

      <p v-if="error" class="text-red-600 mt-4 text-sm text-center">{{ error }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import API from '../services/api';

const email = ref('');
const password = ref('');
const error = ref('');
const router = useRouter();

const handleLogin = async () => {
  error.value = '';
  try {
    const res = await API.post('/auth/login', {
      email: email.value,
      password: password.value,
    });

    const token = res.data.idToken;
    localStorage.setItem('token', token);
    router.push('/dashboard');
  } catch (err) {
    console.error(err);
    error.value = err.response?.data?.error || 'Error al iniciar sesión';
  }
};
</script>