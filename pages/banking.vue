<!-- eslint-disable camelcase -->
<script setup>
import { useAuthStore } from '@/auth'
import FileUploadDialog from '@/components/FileUploadDialog.vue'
import { useUserCompanies } from '@/composables/useUserCompanies'
import { computed, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'

definePageMeta({ layout: 'default' })

const router = useRouter()

// Get auth store and user companies
const authStore = useAuthStore()
const { selectedCompany } = useUserCompanies()

// Use the email from the auth store
const userEmail = computed(() => authStore.userEmail)

// Store the uploaded files data
const uploadedFiles = ref([])

// Function to handle row click
const handleRowClick = item => {
  console.log('Row clicked:', item)
  
  // Check if item has necessary identifiers
  if (item && item.raw && item.raw.temp_table) {
    // Get the filename and ID
    const tempTableId = item.raw.temp_table
    const filename = item.raw.uploaded_file
    
    // Store necessary data in sessionStorage (similar to journelexcelview approach)
    sessionStorage.setItem('userEmail', userEmail.value)
    sessionStorage.setItem('selectedCompany', selectedCompany.value?.company_id || '')
    sessionStorage.setItem('selectedCompanyName', selectedCompany.value?.company_name || '')
    sessionStorage.setItem('tempTable', tempTableId)
    sessionStorage.setItem('bankName', item.raw.bank_name || '')
    
    console.log('Stored in sessionStorage:', {
      userEmail: userEmail.value,
      selectedCompany: selectedCompany.value?.company_id || '',
      selectedCompanyName: selectedCompany.value?.company_name || '',
      tempTable: tempTableId,
      bankName: item.raw.bank_name || '',
    })
    
    console.log(`Navigating to bankingview with id=${tempTableId}`)
    
    // Use the exact page name as it appears in the file system
    router.push({
      path: '/bankingview',  // This matches the file name pages/bankingview.vue
      query: { 
        id: tempTableId,
        filename: filename,
      },
    })
  } else {
    console.error('Cannot navigate: Missing temp_table identifier', item)
  }
}

// Fetch temp tables from API using email and selected company
const fetchTempTables = async () => {
  console.log('Selected company:', selectedCompany.value)
  
  if (!userEmail.value || !selectedCompany.value) return

  try {
    // Use query parameters instead of POST body
    const companyId = selectedCompany.value.company_id || ''

    console.log('Using company ID for API call:', companyId)

    const apiUrl = `https://api.tallyfy.in/api/getAllTempTables?email=${encodeURIComponent(userEmail.value)}&company=${encodeURIComponent(companyId)}`
    
    console.log('Calling API with URL:', apiUrl)

    const response = await fetch(apiUrl)

    if (!response.ok) {
      throw new Error('Failed to fetch temp tables')
    }

    const data = await response.json()

    console.log('Temp tables:', data)
    
    // Wrap API data in 'raw' to match template bindings and add an index property
    if (Array.isArray(data)) {
      uploadedFiles.value = data.map((item, index) => ({
        raw: { ...item },
        index: index + 1,
      }))
    }
  } catch (error) {
    console.error('Error fetching temp tables:', error)
  }
}

// Fetch data when component mounts
onMounted(() => {
  fetchTempTables()
})

// Watch the entire selectedCompany object with a deep watcher.
// This ensures that whenever the entire company object is changed (or its nested properties),
// the fetchTempTables function will be triggered.
watch(selectedCompany, newCompany => {
  console.log('Selected company changed to:', newCompany)
  if (newCompany && newCompany.company_id) {
    fetchTempTables()
  }
}, { deep: true, immediate: true })

const headers = [
  { 
    title: 'SR.NO', 
    key: 'index', 
    sortable: false, 
    width: '70px',
    align: 'start',
    paddingRight: '0px',
  },
  { 
    title: 'FILE NAME', 
    key: 'uploaded_file', 
    sortable: true, 
    width: '250px',
    align: 'start',
    paddingRight: '0px',
  },
  { 
    title: 'BANK NAME', 
    key: 'bank_name', 
    sortable: true, 
    width: '15%',
    align: 'start',
    paddingRight: '0px',
  },
  { 
    title: 'STATEMENT DATE RANGE', 
    key: 'statement_date_range', 
    sortable: true, 
    width: '15%',
    align: 'start',
    paddingRight: '0px',
  },
  { 
    title: 'TOTAL', 
    key: 'total', 
    sortable: true, 
    align: 'start', 
    width: '50px',
    padding: '0px',
  },
  { 
    title: 'SAVED', 
    key: 'saved', 
    sortable: true, 
    align: 'start', 
    width: '50px',
    paddingRight: '0px',
    paddingLeft: '0px',
  },
  { 
    title: 'PENDING', 
    key: 'synced', 
    sortable: true, 
    align: 'start', 
    width: '10px',
    paddingRight: '0px',
    paddingLeft: '0px',
  },
  { 
    title: 'SEND DATA', 
    key: 'synced', 
    sortable: true, 
    align: 'start', 
    width: '20px',
    paddingRight: '0px',
    paddingLeft: '0px',
  },
  { 
    title: 'STATUS', 
    key: 'synced', 
    sortable: true, 
    align: 'start', 
    width: '70px',
    paddingRight: '0px',
  },
  { 
    title: '', // Empty title for delete icon
    key: 'actions', 
    sortable: false, 
    align: 'center', 
    width: '0px',
    padding: '0px',
  },
]

const showUploadDialog = ref(false)
const selectedFile = ref(null)
const error = ref(null)
const uploading = ref(false)

// Replace the static banks with a fetch from API
const banks = ref([])

// Add loading state for bank names fetch
const loadingBanks = ref(false)

// Update fetch bank names function with loading state
const fetchBankNames = async () => {
  try {
    if (!selectedCompany.value?.company_id) return
    
    loadingBanks.value = true

    const companyId = selectedCompany.value.company_id
    
    const response = await fetch(`https://api.tallyfy.in/api/getBankNames?company=${encodeURIComponent(companyId)}`)
    
    if (!response.ok) {
      throw new Error('Failed to fetch bank names')
    }
    
    const data = await response.json()
    
    // Transform API response format to match our dropdown format
    if (data && Array.isArray(data.bank_names)) {
      banks.value = data.bank_names.map(bankName => ({
        title: `${bankName} Bank`,
        value: bankName.toLowerCase(),
      }))
    }
    
    console.log('Fetched bank names:', banks.value)
  } catch (error) {
    console.error('Error fetching bank names:', error)

    // Fallback to empty array if API fails
    banks.value = []
  } finally {
    loadingBanks.value = false
  }
}

// Fetch bank names when component mounts and when company changes
onMounted(() => {
  fetchBankNames()
})

// Watch for company changes to update bank names
watch(selectedCompany, () => {
  fetchBankNames()

  // Reset selected bank when company changes
  selectedBank.value = null
}, { deep: true })

// Add bank selection state
const selectedBank = ref(null)

// Define the API url for file uploading
const uploadApiUrl = computed(() => {
  const companyId = selectedCompany.value?.company_id || ''
  
  return `https://api.tallyfy.in/api/uploadBankingFile?email=${encodeURIComponent(userEmail.value)}&company=${encodeURIComponent(companyId)}`
})

// Update the extra data to include the selected bank and file details
const uploadExtraData = computed(() => {
  // Find the selected bank object to use the original bank name
  const selectedBankObj = banks.value.find(bank => bank.value === selectedBank.value)
  const bankName = selectedBankObj?.title?.replace(' Bank', '') || ''
  
  return {
    email: userEmail.value,
    company: selectedCompany.value?.company_id || '',
    bank: bankName, // Use the original bank name without "Bank" suffix
    uploaded_file: 'uploaded.pdf', // Default filename for PDF uploads
    user_group: 'gold', // Default user group for all uploads
    user_id: authStore.userId || userEmail.value, // Use userId if available, fallback to email
    // Generate a unique file_id
    file_id: `file_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`,
  }
})

// Handle successful upload
const handleUploadSuccess = data => {
  console.log('Upload success event received:', data)

  // Log detailed information about the uploaded file
  console.log('Uploaded File Details:', {
    filename: data.file.name,
    fileSize: `${Math.round(data.file.size / 1024)} KB`,
    fileType: data.file.type,
    tempTableName: data.tempTableName || 'N/A',
    responseData: data.response,
    isProcessing: data.isProcessing,
  })

  // For PDF uploads in processing state, add a temporary row to the table
  const isPdf = data.file.name.toLowerCase().endsWith('.pdf')
  
  // If this is a processing status notification (table created, but PDF not yet processed)
  if (isPdf && data.isProcessing && data.tempTableName) {
    console.log('Adding PDF processing row to table with temp table:', data.tempTableName)
    
    // Create a new row with processing status
    const newRow = {
      raw: {
        id: data.tempTableName,
        temp_table: data.tempTableName,
        uploaded_file: data.file.name,
        bank_name: uploadExtraData.value.bank || '-',
        status: 'processing',
        rowCounts: {
          total: 0,
          saved: 0,
          sentToTally: 0,
        },
      },
      index: uploadedFiles.value.length + 1,
    }
    
    // Add the new row to the table data at the beginning
    uploadedFiles.value = [newRow, ...uploadedFiles.value]
    
    // Show success message
    showSuccessAlert.value = true
    successMessage.value = `PDF Processing - ${data.file.name}`
    
    // Clear the success message after a delay
    setTimeout(() => {
      showSuccessAlert.value = false
    }, 3000)
    
    return // Don't refresh the table data as we just manually added the row
  }

  // For PDF uploads, log the specific response format
  if (isPdf) {
    console.log('PDF Processing Response:', {
      tempTableName: data.tempTableName,
      status: data.response.status || 'unknown',
      message: data.response.message || 'No message returned',
      processedData: data.response.data || {},
      processingTime: data.response.processing_time || 'unknown',
    })
  }

  // Refresh the table data
  fetchTempTables()
  
  // Show success message
  showSuccessAlert.value = true
  successMessage.value = isPdf 
    ? `PDF successfully processed with temp table: ${data.tempTableName || 'unknown'}`
    : 'File successfully uploaded'
  
  // Clear the success message after a delay
  setTimeout(() => {
    showSuccessAlert.value = false
  }, 3000)
}

// Add delete confirmation dialog state
const showDeleteConfirm = ref(false)
const deleteItem = ref(null)

// Add a delete function with API call
const handleDelete = async (item, event) => {
  // Stop event propagation to prevent row click
  event.stopPropagation()
  
  // Store the item to be deleted and show confirmation dialog
  deleteItem.value = item
  showDeleteConfirm.value = true
}

// Function to confirm deletion
const confirmDelete = async () => {
  try {
    if (!deleteItem.value || !deleteItem.value.raw) return
    
    const item = deleteItem.value.raw
    const companyId = selectedCompany.value?.company_id || ''
    
    // Prepare data for API
    const deleteData = {
      id: item.id,
      email: userEmail.value,
      company: companyId,
    }
    
    console.log('Deleting item with data:', deleteData)
    
    // Call the delete API
    const response = await fetch('https://api.tallyfy.in/api/deleteTempTable', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(deleteData),
    })
    
    if (!response.ok) {
      throw new Error('Failed to delete item')
    }
    
    // Remove item from the table data
    uploadedFiles.value = uploadedFiles.value.filter(file => 
      file.raw.id !== item.id,
    )
    
    // Show success message
    showSuccessAlert.value = true
    successMessage.value = 'Item successfully deleted'
    
    // Close the dialog
    showDeleteConfirm.value = false
    
    // Clear the success message after a delay
    setTimeout(() => {
      showSuccessAlert.value = false
    }, 3000)
    
  } catch (error) {
    console.error('Error deleting item:', error)

    // Show error message
    showErrorAlert.value = true
    errorMessage.value = 'Failed to delete item: ' + error.message
    
    // Clear the error message after a delay
    setTimeout(() => {
      showErrorAlert.value = false
    }, 5000)
  }
}

