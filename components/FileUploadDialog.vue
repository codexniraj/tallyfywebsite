<script setup>
import { computed, onMounted, ref } from 'vue'
import * as XLSX from 'xlsx'

const props = defineProps({
  show: {
    type: Boolean,
    required: true,
  },
  title: {
    type: String,
    default: 'Upload File',
  },
  maxFileSize: {
    type: Number,
    default: 50 * 1024 * 1024, // 50MB
  },
  acceptedFormats: {
    type: String,
    default: '.xls,.xlsx',
  },
  uploadApi: {
    type: String,
    required: false,
  },
  requiredFields: {
    type: Array,
    default: () => [],
  },
  extraData: {
    type: Object,
    default: () => ({}),
  },
  redirectPath: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['update:show', 'upload-success', 'file-selected', 'confirm-upload'])

const selectedFile = ref(null)
const error = ref('')
const uploading = ref(false)
const fileInput = ref(null)
const bankElement = ref(null)

// Check if bank is selected from slot
const isBankRequired = ref(false)

const isBankSelected = computed(() => {
  if (!isBankRequired.value) return true
  
  return !!props.extraData.bank
})

// Check for bank selection slot on component mount
onMounted(() => {
  // Wait for DOM to be ready
  setTimeout(() => {
    const bankSelectionSlot = document.querySelector('.bank-selection-slot-wrapper')

    isBankRequired.value = !!bankSelectionSlot
  }, 100)
})

const handleFileUpload = event => {
  error.value = ''

  const file = event.target?.files?.[0] || event
  if (!file) return

  if (file.size > props.maxFileSize) {
    error.value = "File size exceeds 50MB limit."
    
    return
  }

  selectedFile.value = file
  
  // Emit the file-selected event to the parent component
  emit('file-selected', file)
}

const uploadFile = async () => {
  if (!selectedFile.value) return
  
  // Validate bank selection if required
  if (isBankRequired.value && !isBankSelected.value) {
    error.value = "Please select a bank before uploading a statement."
    
    return
  }

  // Check file type
  const fileType = selectedFile.value.name.split('.').pop().toLowerCase()
  const isPdf = fileType === 'pdf'
  const isExcel = ['xls', 'xlsx'].includes(fileType)
  
  if (!isPdf && !isExcel) {
    error.value = "Only Excel (.xls, .xlsx) and PDF (.pdf) files are allowed."
    
    return
  }
  
  // If uploadApi is not provided, emit the confirm-upload event and let the parent handle the upload
  if (!props.uploadApi) {
    emit('confirm-upload', selectedFile.value)
    return
  }
  
  // For Excel files, validate content
  if (isExcel) {
    const reader = new FileReader()

    reader.onload = async e => {
      try {
        const data = new Uint8Array(e.target.result)
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

        if (props.requiredFields && Array.isArray(props.requiredFields) && props.requiredFields.length > 0) {
          const firstRow = json[0] || {}
          const keys = Object.keys(firstRow)
          const missingHeaders = props.requiredFields.filter(key => !keys.includes(key))
          
          if (missingHeaders.length > 0) {
            error.value = `Missing compulsory headers: ${missingHeaders.join(', ')}`
            
            return
          }
        }

        // Submit the validated Excel file
        await submitFile()
      } catch (err) {
        error.value = "Failed to read Excel file. Make sure it's not corrupted or password protected."
        console.error('Excel parsing error:', err)
      }
    }

    reader.readAsArrayBuffer(selectedFile.value)
  } else {
    // For PDF files, skip Excel validation and submit directly
    await submitFile()
  }
}

// Separate submit function for both file types
const submitFile = async () => {
  try {
    uploading.value = true
    
    const formData = new FormData()

    formData.append('file', selectedFile.value)
    
    // Add any extra data from props
    if (props.extraData && typeof props.extraData === 'object') {
      Object.entries(props.extraData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, typeof value === 'object' ? JSON.stringify(value) : value.toString())
        }
      })
    }

    const res = await fetch(props.uploadApi, {
      method: 'POST',
      body: formData,
    })
    
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({ error: 'Upload failed' }))
      throw new Error(errorData.error || 'Upload failed')
    }
    
    const data = await res.json().catch(() => ({}))
    
    emit('upload-success', {
      file: selectedFile.value,
      response: data,
    })
    
    closeDialog()
    
    if (props.redirectPath) {
      navigateTo(props.redirectPath)
    }
  } catch (err) {
    error.value = err.message || "Failed to upload data."
  } finally {
    uploading.value = false
  }
}

const closeDialog = () => {
  selectedFile.value = null
  error.value = ''
  emit('update:show', false)
}
</script>

