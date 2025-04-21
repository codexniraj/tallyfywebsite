<template>
  <div>
    <VCard>
      <VCardText>
        <div class="d-flex align-center flex-wrap gap-4 mb-4">
          <div class="me-3">
            <h4 class="font-weight-medium">
              Journal (Excel)
            </h4>
          </div>

          <div class="d-flex align-center flex-wrap gap-4">
            <VBtn
              prepend-icon="bx-download"
              variant="tonal"
              color="primary"
              class="me-3"
              href="YOUR_WITH_ITEM_SAMPLE_LINK"
              target="_blank"
            >
              Download With Items
            </VBtn>
            <VBtn
              prepend-icon="bx-download"
              variant="tonal"
              color="primary"
              class="me-3"
              href="YOUR_WITHOUT_ITEM_SAMPLE_LINK"
              target="_blank"
            >
              Download Without Items
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
          class="text-no-wrap"
          fixed-header
        >
          <!-- Sr.No Column -->
          <template #item.index="{ item }">
            {{ item.raw.index }}
          </template>

          <!-- File Name Column -->
          <template #item.uploaded_file="{ item }">
            <div 
              class="cursor-pointer"
              @click="handleViewUpload(item.raw)"
            >
              {{ item.raw.uploaded_file }}
            </div>
          </template>

          <!-- Send to Tally Date Range Column -->
          <template #item.SendToTally_date="{ item }">
            {{ item.raw.SendToTally_date || '-' }}
          </template>

          <!-- Total Column -->
          <template #item.total="{ item }">
            {{ item.raw.rowCounts?.total || 0 }}
          </template>

          <!-- Saved Column -->
          <template #item.saved="{ item }">
            {{ item.raw.rowCounts?.saved || 0 }}
          </template>

          <!-- Send to Tally Column -->
          <template #item.synced="{ item }">
            {{ item.raw.rowCounts?.sentToTally || 0 }}
          </template>

          <!-- Actions Column -->
          <template #item.actions="{ item }">
            <VBtn
              size="small"
              icon
              variant="text"
              color="error"
              @click.stop="confirmDelete(item.raw.temp_table)"
            >
              <VIcon icon="bx-trash" />
            </VBtn>
          </template>
        </VDataTable>
      </VCardText>
    </VCard>

    <!-- File Upload Dialog -->
    <FileUploadDialog
      v-model:show="showUploadDialog"
      title="Upload Journal"
      :required-fields="[]"
      :extra-data="{
        email: userEmail,
        company: selectedCompany && selectedCompany.company_id ? selectedCompany.company_id : '',
      }"
      @file-selected="handleFileUpload"
      @confirm-upload="uploadFile"
      @upload-success="handleUploadSuccess"
    />
    


    <!-- Delete Confirmation Dialog -->
    <VDialog
      v-model="deleteDialog"
      max-width="400"
    >
      <VCard>
        <VCardTitle class="text-h5 pa-4">
          Confirm Delete
        </VCardTitle>
        <VCardText>
          Are you sure you want to delete this file?
        </VCardText>
        <VCardActions class="pa-4">
          <VSpacer />
          <VBtn
            variant="tonal"
            @click="deleteDialog = false"
          >
            Cancel
          </VBtn>
          <VBtn
            color="error"
            @click="deleteFile"
          >
            Delete
          </VBtn>
        </VCardActions>
      </VCard>
    </VDialog>
  </div>
</template>