// Add alert state
const showSuccessAlert = ref(false)
const successMessage = ref('')
const showErrorAlert = ref(false)
const errorMessage = ref('')

// NOTE: Ensure that when a company is selected from your companies list,
// you assign the entire company object to selectedCompany.value rather than modifying a nested property.
</script>

<template>
  <div>
    <VCard>
      <VCardText>
        <div class="d-flex align-center flex-wrap gap-4 mb-4">
          <div class="me-3">
            <h4 class="font-weight-medium">
              Banking (Excel)
            </h4>
          </div>

          <div class="d-flex align-center flex-wrap gap-4">
            <VBtn
              prepend-icon="bx-download"
              variant="tonal"
              color="primary"
              class="me-3"
            >
              Download Sample
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

        <!-- Table -->
        <VDataTable
          :headers="headers"
          :items="uploadedFiles"
          :items-per-page="20"
          class="text-no-wrap fixed-table clickable-rows"
          fixed-header
        >
          <template #item="{ item, columns }">
            <tr
              class="clickable-row"
              @click="handleRowClick(item)"
            >
              <td
                v-for="column in columns"
                :key="column.key"
              >
                <div
                  v-if="column.key === 'uploaded_file'"
                  class="file-name-cell"
                >
                  {{ item.raw.uploaded_file }}
                </div>
                <template v-else-if="column.key === 'bank_name'">
                  {{ item.raw.bank_name || '-' }}
                </template>
                <template v-else-if="column.key === 'statement_date_range'">
                  {{ item.raw.statement_date_range || '-' }}
                </template>
                <template v-else-if="column.key === 'total'">
                  <div
                    v-if="item.raw.status === 'processing'"
                    class="text-warning text-center"
                  >
                    ---
                  </div>
                  <template v-else>
                    {{ item.raw.rowCounts?.total || 0 }}
                  </template>
                </template>
                <template v-else-if="column.key === 'saved'">
                  <div
                    v-if="item.raw.status === 'processing'"
                    class="text-warning text-center"
                  >
                    ---
                  </div>
                  <template v-else>
                    {{ item.raw.rowCounts?.saved || 0 }}
                  </template>
                </template>
                <template v-else-if="column.key === 'synced'">
                  <!-- Special handling for the STATUS column (last one using synced key) -->
                  <template v-if="column.title === 'STATUS'">
                    <div 
                      class="d-flex align-center justify-center"
                      :class="[
                        item.raw.status === 'processing' ? 'processing-indicator' : ''
                      ]"
                    >
                      <template v-if="item.raw.status === 'processing'">
                        <VIcon
                          icon="bx-loader bx-spin"
                          color="warning"
                          size="18"
                          class="me-1"
                        />
                        <span class="text-warning">Processing</span>
                      </template>
                      <template v-else>
                        <VIcon
                          icon="bx-check-circle"
                          color="success"
                          size="18"
                          class="me-1"
                        />
                        <span class="text-success">Completed</span>
                      </template>
                    </div>
                  </template>
                  <!-- For PENDING and SEND DATA columns -->
                  <template v-else>
                    <div
                      v-if="item.raw.status === 'processing'"
                      class="text-warning text-center"
                    >
                      ---
                    </div>
                    <template v-else>
                      {{ item.raw.rowCounts?.sentToTally || 0 }}
                    </template>
                  </template>
                </template>
                <template v-else-if="column.key === 'index'">
                  {{ item.index }}
                </template>
                <template v-else-if="column.key === 'actions'">
                  <VBtn
                    icon
                    size="small"
                    color="error"
                    variant="text"
                    @click="(event) => handleDelete(item, event)"
                  >
                    <VIcon icon="bx-trash" />
                  </VBtn>
                </template>
                <template v-else>
                  {{ item.raw[column.key] }}
                </template>
              </td>
            </tr>
          </template>
        </VDataTable>
      </VCardText>
    </VCard>

    <!-- File Upload Dialog - Using the new component -->
    <FileUploadDialog
      v-model:show="showUploadDialog"
      title="Upload Banking Statement"
      :upload-api="uploadApiUrl"
      :extra-data="uploadExtraData"
      :required-fields="['Date', 'Description', 'Debit', 'Credit', 'Balance']"
      accepted-formats=".xls,.xlsx,.pdf"
      @upload-success="handleUploadSuccess"
    >
      <template #bank-selection>
        <div class="bank-selection-slot-content">
          <h3 class="text-subtitle-1 font-weight-medium mb-2">
            Select Bank <span class="text-error">*</span>
          </h3>
          <VSelect
            v-model="selectedBank"
            :items="banks"
            label="Choose your bank"
            placeholder="Select a bank"
            variant="outlined"
            color="primary"
            class="mb-2"
            :loading="loadingBanks"
            :disabled="loadingBanks || banks.length === 0"
            :rules="[v => !!v || 'Bank selection is required']"
            :hint="banks.length === 0 && !loadingBanks ? 'No banks available for this company' : ''"
            persistent-hint
            required
          />
          <div
            v-if="!selectedBank"
            class="text-caption text-error mb-4"
          >
            <VIcon
              icon="bx-error-circle"
              size="14"
              class="me-1"
            />
            You must select a bank before uploading a statement
          </div>
        </div>
      </template>
    </FileUploadDialog>

    <!-- Delete Confirmation Dialog -->
    <VDialog
      v-model="showDeleteConfirm"
      max-width="600"
    >
      <VCard>
        <VCardTitle class="text-h5 pa-4">
          <VIcon
            icon="bx-trash"
            color="error"
            size="24"
            class="me-2"
          />
          Confirm Deletion
        </VCardTitle>

        <VCardText>
          <p class="text-body-1">
            Are you sure you want to delete this item? This action cannot be reversed.
          </p>
        </VCardText>

        <VCardActions class="pa-4 pt-0">
          <VSpacer />
          <VBtn
            variant="tonal"
            @click="showDeleteConfirm = false"
          >
            Cancel
          </VBtn>
          <VBtn
            color="primary"
            @click="confirmDelete"
          >
            Delete
          </VBtn>
        </VCardActions>
      </VCard>
    </VDialog>

    <!-- Success Alert -->
    <VSnackbar
      v-model="showSuccessAlert"
      :timeout="3000"
    >
      {{ successMessage }}
    </VSnackbar>

    <!-- Error Alert -->
    <VSnackbar
      v-model="showErrorAlert"
      :timeout="5000"
    >
      {{ errorMessage }}
    </VSnackbar>
  </div>
