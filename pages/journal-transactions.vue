<script setup>
import { computed, onMounted, ref } from 'vue'
import ExcelView from '~/components/ExcelView.vue'
import FileUploadDialog from '~/components/FileUploadDialog.vue'

definePageMeta({ layout: 'default' })

// Define headers for the journal transactions table
const headers = [
  { 
    title: 'Sr. No.', 
    key: 'sr_no', 
    sortable: true, 
    width: '70px',
    align: 'center',
  },
  { 
    title: 'ID', 
    key: 'id', 
    sortable: true, 
    width: '70px',
    align: 'center',
  },
  { 
    title: 'Journal No', 
    key: 'journal_no', 
    sortable: true, 
    width: '110px',
    align: 'start',
  },
  { 
    title: 'Reference No', 
    key: 'reference_no', 
    sortable: true, 
    width: '120px',
    align: 'start',
  },
  { 
    title: 'Date', 
    key: 'date', 
    sortable: true, 
    width: '120px',
    align: 'start',
  },
  { 
    title: 'Cost Center', 
    key: 'cost_center', 
    sortable: true, 
    align: 'start', 
  },
  { 
    title: 'Particulars', 
    key: 'particulars', 
    sortable: true, 
    align: 'start', 
  },
  { 
    title: 'Dr/Cr', 
    key: 'dr_cr', 
    sortable: true, 
    width: '80px',
    align: 'center', 
  },
  { 
    title: 'Amount', 
    key: 'amount', 
    sortable: true, 
    width: '120px',
    align: 'end', 
  },
  { 
    title: 'Ledger Narration', 
    key: 'ledger_narration', 
    sortable: true, 
    align: 'start', 
  },
  { 
    title: 'Status', 
    key: 'status', 
    sortable: true, 
    width: '100px',
    align: 'center', 
  },
]

// Table data and state
const journalTransactions = ref([])
const loading = ref(true)
const selectedRows = ref([])
const showUploadDialog = ref(false)
const error = ref('')
const uploading = ref(false)
const userEmail = ref('admin@gmail.com')  // Default for demo, would come from auth
const selectedCompany = ref({ company_id: '100000', name: 'Niraj Wani' })  // Default for demo

// Statistics
const stats = computed(() => {
  const total = journalTransactions.value.length
  const saved = journalTransactions.value.filter(item => item.status === 'saved').length
  const pending = journalTransactions.value.filter(item => item.status === 'pending').length
  const sentToTally = journalTransactions.value.filter(item => item.status === 'sent to tally').length
  
  return { total, saved, pending, sentToTally }
})

// Define filter options
const dateRange = ref({ from: null, to: null })
const filterOptions = ref({
  journal_no: '',
  reference_no: '',
  cost_center: '',
  particulars: '',
  dr_cr: '',
  status: '',
})

// Define compulsory headers for upload
const compulsoryHeaders = [
  "Journal No", "Reference No", "Date", "Cost Center", "Particulars", "Dr/Cr", "Amount", "Ledger Narration"
]

// Fetch journal transactions from API
const fetchJournalTransactions = async () => {
  loading.value = true
  
  try {
    // Simulate API call with a delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Mock data for demo - in real app, this would be an API call
    const mockData = Array.from({ length: 186 }, (_, i) => {
      const isDr = Math.random() > 0.5
      const amount = Math.floor(Math.random() * 10000) + 1000
      const journalNo = Math.floor(Math.random() * 10) + 1
      const referenceNo = Math.floor(Math.random() * 10) + 1000
      
      const statusOptions = ['pending', 'saved', 'sent to tally']
      const costCenters = ['Medicine Expense', 'Riddhi Siddhi', 'Kirana Expense', 'Adwani Traders']
      const particulars = ['Medicine Expense', 'Riddhi Siddhi', 'Kirana Expense', 'Adwani Traders']
      
      const randomStatus = statusOptions[Math.floor(Math.random() * statusOptions.length)]
      const randomCostCenter = costCenters[Math.floor(Math.random() * costCenters.length)]
      const randomParticulars = particulars[Math.floor(Math.random() * particulars.length)]
      
      return {
        sr_no: i + 1,
        id: i + 1,
        journal_no: journalNo,
        reference_no: referenceNo,
        date: '31-03-2024',
        cost_center: randomCostCenter,
        particulars: randomParticulars,
        dr_cr: isDr ? 'Dr' : 'Cr',
        amount: isDr ? amount : amount,
        ledger_narration: `Payment for ${randomParticulars.toLowerCase()}`,
        status: randomStatus,
      }
    })
    
    journalTransactions.value = mockData
  } catch (err) {
    console.error('Failed to fetch journal transactions', err)
    error.value = 'Failed to load journal transactions. Please try again.'
  } finally {
    loading.value = false
  }
}

