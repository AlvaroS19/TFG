import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

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
  { path: '/', name: 'Landing', component: LandingView },
  { path: '/login', name: 'Login', component: LoginView },
  { path: '/register', name: 'Register', component: RegisterView },
  { path: '/reset-password', name: 'ResetPassword', component: ResetPasswordView },
  { path: '/reset-password/:token', name: 'ResetPasswordToken', component: ResetPasswordTokenView },

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

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    console.warn('⚠️ No hay sesión, redirigiendo a login');
    return next('/login')
  }

  if (to.path === '/' && authStore.isAuthenticated) {
    return next('/dashboard')
  }

  next()
})

export default router
