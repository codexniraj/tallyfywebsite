<script setup>
import axios from 'axios'
import { onMounted, ref } from 'vue'
import AddLedgerDialog from '~/components/AddLedgerDialog.vue'
import ExcelView from '~/components/ExcelView.vue'

definePageMeta({ layout: 'blank' })

// State variables
const items = ref([])
const headers = ref([])
const loading = ref(true)
const selectedRows = ref([])
const error = ref('')
const message = ref('')
const tempTable = ref('')
const userEmail = ref('')
const selectedCompany = ref('')
const ledgerOptions = ref([])
const invalidLedgers = ref([])

const rowCounts = ref({
  total: 0,
  saved: 0,
  sentToTally: 0,
})

// Table settings with defaults matching the requirements
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

// Add Ledger Dialog
const showAddLedgerDialog = ref(false)

// Fetch data from the API
const fetchData = async tableName => {
  console.log('Fetching data for table:', tableName)
  if (!tableName) {
    console.error('No table name provided to fetchData')
    error.value = 'No table name provided'
    loading.value = false
    
    return
  }

  try {
    loading.value = true
    items.value = []
    
    // Make API request with timestamp to prevent caching
    const timestamp = Date.now()

    console.log('Making API request to get journal data')
    
    // In real implementation, use your API endpoint
    const res = await axios.get('http://3.108.64.167:3001/api/getJournalData', {
      params: { 
        tempTable: tableName,
      },
    })

    console.log('API response received:', res.data)

    if (res.data && Array.isArray(res.data)) {
      if (res.data.length === 0) {
        console.warn('No rows returned from backend')
        error.value = 'No data available'
        loading.value = false
        
        return
      }

      if (!('id' in res.data[0])) {
        console.error('Fetched data missing ID:', res.data[0])
        error.value = 'Fetched data missing ID'
        loading.value = false
        
        return
      }

      // Dynamically create headers from the first data row
      const firstRow = res.data[0]

      headers.value = Object.keys(firstRow).map(key => {
        // Default configuration for each column
        const config = {
          title: key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
          key: key,
          sortable: true,
          align: key === 'amount' ? 'end' : key === 'id' || key === 'dr_cr' || key === 'status' ? 'center' : 'start',
        }
        
        // Special configurations for specific columns
        if (key === 'id') {
          config.title = 'Sr. No.'
          config.width = '80px'
        } else if (key === 'amount') {
          config.width = '120px'
        } else if (key === 'dr_cr') {
          config.width = '100px'
        } else if (key === 'status') {
          config.width = '120px'
        } else if (key === 'date' || key === 'journal_no' || key === 'reference_no') {
          config.width = '120px'
        }
        
        return config
      })

      console.log('Generated headers:', headers.value)
      
      // Set the data
      items.value = res.data
      calculateRowCounts(res.data)
      tempTable.value = tableName
      sessionStorage.setItem('tempTable', tableName)
      
      // Get any metadata like invalid ledgers
      const uploadMeta = JSON.parse(sessionStorage.getItem('uploadMeta')) || {}

      invalidLedgers.value = uploadMeta.invalidLedgers || []
      
      console.log('Data loaded successfully:', items.value.length, 'rows')
    } else {
      console.error('Invalid data format received:', res.data)
      error.value = 'Invalid data format received from server'
    }
    
    loading.value = false
  } catch (err) {
    console.error('Error fetching data:', err)
    error.value = 'Failed to load data: ' + (err.response?.data?.error || err.message)
    loading.value = false
  }
}

// Mock API call for ledger names
const fetchLedgerNames = async () => {
  try {
    console.log('Fetching ledger names for company:', selectedCompany.value)
    
    if (!userEmail.value || !selectedCompany.value) {
      console.error('Missing user email or company for ledger fetch')
      
      return
    }
    
    // In a real implementation, fetch from your API
    const res = await axios.get('http://3.108.64.167:3001/api/getMergedLedgerNames', {
      params: { 
        email: userEmail.value, 
        company: selectedCompany.value, 
      },
    })
    
    console.log('Ledger names received:', res.data)
    ledgerOptions.value = res.data
  } catch (err) {
    console.error('Error fetching ledger names:', err)
    error.value = 'Failed to load ledger names: ' + (err.response?.data?.error || err.message)
  }
}

