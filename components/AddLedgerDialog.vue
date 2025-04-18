<script setup>
import axios from 'axios'
import { reactive, ref, watch } from 'vue'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:show', 'ledger-added'])

// Ledger groups array
const ledgerGroups = [
  "Bank Accounts", "Bank OCC Alc", "Bank OD Alc", "Branch / Divisions", "Capital Account",
  "Cash-in-Hand", "Current Assets", "Current Liabilities", "Deposits (Asset)", "Direct Expenses",
  "Direct Incomes", "Duties & Taxes", "Expenses (Direct)", "Expenses (Indirect)", "Fixed Assets",
  "Income (Direct)", "Income (Indirect)", "Indirect Expenses", "Indirect Incomes", "Investments",
  "Loans & Advances (Asset)", "Loans (Liability)", "Misc. Expenses (ASSET)", "Provisions",
  "Purchase Accounts", "Reserves & Surplus", "Retained Earnings", "Sales Accounts",
  "Secured Loans", "Stock-in-Hand", "Sundry Creditors", "Sundry Debtors", "Suspense Alc", "Unsecured Loans"
]

// Indian states array
const indianStates = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", 
  "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", 
  "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", 
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", 
  "Uttarakhand", "West Bengal", "Andaman and Nicobar Islands", "Chandigarh", 
  "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Jammu and Kashmir", 
  "Ladakh", "Lakshadweep", "Puducherry"
]

// Dropdown options
const billByBillOptions = ["Yes", "No"]
const inventoryAffectedOptions = ["Yes", "No"]
const registrationTypeOptions = ["Unknown", "Composition", "Consumer", "Regular", "Unregistered"]
const typeOfLedgerOptions = ["Not Applicable", "Discount", "Invoice Rounding"]
const gstApplicableOptions = ["Applicable", "Not Applicable", "Undefined"]
const setAlterGSTDetailsOptions = ["Yes", "No"]
const taxabilityOptions = ["Unknow", "Exempt", "Nil Rated", "Taxable"]

