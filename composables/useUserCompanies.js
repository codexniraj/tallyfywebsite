// src/composables/useUserCompanies.js
import { useAuthStore } from '@/auth'
import { computed, ref, watchEffect } from 'vue'

// Move the reactive state outside the function so it’s shared.
const companies = ref([])
const selectedCompany = ref(null)
let initialized = false

export function useUserCompanies() {
  const authStore = useAuthStore()

  const fetchCompanies = async () => {
    if (authStore.userGroup === 'Gold' && authStore.userEmail) {
      const apiUrl = `http://3.108.64.167:3001/api/getUserCompanies?email=${authStore.userEmail}`
      try {
        const response = await fetch(apiUrl)
        if (!response.ok) throw new Error('Network response was not ok')
        const data = await response.json()

        companies.value = data
        
        // Set the first company as default if available and no company is currently selected
        if (companies.value.length > 0 && !selectedCompany.value) {
          selectedCompany.value = companies.value[0]
        }
      } catch (error) {
        console.error('Error fetching companies:', error)
        companies.value = []
      }
    } else {
      companies.value = []
    }
  }

  if (!initialized) {
    watchEffect(() => {
      fetchCompanies()
    })
    initialized = true
  }

  const companyOptions = computed(() => {
    return companies.value.map(company => ({
      id: company.id,
      name: company.name,
      value: company,
    }))
  })

  return { 
    companies,
    selectedCompany, 
    companyOptions,
    fetchCompanies, 
  }
}
