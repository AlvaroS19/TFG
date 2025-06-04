import { createRouter, createWebHistory } from 'vue-router'
import { isAuthenticated } from '../core/auth.service'

import LandingView from '@/views/LandingView.vue'
import LoginView from '@/views/LoginView.vue'
import RegisterView from '@/views/RegisterView.vue'
import ResetPasswordView from '@/views/ResetPasswordView.vue'
import ResetPasswordTokenView from '@/views/ResetPasswordTokenView.vue'

import AppLayout from '@/views/AppLayout.vue'
import DashboardView from '@/views/DashboardView.vue'
import MissionsView from '@/views/MissionsView.vue'
import CompletedMissionsView from '@/views/CompletedMissionsView.vue'
import UserStatsView from '@/views/UserStatsView.vue'
import ProfileView from '@/views/ProfileView.vue'
import AchievementsView from '@/views/AchievementsView.vue'
import RewardsView from '@/views/RewardsView.vue'

const routes = [
  // Redirección base
  {
    path: '/',
    redirect: () => (isAuthenticated() ? '/dashboard' : '/landing')
  },

  // Rutas públicas
  { path: '/landing', name: 'Landing', component: LandingView },
  { path: '/login', name: 'Login', component: LoginView },
  { path: '/register', name: 'Register', component: RegisterView },
  { path: '/reset-password', name: 'ResetPassword', component: ResetPasswordView },
  { path: '/reset-password/:token', name: 'ResetPasswordToken', component: ResetPasswordTokenView },

  // Rutas protegidas bajo layout
  {
    path: '/',
    component: AppLayout,
    meta: { requiresAuth: true },
    children: [
      { path: 'dashboard', name: 'Dashboard', component: DashboardView },
      { path: 'missions', name: 'Missions', component: MissionsView },
      { path: 'missions/completed', name: 'CompletedMissions', component: CompletedMissionsView },
      { path: 'user/stats', name: 'UserStats', component: UserStatsView },
      { path: 'profile', name: 'Profile', component: ProfileView },
      { path: 'achievements', name: 'Achievements', component: AchievementsView },
      { path: 'rewards', name: 'Rewards', component: RewardsView },
    
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Guard global de rutas protegidas
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !isAuthenticated()) {
    console.warn('⚠️ No hay sesión, redirigiendo a login');
    next('/login')
  } else {
    next()
  }
})

export default router