// Sample data generation
const generateSampleData = (count = 50) => {
  const statusOptions = ['pending', 'saved', 'send to tally']
  const drCrOptions = ['Dr', 'Cr']
  const costCenters = ['Marketing', 'Sales', 'Finance', 'HR', 'IT', 'Admin', 'Operations']

  const particulars = [
    'Office Rent',
    'Salaries',
    'Utilities',
    'Internet Services', 
    'Software Subscriptions',
    'Travel Expenses',
    'Marketing Campaign', 
    'Equipment Purchase',
    'Legal Services',
    'Consulting Fees',
  ]
  
  return Array.from({ length: count }, (_, i) => {
    const amount = Math.floor(Math.random() * 10000) + 1000
    const refNo = Math.floor(Math.random() * 15) + 1
    const journalNo = Math.floor(Math.random() * 10) + 1
    const randomMonth = Math.floor(Math.random() * 3)
    const randomDay = Math.floor(Math.random() * 28) + 1
    
    return {
      id: i + 1,
      journal_no: journalNo,
      reference_no: refNo,
      date: new Date(2024, randomMonth, randomDay).toLocaleDateString(),
      cost_center: costCenters[Math.floor(Math.random() * costCenters.length)],
      particulars: particulars[Math.floor(Math.random() * particulars.length)],
      dr_cr: drCrOptions[Math.floor(Math.random() * drCrOptions.length)],
      amount: amount,
      ledger_narration: `Payment for ${particulars[Math.floor(Math.random() * particulars.length)].toLowerCase()}`,
      narration: `Transaction details for reference #${refNo}`,
      status: statusOptions[Math.floor(Math.random() * statusOptions.length)],
    }
  })
}

// Calculate the row counts (total, saved, sent to tally)
const calculateRowCounts = data => {
  if (!data || !Array.isArray(data)) return
  
  const counts = {
    total: data.length,
    saved: 0,
    sentToTally: 0,
  }
  
  data.forEach(row => {
    if (row.status) {
      const status = row.status.toLowerCase()
      if (status === 'saved') {
        counts.saved++
      } else if (status === 'send to tally') {
        counts.sentToTally++
      }
    }
  })
  
  console.log('Calculated row counts:', counts)
  rowCounts.value = counts
}

// Save selected rows to database
const handleSave = async () => {
  if (selectedRows.value.length === 0) {
    error.value = "Please select at least one row to save."
    
    return
  }
  
  try {
    message.value = "Saving selected rows..."
    error.value = ''
    
    // In real implementation, this would be an API call
    // await axios.post('/api/updateJournalRows', {
    //   tempTable: tempTable.value,
    //   rows: selectedRows.value
    // })
    
    // For demo, simulate a delay and update rows
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Update status of selected rows
    items.value = items.value.map(item => {
      if (selectedRows.value.some(selected => selected.id === item.id)) {
        return { ...item, status: 'saved' }
      }
      
      return item
    })
    
    // Recalculate counts
    calculateRowCounts(items.value)
    
    await refreshData()
    message.value = "Selected rows saved successfully."
    selectedRows.value = []
  } catch (err) {
    console.error("Save error:", err)
    error.value = "Save failed: " + (err.response?.data?.error || err.message)
  }
}

// Send selected rows to Tally
const handleSendToTally = async () => {
  if (selectedRows.value.length === 0) {
    error.value = "Please select at least one row to send to Tally."
    
    return
  }
  
  // Show confirmation dialog (could be implemented with a proper modal)
  const confirmed = window.confirm("Are you sure you want to send the selected entries to Tally?")
  if (!confirmed) {
    return
  }
  
  try {
    message.value = "Sending to Tally..."
    error.value = ''
    
    // In real implementation, this would be an API call
    // await axios.post('/api/sendToTally', {
    //   tempTable: tempTable.value,
    //   rows: selectedRows.value
    // })
    
    // For demo, simulate a delay and update rows
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Update status of selected rows
    items.value = items.value.map(item => {
      if (selectedRows.value.some(selected => selected.id === item.id)) {
        return { ...item, status: 'send to tally' }
      }
      
      return item
    })
    
    // Recalculate counts
    calculateRowCounts(items.value)
    
    await refreshData()
    message.value = "Selected rows sent to Tally successfully."
    selectedRows.value = []
  } catch (err) {
    console.error("Send to Tally error:", err)
    error.value = "Send to Tally failed: " + (err.response?.data?.error || err.message)
  }
}