<script setup>
import { useAuthStore } from '@/auth'
import { useUserCompanies } from '@/composables/useUserCompanies'
import axios from 'axios'
import { computed, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import * as XLSX from 'xlsx'
import FileUploadDialog from '~/components/FileUploadDialog.vue'

definePageMeta({ layout: 'default' })

const router = useRouter()

// Auth store and user companies composable
const authStore = useAuthStore()
const { selectedCompany } = useUserCompanies()

// User email computed property
const userEmail = computed(() => authStore.userEmail)

// Console logs for debugging email and selected company
console.log('Initial userEmail:', userEmail.value)
console.log('Initial selectedCompany:', selectedCompany.value)

const headers = [
  { 
    title: 'SR.NO', 
    key: 'index', 
    sortable: false, 
    width: '50px',
    align: 'start',
  },
  { 
    title: 'FILE NAME', 
    key: 'uploaded_file', 
    sortable: true, 
    width: '60%',
    align: 'start',
  },
  { 
    title: 'SEND TO TALLY DATE RANGE', 
    key: 'SendToTally_date', 
    sortable: true, 
    width: '25%',
    align: 'start',
  },
  { 
    title: 'TOTAL', 
    key: 'total', 
    sortable: true, 
    align: 'start', 
    width: '50px',
  },
  { 
    title: 'SAVED', 
    key: 'saved', 
    sortable: true, 
    align: 'start', 
    width: '50px',
  },
  { 
    title: 'SEND TO TALLY', 
    key: 'synced', 
    sortable: true, 
    align: 'start', 
    width: '100px',
  },
  { 
    title: ' ', 
    key: 'actions', 
    sortable: false, 
    align: 'center',
    width: '5px',
  },
]

const error = ref('')
const uploading = ref(false)
const uploadedFiles = ref([])
const showUploadDialog = ref(false)
const selectedFile = ref(null)
const maxFileSize = 50 * 1024 * 1024
const deleteDialog = ref(false)
const tempTableToDelete = ref('')
 

const compulsoryWithoutItems = [
  "Reference No", "Date", "Particulars", "Dr/Cr", "Amount",
]

const compulsoryWithItems = [
  "Reference No", "Date", "Particulars", "Name Of Item", "Quantity", "Rate", "Dr/Cr", "Amount",
]

// const validateExcelHeaders = (json) => {
//   const keys = Object.keys(json[0] || {});
//   const isWithItems = keys.includes("Name Of Item");
  
//   const compulsory = isWithItems ? compulsoryWithItems : compulsoryWithoutItems;
//   const missingHeaders = compulsory.filter(key => !keys.includes(key));
  
//   return { isValid: missingHeaders.length === 0, missingHeaders };
// };

// // Usage example
// const reader = new FileReader();
// reader.onload = (e) => {
//   const data = new Uint8Array(e.target.result);
//   const workbook = XLSX.read(data, { type: 'array' });
//   const sheet = workbook.Sheets[workbook.SheetNames[0]];
//   const json = XLSX.utils.sheet_to_json(sheet, {
//     defval: "",
//     raw: false
//   });

//   const validation = validateExcelHeaders(json);

//   if (!validation.isValid) {
//     error.value = `Missing compulsory headers: ${validation.missingHeaders.join(', ')}`;
//     return;
//   }
// }


// Function to fetch uploaded files data
const fetchUploadedFiles = async () => {
  console.log('Fetching uploaded files...')
  if (!userEmail.value || !selectedCompany.value?.company_id) {
    console.error('Cannot fetch: Missing userEmail or selectedCompany.')
    
    return
  }

  const companyId = selectedCompany.value.company_id

  console.log(`Fetching files with email=${userEmail.value}, company=${companyId}`)
  
  try {   
    const filesRes = await axios.get("https://api.tallyfy.in/api/getUserJournelUploads", {
      params: { email: userEmail.value, company: companyId },
    })

    console.log('Fetched files:', filesRes.data)

    const filesWithCounts = await Promise.all(
      filesRes.data.map(async (file, index) => {
        try {
          const dataRes = await axios.get("https://api.tallyfy.in/api/getJournalData", {
            params: { tempTable: file.temp_table },
          })
          
          const totalRows = dataRes.data?.length || 0
          let savedRows = 0
          let sentToTallyRows = 0
          
          if (dataRes.data && Array.isArray(dataRes.data)) {
            dataRes.data.forEach(row => {
              if (row.status) {
                const status = row.status.toLowerCase()
                if (status === 'saved') savedRows++
                if (['sent_to_tally', 'send to tally'].includes(status)) sentToTallyRows++
              }
            })
          }
          
          return {
            ...file,
            index: index + 1,
            rowCounts: {
              total: totalRows,
              saved: savedRows,
              sentToTally: sentToTallyRows,
            },
          }
        } catch (err) {
          console.error("Failed to get row counts for table:", file.temp_table, err)
          
          return {
            ...file,
            index: index + 1,
            rowCounts: { total: 0, saved: 0, sentToTally: 0 },
          }
        }
      }),
    )

    uploadedFiles.value = filesWithCounts.map((item, idx) => ({
      raw: item,
      index: idx + 1,
    }))

    console.log('Processed uploaded files:', uploadedFiles.value)

  } catch (err) {
    console.error("Failed to fetch uploaded files", err)
  }
}


// Fetch data when component mounts
onMounted(() => {
  console.log('Journal.vue mounted')
  fetchUploadedFiles()
})

// Watch the selected company and refetch data when it changes
watch(selectedCompany, newCompany => {
  console.log('Selected company changed to:', newCompany)
  if (newCompany && newCompany.company_id) {
    fetchUploadedFiles()
  }
}, { deep: true, immediate: true })

const handleFileUpload = file => {
  console.log('🔍 handleFileUpload called with file:', file ? file.name : 'none')
  error.value = ''
  if (!file) return

  if (!userEmail.value || !selectedCompany.value) {
    console.error('⛔ Upload error: Missing userEmail or selectedCompany')
    error.value = "Please login and select a company before uploading."
    
    return
  }

  if (file.size > maxFileSize) {
    console.error('⛔ Upload error: File size exceeds limit', file.size)
    error.value = "File size exceeds 50MB limit."
    
    return
  }

  console.log('✅ File validation passed, setting selectedFile')
  selectedFile.value = file
}

const uploadFile = async file => {
  console.log('🔍 uploadFile called with file:', file ? file.name : 'none')
  
  // Use the file passed from the dialog, or fall back to selectedFile if not provided
  const fileToUpload = file || selectedFile.value
  
  if (!fileToUpload) {
    console.error('No file available for upload')
    
    return
  }

  const reader = new FileReader()

  reader.onload = async e => {
    console.log('📄 FileReader loaded file contents')

    const data = new Uint8Array(e.target.result)
    
    try {
      console.log('📊 Parsing Excel data with XLSX')

      const workbook = XLSX.read(data, { type: 'array' })
      const sheet = workbook.Sheets[workbook.SheetNames[0]]

      console.log('📗 Workbook sheet names:', workbook.SheetNames)

      const json = XLSX.utils.sheet_to_json(sheet, {
        defval: "",
        raw: false,
      })

      console.log('🔢 Converted to JSON with row count:', json.length)

      if (!json || json.length === 0) {
        console.error('⛔ Excel file is empty or unreadable')
        error.value = "Excel file is empty or unreadable."
        
        return
      }

      const keys = Object.keys(json[0] || {})

      console.log('🔑 Excel headers found:', keys)
      
      const isWithItems = keys.includes("Name Of Item")

      console.log('📋 File type:', isWithItems ? 'With Items' : 'Without Items')
      
      const compulsory = isWithItems ? compulsoryWithItems : compulsoryWithoutItems
      const missingHeaders = compulsory.filter(key => !keys.includes(key))
      
      if (missingHeaders.length > 0) {
        console.error('⛔ Missing required headers:', missingHeaders)
        error.value = `Missing compulsory headers: ${missingHeaders.join(', ')}`
        
        return
      }

      try {
        console.log('🚀 Starting API upload to http://3.108.64.167:3001/api/uploadJournal')
        uploading.value = true

        const payload = {
          email: userEmail.value,
          company: selectedCompany.value.company_id || '',
          data: json,
          withItems: isWithItems,
          uploadedFileName: fileToUpload.name,
        }

        console.log('📦 Upload payload:', { 
          email: payload.email,
          company: payload.company, 
          dataRows: payload.data.length,
          withItems: payload.withItems,
          fileName: payload.uploadedFileName,
        })

        const res = await axios.post("https://api.tallyfy.in/api/uploadJournal", payload)

        console.log('✅ Upload successful, API response:', res.data)

        const newIndex = uploadedFiles.value.length + 1

        uploadedFiles.value.push({
          raw: {
            uploaded_file: fileToUpload.name,
            created_at: new Date().toISOString(),
            temp_table: res.data.table,
            invalid_ledgers: res.data.invalidLedgers || [],
            rowCounts: {
              total: 0,
              saved: 0,
              sentToTally: 0,
            },
            index: newIndex,
          },
          index: newIndex,
        })
        console.log('📋 Added new file to uploadedFiles list')

        showUploadDialog.value = false
        selectedFile.value = null
      } catch (err) {
        console.error('⛔ API upload error:', err)
        console.error('Error details:', err.response?.data || err.message)
        error.value = err.response?.data?.error || "Failed to upload data."
      } finally {
        uploading.value = false
      }
    } catch (excelErr) {
      console.error('⛔ Excel parsing error:', excelErr)
      error.value = "Could not parse Excel file. Please check the file format."
      uploading.value = false
    }
  }

  reader.onerror = readerError => {
    console.error('⛔ FileReader error:', readerError)
    error.value = "Error reading file."
    uploading.value = false
  }

  console.log('🔄 Starting FileReader to read file as ArrayBuffer')
  reader.readAsArrayBuffer(fileToUpload)
}

const confirmDelete = tableName => {
  tempTableToDelete.value = tableName
  deleteDialog.value = true
}

const deleteFile = async () => {
  try {
    await axios.delete('https://api.tallyfy.in/api/deleteJournelUpload', {
      data: { table: tempTableToDelete.value },
    })
    deleteDialog.value = false
    fetchUploadedFiles()
  } catch (err) {
    console.error("Failed to delete", err)
  }
}

const handleViewUpload = item => {
  console.log('Clicked on file row:', item)
  
  // Store necessary data in sessionStorage
  sessionStorage.setItem('userEmail', userEmail.value)
  sessionStorage.setItem('selectedCompany', selectedCompany.value?.company_id || '')
  sessionStorage.setItem('tempTable', item.temp_table)
  sessionStorage.setItem('uploadMeta', JSON.stringify({ invalidLedgers: item.invalid_ledgers || [] }))
  
  console.log('Stored in sessionStorage:', {
    userEmail: userEmail.value,
    selectedCompany: selectedCompany.value?.company_id || '',
    tempTable: item.temp_table,
  })
  
  // Navigate to journal excel view
  router.push('/journelexcelview')
}

const handleUploadSuccess = result => {
  console.log('✅ handleUploadSuccess called with result:', result)
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
        sentToTally: 0,
      },
    },
  ]
  fetchUploadedFiles()
}
</script>

<style lang="scss" scoped>
.v-data-table {
  .v-data-table-header {
    position: sticky;
    z-index: 1;
    inset-block-start: 0;

    th {
      font-size: 0.875rem;
      font-weight: 600;
      letter-spacing: 0.5px;
      text-transform: uppercase;
      white-space: nowrap;
    }
  }

  .v-data-table__td {
    &.text-center {
      padding-inline: 8px;
    }
  }
}

.cursor-pointer {
  cursor: pointer;

  &:hover {
    color: rgb(var(--v-theme-primary));
    text-decoration: underline;
  }
}

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
</style> 
