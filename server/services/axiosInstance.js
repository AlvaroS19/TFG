import axios from 'axios'

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://192.168.1.131:5000',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
})

export default axiosInstance
