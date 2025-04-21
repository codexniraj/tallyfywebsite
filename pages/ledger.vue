<!-- eslint-disable camelcase -->
<script setup>
import { useAuthStore } from '@/auth'
import { useUserCompanies } from '@/composables/useUserCompanies'
import axios from 'axios'
import { computed, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import FileUploadDialog from '~/components/FileUploadDialog.vue'

// Change layout back to default
definePageMeta({ layout: 'default' })

const router = useRouter()

// Get auth store and user companies
const authStore = useAuthStore()
const { selectedCompany } = useUserCompanies()

// Use the email from the auth store
const userEmail = computed(() => authStore.userEmail)

const headers = [
  { 
    title: 'SR.NO', 
    key: 'index', 
    sortable: false, 
    width: '70px',
    align: 'start',
  },
  { 
    title: 'FILE NAME', 
    key: 'uploaded_file', 
    sortable: true, 
    width: '40%',
    align: 'start',
  },
   
  { 
    title: 'TOTAL', 
    key: 'total', 
    sortable: true, 
    align: 'start', 
    width: '70px',
  },
  { 
    title: 'SAVED', 
    key: 'saved', 
    sortable: true, 
    align: 'start', 
    width: '70px',
  },
   
  { 
    title: 'SEND TO TALLY', 
    key: 'sent_to_tally', 
    sortable: true, 
    align: 'start', 
    width: '90px',
  },
  { 
    title: '', // Empty title for delete icon
    key: 'actions', 
    sortable: false, 
    align: 'center', 
    width: '50px',
  },
]

const uploadedFiles = ref([])
const showUploadDialog = ref(false)
const selectedFile = ref(null)
const error = ref('')
const uploading = ref(false)
const maxFileSize = 50 * 1024 * 1024

// Add skipped report handling
const skippedReport = ref(null)

// Add duplicate handling
const duplicateModal = ref(false)
const duplicateInfo = ref({})
const processedData = ref([])

// Add delete confirmation dialog state
const showDeleteConfirm = ref(false)
const itemToDelete = ref(null)

const compulsoryHeaders = [
  "Name", "Under" 
]

// Add a delete function with API call
const handleDelete = (item, event) => {
  // Stop event propagation to prevent row click
  event.stopPropagation()
  
  // Store the item to be deleted and show confirmation dialog
  itemToDelete.value = item
  showDeleteConfirm.value = true
}

// Function to confirm deletion
const confirmDelete = async () => {
  try {
    // Call the delete API with the table name
    await axios.delete('https://api.tallyfy.in/api/deleteExcelLedgerUpload', {
      data: { table: itemToDelete.value.temp_table }
    })
    
    // Refresh table after deletion
    fetchUploadedFiles()
    
    // Close the dialog
    showDeleteConfirm.value = false
  } catch (err) {
    console.error("Failed to delete", err)
  }
}

const fetchUploadedFiles = async () => {
  if (!userEmail.value || !selectedCompany.value) return
  
  try {
    console.log('Fetching uploaded files...')
    const companyId = selectedCompany.value.company_id || ''
    console.log(`Fetching files with email=${userEmail.value}, company=${companyId}`)
    
    const filesRes = await axios.get("https://api.tallyfy.in/api/getUserExcelLedgerUploads", {
      params: { 
        email: userEmail.value, 
        company: companyId
      }
    })
    
    console.log('Fetched files:', filesRes.data)
    
    const filesWithCounts = await Promise.all(
      filesRes.data.map(async (file, index) => {
        try {
          console.log(`Fetching data for table: ${file.temp_table}`)
          
          // Use the correct API endpoint that matches the API response format
          // Some debugging showed we should be using the correct URL: excelLedgersData
          const dataRes = await axios.get("https://api.tallyfy.in/api/excelLedgersData", {
            params: { tempTable: file.temp_table }
          })
          
          console.log(`Got response for ${file.temp_table}:`, dataRes.data ? 'Data found' : 'No data')
          console.log(`Response type:`, typeof dataRes.data, Array.isArray(dataRes.data) ? 'Is array' : 'Not array')
          
          // Log the first item if it exists to debug the structure
          if (dataRes.data && Array.isArray(dataRes.data) && dataRes.data.length > 0) {
            console.log('First item sample:', JSON.stringify(dataRes.data[0]).substring(0, 200) + '...')
          }
          
          const totalRows = dataRes.data?.length || 0
          let savedRows = 0
          let pendingRows = 0
          let sentToTallyRows = 0
          
          if (dataRes.data && Array.isArray(dataRes.data)) {
            console.log(`Processing ${dataRes.data.length} rows for ${file.temp_table}`)
            dataRes.data.forEach(row => {
              if (row.status) {
                const status = row.status.toLowerCase()
                if (status === 'saved') {
                  savedRows++
                } else if (status === 'sent_to_tally' || status === 'send to tally') {
                  sentToTallyRows++
                } else if (status === 'pending') {
                  pendingRows++
                }
              }
            })
          } else {
            console.warn(`Invalid data format for ${file.temp_table}:`, dataRes.data)
          }
          
          console.log(`Counts for ${file.temp_table}: total=${totalRows}, saved=${savedRows}, pending=${pendingRows}, sentToTally=${sentToTallyRows}`)
          
          return {
            ...file,
            index: index + 1,
            rowCounts: {
              total: totalRows,
              saved: savedRows,
              pending: pendingRows,
              sentToTally: sentToTallyRows
            }
          }
        } catch (err) {
          console.error(`Failed to get row counts for table: ${file.temp_table}`, err)
          console.error(`Error details:`, err.response?.data || err.message)
          return {
            ...file,
            index: index + 1,
            rowCounts: {
              total: 0,
              saved: 0,
              pending: 0,
              sentToTally: 0
            }
          }
        }
      })
    )
    
    uploadedFiles.value = filesWithCounts
    console.log('Processed uploaded files with counts:', uploadedFiles.value)
  } catch (err) {
    console.error("Failed to fetch uploaded files", err)
    console.error("Error details:", err.response?.data || err.message)
  }
}

// Add the new file drag and drop handling
const handleDragOver = (event) => {
  event.preventDefault();
}

const handleDrop = (event) => {
  event.preventDefault();
  
  if (event.dataTransfer.items) {
    const file = event.dataTransfer.items[0].getAsFile();
    if (file) {
      handleFileUpload(file);
    }
  } else if (event.dataTransfer.files.length) {
    handleFileUpload(event.dataTransfer.files[0]);
  }
}

const handleFileUpload = (file) => {
  error.value = ''
  if (!file) return

  if (!userEmail.value || !selectedCompany.value) {
    error.value = "Please login and select a company before uploading."
    return
  }

  if (file.size > maxFileSize) {
    error.value = "File size exceeds 50MB limit."
    return
  }

  selectedFile.value = file
  
  // Process Excel file similarly to new implementation
  const reader = new FileReader()
  reader.onload = async (e) => {
    try {
      // This will be used with the advanced duplicate checking feature
      processExcelFile(e.target.result);
    } catch (err) {
      console.error("Excel parsing error:", err)
      error.value = "Failed to read Excel file. Make sure it's not corrupted or password protected."
    }
  }
  
  if (file.type.includes('excel') || file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
    reader.readAsArrayBuffer(file)
  }
}

// Implement the Excel processing function
const processExcelFile = (fileData) => {
  try {
    const data = new Uint8Array(fileData)
    const workbook = XLSX.read(data, { type: 'array' })
    const sheet = workbook.Sheets[workbook.SheetNames[0]]
    
    const json = XLSX.utils.sheet_to_json(sheet, {
      defval: "",
      raw: false,
    })
    
    if (!json || json.length === 0) {
      error.value = "Excel file is empty or unreadable."
      return
    }
    
    if (compulsoryHeaders.length > 0) {
      const firstRow = json[0] || {}
      const keys = Object.keys(firstRow)
      const missingHeaders = compulsoryHeaders.filter(key => !keys.includes(key))
      if (missingHeaders.length > 0) {
        error.value = `Missing compulsory headers: ${missingHeaders.join(', ')}`
        return
      }
    }
    
    processedData.value = json
  } catch (err) {
    error.value = "Failed to process Excel file."
    console.error(err)
  }
}

// Add the downloadSkippedReport function
const downloadSkippedReport = async () => {
  if (!skippedReport.value) return
  try {
    const response = await axios.get("https://api.tallyfy.in/api/downloadSkippedReport", {
      params: { path: skippedReport.value.reportFile },
      responseType: 'blob'
    })
    
    const url = URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = url
    link.download = 'Skipped_Ledgers_Report.xlsx'
    link.click()
    URL.revokeObjectURL(url)
    skippedReport.value = null
  } catch (err) {
    error.value = 'Failed to download report.'
    console.error(err)
  }
}

// Add duplicate handling function
const handleDuplicateAction = async (action) => {
  try {
    uploading.value = true
    
    if (action === 'view') {
      handleViewUpload({ temp_table: duplicateInfo.value.existingTable })
      duplicateModal.value = false
    } else {
      const company = selectedCompany.value.company_id || ''
      
      const response = await axios.post("https://api.tallyfy.in/api/uploadExcelLedger", {
        email: userEmail.value,
        company: company,
        data: json,
        uploadedFileName: selectedFile.value.name,
        action: "check"
      })
      
      duplicateInfo.value = {
        ...duplicateInfo.value,
        type: 'success',
        message: action === 'merge' 
          ? `Merged ${response.data.inserted} unique entries.`
          : 'Created new file with unique entries.',
        table: response.data.table || response.data.newTable || duplicateInfo.value.existingTable
      }
      
      if (response.data.skipped > 0) {
        skippedReport.value = {
          count: response.data.skipped,
          reportFile: response.data.reportFile
        }
      }
      
      fetchUploadedFiles()
    }
  } catch (err) {
    error.value = err.response?.data?.error || 'Failed to process duplicate.'
    duplicateModal.value = false
  } finally {
    uploading.value = false
  }
}

const uploadFile = async () => {
  // Implementation for upload button
}

const handleViewUpload = (file) => {
  sessionStorage.setItem('tempTable', file.temp_table)
  sessionStorage.setItem('uploadMeta', JSON.stringify({ invalidLedgers: file.invalid_ledgers || [] }))
  router.push('/ledger-view')
}

const handleUploadSuccess = (result) => {
  // Check for skipped report data
  if (result.response && result.response.skipped > 0) {
    skippedReport.value = {
      count: result.response.skipped,
      reportFile: result.response.reportFile
    }
  }
  
  uploadedFiles.value = [
    ...uploadedFiles.value,
    {
      uploaded_file: result.file.name,
      created_at: new Date().toISOString(),
      temp_table: result.response.table,
      invalid_ledgers: result.response.invalidLedgers || [],
      rowCounts: {
        total: 0,
        saved: 0,
        sentToTally: 0
      }
    }
  ]
  fetchUploadedFiles()
}

// Fetch data when component mounts
onMounted(() => {
  console.log('Ledger page mounted')
  fetchUploadedFiles()
})

// Watch the selected company and refetch data when it changes
watch(selectedCompany, newCompany => {
  console.log('Selected company changed to:', newCompany)
  if (newCompany && newCompany.company_id) {
    fetchUploadedFiles()
  }
}, { deep: true, immediate: true })
</script>

<template>
  <div>
    <VCard>
      <VCardText>
        <div class="d-flex align-center flex-wrap gap-4 mb-4">
          <div class="me-3">
            <h4 class="font-weight-medium">
              Ledger (Excel)
            </h4>
          </div>

          <div class="d-flex align-center flex-wrap gap-4">
            <VBtn
              prepend-icon="bx-download"
              variant="tonal"
              color="primary"
              class="me-3"
              href="https://docs.google.com/spreadsheets/d/1cexMhJO--7lgyy5tw2cqt2Dkjnmm5PU_/edit?usp=sharing"
              target="_blank"
              rel="noreferrer"
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

        <!-- Display skipped report alert if available -->
        <VAlert
          v-if="skippedReport"
          type="warning"
          variant="tonal"
          border="start"
          closable
          class="mb-4"
        >
          <div class="d-flex align-center">
            <div>
              <VIcon
                icon="bx-info-circle"
                class="me-2"
                size="24"
              />
              {{ skippedReport.count }} ledgers were skipped because they already exist.
            </div>
            <VBtn
              class="ms-auto"
              size="small"
              variant="outlined"
              color="warning"
              @click="downloadSkippedReport"
            >
              <VIcon icon="bx-download" size="18" class="me-1" /> Download Report
            </VBtn>
          </div>
        </VAlert>

        <!-- Debug info for development -->
        <VAlert
          v-if="uploadedFiles.length > 0"
          type="info"
          variant="tonal"
          border="start"
          class="mb-4"
        >
          <div>
            <strong>Found {{ uploadedFiles.length }} file(s)</strong>
          </div>
        </VAlert>

        <!-- Table -->
        <VDataTable
          :headers="headers"
          :items="uploadedFiles"
          :items-per-page="20"
          class="text-no-wrap clickable-rows"
          fixed-header
        >
          <template #item="{ item, columns }">
            <tr
              class="clickable-row"
              @click="handleViewUpload(item)"
            >
              <td
                v-for="column in columns"
                :key="column.key"
              >
                <template v-if="column.key === 'index'">
                  {{ item.index }}
                </template>
                <template v-else-if="column.key === 'uploaded_file'">
                  <div class="file-name-cell">
                    {{ item.uploaded_file }}
                  </div>
                </template>
                <template v-else-if="column.key === 'total'">
                  {{ item.rowCounts?.total || 0 }}
                </template>
                <template v-else-if="column.key === 'saved'">
                  {{ item.rowCounts?.saved || 0 }}
                </template>
                <template v-else-if="column.key === 'sent_to_tally'">
                  {{ item.rowCounts?.sentToTally || 0 }}
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
                  {{ item[column.key] }}
                </template>
              </td>
            </tr>
          </template>
        </VDataTable>
      </VCardText>
    </VCard>

    <!-- File Upload Dialog -->
    <FileUploadDialog
      v-model:show="showUploadDialog"
      title="Upload Ledger Data"
      upload-api="https://api.tallyfy.in/api/uploadExcelLedger"
      :required-fields="compulsoryHeaders"
      :extra-data="{
        email: userEmail,
        company: selectedCompany?.company_id || ''
      }"
      @upload-success="handleUploadSuccess"
    />

    <!-- Duplicate File Modal -->
    <VDialog
      v-model="duplicateModal"
      max-width="500"
      persistent
    >
      <VCard>
        <VCardTitle class="bg-warning-subtle text-warning">
          <VIcon
            icon="bx-exclamation-triangle"
            class="me-2"
            color="warning"
          />
          Duplicate File Detected
        </VCardTitle>
        
        <VCardText class="pa-4">
          <p>{{ duplicateInfo.message }}</p>

          <div v-if="duplicateInfo.type === 'identical'">
            <p>This file is identical to an existing upload.</p>
          </div>

          <div v-else-if="duplicateInfo.type === 'different'">
            <p>
              <strong>Analysis:</strong><br>
              Unique rows: {{ duplicateInfo.uniqueRows }}<br>
              Duplicate rows: {{ duplicateInfo.duplicateRows }}
            </p>
            <VDivider class="my-3" />
            <p>What would you like to do?</p>
            <VList density="compact" class="bg-secondary-subtle rounded">
              <VListItem>
                <VListItemTitle><strong>View existing file</strong> - see the original file</VListItemTitle>
              </VListItem>
              <VListItem v-if="duplicateInfo.uniqueRows > 0">
                <VListItemTitle><strong>Merge</strong> - add unique entries to existing file</VListItemTitle>
              </VListItem>
              <VListItem v-if="duplicateInfo.uniqueRows > 0">
                <VListItemTitle><strong>Create new</strong> - create a separate file with unique entries</VListItemTitle>
              </VListItem>
            </VList>
          </div>

          <div v-else-if="duplicateInfo.type === 'success'">
            <VAlert
              type="success"
              variant="tonal"
              border="start"
            >
              {{ duplicateInfo.message }}
            </VAlert>
          </div>
        </VCardText>
        
        <VCardActions class="pa-4 pt-0">
          <VBtn
            variant="outlined"
            color="secondary"
            @click="duplicateModal = false"
          >
            Close
          </VBtn>
          
          <VSpacer />

          <VBtn
            v-if="duplicateInfo.type !== 'success'"
            color="info"
            variant="elevated"
            class="me-2"
            @click="handleDuplicateAction('view')"
          >
            View Existing
          </VBtn>

          <VBtn
            v-if="duplicateInfo.type === 'different' && duplicateInfo.uniqueRows > 0"
            color="primary"
            variant="elevated"
            class="me-2"
            @click="handleDuplicateAction('merge')"
          >
            Merge
          </VBtn>
          
          <VBtn
            v-if="duplicateInfo.type === 'different' && duplicateInfo.uniqueRows > 0"
            color="warning"
            variant="elevated"
            @click="handleDuplicateAction('new')"
          >
            Create New
          </VBtn>

          <VBtn
            v-if="duplicateInfo.type === 'success'"
            color="primary"
            variant="elevated"
            @click="handleViewUpload({temp_table: duplicateInfo.table})"
          >
            View File
          </VBtn>
        </VCardActions>
      </VCard>
    </VDialog>
    
    <!-- Delete Confirmation Dialog -->
    <VDialog
      v-model="showDeleteConfirm"
      max-width="500"
    >
      <VCard>
        <VCardTitle class="bg-error-subtle text-error">
          <VIcon
            icon="bx-trash"
            color="error"
            class="me-2"
          />
          Confirm Deletion
        </VCardTitle>
        
        <VCardText class="pa-4">
          <p>Are you sure you want to delete this file? This action cannot be undone.</p>
        </VCardText>
        
        <VCardActions class="pa-4 pt-0">
          <VBtn
            variant="outlined"
            color="secondary"
            @click="showDeleteConfirm = false"
          >
            Cancel
          </VBtn>
          
          <VSpacer />
          
          <VBtn
            color="error"
            variant="elevated"
            @click="confirmDelete"
          >
            Delete
          </VBtn>
        </VCardActions>
      </VCard>
    </VDialog>
  </div>
</template>

<style lang="scss">
.file-name-cell {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
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
      transform: translateY(0);
    }
  }
}

// Make the table fit content better
.v-data-table {
  .v-data-table__td,
  .v-data-table__th {
    padding-block: 0 !important;
    padding-inline: 12px !important;
  }

  // Total column (3rd column)
  .v-data-table__tr > :nth-child(3) {
    text-align: center !important;
  }

  // Saved column (4th column)
  .v-data-table__tr > :nth-child(4) {
    text-align: center !important;
  }

  // Send to Tally column (5th column)
  .v-data-table__tr > :nth-child(5) {
    text-align: center !important;
  }

  // Ensure values are centered in numeric columns
  .v-data-table__td:nth-child(3),
  .v-data-table__td:nth-child(4),
  .v-data-table__td:nth-child(5) {
    font-variant-numeric: tabular-nums;
  }
}
</style> 
