<!-- eslint-disable camelcase -->
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

// define all the emitted event names, old and new
// eslint-disable-next-line camelcase
const emit = defineEmits([
  'update:show',
  'upload‑success',   // old style
  'uploadSuccess',    // new camelCase
  'file‑selected',
  'confirm‑upload'
])

// For backward/forward compatibility, map the old event to the new
const emitUploadSuccess = data => {
  // fire the new camelCase event
  emit('uploadSuccess', data)
  // also fire the old‑style dash event if any listener still uses it
  emit('upload‑success', data)
}

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

// Form data preparation is now handled directly in the submitFile function
// to avoid issues with selectedFile being null after dialog is closed

// Function to send receipts to database
const sendReceiptsToDatabase = async (data, tempTableName) => {
  try {
    // Check if we have receipts in the response
    if (!data.receipts || !Array.isArray(data.receipts) || data.receipts.length === 0) {
      console.warn('No receipts found in the PDF processing response')
      console.log('Response data structure:', JSON.stringify(data, null, 2))
      
      return
    }
    
    console.log(`Found ${data.receipts.length} receipts in PDF response. Sending to database...`)
    console.log('First receipt sample:', JSON.stringify(data.receipts[0], null, 2))
    
    // Since the backend isn't properly implementing the required upload_id, we need to modify it
    console.log('Since we still have database errors, we need to apply a workaround...')
    
    try {
      // Try a direct database update to fix the missing upload_id
      console.log(`Applying SQL fix for table ${tempTableName}...`)
      
      // Simple request to try to fix the table with raw SQL
      const fixResponse = await fetch('http://localhost:3001/api/executeSql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sql: `UPDATE ${tempTableName} SET upload_id = '${tempTableName}', email = '${props.extraData.email || ''}', company = '${props.extraData.company || ''}' WHERE upload_id IS NULL`,
        }),
      }).catch(err => {
        console.warn('SQL fix endpoint not available:', err.message)
        
        return { ok: false }
      })
      
      if (fixResponse.ok) {
        console.log('✅ Applied SQL fix successfully!')
      }
    } catch (err) {
      console.warn('Failed to apply SQL fix:', err.message)
    }
    
    // Create simplified data for the API
    const receiptsData = {
      temp_table: tempTableName,
      email: props.extraData.email || '',
      company: props.extraData.company || '',
      upload_id: tempTableName, // Send the table name as the upload_id
      receipts: data.receipts,
    }
    
    // Log data being sent for debugging
    console.log('Sending receipts data to database with params:', {
      temp_table: receiptsData.temp_table,
      email: receiptsData.email,
      company: receiptsData.company,
      upload_id: receiptsData.upload_id,
      receiptCount: receiptsData.receipts.length,
    })
    
    // Send the data to the insertParsedReceipts endpoint
    const response = await fetch('http://localhost:3001/api/insertParsedReceipts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(receiptsData),
    })
    
    // Log raw response for debugging
    console.log('API Response Status:', response.status, response.statusText)
    
    if (!response.ok) {
      const errorText = await response.text()

      console.error('API Error Response:', errorText)
      
      try {
        const errorJson = JSON.parse(errorText)

        console.error('API Error JSON:', errorJson)
        throw new Error(`Failed to insert receipts: ${errorJson.message || errorJson.error || 'Unknown error'}`)
      } catch (parseError) {
        throw new Error(`Failed to insert receipts: ${response.status} ${response.statusText} - ${errorText}`)
      }
    }
    
    const result = await response.json()
    
    console.log('Successfully inserted receipts to database:', result)
    
    return result
  } catch (error) {
    console.error('Error inserting receipts to database:', error)
    throw error
  }
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
    
    // Check if it's a PDF file
    const isPdf = selectedFile.value.name.toLowerCase().endsWith('.pdf')
    
    // Store file details for later use (to prevent null reference issues)
    const fileDetails = {
      name: selectedFile.value.name,
      size: selectedFile.value.size,
      type: selectedFile.value.type,
      file: selectedFile.value,
    }
    
    // For PDF files, first create a temp table
    let tempTableName = null
    
    if (isPdf) {
      try {
        console.log('PDF detected - Creating temp table first...')
        
        // Prepare data for temp table creation
        const createTempTableData = {
          email: props.extraData.email || '',
          company: props.extraData.company || '',
          fileName: fileDetails.name,
          bankAccount: props.extraData.bank || '',
        }
        
        console.log('Creating temp table with data:', createTempTableData)
        
        // Call the API to create a temp table
        const tempTableResponse = await fetch('http://localhost:3001/api/createTempTable', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(createTempTableData),
        })
        
        if (!tempTableResponse.ok) {
          throw new Error('Failed to create temp table')
        }
        
        const tempTableData = await tempTableResponse.json()
        
        // Get the temp table name from the response
        // The API returns the table name in the 'table' property
        tempTableName = tempTableData.table || tempTableData.tableName || tempTableData.table_name
        
        if (!tempTableName) {
          console.error('API Response:', tempTableData)
          throw new Error('No temp table name returned from API')
        }
        
        console.log('✅ Temp table created successfully:', tempTableName)

        // For PDF, emit success with processing status and close dialog now
        console.log('Emitting processing status and closing dialog - table name:', tempTableName)

        // Emit with processing status 
        emitUploadSuccess({
          file: fileDetails.file,
          response: {
            status: 'processing',
          },
          tempTableName: tempTableName,
          isProcessing: true,
        })

        // Close the dialog immediately after getting temp table
        closeDialog()

        console.log('Now proceeding to upload PDF with temp table name in background')
      } catch (err) {
        console.error('❌ Error creating temp table:', err)
        throw new Error('Failed to create temp table: ' + err.message)
      }
    }
    
    // For PDF files, we MUST have a temp table name before proceeding
    if (isPdf && !tempTableName) {
      throw new Error('Cannot process PDF without a temp table name')
    }

    // Create the FormData once
    const formData = new FormData()

    if (isPdf) {
      // === PDF path: manually append each field ===
      // eslint-disable-next-line camelcase
      formData.append('email', props.extraData.email || '')
      // eslint-disable-next-line camelcase
      formData.append('company', props.extraData.company || '')
      // eslint-disable-next-line camelcase
      formData.append('uploaded_file', props.extraData.uploaded_file || fileDetails.name)
      // eslint-disable-next-line camelcase
      formData.append('user_group', props.extraData.user_group || 'gold')

      // Add the file blob
      formData.append('file', fileDetails.file)

      // Temp table & metadata
      if (tempTableName) {
        console.log(`🔄 Adding temp_table: ${tempTableName} to formData`)
        // eslint-disable-next-line camelcase
        formData.append('temp_table', tempTableName)

        if (props.extraData.bank) {
          console.log(`🔄 Adding bank_name: ${props.extraData.bank} to formData`)
          // eslint-disable-next-line camelcase
          formData.append('bank_name', props.extraData.bank)
        }
        if (props.extraData.user_id) {
          console.log(`🔄 Adding user_id: ${props.extraData.user_id} to formData`)
          // eslint-disable-next-line camelcase
          formData.append('user_id', props.extraData.user_id)
        }

        const fileId = props.extraData.file_id || tempTableName
        // eslint-disable-next-line camelcase
        formData.append('file_id', fileId)
        console.log(`🔄 Adding file_id: ${fileId} to formData`)
      }

    } else {
      // === Excel (or non‑PDF) path: fallback to generic append ===
      formData.append('file', selectedFile.value)

      if (props.extraData && typeof props.extraData === 'object') {
        Object.entries(props.extraData).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            formData.append(
              key,
              typeof value === 'object' ? JSON.stringify(value) : value.toString()
            )
          }
        })
      }
    }
        // eslint-disable-next-line camelcase
        formData.append('file_id', fileId)
        console.log(`🔄 Adding file_id: ${fileId} to formData`)
      }
    } else {
      // For Excel, use the original function
      formData.append('file', selectedFile.value)
      
      // Add any extra data from props
      Object.entries(props.extraData).forEach(([key, value]) => {
        formData.append(key, value)
      })
    }
    
    // Log the form data for uploads
    console.log('FormData prepared with fields:', 
      Object.fromEntries(
        Array.from(formData.entries())
          .filter(([key]) => key !== 'file')
          .map(([key, value]) => [key, value]),
      ),
    )
    
    // Use different API endpoint for PDF files
    const apiEndpoint = isPdf 
      ? 'http://3.108.64.167:8000/process-pdf' 
      : props.uploadApi
    
    console.log(`Uploading ${isPdf ? 'PDF' : 'Excel'} file to: ${apiEndpoint}`)
    
    // For PDF specifically, add debugging info
    if (isPdf) {
      console.log('------- PDF UPLOAD DETAILS -------')
      console.log('File name:', fileDetails.name)
      console.log('File size:', fileDetails.size)
      console.log('Temp table:', tempTableName)
      console.log('Bank name:', props.extraData.bank)
      console.log('----------------------------------')
    }
    
    // Make the API call - for PDF we don't set Content-Type header
    // as FormData will set multipart/form-data with boundary automatically
    const res = await fetch(apiEndpoint, {
      method: 'POST',
      body: formData,
    })
    
    // For improved debugging, log the status and headers
    console.log(`API Response Status: ${res.status} ${res.statusText}`)
    
    // If API call failed
    if (!res.ok) {

      const errorText = await res.text()
      let errorData = null
      
      console.error('API Error Response Text:', errorText)
      
      // Try to parse as JSON, but handle case where it's not valid JSON
      try {
        errorData = JSON.parse(errorText)
        console.error('API Error JSON:', errorData)
        
        if (errorData.detail && Array.isArray(errorData.detail)) {
          // Log detailed validation errors
          console.error('Validation errors details:', JSON.stringify(errorData.detail, null, 2))
          
          const errorMessages = errorData.detail.map(d => {
            if (typeof d === 'object') {
              return `${d.loc?.[1] || ''}: ${d.msg || 'Unknown error'}`
            }
            
            return d
          }).join(', ')
          
          throw new Error(`Validation error: ${errorMessages}`)
        }
      } catch (jsonError) {
        console.error('Failed to parse API error as JSON:', jsonError)
        console.error('Original error text:', errorText)
        errorData = { error: errorText }
      }
      
      throw new Error(errorData?.error || errorData?.detail || 'Upload failed')
    }
    
    const data = await res.json().catch(() => ({}))
    
    // For PDF files, let's log the detailed response structure for debugging
    if (isPdf) {
      console.log('------- Detailed PDF Response Structure -------')
      console.log('Response status:', res.status, res.statusText)
      console.log('Response top-level properties:', Object.keys(data))
      
      // Look for receipts in different parts of the response
      if (data.receipts) {
        console.log('Receipts found at top level:', data.receipts.length)
      } else if (data.data && data.data.receipts) {
        console.log('Receipts found in data.data:', data.data.receipts.length)
      } else if (data.response && data.response.receipts) {
        console.log('Receipts found in data.response:', data.response.receipts.length)
      } else {
        console.log('No receipts property found in response. Structure:', JSON.stringify(data, null, 2))
      }
      console.log('---------------------------------------------')
    }

    // Log the complete response data
    console.log('API Response Data:', {
      endpoint: apiEndpoint,
      fileType: isPdf ? 'PDF' : 'Excel',
      fileName: isPdf ? fileDetails.name : selectedFile.value.name,
      tempTableName: tempTableName || 'N/A',
      responseData: data,
    })

    // For PDF uploads, check for receipts and send them to the database
    if (isPdf && tempTableName) {
      try {
        // Check where receipts might be in the response structure
        const receipts = data.receipts || 
                         (data.data && data.data.receipts) || 
                         (data.response && data.response.receipts)
                         
        if (receipts && Array.isArray(receipts) && receipts.length > 0) {
          console.log(`Found ${receipts.length} receipts in the response. Sending to database...`)
          
          // Create a data object with the receipts for the database function
          const dataWithReceipts = { ...data, receipts }
          
          // Send parsed receipts to the database
          const insertResult = await sendReceiptsToDatabase(dataWithReceipts, tempTableName)
          
          console.log('✅ Receipts inserted into database successfully')
          
          // Add receipt information to the response data
          data.receiptsInserted = true
          data.receiptsCount = receipts.length
          data.insertResult = insertResult
        } else {
          console.log('No receipts found in the PDF processing response structure')
        }
      } catch (error) {
        console.error('❌ Failed to insert receipts into database:', error)

        // Don't fail the overall process if this fails
      }
    }
    
    // Emit final success event
    emitUploadSuccess({
      file: isPdf ? fileDetails.file : selectedFile.value,
      response: data,
      tempTableName: tempTableName,
    })
    
    if (!isPdf) {
      // Only close dialog for Excel files, for PDF it's already closed
      closeDialog()
    }
    
    if (props.redirectPath) {
      navigateTo(props.redirectPath)
    }
  } catch (err) {
    console.error('Error in submitFile:', err)
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