// Required fields by ledger group
const requiredFieldsByLedgerGroup = {
  "Bank Accounts": ["Account Holder Name", "Alc No", "IFS code", "SWIFT code", "Bank Name", "Branch", "Mailing name", "Address", "State", "Pincode", "GSTIN/UIN", "Opening Balance"],
  "Bank OCC Alc": ["Set OD limit","Account Holder Name", "IFS code", "SWIFT code", "Bank Name","Branch", "Mailing name", "Address", "State", "Pincode", "GSTIN/UIN", "Opening Balance"],
  "Bank OD Alc": ["Set OD limit","Account Holder Name", "IFS code","SWIFT code", "Bank Name","Branch", "Mailing name", "Address", "State", "Pincode", "GSTIN/UIN", "Opening Balance"],
  "Branch / Divisions": ["Mailing name", "Address", "State", "Pincode","PAN/IT No", "Registration Type", "GSTIN/UIN","Set/Alter GST Details", "Opening Balance"],
  "Capital Account": ["Mailing name", "Address", "State", "Pincode","PAN/IT No", "Registration Type", "GSTIN/UIN","Set/Alter GST Details", "Opening Balance"],
  "Cash-in-Hand": ["Mailing name", "Address" ,"PAN/IT No" , "Opening Balance"],
  "Current Assets": ["GST Applicable","Mailing name", "Address", "State", "Pincode","PAN/IT No", "Registration Type", "GSTIN/UIN","Set/Alter GST Details", "Opening Balance"],
  "Current Liabilities": ["GST Applicable","Mailing name", "Address", "State", "Pincode","PAN/IT No", "Registration Type", "GSTIN/UIN","Set/Alter GST Details", "Opening Balance"],
  "Deposits (Asset)": ["Mailing name", "Address", "State", "Pincode","PAN/IT No", "Registration Type", "GSTIN/UIN","Set/Alter GST Details", "Opening Balance"],
  "Direct Expenses": ["Type of Ledger", "GST Applicable","HSN/SAC", "Source of Supply", "Taxability", "Integrated Tax", "Cess Tax", "Applicable Date","Mailing name", "Address", "State", "Pincode","PAN/IT No", "Account Holder Name","Alc No", "IFS code", "SWIFT code", "Bank Name", "Branch", "Opening Balance"],
  "Direct Incomes": ["Type of Ledger", "GST Applicable","HSN/SAC", "Source of Supply", "Taxability", "Integrated Tax", "Cess Tax", "Applicable Date","Mailing name", "Address", "State", "Pincode","PAN/IT No", "Account Holder Name","Alc No", "IFS code", "SWIFT code", "Bank Name", "Branch", "Opening Balance"],
  "Duties & Taxes": ["Type of Duty Tax","CGST","SGST","IGST","CESS","Percentage of Calculation","Mailing name", "Address","PAN/IT No", "Account Holder Name","Alc No", "IFS code", "SWIFT code", "Bank Name", "Branch","PAN/IT No", "GSTIN/UIN","Set/Alter GST Details", "Opening Balance"],
  "Expenses (Direct)": ["Type of Ledger", "GST Applicable","HSN/SAC", "Source of Supply", "Taxability", "Integrated Tax", "Cess Tax", "Applicable Date","Mailing name", "Address", "State", "Pincode","PAN/IT No", "Account Holder Name","Alc No", "IFS code", "SWIFT code", "Bank Name", "Branch", "Opening Balance"],
  "Expenses (Indirect)": ["Type of Ledger", "GST Applicable","HSN/SAC", "Source of Supply", "Taxability", "Integrated Tax", "Cess Tax", "Applicable Date","Mailing name", "Address", "State", "Pincode","PAN/IT No", "Account Holder Name","Alc No", "IFS code", "SWIFT code", "Bank Name", "Branch", "Opening Balance"],
  "Fixed Assets":[ "GST Applicable","HSN/SAC", "Source of Supply", "Taxability", "Integrated Tax", "Cess Tax", "Applicable Date","Mailing name", "Address", "State", "Pincode","PAN/IT No", "Account Holder Name","Alc No", "IFS code", "SWIFT code", "Bank Name", "Branch","Registration Type", "GSTIN/UIN","Set/Alter GST Details", "Opening Balance"],
  "Income (Direct)":["Type of Ledger", "GST Applicable","HSN/SAC", "Source of Supply", "Taxability", "Integrated Tax", "Cess Tax", "Applicable Date","Mailing name", "Address", "State", "Pincode","PAN/IT No", "Account Holder Name","Alc No", "IFS code", "SWIFT code", "Bank Name", "Branch", "Opening Balance"],
  "Income (Indirect)": ["Type of Ledger", "GST Applicable","HSN/SAC", "Source of Supply", "Taxability", "Integrated Tax", "Cess Tax", "Applicable Date","Mailing name", "Address", "State", "Pincode","PAN/IT No", "Account Holder Name","Alc No", "IFS code", "SWIFT code", "Bank Name", "Branch", "Opening Balance"],
  "Indirect Expenses": ["Type of Ledger", "GST Applicable","HSN/SAC", "Source of Supply", "Taxability", "Integrated Tax", "Cess Tax", "Applicable Date","Mailing name", "Address", "State", "Pincode","PAN/IT No", "Account Holder Name","Alc No", "IFS code", "SWIFT code", "Bank Name", "Branch", "Opening Balance"],
  "Indirect Incomes": ["Type of Ledger", "GST Applicable","HSN/SAC", "Source of Supply", "Taxability", "Integrated Tax", "Cess Tax", "Applicable Date","Mailing name", "Address", "State", "Pincode","PAN/IT No", "Account Holder Name","Alc No", "IFS code", "SWIFT code", "Bank Name", "Branch", "Opening Balance"],
  "Investments": [ "Mailing name", "Address", "State", "Pincode","PAN/IT No", "Account Holder Name","Alc No", "IFS code", "SWIFT code", "Bank Name", "Branch", "Opening Balance"],
  "Loans & Advances (Asset)": [ "Mailing name", "Address", "State", "Pincode","PAN/IT No", "Account Holder Name","Alc No", "IFS code", "SWIFT code", "Bank Name", "Branch", "Registration Type", "GSTIN/UIN","Set/Alter GST Details", "Opening Balance"],
  "Loans (Liability)": [ "Mailing name", "Address", "State", "Pincode","PAN/IT No", "Account Holder Name","Alc No", "IFS code", "SWIFT code", "Bank Name", "Branch", "Registration Type", "GSTIN/UIN","Set/Alter GST Details", "Opening Balance"],
  "Misc. Expenses (ASSET)":[ "Mailing name", "Address" ,"PAN/IT No", "Account Holder Name","Alc No", "IFS code", "SWIFT code", "Bank Name", "Branch", "Opening Balance"],
  "Provisions": [ "Mailing name", "Address" ,"PAN/IT No", "Account Holder Name","Alc No", "IFS code", "SWIFT code", "Bank Name", "Branch", "Opening Balance"],
  "Purchase Accounts": ["GST Applicable", "Mailing name", "Address", "State", "Pincode","PAN/IT No", "Account Holder Name","Alc No", "IFS code", "SWIFT code", "Bank Name", "Branch", "Opening Balance"],
  "Reserves & Surplus": ["Mailing name", "Address", "Pan/IT No","Account Holder Name","Alc No", "IFS code", "SWIFT code", "Bank Name", "Branch", "Opening Balance"],
  "Retained Earnings": ["Mailing name", "Address", "Pan/IT No","Account Holder Name","Alc No", "IFS code", "SWIFT code", "Bank Name", "Branch", "Opening Balance"],
  "Sales Accounts": ["Type of Ledger", "GST Applicable","HSN/SAC", "Source of Supply", "Taxability", "Integrated Tax", "Cess Tax", "Applicable Date","Mailing name", "Address", "State", "Pincode","PAN/IT No", "Account Holder Name","Alc No", "IFS code", "SWIFT code", "Bank Name", "Branch", "Opening Balance"],
  "Secured Loans": [ "Mailing name", "Address", "State", "Pincode","PAN/IT No", "Account Holder Name","Alc No", "IFS code", "SWIFT code", "Bank Name", "Branch", "Registration Type", "GSTIN/UIN","Set/Alter GST Details", "Opening Balance"],
  "Stock-in-Hand": ["Mailing name", "Address", "Pan/IT No","Account Holder Name","Alc No", "IFS code", "SWIFT code", "Bank Name", "Branch", "Opening Balance", ],
  "Sundry Creditors": ["Bill by bill", "Credit Period","PAN/IT No", "GSTIN/UIN", "Mailing name", "Address", "State", "Pincode","Account Holder Name","Alc No", "IFS code", "SWIFT code", "Bank Name", "Branch", "Opening Balance"], 
  "Sundry Debtors": ["Bill by bill", "Credit Period","PAN/IT No", "GSTIN/UIN", "Mailing name", "Address", "State", "Pincode","Account Holder Name","Alc No", "IFS code", "SWIFT code", "Bank Name", "Branch", "Opening Balance"],
  "Suspense Alc": ["Mailing name", "Address", "Pan/IT No","Account Holder Name","Alc No", "IFS code", "SWIFT code", "Bank Name", "Branch", "Opening Balance"],
  "Unsecured Loans": [ "Mailing name", "Address", "State", "Pincode","PAN/IT No", "Account Holder Name","Alc No", "IFS code", "SWIFT code", "Bank Name", "Branch", "Registration Type", "GSTIN/UIN","Set/Alter GST Details", "Opening Balance"],
}

