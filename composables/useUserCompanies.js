// src/composables/useUserCompanies.js
import { useAuthStore } from '@/auth'
import { ref, watchEffect } from 'vue'

export function useUserCompanies() {
  const authStore = useAuthStore()
  const companies = ref([])

  const fetchCompanies = async () => {
    if (authStore.userGroup === 'Gold' && authStore.userEmail) {
      const apiUrl = `http://localhost:3001/api/getUserCompanies?email=${authStore.userEmail}`
      try {
        const response = await fetch(apiUrl)
        if (!response.ok) throw new Error('Network response was not ok')
        const data = await response.json()


        // Assuming data is the array returned, no transformation needed
        companies.value = data
      } catch (error) {
        console.error('Error fetching companies:', error)
        companies.value = []
      }
    } else {
      companies.value = []
    }
  }

  watchEffect(() => {
    fetchCompanies()
  })

  return { companies, fetchCompanies }
}
