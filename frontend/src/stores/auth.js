import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('idToken') || null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
  },

  actions: {
    setToken(token) {
      this.token = token
      localStorage.setItem('idToken', token)
    },

    clearToken() {
      this.token = null
      localStorage.removeItem('idToken')
    },
  },
})