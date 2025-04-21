<!-- eslint-disable camelcase -->
<script setup>
import ExcelView from '@/components/ExcelView.vue'
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

definePageMeta({ layout: 'blank' })

const route = useRoute()
const router = useRouter()

// Get temp table ID from route query parameter
const tempTableId = computed(() => route.query.id || null)
const filename = computed(() => route.query.filename || 'Bank Statement')

// Table data state
const transactions = ref([])
const loading = ref(false)
const error = ref(null)
const message = ref('')
const selectedRows = ref([])
const userEmail = ref('')
const selectedCompany = ref('')
const selectedCompanyName = ref('')
const bankName = ref('')

const tableInfo = ref({
  totalRecords: 0,
  company: '',
  bankName: '',
  email: '',
})

// Counter cards data
const rowCounts = ref({
  total: 0,
  deposits: 0,
  withdrawals: 0,
  totalReceiptAmount: 0,
  totalPaymentAmount: 0,
})

// Table settings
const settings = ref({
  density: 'compact',
  height: 500,
  fixedHeader: true,
  bordered: true,
  striped: false,
  hover: true,
  selectable: true,
  showPagination: true,
  searchable: true,
  itemsPerPage: 10,
})

// Table headers for ExcelView
const headers = [
  { title: 'Sr. No.', key: 'srNo', sortable: true, width: '80px', align: 'center' },
  { title: 'Date', key: 'date', sortable: true, width: '120px' },
  { title: 'Description', key: 'description', sortable: true, width: '30%' },
  { title: 'Transaction Type', key: 'transaction_type', sortable: true, width: '150px' },
  { title: 'Amount', key: 'amount', sortable: true, width: '120px', align: 'end' },
  { title: 'Ledger', key: 'ledger', sortable: true, width: '25%' },
]

// Add ledgerOptions ref to store the ledgers
const ledgerOptions = ref([])
const loadingLedgers = ref(false)

// Add state for confirmation dialog
const showConfirmDialog = ref(false)

const pendingTransactionTypeChange = ref({
  id: null,
  oldType: '',
  newType: '',
})

// Add state for delete confirmation dialog
const deleteDialog = ref(false)
const transactionToDelete = ref(null)

// Bulk‐delete state
const showBulkDeleteDialog = ref(false)

// Trigger the slide‐in dialog
const confirmBulkDelete = () => {
  showBulkDeleteDialog.value = true
}

// Delete all selected rows one‐by‐one, then reindex
const bulkDeleteTransactions = async () => {
  try {
    if (!tempTableId.value || selectedRows.value.length === 0) {
      error.value = 'No rows selected or missing table ID'
      
      return
    }

    // call your delete API for each selected row
    for (const row of selectedRows.value) {
      await fetch('https://api.tallyfy.in/api/deleteTransaction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tempTable: tempTableId.value, transactionId: row.id }),
      })
    }

    // remove them from local state & re‐index srNo
    const ids = selectedRows.value.map(r => r.id)

    transactions.value = transactions.value
      .filter(t => !ids.includes(t.id))
      .map((item, idx) => ({ ...item, srNo: idx + 1 }))
    calculateRowCounts(transactions.value)

    // reset selection + close dialog + show success
    selectedRows.value = []
    showBulkDeleteDialog.value = false
    message.value = `${ids.length} transactions deleted successfully`
    setTimeout(() => { if (message.value.includes('deleted successfully')) message.value = '' }, 3000)

  } catch (err) {
    console.error(err)
    error.value = err.message || 'Failed to delete selected rows'
    showBulkDeleteDialog.value = false
  }
}

// bulk‑assign state
const bulkLedger = ref(null)

// Apply the selected ledger to all selected rows
const applyBulkAssignLedger = () => {
  if (!bulkLedger.value) {
    error.value = 'Please select a ledger to assign'
      
    return
  }

  // Assign locally
  const ledgerObj = bulkLedger.value
  const selectedIds = selectedRows.value.map(r => r.id)

  transactions.value = transactions.value.map(tx =>
    selectedIds.includes(tx.id)
      ? { ...tx, ledger: ledgerObj }
      : tx,
  )

  // Feedback
  message.value = `Assigned "${ledgerObj.title}" to ${selectedIds.length} rows`
  setTimeout(() => { if (message.value.startsWith('Assigned')) message.value = '' }, 3000)

  // Optionally clear dropdown
  bulkLedger.value = null
}