// Map frontend fields to database columns 
const fieldToColumnMap = {
  "Name": "name",
  "Under": "parent",
  "Mailing name": "mailing_name",
  "Bill by bill": "bill_by_bill",
  "Registration Type": "registration_type",
  "Type of Ledger": "type_of_ledger",
  "Inventory Affected": "inventory_affected",
  "Credit period": "credit_period",
  "GST Applicable": "gst_applicable",
  "Set/Alter GST Details": "set_alter_gst_details",
  "Taxability": "taxability",
  "Integrated Tax": "integrated_tax",
  "Cess Tax": "cess_tax",
  "Applicable Date": "applicable_date",
  "Address": "address",
  "State": "state",
  "Pincode": "pincode",
  "PAN/IT No": "pan_it_no",
  "GSTIN/UIN": "gstin_uin",
  "Account Holder Name": "account_holder_name",
  "Alc No": "alc_no",
  "IFS code": "ifs_code",
  "SWIFT code": "swift_code",
  "Bank Name": "bank_name",
  "Branch": "branch",
  "Type of Duty Tax": "type_of_duty_tax",
  "Percentage of Calculation": "percentage_of_calculation",
  "HSN/SAC": "hsn_sac",
  "Type of Supply": "type_of_supply",
  "Opening Balance": "opening_balance",
  "Set OD limit": "set_od_limit",
  "Registration type": "registration_type",
}

