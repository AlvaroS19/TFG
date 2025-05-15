<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-900 text-white">
    <div class="w-full max-w-md p-8 bg-gray-800 rounded-xl shadow-lg">
      <h1 class="text-2xl font-bold mb-6 text-center">Crear cuenta</h1>

      <form @submit.prevent="handleRegister" class="space-y-4">
        <input v-model="name" type="text" placeholder="Nombre"
          class="w-full p-2 rounded bg-gray-700 text-white placeholder-gray-400" />

        <input v-model="lastName" type="text" placeholder="Apellido"
          class="w-full p-2 rounded bg-gray-700 text-white placeholder-gray-400" />

        <input v-model="email" type="email" placeholder="Correo electrónico"
          class="w-full p-2 rounded bg-gray-700 text-white placeholder-gray-400" />

        <input v-model="password" type="password" placeholder="Contraseña"
          class="w-full p-2 rounded bg-gray-700 text-white placeholder-gray-400" />

        <button type="submit"
          class="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded transition">
          Registrarse
        </button>

        <p v-if="error" class="text-red-500 text-sm text-center mt-2">{{ error }}</p>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import API from '../services/api';

const name = ref('');
const lastName = ref('');
const email = ref('');
const password = ref('');
const error = ref('');

const router = useRouter();

const handleRegister = async () => {
  error.value = '';

  if (!name.value || !lastName.value || !email.value || !password.value) {
    error.value = 'Rellena todos los campos';
    return;
  }

  try {
    const res = await API.post('/auth/register', {
      name: name.value,
      lastName: lastName.value,
      email: email.value,
      password: password.value,
    });

    console.log('Registrado:', res.data);

    // Redirigir al login tras registro
    router.push('/login');
  } catch (err) {
    error.value = err.response?.data?.error || 'Error al registrar usuario';
  }
};
</script>