// Handle row click
const handleRowClick = (row) => {
  console.log('Row clicked:', row)
}

// Handle viewing a transaction
const handleViewTransaction = (transaction) => {
  console.log('View transaction:', transaction)
  // Navigate to transaction detail page
  // navigateTo(`/journal-transaction/${transaction.id}`)
}

// Handle saving selected transactions
const handleSaveSelected = async () => {
  if (selectedRows.value.length === 0) return
  
  loading.value = true
  
  try {
    // Simulate API call with a delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Update status of selected rows
    journalTransactions.value = journalTransactions.value.map(transaction => {
      if (selectedRows.value.some(selected => selected.id === transaction.id)) {
        return { ...transaction, status: 'saved' }
      }
      return transaction
    })
    
    // Clear selection
    selectedRows.value = []
    
    // Show success message
    alert(`Successfully saved ${selectedRows.value.length} transactions`)
  } catch (err) {
    console.error('Failed to save transactions', err)
    error.value = 'Failed to save transactions. Please try again.'
  } finally {
    loading.value = false
  }
}

// Handle sending selected transactions to Tally
const handleSendToTally = async () => {
  if (selectedRows.value.length === 0) return
  
  loading.value = true
  
  try {
    // Simulate API call with a delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Update status of selected rows
    journalTransactions.value = journalTransactions.value.map(transaction => {
      if (selectedRows.value.some(selected => selected.id === transaction.id)) {
        return { ...transaction, status: 'sent to tally' }
      }
      return transaction
    })
    
    // Clear selection
    selectedRows.value = []
    
    // Show success message
    alert(`Successfully sent ${selectedRows.value.length} transactions to Tally`)
  } catch (err) {
    console.error('Failed to send transactions to Tally', err)
    error.value = 'Failed to send transactions to Tally. Please try again.'
  } finally {
    loading.value = false
  }
}

// Handle delete transaction
const handleDeleteTransaction = async (transaction) => {
  if (!confirm(`Are you sure you want to delete transaction #${transaction.id}?`)) {
    return
  }
  
  try {
    // Simulate API call with a delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Remove transaction from list
    journalTransactions.value = journalTransactions.value.filter(t => t.id !== transaction.id)
    
    // Show success message
    alert(`Successfully deleted transaction #${transaction.id}`)
  } catch (err) {
    console.error('Failed to delete transaction', err)
    error.value = 'Failed to delete transaction. Please try again.'
  }
}

// Handle export to Excel
const handleExportExcel = (data) => {
  console.log('Export to Excel:', data.length, 'rows')
  alert(`Export to Excel: ${data.length} rows (Would trigger actual Excel export in production)`)
}

// Handle export to CSV
const handleExportCsv = (data) => {
  console.log('Export to CSV:', data.length, 'rows')
  alert(`Export to CSV: ${data.length} rows (Would trigger actual CSV export in production)`)
}

// Handle upload success
const handleUploadSuccess = (result) => {
  alert(`Successfully uploaded file: ${result.file.name}`)
  fetchJournalTransactions()
}

// Apply filters (date range, search)
const applyFilters = () => {
  fetchJournalTransactions()
}