// Define which fields should use dropdowns
const dropdownFields = {
  "Bill by bill": billByBillOptions,
  "Inventory Affected": inventoryAffectedOptions,
  "Type of Ledger": typeOfLedgerOptions,
  "Registration Type": registrationTypeOptions,
  "GST Applicable": gstApplicableOptions,
  "Set/Alter GST Details": setAlterGSTDetailsOptions,
  "Taxability": taxabilityOptions,
  "State": indianStates
}

// State variables
const ledgerName = ref('')
const selectedGroup = ref('Bank Accounts')
const dynamicFields = ref([])
const fieldValues = reactive({})
const loading = ref(false)
const error = ref('')
const success = ref('')
const showDuplicateWarning = ref(false)
const duplicateInfo = ref(null)

// Get user email and company from session storage
const userEmail = sessionStorage.getItem("userEmail")
const selectedCompany = sessionStorage.getItem("selectedCompany")

// Watch for changes in selected group
watch(selectedGroup, (newGroup) => {
  dynamicFields.value = requiredFieldsByLedgerGroup[newGroup] || []
  // Reset field values when group changes
  Object.keys(fieldValues).forEach(key => {
    delete fieldValues[key]
  })
})

// Check if ledger already exists
const checkIfLedgerExists = async (name) => {
  try {
    const tables = await axios.get('http://3.108.64.167:3001/api/getUserExcelLedgerUploads', {
      params: { email: userEmail, company: selectedCompany }
    })
    
    if (tables.data.length === 0) return false
    
    // Just check the most recent table
    const latestTable = tables.data[0].temp_table
    
    const ledgers = await axios.get('http://3.108.64.167:3001/api/excelLedgersData', {
      params: { tempTable: latestTable }
    })
    
    return ledgers.data.some(ledger => 
      ledger.name.toLowerCase() === name.toLowerCase()
    )
  } catch (error) {
    console.error("Error checking if ledger exists:", error)
    return false
  }
}

