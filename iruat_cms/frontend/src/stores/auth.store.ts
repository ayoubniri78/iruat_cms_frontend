import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { AuthUser } from '@/types/auth'
import * as authService from '@/services/auth.service'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<AuthUser | null>(null)
  const session = ref<Record<string, unknown> | null>(null)
  const isAuthenticated = computed(() => !!session.value)
  const loading = ref(false)
  const error = ref('')

  function setUserFromSession(sess: Record<string, unknown> | null) {
    session.value = sess
    if (sess && typeof sess === 'object' && 'user' in sess) {
      const u = (sess as { user: { id: string; email?: string; user_metadata?: Record<string, unknown> } }).user
      user.value = {
        id: u.id,
        email: u.email ?? '',
        first_name: u.user_metadata?.first_name as string | undefined,
        last_name: u.user_metadata?.last_name as string | undefined,
      }
    } else {
      user.value = null
    }
  }

  async function initializeAuth() {
    const { data } = await authService.getCurrentSession()
    setUserFromSession(data?.session as Record<string, unknown> | null ?? null)

    authService.onAuthStateChange((event, sess) => {
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED') {
        setUserFromSession(sess as Record<string, unknown> | null)
      } else if (event === 'SIGNED_OUT') {
        user.value = null
        session.value = null
      }
    })
  }

  async function register(email: string, password: string, firstName: string, lastName: string): Promise<{ success: boolean; error?: string }> {
    loading.value = true
    error.value = ''

    try {
      const result = await authService.register(email, password, firstName, lastName)

      if (result.error) {
        error.value = result.error.message
        return { success: false, error: result.error.message }
      }

      if (result.data?.user?.identities?.length === 0) {
        const msg = 'Un compte existe déjà avec cette adresse e-mail.'
        error.value = msg
        return { success: false, error: msg }
      }

      return { success: true }
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Erreur lors de l\'inscription.'
      error.value = msg
      return { success: false, error: msg }
    } finally {
      loading.value = false
    }
  }

  async function login(email: string, password: string): Promise<{ success: boolean; error?: string }> {
    loading.value = true
    error.value = ''

    try {
      const result = await authService.login(email, password)

      if (result.error) {
        error.value = result.error.message
        return { success: false, error: result.error.message }
      }

      setUserFromSession(result.data?.session as Record<string, unknown> | null)
      return { success: true }
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Erreur lors de la connexion.'
      error.value = msg
      return { success: false, error: msg }
    } finally {
      loading.value = false
    }
  }

  async function loginWithGoogle(): Promise<{ success: boolean; error?: string }> {
    loading.value = true
    error.value = ''

    try {
      const result = await authService.loginWithGoogle()

      if (result.error) {
        error.value = result.error.message
        return { success: false, error: result.error.message }
      }

      return { success: true }
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Erreur lors de la connexion avec Google.'
      error.value = msg
      return { success: false, error: msg }
    } finally {
      loading.value = false
    }
  }

  async function logout() {
    loading.value = true
    error.value = ''

    try {
      await authService.logout()
      user.value = null
      session.value = null
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Erreur lors de la déconnexion.'
      error.value = msg
    } finally {
      loading.value = false
    }
  }

  return {
    user,
    session,
    isAuthenticated,
    loading,
    error,
    initializeAuth,
    register,
    login,
    loginWithGoogle,
    logout,
  }
})
