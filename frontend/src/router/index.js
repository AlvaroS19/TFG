// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import LandingView  from '@/views/LandingView.vue'
import LoginView    from '@/views/LoginView.vue'
import RegisterView from '@/views/RegisterView.vue'
import ResetPasswordView from '@/views/ResetPasswordView.vue'
import ResetPasswordTokenView from '@/views/ResetPasswordTokenView.vue'
import DashboardView from '@/views/DashboardView.vue'
import { isAuthenticated } from '@/core/auth.service'
import UserStatsView from '@/views/UserStatsView.vue'


const routes = [
  { path: '/',         name: 'Landing',  component: LandingView },
  { path: '/login',    name: 'Login',    component: LoginView },
  { path: '/register', name: 'Register', component: RegisterView },
  { path: '/reset-password', name: 'ResetPassword', component: ResetPasswordView },
  { path: '/reset-password/:token', name: 'ResetPasswordToken', component: ResetPasswordTokenView },
  { path: '/dashboard', name: 'Dashboard', component: DashboardView, meta: { requiresAuth: true } },
  { path: '/user/stats', name: 'UserStats', component: UserStatsView, meta: { requiresAuth: true } },
]
const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !isAuthenticated()) {
    next('/login')
  } else {
    next()
  }
})
export default router
