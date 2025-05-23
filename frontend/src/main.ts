import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'

// Toastify
import Vue3Toastify, { type ToastContainerOptions } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'

// Tu CSS
import './style.css'

const toastOptions: ToastContainerOptions = {
  autoClose: 3000,
  position: 'top-center',
  theme: 'dark',
}

const app = createApp(App)

app.use(router)
app.use(createPinia())
app.use(Vue3Toastify, toastOptions)

app.mount('#app')