// Function for Export Excel button in the table
const exportToExcel = () => {
  console.log('Exporting to Excel:', items.value.length, 'rows')
  message.value = `Exported ${items.value.length} rows to Excel successfully`
}

// Function for Export CSV button in the table
const save = () => {
  console.log('Exporting to CSV:', items.value.length, 'rows')
  message.value = `Exported ${items.value.length} rows to CSV successfully`
}

// Handle row deletion
const handleDeleteRow = async rowId => {
  if (!rowId) {
    console.error('No row ID provided for deletion')
    
    return
  }
  
  // Confirm deletion
  const confirmed = window.confirm('Are you sure you want to delete this row? This action cannot be undone.')
  if (!confirmed) {
    return
  }
  
  try {
    console.log('Deleting row:', rowId)
    
    // Send delete request to API
    const response = await axios.post('http://3.108.64.167:3001/api/deleteJournalRow', { 
      tempTable: tempTable.value,
      rowId: rowId,
    })
    
    console.log('Delete response:', response.data)
    
    if (response.data.success) {
      message.value = `Row ${rowId} deleted successfully`
      
      // Refresh data after deletion
      await refreshData()
    }
  } catch (err) {
    console.error('Error deleting row:', err)
    error.value = `Error deleting row: ${err.response?.data?.details || err.message}`
  }
}

// Refresh data 
const refreshData = async () => {
  error.value = ''
  message.value = ''
  console.log('Refreshing data')
  await fetchData(tempTable.value)
}

// Add ledger (would be implemented as a modal in real app)
const handleAddLedger = () => {
  showAddLedgerDialog.value = true
}

const handleLedgerAdded = ledgerName => {
  message.value = `Ledger "${ledgerName}" added successfully`
}

// Handle row click
const handleRowClick = row => {
  console.log('Row clicked:', row)
}

// Handle cell click
const handleCellClick = ({ row, header }) => {
  console.log('Cell clicked:', { row, header })
}

// Custom Excel export
const handleExportExcel = data => {
  console.log('Export to Excel:', data.length, 'rows')
}

// Custom CSV export
const handleExportCsv = data => {
  console.log('Export to CSV:', data.length, 'rows')
}

// Load data from session storage or API on component mount
const loadInitialData = async () => {
  try {
    console.log('Loading initial data from session storage')
    
    // Get values from session storage
    userEmail.value = sessionStorage.getItem('userEmail')
    selectedCompany.value = sessionStorage.getItem('selectedCompany')

    const sessionTable = sessionStorage.getItem('tempTable')
    
    console.log('Session storage values:', {
      userEmail: userEmail.value,
      selectedCompany: selectedCompany.value,
      tempTable: sessionTable,
    })
    
    if (!userEmail.value || !selectedCompany.value) {
      console.error('Missing user email or company in session storage')
      error.value = "Missing user email or company"
      loading.value = false
      
      return
    }
    
    // Try to get the table from sessionStorage
    console.log('Session table value:', sessionTable)
    
    if (sessionTable) {
      // If we have a table in sessionStorage, use it
      tempTable.value = sessionTable
      console.log('Using table from session storage:', tempTable.value)
      await fetchData(sessionTable)
      await fetchLedgerNames()
    } else {
      // If no table in sessionStorage, get the latest from API
      console.log('No table in session storage, fetching latest upload')

      const uploadRes = await axios.get('http://3.108.64.167:3001/api/getUserJournelUploads', {
        params: { 
          email: userEmail.value, 
          company: selectedCompany.value, 
        },
      })
      
      console.log('User uploads response:', uploadRes.data)
      
      if (uploadRes.data && uploadRes.data.length > 0) {
        const latestTable = uploadRes.data[0].temp_table

        tempTable.value = latestTable
        console.log('Using latest table from API:', tempTable.value)
        await fetchData(latestTable)
        await fetchLedgerNames()
      } else {
        console.error('No journal data found')
        error.value = "No journal data found"
        loading.value = false
      }
    }
    
  } catch (err) {
    console.error('Error loading initial data:', err)
    error.value = 'Failed to load initial data: ' + (err.response?.data?.error || err.message)
    loading.value = false
  }
}

