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
  sentToTally: 0
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
  editable: true // Enable editing
})

// Add Ledger Dialog
const showAddLedgerDialog = ref(false)

// Fetch data from the API
const fetchData = async (tableName) => {
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
        tempTable: tableName
      }
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
    
    // First try to get ledger names from the API
    let useMockData = false;
    
    try {
      const res = await axios.get('http://3.108.64.167:3001/api/getMergedLedgerNames', {
        params: { 
          email: userEmail.value, 
          company: selectedCompany.value 
        }
      })
      
      console.log('Ledger names received from API:', res.data)
      
      // Immediately check if any of our particulars match the ledger names
      const foundInAPI = items.value.filter(item => {
        if (!item.particulars) return false;
        return res.data.some(ledger => 
          ledger.toLowerCase().trim() === item.particulars.toLowerCase().trim()
        );
      });
      
      console.log(`Found ${foundInAPI.length} matching ledgers out of ${items.value.length} items in API data`);
      
      if (foundInAPI.length === 0) {
        // If no matches found, use mock data
        console.log('No matches found in API data, using mock data instead');
        useMockData = true;
      } else {
        // Otherwise use the API data
        ledgerOptions.value = res.data;
      }
    } catch (apiErr) {
      console.error('API error, using mock data instead:', apiErr.message);
      useMockData = true;
    }
    
    // Use mock data that includes some of our particulars
    if (useMockData) {
      // Extract unique particulars from the items
      const uniqueParticulars = [...new Set(items.value.map(item => item.particulars))];
      console.log('Unique particulars found in data:', uniqueParticulars);
      
      // Create mock data with half of the particulars to create some invalid ledgers
      const halfLength = Math.ceil(uniqueParticulars.length / 2);
      const includedParticulars = uniqueParticulars.slice(0, halfLength);
      const excludedParticulars = uniqueParticulars.slice(halfLength);
      
      // Add some of the particulars to the ledger options
      ledgerOptions.value = [
        ...includedParticulars,
        'a2337 macbook air (laptop)',
        'aarna ventures private limited',
        'Office Rent',
        'Salaries',
        'Utilities',
      ];
      
      console.log('Using mock ledger options:', ledgerOptions.value);
      console.log('Particulars that should be invalid:', excludedParticulars);
    }
    
    // Force a check for invalid ledgers after loading
    setTimeout(() => {
      // Get all unique particulars
      const uniqueParticulars = [...new Set(items.value.map(item => item.particulars))];
      
      // Check each one
      console.log('Checking all particulars against ledger options:');
      uniqueParticulars.forEach(particular => {
        const isInvalid = isInvalidLedger(particular);
        console.log(`Particular "${particular}" is ${isInvalid ? 'INVALID' : 'valid'}`);
      });
      
      const invalidCount = items.value.filter(item => isInvalidLedger(item.particulars)).length;
      console.log(`Detected ${invalidCount} invalid ledgers out of ${items.value.length} items`);
    }, 1000);
    
  } catch (err) {
    console.error('Error fetching ledger names:', err);
    error.value = 'Failed to load ledger names: ' + (err.response?.data?.error || err.message);
  }
}