// Add watch for filtered transactions
const filteredTransactions = ref([])

// Fetch ledger names from the API
const fetchLedgerNames = async () => {
  try {
    loadingLedgers.value = true
    
    if (!selectedCompany.value || !userEmail.value) {
      console.error('Missing user email or company for ledger fetch')
      
      return
    }
    
    const apiUrl = `https://api.tallyfy.in/api/getMergedLedgerNames?company=${encodeURIComponent(selectedCompany.value)}&email=${encodeURIComponent(userEmail.value)}`
    const response = await fetch(apiUrl)
    
    if (!response.ok) {
      throw new Error('Failed to fetch ledger names')
    }
    
    const data = await response.json()
    
    if (Array.isArray(data)) {
      // Transform the array of strings into array of objects for v-select
      ledgerOptions.value = data.map(ledger => ({
        title: ledger,
        value: ledger,
      }))
      
      console.log('Ledger options loaded:', ledgerOptions.value.length)
    } else {
      console.error('Invalid ledger data format received:', data)
      ledgerOptions.value = []
    }
  } catch (err) {
    console.error('Error fetching ledger names:', err)
    ledgerOptions.value = []
  } finally {
    loadingLedgers.value = false
  }
}

// Function to update a transaction's ledger
const updateLedger = async (transactionId, ledger) => {
  console.log('Updating ledger for transaction:', transactionId, 'to', ledger)
  
  try {
    // Update the local state first
    transactions.value = transactions.value.map(transaction => {
      if (transaction.id === transactionId) {
        return {
          ...transaction,
          ledger: ledger,
        }
      }
      
      return transaction
    })
    
    // Notification removed - no message will be displayed after ledger update
  } catch (err) {
    console.error('Error updating ledger:', err)
    error.value = `Failed to update ledger: ${err.message}`
  }
}

// Function to update a transaction's type
const updateTransactionType = async (transactionId, newType, currentType) => {
  // If the type hasn't actually changed, do nothing
  if (newType === currentType) return
  
  console.log('Transaction type change requested:', currentType, '->', newType)
  
  // Store pending change data for the confirmation dialog
  pendingTransactionTypeChange.value = {
    id: transactionId,
    oldType: currentType,
    newType: newType,
  }
  
  // Show confirmation dialog
  showConfirmDialog.value = true
}

// Function to confirm transaction type change
const confirmTypeChange = () => {
  const { id, newType } = pendingTransactionTypeChange.value
  
  console.log('Confirming transaction type change for transaction:', id, 'to', newType)
  
  try {
    // Update the local state
    transactions.value = transactions.value.map(transaction => {
      if (transaction.id === id) {
        return {
          ...transaction,
          transaction_type: newType,
        }
      }
      
      return transaction
    })
    
    // Close the dialog
    showConfirmDialog.value = false
  } catch (err) {
    console.error('Error updating transaction type:', err)
    error.value = `Failed to update transaction type: ${err.message}`
    showConfirmDialog.value = false
  }
}

// Function to cancel transaction type change
const cancelTypeChange = () => {
  console.log('Cancelled transaction type change')
  
  // Reset the original transaction type in the UI
  const { id, oldType } = pendingTransactionTypeChange.value
  if (id && oldType) {
    // Find the transaction in the data
    const transaction = transactions.value.find(t => t.id === id)
    if (transaction) {
      // Reset to the original type
      transaction.transaction_type = oldType
    }
  }
  
  // Close the dialog
  showConfirmDialog.value = false
}

