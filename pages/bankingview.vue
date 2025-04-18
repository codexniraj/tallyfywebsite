<!-- eslint-disable camelcase -->
<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

definePageMeta({ layout: 'default' })

const route = useRoute()
const router = useRouter()

// Get temp table ID from route query parameter
const tempTableId = computed(() => route.query.id || null)
const filename = computed(() => route.query.filename || 'Bank Statement')

// Table data state
const transactions = ref([])
const loading = ref(false)
const error = ref(null)

const tableInfo = ref({
  totalRecords: 0,
  company: '',
  bankName: '',
  email: '',
})

// Fetch transactions from the specified temp table
const fetchTransactions = async () => {
  if (!tempTableId.value) {
    error.value = 'Missing temp table ID'
    
    return
  }
  
  try {
    loading.value = true
    error.value = null
    
    console.log(`Fetching transactions for table ID: ${tempTableId.value}`)
    
    const apiUrl = `http://localhost:3001/api/getTempLedgers?tempTable=${encodeURIComponent(tempTableId.value)}`
    const response = await fetch(apiUrl)
    
    if (!response.ok) {
      throw new Error(`Failed to fetch transactions: ${response.status} ${response.statusText}`)
    }
    
    const data = await response.json()
    
    console.log('Fetched transactions:', data)
    
    if (Array.isArray(data)) {
      transactions.value = data.map((item, index) => ({
        ...item,
        index: index + 1,

        // Format date if available
        formatted_date: item.transaction_date ? new Date(item.transaction_date).toLocaleDateString() : '-',

        // Format amount for display
        formatted_amount: formatAmount(item.amount),
      }))
      
      // Update table info
      if (data.length > 0) {
        const firstItem = data[0]

        tableInfo.value = {
          totalRecords: data.length,
          company: firstItem.company || '-',
          bankName: firstItem.bank_account || '-',
          email: firstItem.email || '-',
        }
      }
    }
  } catch (err) {
    console.error('Error fetching transactions:', err)
    error.value = err.message || 'Failed to load transactions'
  } finally {
    loading.value = false
  }
}

// Format amount for display
const formatAmount = amount => {
  if (amount === null || amount === undefined) return '-'
  
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
  })
  
  return formatter.format(amount)
}

// Table headers
const headers = [
  { title: '#', key: 'index', sortable: false, width: '5%' },
  { title: 'Date', key: 'formatted_date', sortable: true, width: '10%' },
  { title: 'Description', key: 'description', sortable: true, width: '45%' },
  { title: 'Withdrawal', key: 'withdrawal', sortable: true, width: '15%', align: 'end' },
  { title: 'Deposit', key: 'deposit', sortable: true, width: '15%', align: 'end' },
  { title: 'Balance', key: 'balance', sortable: true, width: '10%', align: 'end' },
]

// Go back to the main banking page
const goBack = () => {
  router.push('/banking')
}

// Fetch data when component mounts
onMounted(() => {
  fetchTransactions()
})

// Watch for changes in temp table ID
watch(tempTableId, () => {
  fetchTransactions()
})
</script>