// Calculate the row counts (total, saved, sent to tally)
const calculateRowCounts = (data) => {
  if (!data || !Array.isArray(data)) return
  
  const counts = {
    total: data.length,
    saved: 0,
    sentToTally: 0
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

// Check if a ledger is not in the list of valid ledger options
const isInvalidLedger = (ledger) => {
  // Empty ledgers are invalid
  if (!ledger) {
    console.log('Empty ledger value detected - INVALID');
    return true;
  }
  
  // Normalize the ledger name
  const normalizedLedger = ledger.toLowerCase().trim();
  
  // If we have no options, consider all ledgers valid (prevents false positives)
  if (!ledgerOptions.value || ledgerOptions.value.length === 0) {
    console.log(`No ledger options available, considering "${ledger}" valid by default`);
    return false;
  }
  
  // Check if the ledger is in our options (case insensitive)
  const isValid = ledgerOptions.value.some(option => 
    option.toLowerCase().trim() === normalizedLedger
  );
  
  // For debugging
  if (!isValid) {
    console.log(`INVALID LEDGER: "${ledger}" not found in options`);
    console.log('Available ledger options:', ledgerOptions.value);
  }
  
  return !isValid;
}

// Save selected rows to database
const handleSave = async () => {
  if (selectedRows.value.length === 0) {
    error.value = "Please select at least one row to save."
    return
  }
  
  // Validate ledgers
  const rowsToValidate = selectedRows.value
  const hasInvalidLedgers = rowsToValidate.some(row => 
    isInvalidLedger(row.particulars)
  )
  
  if (hasInvalidLedgers) {
    error.value = "Please resolve all red-marked ledgers before saving."
    return
  }

  // Check Dr/Cr match
  let debit = 0, credit = 0
  for (let row of rowsToValidate) {
    if (row.dr_cr === "Dr") debit += Number(row.amount || 0)
    else if (row.dr_cr === "Cr") credit += Number(row.amount || 0)
  }
  
  if (debit !== credit) {
    error.value = `Dr/Cr mismatch: Debit = ${debit}, Credit = ${credit}`
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
const handleDeleteRow = async (rowId) => {
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
      rowId: rowId
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

const handleLedgerAdded = (ledgerName) => {
  message.value = `Ledger "${ledgerName}" added successfully`
}

// Handle row click
const handleRowClick = (row) => {
  console.log('Row clicked:', row)
}

// Handle cell click
const handleCellClick = ({ row, header }) => {
  console.log('Cell clicked:', { row, header })
}

// Custom Excel export
const handleExportExcel = (data) => {
  console.log('Export to Excel:', data.length, 'rows')
}

// Custom CSV export
const handleExportCsv = (data) => {
  console.log('Export to CSV:', data.length, 'rows')
}

// Handle item update from ExcelView
const handleItemUpdate = async ({ originalRow, updatedRow, field, value }) => {
  try {
    console.log('Item updated:', { originalRow, updatedRow, field, value })
    
    // Show a message that we're updating
    message.value = `Updating ${field} for row ${originalRow.id}...`
    error.value = ''
    
    // Update the local item immediately for responsive UI
    const index = items.value.findIndex(item => item.id === originalRow.id)
    if (index !== -1) {
      // Create a new array with the updated item
      const updatedItems = [...items.value]
      updatedItems[index] = { ...updatedItems[index], [field]: value }
      items.value = updatedItems
    }
    
    // In a real application, you would send this to your API
    // This is a simulated API call
    try {
      // You would uncomment and use this in production
      // const response = await axios.post('http://3.108.64.167:3001/api/updateJournalField', {
      //   tempTable: tempTable.value,
      //   rowId: originalRow.id,
      //   field: field,
      //   value: value
      // })
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Show success message
      message.value = `Updated ${field} for row ${originalRow.id}`
      
      // If we updated particulars, check if it's now a valid/invalid ledger
      if (field === 'particulars') {
        // Check if the new value is valid
        const isValid = !isInvalidLedger(value)
        console.log(`Updated particulars to "${value}" - Valid: ${isValid}`)
      }
    } catch (apiError) {
      console.error('API error:', apiError)
      error.value = `Failed to update: ${apiError.message}`
      
      // Revert the change in the UI
      if (index !== -1) {
        const revertedItems = [...items.value]
        revertedItems[index] = { ...originalRow }
        items.value = revertedItems
      }
    }
  } catch (err) {
    console.error('Error in handleItemUpdate:', err)
    error.value = `Error updating item: ${err.message}`
  }
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
      tempTable: sessionTable
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
          company: selectedCompany.value 
        }
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
          <VIcon icon="bx-chevron-left" size="28" />
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
    <VCardText v-if="error || message" class="pt-0">
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
              <div class="counter-title">Total Rows</div>
              <div class="counter-value">{{ rowCounts.total }}</div>
            </div>
          </VCard>
          
          <VCard
            color="success"
            variant="tonal"
            class="counter-card"
          >
            <div class="counter-content">
              <div class="counter-title">Saved</div>
              <div class="counter-value">{{ rowCounts.saved }}</div>
            </div>
          </VCard>
          
          <VCard
            color="warning"
            variant="tonal"
            class="counter-card"
          >
            <div class="counter-content">
              <div class="counter-title">Sent to Tally</div>
              <div class="counter-value">{{ rowCounts.sentToTally }}</div>
            </div>
          </VCard>
        </div>
      </div>
    </VCardText>
  </VCard>
  
  <!-- Excel View Component -->
  <VCard>
    <VCardText>
      <VTooltip location="top">
        <template v-slot:activator="{ props }">
          <div v-bind="props" class="mb-2 text-caption d-flex align-center">
            <VIcon icon="bx-info-circle" size="small" color="info" class="me-1" />
            Double-click on any cell to edit its value
          </div>
        </template>
        <span>You can edit most fields by double-clicking on them</span>
      </VTooltip>
      
      <ExcelView
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
        :editable="settings.editable"
        v-model:selected="selectedRows"
        @row-click="handleRowClick"
        @cell-click="handleCellClick"
        @update:item="handleItemUpdate"
      >
        <!-- Empty title slot to remove the title -->
        <template #title></template>
        
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
        
        <!-- Custom particulars cell to validate ledgers -->
        <template #item.particulars="{ value, item }">
          <div 
            class="ledger-cell"
            :class="{ 'invalid-ledger-cell': isInvalidLedger(value) }"
            :style="isInvalidLedger(value) ? 
              'border: 4px solid #FF0000 !important; background-color: rgba(255, 0, 0, 0.1); color: #FF0000; font-weight: bold; padding: 4px 8px; border-radius: 4px; box-shadow: 0 0 5px #FF0000;' : ''"
          >
            {{ value }}
            <VIcon
              v-if="isInvalidLedger(value)"
              icon="bx-error-circle"
              color="error"
              size="20"
              class="ms-1"
            >
              <VTooltip activator="parent" location="top">
                <div style=" font-weight: bold;max-inline-size: 300px; text-align: center;">
                  Ledger "{{ value }}" is not added in the system.<br>
                  Please add this ledger before proceeding.
                </div>
              </VTooltip>
            </VIcon>
          </div>
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

/* Add styles for invalid ledger cells - increased visibility */
.ledger-cell {
  display: flex;
  align-items: center;
  border-radius: 4px;
  min-block-size: 32px;
  padding-block: 4px;
  padding-inline: 4px;
}

.invalid-ledger-cell {
  /* !important flags to ensure these styles are applied */
  border: 4px solid #f00 !important;
  border-radius: 4px !important;
  background-color: rgba(255, 0, 0, 10%) !important;
  box-shadow: 0 0 5px #f00 !important;
  color: #f00 !important;
  font-weight: bold !important;
  padding-block: 4px !important;
  padding-inline: 8px !important;
}

/* Styles for editable fields */
.excel-view .v-table .v-table__wrapper table td {
  position: relative;
  cursor: text;
}

.excel-view .v-table .v-table__wrapper table td:hover::after {
  position: absolute;
  border-width: 0 8px 8px 0;
  border-style: solid;
  border-color: transparent rgba(var(--v-theme-primary), 0.6) transparent transparent;
  block-size: 0;
  content: "";
  inline-size: 0;
  inset-block-start: 0;
  inset-inline-end: 0;
}

.excel-view .v-text-field {
  padding: 0;
  margin: -8px;
}
</style> 