<template>
  <VDialog
    :model-value="show"
    max-width="550"
    persistent
    @update:model-value="$emit('update:show', $event)"
  >
    <VCard class="rounded-lg">
      <VCardTitle class="d-flex justify-space-between align-center pa-4 border-bottom">
        <span class="text-h6 font-weight-medium">{{ title }}</span>
        <VBtn
          icon
          variant="text"
          size="small"
          @click="closeDialog"
        >
          <VIcon icon="bx-x" />
        </VBtn>
      </VCardTitle>

      <VCardText class="pa-6">
        <!-- Bank Selection Slot - Add this new slot -->
        <div class="mb-6 bank-selection-slot-wrapper">
          <slot name="bank-selection" />
        </div>
        
        <!-- File Upload Area -->
        <VCard
          flat
          class="border-2 border-dashed rounded-lg pa-8 mb-6 text-center"
          :color="selectedFile ? 'primary' : 'default'"
          :class="{'border-primary': selectedFile}"
        >
          <div v-if="!selectedFile">
            <VIcon
              icon="bx-cloud-upload"
              size="42"
              class="mb-3 text-primary"
            />
            <h3 class="text-h6 mb-2">
              {{ title }}
            </h3>
            <p class="text-body-2 text-medium-emphasis mb-4">
              Click to browse or drag and drop your file
            </p>
            <VBtn 
              color="primary" 
              prepend-icon="bx-upload"
              @click="fileInput.click()"
            >
              Upload File
            </VBtn>
            <input
              ref="fileInput"
              type="file"
              :accept="acceptedFormats"
              class="d-none"
              @change="handleFileUpload"
            >
          </div>
          <div
            v-else
            class="py-2"
          >
            <div class="d-flex align-center">
              <VIcon
                :icon="selectedFile.name.endsWith('.pdf') ? 'bx-file-pdf' : 'bx-file-excel'"
                size="32"
                color="primary"
                class="me-3"
              />
              <div class="text-start">
                <div class="text-subtitle-1 font-weight-medium">
                  {{ selectedFile.name }}
                </div>
                <div class="text-caption text-medium-emphasis">
                  {{ Math.round(selectedFile.size / 1024) }} KB
                  <VBtn
                    variant="text"
                    density="comfortable"
                    size="small"
                    color="error"
                    class="ms-2 text-caption"
                    @click="selectedFile = null; error = ''"
                  >
                    Remove
                  </VBtn>
                </div>
              </div>
            </div>
          </div>
        </VCard>

        <!-- Status Message -->
        <VCard
          v-if="error || uploading"
          :color="error ? 'error' : 'info'"
          variant="flat"
          class="mb-6 pa-4 rounded-lg"
        >
          <div class="d-flex align-center">
            <VIcon
              :icon="error ? 'bx-error-circle' : 'bx-loader bx-spin'"
              size="24"
              class="me-2"
            />
            <div>
              <div class="font-weight-medium">
                {{ error ? 'Missing data' : 'Uploading...' }}
              </div>
              <div
                v-if="error"
                class="text-body-2 mt-1"
              >
                {{ error }}
              </div>
            </div>
          </div>
        </VCard>

        <!-- Upload Rules -->
        <div class="mb-3">
          <div class="text-subtitle-1 font-weight-medium mb-3">
            Upload Rules:
          </div>
          
          <!-- Rule 1 -->
          <div class="d-flex align-start mb-2">
            <VIcon
              size="8"
              icon="bxs-bookmark-star"
              color="black"
              class="me-3 mt-2"
            />
            <span class="text-medium-emphasis">
              <span class="text-error font-weight-bold">Colored fields</span> are compulsory.
            </span>
          </div>
          
          <!-- Rule 2 -->
          <div class="d-flex align-start mb-2">
            <VIcon
              size="8"
              icon="bxs-bookmark-star"
              color="black"
              class="me-3 mt-2"
            />
            <span class="text-medium-emphasis">
              Ensure format matches <span class="text-primary font-weight-bold">sample uploaded file</span>.
            </span>
          </div>
          
          <!-- Rule 3 -->
          <div class="d-flex align-start mb-2">
            <VIcon
              size="8"
              icon="bxs-bookmark-star"
              color="black"
              class="me-3 mt-2"
            />
            <span class="text-medium-emphasis">
              Only <span class="text-primary font-weight-bold">.xls, .xlsx, and .pdf</span> files allowed.
            </span>
          </div>
          
          <!-- Rule 4 -->
          <div class="d-flex align-start mb-2">
            <VIcon
              size="8"
              icon="bxs-bookmark-star"
              color="black"
              class="me-3 mt-2"
            />
            <span class="text-medium-emphasis">
              Please make sure the file size must not exceed <span class="text-warning font-weight-bold">50 MB</span>
            </span>
          </div>
          
          <!-- Rule 5 -->
          <div class="d-flex align-start mb-2">
            <VIcon
              size="8"
              icon="bxs-bookmark-star"
              color="black"
              class="me-3 mt-2" 
            />
            <span class="text-medium-emphasis">
              Please don't upload <span class="text-error font-weight-bold">password protected</span> excel files.
            </span>
          </div>
          
          <!-- Rule 6 -->
          <div class="d-flex align-start">
            <VIcon
              size="8"
              icon="bxs-bookmark-star"
              color="black"
              class="me-3 mt-2"
            />
            <span class="text-medium-emphasis">
              Date format should be <span class="text-primary font-weight-bold">DD/MM/YYYY</span>.
            </span>
          </div>
        </div>
      </VCardText>

      <VCardActions class="pa-4 pt-0 d-flex justify-end gap-3">
        <VBtn
          variant="outlined"
          color="default"
          @click="closeDialog"
        >
          Cancel
        </VBtn>
        <VBtn
          color="primary"
          :loading="uploading"
          :disabled="!selectedFile || (isBankRequired && !isBankSelected)"
          @click="uploadFile"
        >
          Upload
        </VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
</template> 