// Initialize data on page load
onMounted(() => {
  console.log('JournelExcelView component mounted')
  loadInitialData()
})
</script>

<template>
  <VCard class="mb-5">
    <VCardTitle class="d-flex justify-space-between align-center px-5 py-3">
      <div class="d-flex align-center gap-3">
        <VBtn
          icon
          variant="text"
          color="secondary"
          to="/journal"
        >
          <VIcon
            icon="bx-chevron-left"
            size="28"
          />
        </VBtn>
        <div>Journal Excel Data</div>
      </div>
      <VTextField
        v-model="selectedCompany"
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
            color="success"
            variant="elevated"
            prepend-icon="bx-save"
            :disabled="selectedRows.length === 0"
            @click="handleSave"
          >
            Save
          </VBtn>
          <VBtn
            color="warning"
            variant="elevated"
            prepend-icon="bx-share"
            :disabled="selectedRows.length === 0"
            @click="handleSendToTally"
          >
            Send To Tally
          </VBtn>
          <VBtn
            color="primary"
            variant="elevated"
            prepend-icon="bx-plus"
            @click="handleAddLedger"
          >
            Add Ledger
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
                Saved
              </div>
              <div class="counter-value">
                {{ rowCounts.saved }}
              </div>
            </div>
          </VCard>
          
          <VCard
            color="warning"
            variant="tonal"
            class="counter-card"
          >
            <div class="counter-content">
              <div class="counter-title">
                Sent to Tally
              </div>
              <div class="counter-value">
                {{ rowCounts.sentToTally }}
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
      <ExcelView
        v-model:selected="selectedRows"
        :headers="headers"
        :items="items"
        :density="settings.density"
        :height="settings.height"
        :fixed-header="settings.fixedHeader"
        :bordered="settings.bordered"
        :striped="settings.striped"
        :hover="settings.hover"
        :selectable="settings.selectable"
        :loading="loading"
        :show-pagination="settings.showPagination"
        :searchable="settings.searchable"
        :items-per-page="settings.itemsPerPage"
        @row-click="handleRowClick"
        @cell-click="handleCellClick"
      >
        <!-- Empty title slot to remove the title -->
        <template #title />
        
        <!-- Custom actions slot to hide export buttons -->
        <template #actions>
          <!-- Actions slot intentionally left empty to remove the export buttons -->
        </template>
        
        <!-- Custom status cell rendering -->
        <template #item.status="{ value }">
          <VChip
            size="small"
            :color="value === 'saved' ? 'success' : value === 'send to tally' ? 'warning' : 'info'"
            variant="flat"
          >
            {{ value }}
          </VChip>
        </template>
        
        <!-- Custom actions for each row -->
        <template #item-actions="{ item }">
          <div class="d-flex gap-1">
            <VBtn
              size="x-small"
              icon
              color="error"
              variant="text"
              @click.stop="handleDeleteRow(item.id)"
            >
              <VIcon icon="bx-trash" />
            </VBtn>
          </div>
        </template>
      </ExcelView>
    </VCardText>
  </VCard>
  
  <!-- Add Ledger Dialog -->
  <AddLedgerDialog
    v-model:show="showAddLedgerDialog"
    @ledger-added="handleLedgerAdded"
  />
</template>

<style lang="scss" scoped>
.v-card-title {
  border-block-end: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
}

.counter-card {
  display: flex;
  align-items: center;
  justify-content: center;
  block-size: 70px;
  inline-size: 180px;
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

.max-width-300 {
  max-inline-size: 300px;
}
</style> 