<template>
  <VCard>
    <VCardTitle class="d-flex flex-column flex-sm-row justify-space-between align-center pa-4">
      <div class="d-flex align-center">
        <VBtn
          icon
          variant="text"
          color="default"
          class="me-3"
          @click="goBack"
        >
          <VIcon icon="bx-arrow-back" />
        </VBtn>
        <h5 class="text-h5 mb-0">
          {{ filename }}
        </h5>
      </div>
      
      <div class="d-flex gap-3 mt-3 mt-sm-0">
        <VBtn
          color="success"
          prepend-icon="bx-download"
          :disabled="transactions.length === 0"
        >
          Export
        </VBtn>
        <VBtn
          color="primary"
          prepend-icon="bx-refresh"
          :loading="loading"
          @click="fetchTransactions"
        >
          Refresh
        </VBtn>
      </div>
    </VCardTitle>
    
    <VCardText>
      <!-- Info Cards -->
      <VRow class="mb-4">
        <VCol
          cols="12"
          sm="6"
          md="3"
        >
          <VCard class="bg-primary text-white">
            <VCardText>
              <div class="d-flex justify-space-between align-center">
                <div>
                  <p class="text-sm mb-0 text-white text-opacity-75">
                    Total Transactions
                  </p>
                  <h4 class="text-h4 mb-0 text-white">
                    {{ tableInfo.totalRecords }}
                  </h4>
                </div>
                <VIcon
                  icon="bx-receipt"
                  size="42"
                  class="text-white text-opacity-75"
                />
              </div>
            </VCardText>
          </VCard>
        </VCol>
        
        <VCol
          cols="12"
          sm="6"
          md="3"
        >
          <VCard class="bg-success text-white">
            <VCardText>
              <div class="d-flex justify-space-between align-center">
                <div>
                  <p class="text-sm mb-0 text-white text-opacity-75">
                    Bank Account
                  </p>
                  <h6
                    class="text-subtitle-1 mb-0 text-white text-truncate"
                    style="max-inline-size: 200px;"
                  >
                    {{ tableInfo.bankName }}
                  </h6>
                </div>
                <VIcon
                  icon="bx-bank"
                  size="42"
                  class="text-white text-opacity-75"
                />
              </div>
            </VCardText>
          </VCard>
        </VCol>
        
        <VCol
          cols="12"
          sm="6"
          md="3"
        >
          <VCard class="bg-warning text-white">
            <VCardText>
              <div class="d-flex justify-space-between align-center">
                <div>
                  <p class="text-sm mb-0 text-white text-opacity-75">
                    Company
                  </p>
                  <h6
                    class="text-subtitle-1 mb-0 text-white text-truncate"
                    style="max-inline-size: 200px;"
                  >
                    {{ tableInfo.company }}
                  </h6>
                </div>
                <VIcon
                  icon="bx-building"
                  size="42"
                  class="text-white text-opacity-75"
                />
              </div>
            </VCardText>
          </VCard>
        </VCol>
        
        <VCol
          cols="12"
          sm="6"
          md="3"
        >
          <VCard class="bg-info text-white">
            <VCardText>
              <div class="d-flex justify-space-between align-center">
                <div>
                  <p class="text-sm mb-0 text-white text-opacity-75">
                    Table ID
                  </p>
                  <h6
                    class="text-subtitle-1 mb-0 text-white text-truncate"
                    style="max-inline-size: 200px;"
                  >
                    {{ tempTableId || '-' }}
                  </h6>
                </div>
                <VIcon
                  icon="bx-table"
                  size="42"
                  class="text-white text-opacity-75"
                />
              </div>
            </VCardText>
          </VCard>
        </VCol>
      </VRow>
      
      <!-- Error Alert -->
      <VAlert
        v-if="error"
        type="error"
        variant="tonal"
        closable
        class="mb-4"
      >
        {{ error }}
      </VAlert>
      
      <!-- Transactions Table -->
      <VTable
        hover
        fixed-header
        height="500px"
        class="text-no-wrap"
      >
        <thead>
          <tr>
            <th
              v-for="header in headers"
              :key="header.key"
              :class="[header.align === 'end' ? 'text-end' : '']"
              :style="{ width: header.width || 'auto' }"
            >
              {{ header.title }}
            </th>
          </tr>
        </thead>
        <tbody>
          <template v-if="loading && transactions.length === 0">
            <tr>
              <td
                :colspan="headers.length"
                class="text-center py-8"
              >
                <VProgressCircular
                  indeterminate
                  color="primary"
                  class="mb-2"
                />
                <div>Loading transactions...</div>
              </td>
            </tr>
          </template>
          <template v-else-if="transactions.length === 0">
            <tr>
              <td
                :colspan="headers.length"
                class="text-center py-8"
              >
                <VIcon
                  icon="bx-info-circle"
                  size="36"
                  color="warning"
                  class="mb-2"
                />
                <div>No transactions found for this table</div>
              </td>
            </tr>
          </template>
          <template v-else>
            <tr
              v-for="item in transactions"
              :key="item.id"
            >
              <td>{{ item.index }}</td>
              <td>{{ item.formatted_date }}</td>
              <td>{{ item.description || '-' }}</td>
              <td class="text-end">
                {{ item.withdrawal ? formatAmount(item.withdrawal) : '-' }}
              </td>
              <td class="text-end">
                {{ item.deposit ? formatAmount(item.deposit) : '-' }}
              </td>
              <td class="text-end">
                {{ item.balance || '-' }}
              </td>
            </tr>
          </template>
        </tbody>
      </VTable>
    </VCardText>
  </VCard>
</template>

<style scoped>
.v-table {
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  border-radius: 0.375rem;
}

.v-table thead th {
  background-color: rgb(var(--v-theme-surface));
  color: rgb(var(--v-theme-on-surface));
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.5px;
  text-transform: uppercase;
}
</style>
