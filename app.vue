<script setup>
import UpgradeToPro from '@/components/UpgradeToPro.vue'

// Safe way to detect mobile without using a store
let isMobile = false
if (process.client) {
  // Only run device detection on client
  isMobile = window.innerWidth < 960
  
  // Listen for resize to update on viewport changes
  window.addEventListener('resize', () => {
    isMobile = window.innerWidth < 960
  })
}

// Set a value to control layout - we avoid accessing store directly
const verticalNav = ref(isMobile)

// Export for components that need this value
defineExpose({
  verticalNav,
})
</script>

<template>
  <VApp>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <UpgradeToPro />
  </VApp>
</template>
