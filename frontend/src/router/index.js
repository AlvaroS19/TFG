// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import LandingView  from '@/views/LandingView.vue'
import LoginView    from '@/views/LoginView.vue'
import RegisterView from '@/views/RegisterView.vue'

const routes = [
  { path: '/',         name: 'Landing',  component: LandingView },
  { path: '/login',    name: 'Login',    component: LoginView },
  { path: '/register', name: 'Register', component: RegisterView },
]

export default createRouter({
  history: createWebHistory(),
  routes,
})