// Reset filters
const resetFilters = () => {
  dateRange.value = { from: null, to: null }
  
  Object.keys(filterOptions.value).forEach(key => {
    filterOptions.value[key] = ''
  })
  
  fetchJournalTransactions()
}

onMounted(() => {
  fetchJournalTransactions()
})
</script>

<template>
  <div>
    <VCard>
      <VCardText>
        <!-- Header section with title and buttons -->
        <div class="d-flex align-center flex-wrap gap-4 mb-6">
          <div>
            <h4 class="text-h5 font-weight-medium mb-1">
              Journal Transactions
            </h4>
            <p class="text-body-2 text-medium-emphasis mb-0">
              Manage and synchronize journal entries with Tally
            </p>
          </div>
          
          <div class="d-flex align-center flex-wrap gap-4 ms-auto">
            <VBtn
              prepend-icon="bx-download"
              variant="tonal"
              color="primary"
              @click="handleExportExcel(journalTransactions)"
            >
              Download Template
            </VBtn>
            <VBtn
              prepend-icon="bx-upload"
              color="primary"
              @click="showUploadDialog = true"
            >
              Upload
            </VBtn>
          </div>
        </div>
        
        <!-- Statistics cards -->
        <VRow class="mb-6">
          <VCol cols="12" sm="6" md="3">
            <VCard
              color="primary"
              variant="tonal"
              class="stat-card"
            >
              <VCardItem>
                <VCardTitle>Total Rows</VCardTitle>
                <div class="text-h4 font-weight-bold">
                  {{ stats.total }}
                </div>
              </VCardItem>
            </VCard>
          </VCol>
          
          <VCol cols="12" sm="6" md="3">
            <VCard
              color="success"
              variant="tonal"
              class="stat-card"
            >
              <VCardItem>
                <VCardTitle>Saved</VCardTitle>
                <div class="text-h4 font-weight-bold">
                  {{ stats.saved }}
                </div>
              </VCardItem>
            </VCard>
          </VCol>
          
          <VCol cols="12" sm="6" md="3">
            <VCard
              color="warning"
              variant="tonal"
              class="stat-card"
            >
              <VCardItem>
                <VCardTitle>Pending</VCardTitle>
                <div class="text-h4 font-weight-bold">
                  {{ stats.pending }}
                </div>
              </VCardItem>
            </VCard>
          </VCol>
          
          <VCol cols="12" sm="6" md="3">
            <VCard
              color="info"
              variant="tonal"
              class="stat-card"
            >
              <VCardItem>
                <VCardTitle>Sent to Tally</VCardTitle>
                <div class="text-h4 font-weight-bold">
                  {{ stats.sentToTally }}
                </div>
              </VCardItem>
            </VCard>
          </VCol>
        </VRow>
        
        <!-- Date range filter -->
        <VCard class="mb-6" title="Filters" variant="outlined">
          <VCardText>
            <VRow>
              <VCol cols="12" md="8">
                <div class="d-flex flex-column flex-md-row gap-4">
                  <VTextField
                    v-model="dateRange.from"
                    label="From Date"
                    type="date"
                    density="compact"
                    hide-details
                    class="filter-field"
                  />
                  
                  <VTextField
                    v-model="dateRange.to"
                    label="To Date"
                    type="date"
                    density="compact"
                    hide-details
                    class="filter-field"
                  />
                </div>
              </VCol>
              
              <VCol cols="12" md="4" class="d-flex align-center justify-end gap-4">
                <VBtn
                  color="primary"
                  variant="tonal"
                  @click="applyFilters"
                >
                  Apply Filters
                </VBtn>
                
                <VBtn
                  color="secondary"
                  variant="tonal"
                  @click="resetFilters"
                >
                  Clear
                </VBtn>
              </VCol>
            </VRow>
          </VCardText>
        </VCard>
        
        <!-- Bulk actions for selected rows -->
        <div
          v-if="selectedRows.length > 0"
          class="bulk-actions d-flex align-center gap-4 mb-4 pa-4"
        >
          <div class="text-body-1 font-weight-medium">
            {{ selectedRows.length }} rows selected
          </div>
          
          <div class="d-flex gap-2 ms-auto">
            <VBtn
              color="success"
              prepend-icon="bx-save"
              @click="handleSaveSelected"
            >
              Save Selected
            </VBtn>
            
            <VBtn
              color="primary"
              prepend-icon="bx-send"
              @click="handleSendToTally"
            >
              Send To Tally
            </VBtn>
          </div>
        </div>
        
        <!-- Excel View Component -->
        <ExcelView
          :headers="headers"
          :items="journalTransactions"
          :loading="loading"
          height="600"
          density="comfortable"
          fixed-header
          striped
          hover
          selectable
          :items-per-page="20"
          v-model:selected="selectedRows"
          @row-click="handleRowClick"
          @export-excel="handleExportExcel"
          @export-csv="handleExportCsv"
        >
          <!-- Custom title slot - we're not using this as we have our custom header above -->
          <template #title>
            <!-- Intentionally left empty as we have a custom header -->
          </template>
          
          <!-- Date cell format -->
          <template #item.date="{ value }">
            {{ value }}
          </template>
          
          <!-- Dr/Cr cell format -->
          <template #item.dr_cr="{ value }">
            <span :class="value === 'Dr' ? 'text-primary font-weight-medium' : 'text-error font-weight-medium'">
              {{ value }}
            </span>
          </template>
          
          <!-- Amount cell format -->
          <template #item.amount="{ value }">
            ₹ {{ value.toLocaleString() }}
          </template>
          
          <!-- Status cell format -->
          <template #item.status="{ value }">
            <VChip
              size="small"
              :color="
                value === 'pending' ? 'warning' : 
                value === 'saved' ? 'success' : 'info'
              "
              :class="
                value === 'pending' ? 'text-warning' : 
                value === 'saved' ? 'text-success' : 'text-info'
              "
            >
              {{ value }}
            </VChip>
          </template>
          
          <!-- Actions cell -->
          <template #item-actions="{ item }">
            <div class="d-flex gap-1">
              <VBtn
                size="small"
                icon
                variant="text"
                color="primary"
                @click.stop="handleViewTransaction(item)"
              >
                <VIcon icon="bx-show" />
              </VBtn>
              
              <VBtn
                v-if="item.status === 'pending'"
                size="small"
                icon
                variant="text"
                color="success"
                @click.stop="handleSaveSelected([item])"
              >
                <VIcon icon="bx-save" />
              </VBtn>
              
              <VBtn
                v-if="item.status === 'saved'"
                size="small"
                icon
                variant="text"
                color="info"
                @click.stop="handleSendToTally([item])"
              >
                <VIcon icon="bx-send" />
              </VBtn>
              
              <VBtn
                size="small"
                icon
                variant="text"
                color="error"
                @click.stop="handleDeleteTransaction(item)"
              >
                <VIcon icon="bx-trash" />
              </VBtn>
            </div>
          </template>
        </ExcelView>
      </VCardText>
    </VCard>

    <!-- File Upload Dialog -->
    <FileUploadDialog
      v-model:show="showUploadDialog"
      title="Upload Journal Transactions"
      upload-api="http://localhost:3001/api/uploadJournalTransactions"
      :required-fields="compulsoryHeaders"
      :extra-data="{
        email: userEmail,
        company: selectedCompany.company_id,
      }"
      @upload-success="handleUploadSuccess"
    />
  </div>
</template>

<style lang="scss" scoped>
.filter-field {
  min-inline-size: 160px;
}

.bulk-actions {
  border: 1px dashed rgba(var(--v-theme-primary), 0.7);
  border-radius: 8px;
  background-color: rgba(var(--v-theme-primary), 0.05);
}

.stat-card {
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-4px);
  }
}

@media (max-width: 600px) {
  .filter-field {
    inline-size: 100%;
  }
}
</style> 