// Fetch transactions from the specified temp table
const fetchTransactions = async () => {
  if (!tempTableId.value) {
    error.value = 'Missing temp table ID'
    
    return
  }
  
  try {
    loading.value = true
    error.value = null
    message.value = ''
    
    console.log(`Fetching transactions for table ID: ${tempTableId.value}`)
    
    // Include company ID and email from sessionStorage
    const apiUrl = `https://api.tallyfy.in/api/getTempTable?temp_table=${encodeURIComponent(tempTableId.value)}&company=${encodeURIComponent(selectedCompany.value)}&email=${encodeURIComponent(userEmail.value)}`
    const response = await fetch(apiUrl)
    
    if (!response.ok) {
      throw new Error(`Failed to fetch transactions: ${response.status} ${response.statusText}`)
    }
    
    const data = await response.json()
    
    console.log('Fetched transactions:', data)
    
    if (data && data.rows && Array.isArray(data.rows)) {
      // Map the rows from the API response
      transactions.value = data.rows.map((item, index) => {
        // Format the date from m/dd/yyyy to dd/mm/yyyy
        let date = '-'
        if (item.transaction_date) {
          const dateObj = new Date(item.transaction_date)


          // Format as dd/mm/yyyy
          date = dateObj.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
          })
        }
        
        // Determine if it's a payment or receipt to display the amount properly
        const amount = item.amount || 0
        
        return {
          // Keep the original ID for internal operations
          id: parseInt(item.id, 10) || 0,

          // Add a sequential srNo that will be displayed in the table
          srNo: index + 1,
          date: date,
          description: item.description || '',
          transaction_type: item.transaction_type || '-',
          amount: amount,
          ledger: item.ledger || '-',

          // Keep original data for reference
          originalData: item,
        }
      })
      
      // Sort transactions by ID after mapping
      transactions.value.sort((a, b) => a.id - b.id)
      
      // Update srNo after sorting to ensure sequential numbering
      transactions.value = transactions.value.map((item, index) => ({
        ...item,
        srNo: index + 1,
      }))
      
      // Update table info
      if (data.rows.length > 0) {
        tableInfo.value = {
          totalRecords: data.rows.length,
          company: selectedCompanyName.value || '-',
          bankName: bankName.value || '-',
          email: userEmail.value || '-',
        }

        // Update counter cards
        calculateRowCounts(transactions.value)
      }
    } else {
      // If data structure is different than expected
      error.value = 'Invalid data format received from server'
      transactions.value = []
    }
  } catch (err) {
    console.error('Error fetching transactions:', err)
    error.value = err.message || 'Failed to load transactions'
    transactions.value = []
  } finally {
    loading.value = false
  }
}