</template>

<style lang="scss">
.fixed-table {
  inline-size: 100%;
  table-layout: fixed;
}

// Target specific columns to reduce spacing
.v-table {
  // SAVED column (6th column)
  th:nth-child(6),
  td:nth-child(6) {
    inline-size: 45px !important;
    padding-inline: 4px 0 !important;
    text-align: center !important;
  }

  // PENDING column (7th column)
  th:nth-child(7),
  td:nth-child(7) {
    inline-size: 45px !important;
    padding-inline: 4px 0 !important;
    text-align: center !important;
  }

  // SEND TO TALLY column (8th column)
  th:nth-child(8),
  td:nth-child(8) {
    inline-size: 45px !important;
    padding-inline: 4px 0 !important;
    text-align: center !important;
  }

  // Optional: Group these columns visually
  th:nth-child(6),
  th:nth-child(7),
  th:nth-child(8) {
    background-color: rgba(var(--v-theme-surface-variant), 0.5);
  }

  // TOTAL column (5th column)
  th:nth-child(5),
  td:nth-child(5) {
    inline-size: 45px !important;
    padding-inline: 4px 0 !important;
    text-align: center !important;
  }
}

.clickable-rows {
  .clickable-row {
    position: relative;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      z-index: 1;
      background-color: rgba(var(--v-theme-primary), 0.08) !important;
      box-shadow: 0 4px 8px rgba(var(--v-theme-on-surface), 0.1);
      transform: translateY(-1px);
    }

    &:active {
      background-color: rgba(var(--v-theme-primary), 0.12) !important;
      box-shadow: 0 2px 4px rgba(var(--v-theme-on-surface), 0.08);
      transform: translateY(0);
    }
  }
}

/* Option 1: File name wraps onto multiple lines (default) */
.file-name-cell {
  hyphens: auto;
  line-height: 1.2;
  max-inline-size: 250px;
  overflow-wrap: break-word;
  white-space: normal;
  word-break: break-word;
  word-wrap: break-word;
}

/* Option 2: File name ellipsis styling (if you prefer a single-line truncated view)
.file-name-ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
*/

.file-actions {
  opacity: 0;
  transition: opacity 0.2s ease;
}

.v-data-table-row:hover .file-actions {
  opacity: 1;
}

.v-data-table-header__content {
  justify-content: inherit;
  inline-size: 100%;
}

// Icon button styles
.v-btn {
  &.v-btn--icon {
    transition: color 0.2s ease;

    &:hover {
      color: rgb(var(--v-theme-primary));
      transform: none;
    }
  }
}

// Add style for the processing indicator
.processing-indicator {
  display: flex;
  justify-content: center;
  border-radius: 20px;
  background-color: rgba(var(--v-theme-warning), 0.1);
  inline-size: 100%;
  padding-block: 2px;
  padding-inline: 4px;
  white-space: nowrap;
}
</style>
