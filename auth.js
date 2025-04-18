// src/stores/auth.js
import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    userName: '',
    userEmail: '',
    userGroup: '',
  }),
  getters: {
    // Add getters to avoid direct state access issues
    getUserName: state => state.userName,
    getUserEmail: state => state.userEmail,
    getUserGroup: state => state.userGroup,
    isAuthenticated: state => !!state.userEmail,
  },
  actions: {
    // Call this after login to store user information
    setUserInfo(name, email, group) {
      this.userName = name || ''
      this.userEmail = email || ''
      this.userGroup = group || ''
      console.log('User info stored in auth store:', this.userName, this.userEmail, this.userGroup)
    },
    clearUserInfo() {
      this.userName = ''
      this.userEmail = ''
      this.userGroup = ''
    },
  },
  
  // Fix serialization issues by disabling Pinia's state hydration for this store
  // This is only needed if you're still having issues with serialization
  hydrate(storeState, initialState) {
    // Explicitly force empty state when hydrating
    return {
      userName: '',
      userEmail: '',
      userGroup: '',
    }
  },
})