// Calculate row counts based on transaction types (for all data)
const calculateRowCounts = data => {
  if (!data || !Array.isArray(data)) return
  
  // Use updateFilteredStats for consistency
  updateFilteredStats(data)
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

// Go back to the main banking page
const goBack = () => {
  router.push('/banking')
}

// Handle row click if needed
const handleRowClick = async row => {
  console.log('Row clicked:', row)
  
  // Removed the message notification
  // No notification will be shown now when a row is clicked
}

// Example actions (can be customized later)
const handleExport = () => {
  message.value = `Exported ${transactions.value.length} rows successfully`
}

const handleProcess = () => {
  if (selectedRows.value.length === 0) {
    error.value = "Please select at least one row to process."
    
    return
  }
  
  message.value = `Processing ${selectedRows.value.length} selected rows...`

  // Add your processing logic here
}

// Cell click handler
const handleCellClick = ({ row, header }) => {
  console.log('Cell clicked:', { row, header })
  
  // Removed the message that shows when clicking on ledger cell
  // No notification will appear now
}

// Load initial data from sessionStorage
const loadInitialData = async () => {
  try {
    console.log('Loading initial data from sessionStorage')
    
    // Get values from sessionStorage
    userEmail.value = sessionStorage.getItem('userEmail') || ''
    selectedCompany.value = sessionStorage.getItem('selectedCompany') || ''
    selectedCompanyName.value = sessionStorage.getItem('selectedCompanyName') || ''
    bankName.value = sessionStorage.getItem('bankName') || ''

    const sessionTable = sessionStorage.getItem('tempTable')
    
    console.log('Session storage values:', {
      userEmail: userEmail.value,
      selectedCompany: selectedCompany.value,
      selectedCompanyName: selectedCompanyName.value,
      bankName: bankName.value,
      tempTable: sessionTable,
    })
    
    // Update table info with sessionStorage data
    tableInfo.value = {
      ...tableInfo.value,
      company: selectedCompanyName.value,
      bankName: bankName.value,
      email: userEmail.value,
    }

    // Fetch ledgers for the dropdown
    await fetchLedgerNames()
    
    // If we have a table ID from the URL query, use it
    if (tempTableId.value) {
      await fetchTransactions()
    } 

    // Otherwise, if we have a tempTable from sessionStorage, use that
    else if (sessionTable) {
      console.log('Using tempTable from sessionStorage:', sessionTable)

      // Update the route query to include the tempTable ID
      router.replace({
        query: { 
          ...route.query,
          id: sessionTable,
        },
      })
    } else {
      error.value = 'No table ID found in URL or sessionStorage'
    }
  } catch (err) {
    console.error('Error loading initial data:', err)
    error.value = `Failed to load initial data: ${err.message}`
  }
}

// Initialize when component mounts
onMounted(() => {
  loadInitialData()
})

// Watch for changes in temp table ID
watch(tempTableId, () => {
  fetchTransactions()
})

// Add a function to save all ledger mappings
const saveAllLedgerMappings = async () => {
  try {
    message.value = "Saving ledger mappings..."
    
    // Filter out transactions with no ledger or with default "-" value
    const transactionsToSave = transactions.value
      .filter(transaction => transaction.ledger && transaction.ledger !== '-')
      .map(transaction => ({
        id: transaction.id,

        // Handle both string and object formats for ledger
        ledger: typeof transaction.ledger === 'object' && transaction.ledger?.value 
          ? transaction.ledger.value 
          : (typeof transaction.ledger === 'object' && transaction.ledger?.title 
            ? transaction.ledger.title 
            : transaction.ledger),

        // Include transaction_type in the payload
        transaction_type: transaction.transaction_type,
      }))
    
    // Only proceed if there are transactions to save
    if (transactionsToSave.length === 0) {
      message.value = "No ledger mappings to save. Please assign ledgers first."
      setTimeout(() => {
        if (message.value === "No ledger mappings to save. Please assign ledgers first.") {
          message.value = ""
        }
      }, 3000)
      
      return
    }
    
    const payload = {
      temp_table: tempTableId.value,
      email: userEmail.value,
      company: selectedCompany.value,
      transactions: transactionsToSave,
    }
    
    console.log('Sending transaction data to API:', payload)
    
    // Send data to the specified API endpoint
    const response = await fetch('https://api.tallyfy.in/api/updateTempTableLedgers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
    
    const responseText = await response.text()

    console.log('API response text:', responseText)
    
    let result
    try {
      // Try to parse as JSON if possible
      result = JSON.parse(responseText)
    } catch (e) {
      // If not JSON, use text as message
      result = { message: responseText || 'Unknown response from server' }
    }
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}\nDetails: ${result.message || responseText}`)
    }
    
    console.log('API response parsed:', result)
    
    message.value = result.message || "Data saved successfully!"
    
    // Auto-clear message after a few seconds
    setTimeout(() => {
      if (message.value === "Data saved successfully!") {
        message.value = ""
      }
    }, 3000)
  } catch (err) {
    console.error('Error saving data:', err)
    error.value = `Failed to save data: ${err.message}`
  }
}

// Function to confirm delete
const confirmDeleteTransaction = transaction => {
  transactionToDelete.value = transaction
  deleteDialog.value = true
}

// Function to delete transaction
const deleteTransaction = async () => {
  try {
    if (!transactionToDelete.value || !tempTableId.value) {
      error.value = 'Missing transaction ID or temp table ID'
      
      return
    }
    
    console.log('Deleting transaction:', transactionToDelete.value.id, 'from table:', tempTableId.value)
    
    // Try POST instead of DELETE - many APIs use POST for all operations
    const response = await fetch('https://api.tallyfy.in/api/deleteTransaction', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        tempTable: tempTableId.value,
        transactionId: transactionToDelete.value.id,
      }),
    })
    
    if (!response.ok) {
      throw new Error(`Failed to delete transaction: ${response.status} ${response.statusText}`)
    }
    
    const result = await response.json()

    console.log('Delete response:', result)
    
    // After success, remove the deleted transaction and update srNo
    transactions.value = transactions.value
      .filter(t => t.id !== transactionToDelete.value.id)
      .map((item, index) => ({
        ...item,
        srNo: index + 1, // Update srNo to maintain sequence
      }))
    
    // Update counter cards
    calculateRowCounts(transactions.value)
    
    // Close dialog and show message
    deleteDialog.value = false
    message.value = result.message || 'Transaction deleted successfully'
    
    // Clear message after a few seconds
    setTimeout(() => {
      if (message.value === 'Transaction deleted successfully') {
        message.value = ''
      }
    }, 3000)
    
  } catch (err) {
    console.error('Error deleting transaction:', err)
    error.value = err.message || 'Failed to delete transaction'
    deleteDialog.value = false
  }
}

// Add function to watch filtered data and update counters
const updateFilteredStats = filtered => {
  console.log('Updating filtered stats based on', filtered.length, 'transactions')
  
  // Store the filtered transactions for reference
  filteredTransactions.value = filtered
  
  // Calculate counts based on filtered data
  const counts = {
    total: filtered.length,
    deposits: 0,
    withdrawals: 0,
    totalReceiptAmount: 0,
    totalPaymentAmount: 0,
  }
  
  filtered.forEach(row => {
    if (row.transaction_type === 'receipt') {
      counts.deposits++
      counts.totalReceiptAmount += parseFloat(row.amount) || 0
    } else if (row.transaction_type === 'payment') {
      counts.withdrawals++
      counts.totalPaymentAmount += parseFloat(row.amount) || 0
    }
  })
  
  // Update the counts
  rowCounts.value = counts
}
</script>

<template>
  <VCard class="mb-5">
    <VCardTitle class="d-flex justify-space-between align-center px-5 py-3">
      <div class="d-flex align-center gap-3">
        <VBtn
          icon
          variant="text"
          color="secondary"
          @click="goBack"
        >
          <VIcon
            icon="bx-chevron-left"
            size="28"
          />
        </VBtn>
        <div>{{ filename }}</div>
      </div>
      <VTextField
        v-model="selectedCompanyName"
        label="Company Name"
        readonly
        variant="outlined"
        density="compact"
        class="max-width-300"
      />
    </VCardTitle>
    
    <!-- Error and success messages -->
    <VCardText
      v-if="error || message"
      class="pt-0"
    >
      <VAlert
        v-if="error"
        type="error"
        closable
        variant="tonal"
        @click:close="error = ''"
      >
        {{ error }}
      </VAlert>
      <VAlert
        v-if="message"
        type="success"
        closable
        variant="tonal"
        @click:close="message = ''"
      >
        {{ message }}
      </VAlert>
    </VCardText>
    
    <!-- Action buttons and counters -->
    <VCardText class="pa-2">
      <div class="d-flex justify-space-between align-center flex-wrap gap-4">
        <div class="d-flex gap-3">
          <VBtn
            color="primary"
            variant="elevated"
            prepend-icon="bx-save"
            :disabled="transactions.length === 0"
            @click="saveAllLedgerMappings"
          >
            Save Ledgers
          </VBtn>
        </div>
        
        <div class="d-flex gap-3">
          <VCard
            color="primary"
            variant="tonal"
            class="counter-card"
          >
            <div class="counter-content">
              <div class="counter-title">
                Total Rows
              </div>
              <div class="counter-value">
                {{ rowCounts.total }}
              </div>
            </div>
          </VCard>
          
          <VCard
            color="success"
            variant="tonal"
            class="counter-card"
          >
            <div class="counter-content">
              <div class="counter-title">
                Receipts
              </div>
              <div class="counter-value">
                {{ rowCounts.deposits }}
              </div>
              <div class="counter-amount">
                {{ formatAmount(rowCounts.totalReceiptAmount) }}
              </div>
            </div>
          </VCard>
          
          <VCard
            color="error"
            variant="tonal"
            class="counter-card"
          >
            <div class="counter-content">
              <div class="counter-title">
                Payments
              </div>
              <div class="counter-value">
                {{ rowCounts.withdrawals }}
              </div>
              <div class="counter-amount">
                {{ formatAmount(rowCounts.totalPaymentAmount) }}
              </div>
            </div>
          </VCard>
        </div>
      </div>
    </VCardText>
  </VCard>
  
  <!-- Excel View Component -->
  <VCard>
    <VCardText>
      <!-- Bulk Actions Area -->
      <VCard
        v-if="selectedRows.length >= 2"
        class="bulk-actions mb-4"
        flat
      >
        <VCardText class="d-flex gap-3 align-center">
          <!-- Bulk Delete -->
          <VBtn
            color="error"
            variant="elevated"
            @click="confirmBulkDelete"
          >
            Bulk Delete ({{ selectedRows.length }})
          </VBtn>

          <!-- Bulk Assign Ledger -->
          <VSelect
            v-model="bulkLedger"
            :items="ledgerOptions"
            item-title="title"
            item-value="value"
            return-object
            placeholder="Select Ledger"
            density="compact"
            variant="outlined"
            class="bulk-ledger-select"
            :loading="loadingLedgers"
          />
          <VBtn
            color="primary"
            variant="elevated"
            :disabled="!bulkLedger"
            @click="applyBulkAssignLedger"
          >
            Assign Ledger
          </VBtn>
        </VCardText>
      </VCard>


      <ExcelView
        v-model:selected="selectedRows"
        :headers="headers"
        :items="transactions"
        :density="settings.density"
        :height="settings.height"
        :fixed-header="settings.fixedHeader"
        :bordered="settings.bordered"
        :striped="settings.striped"
        :hover="settings.hover"
        :selectable="settings.selectable"
        :loading="loading"
        :show-pagination="false"
        searchable
        :items-per-page="100"
        :sort-by="[{ key: 'id', order: 'asc' }]"
        @row-click="handleRowClick"
        @cell-click="handleCellClick"
        @filter="updateFilteredStats"
      >
        <!-- Empty title slot to remove the title -->
        <template #title />
        
        <!-- Format transaction date -->
        <template #item.date="{ value }">
          {{ value }}
        </template>
        
        <!-- Format transaction type with dropdown -->
        <template #item.transaction_type="{ item }">
          <VSelect
            :model-value="item.transaction_type"
            :items="['receipt', 'payment']"
            density="compact"
            variant="outlined"
            hide-details
            class="transaction-type-select"
            @update:model-value="(newType) => updateTransactionType(item.id, newType, item.transaction_type)"
          >
            <!-- Simplified selection template without color coding -->
            <template #selection="{ item }">
              {{ item.raw }}
            </template>
          </VSelect>
        </template>
        
        <!-- Format amount based on transaction type -->
        <template #item.amount="{ value, item }">
          <span :class="item.transaction_type === 'payment' ? 'text-error' : 'text-success'">
            {{ formatAmount(value) }}
          </span>
        </template>
        
        <!-- Format ledger -->
        <template #item.ledger="{ item }">
          <VSelect
            v-model="item.ledger"
            :items="ledgerOptions"
            item-title="title"
            item-value="value"
            placeholder="Select Ledger"
            :loading="loadingLedgers"
            density="compact"
            variant="outlined"
            hide-details
            class="ledger-select"
            :disabled="loadingLedgers"
            return-object
            @update:model-value="updateLedger(item.id, $event)"
          >
            <template #selection="{ item }">
              <span>{{ item.title }}</span>
            </template>
          </VSelect>
        </template>
        
        <!-- Custom actions for each row -->
        <template #item-actions="{ item }">
          <div class="d-flex gap-1">
            <VBtn
              size="x-small"
              icon
              color="error"
              variant="text"
              @click.stop="confirmDeleteTransaction(item)"
            >
              <VIcon icon="bx-trash" />
            </VBtn>
          </div>
        </template>
      </ExcelView>
    </VCardText>
  </VCard>
  
  <!-- Confirmation Dialog for Transaction Type Change -->
  <VDialog
    v-model="showConfirmDialog"
    max-width="500"
    persistent
  >
    <VCard>
      <VCardTitle class="text-h6">
        Confirm Transaction Type Change
      </VCardTitle>
      
      <VCardText>
        Are you sure you want to change the transaction type from 
        <strong>{{ pendingTransactionTypeChange.oldType }}</strong> to 
        <strong>{{ pendingTransactionTypeChange.newType }}</strong>?
      </VCardText>
      
      <VCardActions>
        <VSpacer />
        
        <VBtn
          color="primary"
          variant="text"
          @click="cancelTypeChange"
        >
          Cancel
        </VBtn>
        
        <VBtn
          color="error"
          variant="elevated"
          @click="confirmTypeChange"
        >
          Confirm Change
        </VBtn>
      </VCardActions>
    </VCard>
  </VDialog>

  <!-- Delete Confirmation Dialog -->
  <VDialog
    v-model="deleteDialog"
    max-width="500"
    persistent
  >
    <VCard>
      <VCardTitle class="text-h6">
        Confirm Transaction Deletion
      </VCardTitle>
      
      <VCardText>
        Are you sure you want to delete the transaction?
      </VCardText>
      
      <VCardActions>
        <VSpacer />
        
        <VBtn
          color="primary"
          variant="text"
          @click="deleteTransaction"
        >
          Delete
        </VBtn>
        
        <VBtn
          color="error"
          variant="elevated"
          @click="deleteDialog = false"
        >
          Cancel
        </VBtn>
      </VCardActions>
    </VCard>
  </VDialog>

  <!-- Bulk Delete Confirmation -->
  <VDialog
    v-model="showBulkDeleteDialog"
    max-width="500"
    persistent
  >
    <VCard>
      <VCardTitle class="text-h6">
        Confirm Bulk Delete
      </VCardTitle>
      <VCardText>
        Are you sure you want to delete <strong>{{ selectedRows.length }}</strong> selected transactions?
      </VCardText>
      <VCardActions>
        <VSpacer />
        <VBtn
          color="primary"
          variant="text"
          @click="showBulkDeleteDialog = false"
        >
          Cancel
        </VBtn>
        <VBtn
          color="error"
          variant="elevated"
          @click="bulkDeleteTransactions"
        >
          Delete All
        </VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
</template>

<style lang="scss" scoped>
.v-card-title {
  border-block-end: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
}

.bulk-actions {
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  background: rgba(var(--v-theme-surface), var(--v-theme-surface-opacity));
}

.counter-card {
  display: flex;
  align-items: center;
  justify-content: center;
  block-size: 70px;
  inline-size: 180px;
}

.bulk-ledger-select {
  min-inline-size: 200px;
}

.counter-content {
  text-align: center;
}

.counter-title {
  font-size: 14px;
  font-weight: 500;
}

.counter-value {
  font-size: 28px;
  font-weight: 600;
}

.counter-amount {
  color: rgba(var(--v-theme-on-surface), 0.8);
  font-size: 14px;
  font-weight: 400;
  margin-block-start: 4px;
}

.max-width-300 {
  max-inline-size: 300px;
}

// Add styles for the ledger select dropdown
.ledger-select {
  font-size: 14px;
  inline-size: 100%;

  :deep(.v-field__input) {
    min-block-size: 32px;
    padding-block: 4px;
  }

  :deep(.v-field) {
    border-radius: 4px;
  }
}

// Add styles for the transaction type dropdown
.transaction-type-select {
  font-size: 14px;
  inline-size: 100%;

  :deep(.v-field__input) {
    min-block-size: 32px;
    padding-block: 4px;
  }

  :deep(.v-field) {
    border-radius: 4px;
  }
}
</style>
