import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import api from '../utils/api'

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: true,

      // Initialize auth state
      initialize: () => {
        const token = localStorage.getItem('lensline-token')
        if (token) {
          set({ isAuthenticated: true, token, isLoading: false })
          get().fetchUser()
        } else {
          set({ isLoading: false })
        }
      },

      // Login
      login: async (email, password) => {
        try {
          const response = await api.post('/auth/login', { email, password })
          const { token, user } = response.data
          
          localStorage.setItem('lensline-token', token)
          set({ user, token, isAuthenticated: true })
          
          return { success: true }
        } catch (error) {
          return { 
            success: false, 
            error: error.response?.data?.message || 'Login failed' 
          }
        }
      },

      // Signup
      signup: async (name, email, password) => {
        try {
          const response = await api.post('/auth/signup', { name, email, password })
          const { token, user } = response.data
          
          localStorage.setItem('lensline-token', token)
          set({ user, token, isAuthenticated: true })
          
          return { success: true }
        } catch (error) {
          return { 
            success: false, 
            error: error.response?.data?.message || 'Signup failed' 
          }
        }
      },

      // Logout
      logout: () => {
        localStorage.removeItem('lensline-token')
        set({ user: null, token: null, isAuthenticated: false })
      },

      // Fetch current user
      fetchUser: async () => {
        try {
          const response = await api.get('/auth/me')
          set({ user: response.data.user })
        } catch (error) {
          get().logout()
        }
      },

      // Update user profile
      updateProfile: async (data) => {
        try {
          const response = await api.put('/auth/profile', data)
          set({ user: response.data.user })
          return { success: true }
        } catch (error) {
          return { 
            success: false, 
            error: error.response?.data?.message || 'Update failed' 
          }
        }
      },

      // Demo login (for development without backend)
      demoLogin: () => {
        const demoUser = {
          id: 'demo-123',
          name: 'Demo User',
          email: 'demo@lensline.ai',
          avatar: null,
          plan: 'pro',
          scansToday: 12,
          totalScans: 156,
          joinedAt: new Date().toISOString()
        }
        localStorage.setItem('lensline-token', 'demo-token')
        set({ user: demoUser, token: 'demo-token', isAuthenticated: true, isLoading: false })
      }
    }),
    {
      name: 'lensline-auth',
      partialize: (state) => ({ 
        token: state.token,
        isAuthenticated: state.isAuthenticated 
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.isLoading = false
        }
      }
    }
  )
)

// Initialize on import
if (typeof window !== 'undefined') {
  useAuthStore.getState().initialize()
}
