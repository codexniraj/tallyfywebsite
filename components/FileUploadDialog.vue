<script setup>
import { computed, onMounted, ref } from 'vue'
import * as XLSX from 'xlsx'

const props = defineProps({
  show: { type: Boolean, required: true },
  title: { type: String, default: 'Upload File' },
  maxFileSize: { type: Number, default: 50 * 1024 * 1024 }, // 50MB
  acceptedFormats: { type: String, default: '.xls,.xlsx' },
  uploadApi: { type: String, required: false },
  requiredFields: { type: Array, default: () => [] },
  extraData: { type: Object, default: () => ({}) },
  redirectPath: { type: String, default: '' },
})

// define all the emitted event names, old and new
// eslint-disable-next-line camelcase
const emit = defineEmits([
  'update:show',
  'upload-success',   // old style
  'uploadSuccess',    // new camelCase
  'file-selected',
  'confirm-upload'
])

// For backward/forward compatibility, map the old event to the new
const emitUploadSuccess = (data) => {
  emit('uploadSuccess', data)
  emit('upload-success', data)
}

const selectedFile = ref(null)
const error = ref('')
const uploading = ref(false)
const fileInput = ref(null)
const isBankRequired = ref(false)

const isBankSelected = computed(() => {
  return !isBankRequired.value || !!props.extraData.bank
})

onMounted(() => {
  setTimeout(() => {
    const slot = document.querySelector('.bank-selection-slot-wrapper')
    isBankRequired.value = !!slot
  }, 100)
})

const handleFileUpload = (event) => {
  error.value = ''
  const file = event.target?.files?.[0] || event
  if (!file) return
  if (file.size > props.maxFileSize) {
    error.value = 'File size exceeds 50MB limit.'
    return
  }
  selectedFile.value = file
  emit('file-selected', file)
}

const sendReceiptsToDatabase = async (data, tempTableName) => {
  try {
    const receipts = data.receipts || []
    if (!receipts.length) return
    const payload = {
      temp_table: tempTableName,
      email: props.extraData.email || '',
      company: props.extraData.company || '',
      upload_id: tempTableName,
      receipts,
    }
    const res = await fetch('http://3.108.64.167:3001/api/insertParsedReceipts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (!res.ok) throw new Error(await res.text())
    return await res.json()
  } catch (e) {
    console.error('sendReceiptsToDatabase error:', e)
    throw e
  }
}

const uploadFile = async () => {
  if (!selectedFile.value) return
  if (isBankRequired.value && !isBankSelected.value) {
    error.value = 'Please select a bank before uploading.'
    return
  }
  const ext = selectedFile.value.name.split('.').pop().toLowerCase()
  const isPdf = ext === 'pdf'
  const isExcel = ['xls', 'xlsx'].includes(ext)
  if (!isPdf && !isExcel) {
    error.value = 'Only Excel (.xls, .xlsx) and PDF (.pdf) files are allowed.'
    return
  }
  if (!props.uploadApi && isExcel) {
    emit('confirm-upload', selectedFile.value)
    return
  }
  if (isExcel) {
    const reader = new FileReader()
    reader.onload = async (e) => {
      const data = new Uint8Array(e.target.result)
      const wb = XLSX.read(data, { type: 'array' })
      const sheet = wb.Sheets[wb.SheetNames[0]]
      const json = XLSX.utils.sheet_to_json(sheet, { defval: '', raw: false })
      if (!json.length) {
        error.value = 'Excel file is empty or unreadable.'
        return
      }
      const missing = props.requiredFields.filter((k) => !(k in json[0]))
      if (missing.length) {
        error.value = `Missing compulsory headers: ${missing.join(', ')}`
        return
      }
      await submitFile()
    }
    reader.readAsArrayBuffer(selectedFile.value)
  } else {
    await submitFile()
  }
}

const submitFile = async () => {
  try {
    uploading.value = true
    const isPdf = selectedFile.value.name.toLowerCase().endsWith('.pdf')
    const fileDetails = { file: selectedFile.value }
    let tempTableName = null

    // PDF: create temp table
    if (isPdf) {
      const resp1 = await fetch('http://3.108.64.167:3001/api/createTempTable', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: props.extraData.email || '',
          company: props.extraData.company || '',
          fileName: fileDetails.file.name,
          bankAccount: props.extraData.bank || '',
        }),
      })
      if (!resp1.ok) throw new Error('Failed to create temp table')
      const j1 = await resp1.json()
      tempTableName = j1.table || j1.tableName || j1.table_name
      if (!tempTableName) throw new Error('No temp table name returned')

      emitUploadSuccess({ file: fileDetails.file, response: { status: 'processing' }, tempTableName, isProcessing: true })
      closeDialog()
    }
    if (isPdf && !tempTableName) throw new Error('Cannot process PDF without a temp table name')

    // Build FormData
    const formData = new FormData()
    if (isPdf) {
      formData.append('email', props.extraData.email || '')
      formData.append('company', props.extraData.company || '')
      formData.append('uploaded_file', props.extraData.uploaded_file || fileDetails.file.name)
      formData.append('user_group', props.extraData.user_group || 'gold')
      formData.append('file', fileDetails.file)
      formData.append('temp_table', tempTableName)
      if (props.extraData.bank) formData.append('bank_name', props.extraData.bank)
      if (props.extraData.user_id) formData.append('user_id', props.extraData.user_id)
      const fileId = props.extraData.file_id || tempTableName
      formData.append('file_id', fileId)
    } else {
      formData.append('file', selectedFile.value)
      Object.entries(props.extraData).forEach(([k, v]) => {
        if (v != null) formData.append(k, typeof v === 'object' ? JSON.stringify(v) : v)
      })
    }

    // Upload
    const endpoint = isPdf ? 'http://3.108.64.167:8000/process-pdf' : props.uploadApi
    const resp2 = await fetch(endpoint, { method: 'POST', body: formData })
    if (!resp2.ok) throw new Error(await resp2.text())
    const data = await resp2.json().catch(() => ({}))

    // PDF receipts
    if (isPdf && tempTableName) {
      const receipts = data.receipts || data.data?.receipts || data.response?.receipts
      if (Array.isArray(receipts) && receipts.length) {
        await sendReceiptsToDatabase({ ...data, receipts }, tempTableName)
      }
    }

    // Final emit & cleanup
    emitUploadSuccess({ file: isPdf ? fileDetails.file : selectedFile.value, response: data, tempTableName })
    if (!isPdf) closeDialog()
    if (props.redirectPath) navigateTo(props.redirectPath)
  } catch (e) {
    console.error('submitFile error:', e)
    error.value = `Upload failed: ${e.message}`
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
