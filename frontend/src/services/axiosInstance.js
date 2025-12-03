import axios from 'axios'
import { getCookie } from './auth'

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Interceptor para añadir el token en cada petición
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getCookie('idToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Interceptor para manejar errores de autenticación
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token inválido o expirado
      document.cookie = 'idToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC'
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default axiosInstance