<!-- eslint-disable camelcase -->
<script setup>
import { useAuthStore } from '@/auth'
import { useUserCompanies } from '@/composables/useUserCompanies'
import axios from 'axios'
import { computed, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import FileUploadDialog from '~/components/FileUploadDialog.vue'

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
    title: 'DATE RANGE', 
    key: 'date_range', 
    sortable: true, 
    width: '15%',
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
    title: 'PENDING', 
    key: 'pending', 
    sortable: true, 
    align: 'start', 
    width: '90px',
  },
  { 
    title: 'SEND TO TALLY', 
    key: 'sent_to_tally', 
    sortable: true, 
    align: 'start', 
    width: '90px',
  },
  { 
    title: 'STATUS', 
    key: 'status', 
    sortable: true, 
    align: 'start', 
    width: '90px',
  },
]

const uploadedFiles = ref([])
const showUploadDialog = ref(false)
const selectedFile = ref(null)
const error = ref('')
const uploading = ref(false)
const maxFileSize = 50 * 1024 * 1024

const fetchUploadedFiles = async () => {
  if (!userEmail.value || !selectedCompany.value) return
  
  try {
    const companyId = selectedCompany.value.company_id || ''
    
    const filesRes = await axios.get("http://localhost:3001/api/getUserPurchaseUploads", {
      params: { 
        email: userEmail.value, 
        company: companyId
      }
    })
    
    const filesWithCounts = await Promise.all(
      filesRes.data.map(async (file, index) => {
        try {
          const dataRes = await axios.get("http://localhost:3001/api/getPurchaseData", {
            params: { tempTable: file.temp_table }
          })
          
          const totalRows = dataRes.data?.length || 0
          let savedRows = 0
          let pendingRows = 0
          let sentToTallyRows = 0
          
          if (dataRes.data && Array.isArray(dataRes.data)) {
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
          }
          
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
          console.error("Failed to get row counts for table:", file.temp_table, err)
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
  } catch (err) {
    console.error("Failed to fetch uploaded files", err)
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
}

const uploadFile = async () => {
  // Implement upload logic
}

const handleViewUpload = (file) => {
  sessionStorage.setItem('tempTable', file.temp_table)
  sessionStorage.setItem('uploadMeta', JSON.stringify({ invalidLedgers: file.invalid_ledgers || [] }))
  router.push('/purchase-view')
}

const handleDeleteSelected = async (tableName) => {
  try {
    await axios.delete('http://localhost:3001/api/deletePurchaseUpload', {
      data: { table: tableName }
    })
    fetchUploadedFiles()
  } catch (err) {
    console.error("Failed to delete", err)
  }
}

const handleUploadSuccess = (result) => {
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
              Purchase (Excel)
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
          class="text-no-wrap"
          fixed-header
        >
          <!-- Sr.No Column -->
          <template #item.index="{ item }">
            {{ item.raw.index }}
          </template>

          <!-- File Name Column -->
          <template #item.uploaded_file="{ item }">
            {{ item.raw.uploaded_file }}
          </template>

          <!-- Date Range Column -->
          <template #item.date_range="{ item }">
            {{ item.raw.date_range || '-' }}
          </template>

          <!-- Total Column -->
          <template #item.total="{ item }">
            {{ item.raw.rowCounts?.total || 0 }}
          </template>

          <!-- Saved Column -->
          <template #item.saved="{ item }">
            {{ item.raw.rowCounts?.saved || 0 }}
          </template>

          <!-- Pending Column -->
          <template #item.pending="{ item }">
            {{ item.raw.rowCounts?.pending || 0 }}
          </template>

          <!-- Sent to Tally Column -->
          <template #item.sent_to_tally="{ item }">
            {{ item.raw.rowCounts?.sentToTally || 0 }}
          </template>

          <!-- Status Column -->
          <template #item.status="{ item }">
            <VChip
              :color="item.raw.status === 'Completed' ? 'success' : 'warning'"
              size="small"
            >
              {{ item.raw.status || 'Pending' }}
            </VChip>
          </template>

          <!-- Actions Column -->
          <template #item.actions="{ item }">
            <div class="d-flex gap-1">
              <VBtn
                size="small"
                icon
                variant="text"
                color="primary"
                @click="handleViewUpload(item.raw)"
              >
                <VIcon icon="bx-show" />
              </VBtn>
              <VBtn
                size="small"
                icon
                variant="text"
                color="primary"
              >
                <VIcon icon="bx-download" />
              </VBtn>
              <VBtn
                size="small"
                icon
                variant="text"
                color="error"
                @click.stop="handleDeleteSelected(item.raw.temp_table)"
              >
                <VIcon icon="bx-trash" />
              </VBtn>
            </div>
          </template>
        </VDataTable>
      </VCardText>
    </VCard>

    <!-- File Upload Dialog -->
    <FileUploadDialog
      v-model:show="showUploadDialog"
      title="Upload Purchase Data"
      upload-api="http://localhost:3001/api/uploadPurchase"
      :required-fields="compulsoryHeaders"
      :extra-data="{
        email: userEmail,
        company: selectedCompany?.company_id || ''
      }"
      @upload-success="handleUploadSuccess"
    />
  </div>
</template>

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
