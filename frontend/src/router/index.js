// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import { isAuthenticated } from '@/core/auth.service'
import LandingView  from '@/views/LandingView.vue'
import LoginView    from '@/views/LoginView.vue'
import RegisterView from '@/views/RegisterView.vue'
import ResetPasswordView from '@/views/ResetPasswordView.vue'
import ResetPasswordTokenView from '@/views/ResetPasswordTokenView.vue'
import DashboardView from '@/views/DashboardView.vue'
import UserStatsView from '@/views/UserStatsView.vue'
import MissionsView from '@/views/MissionsView.vue'
import CompletedMissionsView from '@/views/CompletedMissionsView.vue'
import AchievementsView from '@/views/AchievementsView.vue'
import ProfileView from '@/views/ProfileView.vue'
import AppLayout from '@/views/AppLayout.vue'


const routes = [
  // Redirección base
  {
    path: '/',
    redirect: () => {
      return isAuthenticated() ? '/dashboard' : '/landing'
    }
  },
  // Vistas públicas
  { path: '/landing', name: 'Landing', component: LandingView },
  { path: '/login', name: 'Login', component: LoginView },
  { path: '/register', name: 'Register', component: RegisterView },
  { path: '/reset-password', name: 'ResetPassword', component: ResetPasswordView },
  { path: '/reset-password/:token', name: 'ResetPasswordToken', component: ResetPasswordTokenView },

  // Rutas protegidas con layout
  {
    path: '/',
    component: AppLayout,
    meta: { requiresAuth: true },
    children: [
      { path: 'dashboard', name: 'Dashboard', component: DashboardView },
      { path: 'missions', name: 'Missions', component: MissionsView },
      { path: 'missions/completed', name: 'CompletedMissions', component: CompletedMissionsView },
      { path: 'user/stats', name: 'UserStats', component: UserStatsView },
      { path: 'achievements', name: 'Achievements', component: AchievementsView },
      { path: 'profile', name: 'Profile', component: ProfileView }
    ]
  }
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
