import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'

export const notifySuccess = (msg) =>
  toast.success(`✅ ${msg}`, { autoClose: 3000, position: 'top-center' })

export const notifyError = (msg) =>
  toast.error(`❌ ${msg}`, { autoClose: 3000, position: 'top-center' })

export const notifyInfo = (msg) =>
  toast.info(`ℹ️ ${msg}`, { autoClose: 3000, position: 'top-center' })