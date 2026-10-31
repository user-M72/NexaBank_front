import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authApi, userApi } from '../api/client'

export const useAuthStore = defineStore('auth', () => {
  const accessToken = ref(localStorage.getItem('accessToken') || null)
  const refreshToken = ref(localStorage.getItem('refreshToken') || null)
  const user = ref(null)

  const isLoggedIn = computed(() => !!accessToken.value)

  function setTokens({ accessToken: at, refreshToken: rt }) {
    accessToken.value = at
    refreshToken.value = rt
    localStorage.setItem('accessToken', at)
    localStorage.setItem('refreshToken', rt)
  }

  async function login(credentials) {
    const { data } = await authApi.login(credentials)
    setTokens(data)
  }

  async function register(payload) {
    const { data } = await authApi.register(payload)
    setTokens(data)
  }

  async function fetchUser() {
    const { data } = await userApi.getMe()
    user.value = data
    return data
  }

  function logout() {
    accessToken.value = null
    refreshToken.value = null
    user.value = null
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
  }

  return { accessToken, refreshToken, user, isLoggedIn, login, register, fetchUser, logout }
})