// Save the ledger
const handleSave = async () => {
  if (!ledgerName.value) {
    error.value = "Ledger name is required"
    return
  }

  if (!selectedGroup.value) {
    error.value = "Ledger group is required"
    return
  }

  loading.value = true
  error.value = ''
  success.value = ''

  try {
    // First check if ledger already exists
    const exists = await checkIfLedgerExists(ledgerName.value)
    
    if (exists) {
      showDuplicateWarning.value = true
      duplicateInfo.value = {
        name: ledgerName.value,
        message: `Ledger "${ledgerName.value}" already exists`
      }
      loading.value = false
      return
    }

    // Create ledger data object with all possible fields
    const ledgerData = {
      "Name": ledgerName.value,
      "Under": selectedGroup.value,
      "Mailing name": fieldValues["Mailing name"] || ledgerName.value,
      "Bill by bill": fieldValues["Bill by bill"] || "No",
      "Registration Type": fieldValues["Registration Type"] || "",
      "Type of Ledger": fieldValues["Type of Ledger"] || "",
      "Inventory Affected": fieldValues["Inventory Affected"] || "No",
      "Credit period": fieldValues["Credit period"] || "",
      "GST Applicable": fieldValues["GST Applicable"] || "",
      "Set/Alter GST Details": fieldValues["Set/Alter GST Details"] || "",
      "Taxability": fieldValues["Taxability"] || "",
      "Integrated Tax": fieldValues["Integrated Tax"] || "",
      "Cess Tax": fieldValues["Cess Tax"] || "",
      "Applicable Date": fieldValues["Applicable Date"] || "",
      "Address": fieldValues["Address"] || "",
      "State": fieldValues["State"] || "",
      "Pincode": fieldValues["Pincode"] || "",
      "PAN/IT No": fieldValues["PAN/IT No"] || "",
      "GSTIN/UIN": fieldValues["GSTIN/UIN"] || "",
      "Account Holder Name": fieldValues["Account Holder Name"] || "",
      "Alc No": fieldValues["Alc No"] || "",
      "IFS code": fieldValues["IFS code"] || "",
      "SWIFT code": fieldValues["SWIFT code"] || "",
      "Bank Name": fieldValues["Bank Name"] || "",
      "Branch": fieldValues["Branch"] || "",
      "Type of Duty Tax": fieldValues["Type of Duty Tax"] || "",
      "Percentage of Calculation": fieldValues["Percentage of Calculation"] || "",
      "HSN/SAC": fieldValues["HSN/SAC"] || "",
      "Type of Supply": fieldValues["Type of Supply"] || ""
    }

    // Create unique table name for button entries
    const fileName = `Button_Entry_${Date.now()}.xlsx`
    
    const payload = {
      email: userEmail,
      company: selectedCompany,
      data: [ledgerData],
      uploadedFileName: fileName
    }
    
    console.log("Sending ledger data:", payload)
    
    const response = await axios.post('http://3.108.64.167:3001/api/uploadExcelLedger', payload)
    console.log("Response from server:", response.data)

    success.value = 'Ledger saved successfully!'
    
    // Emit the added ledger
    emit('ledger-added', ledgerName.value)
    
    // Clear form after success
    setTimeout(() => {
      closeDialog()
      success.value = ''
    }, 2000)
  } catch (err) {
    console.error("Error saving ledger:", err)
    error.value = err.response?.data?.error || "Error saving ledger"
  } finally {
    loading.value = false
  }
}

// Close the dialog and reset state
const closeDialog = () => {
  ledgerName.value = ''
  selectedGroup.value = ''
  Object.keys(fieldValues).forEach(key => {
    delete fieldValues[key]
  })
  error.value = ''
  success.value = ''
  emit('update:show', false)
}

// Close duplicate warning
const handleCloseDuplicateWarning = () => {
  showDuplicateWarning.value = false
  duplicateInfo.value = null
}

// Get dropdown options for a field
const getDropdownOptions = (field) => {
  return dropdownFields[field] || []
}

// Check if a field should use a dropdown
const isDropdownField = (field) => {
  return Object.keys(dropdownFields).includes(field)
}

// Field change handler
const handleFieldChange = (field, value) => {
  fieldValues[field] = value
}
</script>

<template>
  <VDialog
    v-model="props.show"
    max-width="1000px"
    persistent
    @update:model-value="$emit('update:show', $event)"
  >
    <VCard class="rounded-lg">
      <VCardTitle class="d-flex justify-space-between align-center pa-4 border-bottom">
        <span class="text-h6 font-weight-medium">
          <VIcon icon="bx-file-plus" class="me-2" />
          Add New Ledger
        </span>
        <VBtn
          icon
          variant="text"
          size="small"
          @click="closeDialog"
        >
          <VIcon icon="bx-x" />
        </VBtn>
      </VCardTitle>

      <VCardText class="pa-4">
        <!-- Error and Success Alerts -->
        <VAlert
          v-if="error"
          type="error"
          variant="tonal"
          class="mb-4"
          closable
          @click:close="error = ''"
        >
          {{ error }}
        </VAlert>

        <VAlert
          v-if="success"
          type="success"
          variant="tonal"
          class="mb-4"
          closable
          @click:close="success = ''"
        >
          {{ success }}
        </VAlert>

        <VRow>
          <!-- Required Fields -->
          <VCol cols="12" md="6">
            <VTextField
              v-model="ledgerName"
              label="Ledger Name*"
              placeholder="Enter ledger name"
              variant="outlined"
              density="compact"
              :error-messages="!ledgerName && error ? 'Ledger name is required' : ''"
              class="mb-3"
            />
          </VCol>
          <VCol cols="12" md="6">
            <VSelect
              v-model="selectedGroup"
              label="Ledger Group*"
              :items="ledgerGroups"
              variant="outlined"
              density="compact"
              :error-messages="!selectedGroup && error ? 'Ledger group is required' : ''"
              class="mb-3"
            />
          </VCol>
        </VRow>

        <!-- Dynamic Fields - show only if there are any -->
        <VCard
          v-if="dynamicFields.length > 0"
          variant="outlined"
          class="mb-4 bg-grey-lighten-5"
          flat
        >
          <VCardText>
            <div class="text-subtitle-1 font-weight-medium mb-3">Additional Fields</div>
            <VRow>
              <VCol 
                v-for="field in dynamicFields" 
                :key="field" 
                cols="12" 
                md="4"
              >
                <!-- Render dropdown field -->
                <VSelect
                  v-if="isDropdownField(field)"
                  v-model="fieldValues[field]"
                  :label="field"
                  :items="getDropdownOptions(field)"
                  variant="outlined"
                  density="compact"
                  class="mb-3"
                />
                
                <!-- Render number field -->
                <VTextField
                  v-else-if="field === 'Pincode' || field === 'Opening Balance' || field === 'Credit Period'"
                  v-model="fieldValues[field]"
                  :label="field"
                  :placeholder="`Enter ${field}`"
                  variant="outlined"
                  density="compact"
                  type="number"
                  class="mb-3"
                />
                
                <!-- Render default text field -->
                <VTextField
                  v-else
                  v-model="fieldValues[field]"
                  :label="field"
                  :placeholder="`Enter ${field}`"
                  variant="outlined"
                  density="compact"
                  class="mb-3"
                />
              </VCol>
            </VRow>
          </VCardText>
        </VCard>
      </VCardText>

      <VCardActions class="pa-4 pt-0">
        <VSpacer />
        <VBtn
          variant="outlined"
          color="secondary"
          @click="closeDialog"
          :disabled="loading"
          class="me-3"
        >
          Cancel
        </VBtn>
        <VBtn
          color="primary"
          variant="elevated"
          @click="handleSave"
          :loading="loading"
          :disabled="!ledgerName || !selectedGroup"
          prepend-icon="bx-save"
        >
          Save Ledger
        </VBtn>
      </VCardActions>
    </VCard>
  </VDialog>

  <!-- Duplicate Warning Dialog -->
  <VDialog
    v-model="showDuplicateWarning"
    max-width="400"
  >
    <VCard>
      <VCardTitle class="text-center pa-4">
        <VIcon
          icon="bx-error-circle"
          color="warning"
          size="40"
          class="mb-2"
        />
        <div class="text-h6">Duplicate Ledger</div>
      </VCardTitle>
      <VCardText class="text-center pa-4">
        <p v-if="duplicateInfo">{{ duplicateInfo.message }}</p>
        <p>A ledger with this name already exists in your tables.</p>
      </VCardText>
      <VCardActions class="pa-4 pt-0 justify-center">
        <VBtn
          color="primary"
          @click="handleCloseDuplicateWarning"
        >
          OK
        </VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
</template>

<style lang="scss" scoped>
.v-card-text {
  max-block-size: 65vh;
  overflow-y: auto;
}
</style> 
