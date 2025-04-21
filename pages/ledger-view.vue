<template>
  <div class="ledger-excel-view">
    <!-- Header Section - Updated to match Journal UI -->
    <div class="header-section d-flex justify-space-between align-center px-5 py-3">
      <div class="d-flex align-center">
        <VBtn
          icon
          variant="text"
          color="secondary"
          to="/ledger"
          class="mr-3"
        >
          <VIcon icon="bx-chevron-left" size="28" />
        </VBtn>
        <div class="text-h6">Ledger Excel Data Review</div>
      </div>
      <div class="company-name-field">
        <div class="text-caption text-grey">Company Name</div>
        <div class="company-input">{{ selectedCompany }}</div>
      </div>
    </div>
    
    <!-- Stats and Action buttons - Updated to match Journal UI -->
    <div class="stats-section d-flex px-5 py-2">
      <div class="action-buttons flex-grow-1 d-flex align-center">
        <VBtn
          color="success"
          prepend-icon="bx-save"
          :disabled="!selectedRows.size"
          @click="handleSave"
          class="mr-3"
          size="large"
        >
          Save
        </VBtn>
        <VBtn
          color="warning"
          prepend-icon="bx-share"
          :disabled="!selectedRows.size"
          @click="handleSendToTally"
          size="large"
        >
          Send To Tally
        </VBtn>
      </div>
      <div class="stats-counters d-flex">
        <div class="stat-card total-rows">
          <div class="stat-label">Total Rows</div>
          <div class="stat-value">{{ tableData.length }}</div>
        </div>
        <div class="stat-card saved">
          <div class="stat-label">Saved</div>
          <div class="stat-value">{{ savedCount }}</div>
        </div>
        <div class="stat-card sent">
          <div class="stat-label">Sent to Tally</div>
          <div class="stat-value">{{ sentToTallyCount }}</div>
        </div>
      </div>
    </div>
    
    <!-- Message alerts -->
    <div v-if="error || message || skippedReport" class="alerts-section px-5 py-2">
      <VAlert
        v-if="error"
        type="error"
        closable
        variant="tonal"
        density="compact"
        class="mb-2"
        @click:close="error = ''"
      >
        {{ error }}
      </VAlert>
      <VAlert
        v-if="message"
        type="success"
        closable
        variant="tonal"
        density="compact"
        class="mb-2"
        @click:close="message = ''"
      >
        {{ message }}
      </VAlert>
      <VAlert
        v-if="skippedReport"
        type="warning"
        closable
        variant="tonal"
        density="compact"
        class="d-flex align-center justify-space-between mb-2"
      >
        <div>
          <strong>Attention!</strong> {{ skippedReport.count }} ledgers were skipped because they already exist.
        </div>
        <VBtn
          color="warning"
          size="small"
          @click="downloadSkippedReport"
        >
          Download Report
        </VBtn>
      </VAlert>
    </div>
    
    <!-- Double-click instruction -->
    <div class="edit-instruction px-5 py-2 d-flex align-center">
      <VIcon icon="bx-info-circle" size="small" color="info" class="mr-1" />
      <span class="text-caption text-grey">Double-click on any cell to edit its value</span>
    </div>
    
    <!-- Data Table -->
    <div class="data-table-container px-5">
      <div class="table-wrapper">
        <div class="table-scroll">
          <table class="data-table">
            <thead>
              <tr>
                <th class="text-center sr-no-column">Sr. No</th>
                <th class="text-center select-column">
                  <input 
                    type="checkbox" 
                    @change="e => handleSelectAll(e.target.checked)" 
                    class="table-checkbox" 
                  />
                </th>
                <th v-for="key in visibleKeys" :key="key" :class="getColumnClass(key)">
                  <div class="column-header">
                    <div class="column-title">{{ toHeader(key) }}</div>
                    <div class="column-filter mt-1">
                      <!-- Name search filter -->
                      <template v-if="key === 'name'">
                        <input 
                          v-model="filters.name" 
                          type="text" 
                          placeholder="Search..."
                          class="filter-input"
                        />
                      </template>
                      
                      <!-- Parent dropdown filter -->
                      <template v-else-if="key === 'parent'">
                        <select v-model="filters.parent" class="filter-select">
                          <option value="">All</option>
                          <option v-for="opt in ledgerGroups" :key="opt" :value="opt">{{ opt }}</option>
                        </select>
                      </template>
                      
                      <!-- Registration Type filter -->
                      <template v-else-if="key === 'registration_type'">
                        <select v-model="filters.registration_type" class="filter-select">
                          <option value="">All</option>
                          <option v-for="opt in registrationTypes" :key="opt" :value="opt">{{ opt }}</option>
                        </select>
                      </template>
                      
                      <!-- GST Applicable filter -->
                      <template v-else-if="key === 'gst_applicable'">
                        <select v-model="filters.gst_applicable" class="filter-select">
                          <option value="">All</option>
                          <option v-for="opt in gstApplicable" :key="opt" :value="opt">{{ opt }}</option>
                        </select>
                      </template>
                      
                      <!-- Taxability filter -->
                      <template v-else-if="key === 'taxability'">
                        <select v-model="filters.taxability" class="filter-select">
                          <option value="">All</option>
                          <option v-for="opt in taxabilityOptions" :key="opt" :value="opt">{{ opt }}</option>
                        </select>
                      </template>
                      
                      <!-- Yes/No filters -->
                      <template v-else-if="['bill_by_bill', 'inventory_affected', 'set_alter_gst_details'].includes(key)">
                        <select v-model="filters[key]" class="filter-select">
                          <option value="">All</option>
                          <option v-for="opt in yesNo" :key="opt" :value="opt">{{ opt }}</option>
                        </select>
                      </template>
                      
                      <!-- Empty filter for other columns -->
                      <template v-else>
                        <div class="filter-placeholder"></div>
                      </template>
                    </div>
                  </div>
                </th>
                <th class="action-column">
                  <div class="column-header">
                    <div class="column-title">Action</div>
                    <div class="column-filter mt-1">
                      <div class="filter-placeholder"></div>
                    </div>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(row, idx) in filteredData" :key="idx" class="table-row">
                <td class="text-center">{{ idx + 1 }}</td>
                <td class="text-center">
                  <input 
                    type="checkbox"
                    :checked="selectedRows.has(idx)"
                    @change="() => handleCheckboxChange(idx)" 
                    class="table-checkbox"
                  />
                </td>
                <td v-for="key in visibleKeys" :key="key" 
                  :class="getColumnClass(key)"
                  @dblclick="handleCellClick(idx, key, row[key])"
                >
                  <!-- Show plain view with different styling based on field type -->
                  <div v-if="editing.active && editing.idx === idx && editing.key === key" class="edit-mode">
                    <template v-if="key === 'parent'">
                      <select v-model="editing.value" class="edit-select" @blur="saveEdit">
                        <option value="">Select Parent</option>
                        <option v-for="opt in ledgerGroups" :key="opt" :value="opt">{{ opt }}</option>
                      </select>
                    </template>
                    <template v-else-if="['bill_by_bill','inventory_affected','set_alter_gst_details'].includes(key)">
                      <select v-model="editing.value" class="edit-select" @blur="saveEdit">
                        <option value="">Select</option>
                        <option v-for="opt in yesNo" :key="opt" :value="opt">{{ opt }}</option>
                      </select>
                    </template>
                    <template v-else-if="key === 'registration_type'">
                      <select v-model="editing.value" class="edit-select" @blur="saveEdit">
                        <option value="">Select Registration Type</option>
                        <option v-for="opt in registrationTypes" :key="opt" :value="opt">{{ opt }}</option>
                      </select>
                    </template>
                    <template v-else-if="key === 'type_of_ledger'">
                      <select v-model="editing.value" class="edit-select" @blur="saveEdit">
                        <option value="">Select Type of Ledger</option>
                        <option v-for="opt in typeOfLedgers" :key="opt" :value="opt">{{ opt }}</option>
                      </select>
                    </template>
                    <template v-else-if="key === 'gst_applicable'">
                      <select v-model="editing.value" class="edit-select" @blur="saveEdit">
                        <option value="">Select GST Applicable</option>
                        <option v-for="opt in gstApplicable" :key="opt" :value="opt">{{ opt }}</option>
                      </select>
                    </template>
                    <template v-else-if="key === 'taxability'">
                      <select v-model="editing.value" class="edit-select" @blur="saveEdit">
                        <option value="">Select Taxability</option>
                        <option v-for="opt in taxabilityOptions" :key="opt" :value="opt">{{ opt }}</option>
                      </select>
                    </template>
                    <template v-else>
                      <input v-model="editing.value" class="edit-input" @blur="saveEdit" />
                    </template>
                  </div>
                  <div v-else>
                    <!-- Display text or "Select" for dropdowns -->
                    <template v-if="['parent', 'registration_type', 'type_of_ledger', 'gst_applicable', 'taxability', 'bill_by_bill', 'inventory_affected', 'set_alter_gst_details'].includes(key)">
                      <div class="select-field">
                        {{ row[key] || 'Select' }}
                        <VIcon size="small" icon="bx-chevron-down" class="select-icon" />
                      </div>
                    </template>
                    <template v-else>
                      {{ row[key] || '' }}
                    </template>
                  </div>
                </td>
                <td class="action-column">
                  <div class="delete-btn" @click.stop="handleDelete(idx)">
                    <VIcon icon="bx-trash" size="small" />
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import axios from 'axios';
import { computed, onMounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';

// Set page layout
definePageMeta({ layout: 'blank' });

const router = useRouter();

// Static options
const ledgerGroups = [
  'Bank Accounts', 'Bank OCC Alc', 'Bank OD Alc', 'Branch / Divisions',
  'Capital Account', 'Cash-in-Hand', 'Current Assets', 'Current Liabilities',
  'Deposits (Asset)', 'Direct Expenses', 'Direct Incomes', 'Duties & Taxes',
  'Expenses (Direct)', 'Expenses (Indirect)', 'Fixed Assets', 'Income (Direct)',
  'Income (Indirect)', 'Indirect Expenses', 'Indirect Incomes', 'Investments',
  'Loans & Advances (Asset)', 'Loans (Liability)', 'Misc. Expenses (ASSET)',
  'Provisions', 'Purchase Accounts', 'Reserves & Surplus', 'Retained Earnings',
  'Sales Accounts', 'Secured Loans', 'Stock-in-Hand', 'Sundry Creditors',
  'Sundry Debtors', 'Suspense Alc', 'Unsecured Loans'
];
const yesNo = ['Yes', 'No'];
const registrationTypes = ['Unknown', 'Composition', 'Consumer', 'Regular', 'Unregistered'];
const typeOfLedgers = ['Not Applicable', 'Discount', 'Invoice Rounding'];
const gstApplicable = ['Applicable', 'Not Applicable', 'Undefined'];
const taxabilityOptions = ['Unknown', 'Exempt', 'Nil Rated', 'Taxable'];

// Fields to hide
const hiddenFields = ['creation_id', 'id', 'created_at', 'updated_at'];

// Header formatter
const toHeader = key => key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

// Get column CSS class
const getColumnClass = (key) => {
  if (key === 'name') return 'name-column';
  if (key === 'parent') return 'parent-column';
  if (key === 'gst_applicable') return 'gst-column';
  if (key === 'registration_type') return 'reg-column';
  if (key === 'type_of_ledger') return 'type-column';
  if (key === 'taxability') return 'tax-column';
  if (key === 'bill_by_bill' || key === 'inventory_affected' || key === 'set_alter_gst_details') return 'yes-no-column';
  return '';
};

// Reactive state
const tableData = ref([]);
const filters = reactive({ 
  name: '', 
  parent: '', 
  gst_applicable: '', 
  registration_type: '', 
  taxability: '',
  bill_by_bill: '',
  inventory_affected: '',
  set_alter_gst_details: ''
});
const selectedRows = ref(new Set());
const tempTable = ref('');
const message = ref('');
const error = ref('');
const skippedReport = ref(null);
const selectedCompany = ref('');
const userEmail = ref('');
const savedCount = ref(0);
const sentToTallyCount = ref(0);

// Editing state
const editing = reactive({
  active: false,
  idx: null,
  key: null,
  value: null
});

// Handle cell click for editing
function handleCellClick(idx, key, value) {
  editing.active = true;
  editing.idx = idx;
  editing.key = key;
  editing.value = value || '';
  
  // Focus the input after a short delay
  setTimeout(() => {
    const el = document.querySelector('.edit-mode input, .edit-mode select');
    if (el) el.focus();
  }, 50);
}

// Save the edit
function saveEdit() {
  if (editing.active && editing.idx !== null && editing.key !== null) {
    handleCellChange(editing.idx, editing.key, editing.value);
    editing.active = false;
    editing.idx = null;
    editing.key = null;
    editing.value = null;
  }
}

// Compute visible keys
const visibleKeys = computed(() => {
  return tableData.value.length
    ? Object.keys(tableData.value[0]).filter(k => !hiddenFields.includes(k))
    : [];
});

// Filtered data
const filteredData = computed(() => {
  return tableData.value.filter(row => {
    return (
      (!filters.name || String(row.name || '').toLowerCase().includes(filters.name.toLowerCase())) &&
      (!filters.parent || row.parent === filters.parent) &&
      (!filters.gst_applicable || row.gst_applicable === filters.gst_applicable) &&
      (!filters.registration_type || row.registration_type === filters.registration_type) &&
      (!filters.taxability || row.taxability === filters.taxability) &&
      (!filters.bill_by_bill || row.bill_by_bill === filters.bill_by_bill) &&
      (!filters.inventory_affected || row.inventory_affected === filters.inventory_affected) &&
      (!filters.set_alter_gst_details || row.set_alter_gst_details === filters.set_alter_gst_details)
    );
  });
});

// Fetch ledger data
async function fetchData(tableName) {
  if (!tableName) return;
  try {
    const res = await axios.get('https://api.tallyfy.in/api/excelLedgersData', {
      params: { tempTable: tableName, _t: Date.now() }
    });
    if (Array.isArray(res.data)) {
      tableData.value = res.data;
      tempTable.value = tableName;
      sessionStorage.setItem('tempTable', tableName);
      
      // Fetch counts
      fetchCounts();
    } else {
      throw new Error('Invalid data format');
    }
  } catch (err) {
    console.error('Fetch error:', err);
    error.value = 'Failed to load ledger data: ' + (err.response?.data?.error || err.message);
  }
}

// Fetch counts for stats cards
async function fetchCounts() {
  try {
    const res = await axios.get('https://api.tallyfy.in/api/getLedgerCounts', {
      params: { 
        email: userEmail.value, 
        company: selectedCompany.value,
        tempTable: tempTable.value
      }
    });
    
    if (res.data) {
      savedCount.value = res.data.savedCount || 0;
      sentToTallyCount.value = res.data.sentToTallyCount || 0;
    }
  } catch (err) {
    console.error('Fetch counts error:', err);
  }
}

// Initial load
onMounted(async () => {
  userEmail.value = sessionStorage.getItem('userEmail') || '';
  selectedCompany.value = sessionStorage.getItem('selectedCompany') || '';
  const sessionTable = sessionStorage.getItem('tempTable');
  if (sessionTable) {
    await fetchData(sessionTable);
  } else {
    try {
      const up = await axios.get('https://api.tallyfy.in/api/getUserExcelLedgerUploads', {
        params: { email: userEmail.value, company: selectedCompany.value }
      });
      if (up.data.length) {
        const latest = up.data[0].temp_table;
        await fetchData(latest);
      } else {
        error.value = 'No ledger data found';
      }
    } catch (e) {
      console.error(e);
      error.value = 'Failed to fetch uploads';
    }
  }
});

// Refresh data
async function refreshData() {
  if (tempTable.value) await fetchData(tempTable.value);
}

// Checkbox handlers
function handleCheckboxChange(idx) {
  const s = selectedRows.value;
  s.has(idx) ? s.delete(idx) : s.add(idx);
}
function handleSelectAll(checked) {
  if (checked) selectedRows.value = new Set(tableData.value.map((_, i) => i));
  else selectedRows.value = new Set();
}

// Save selected rows
async function handleSave() {
  if (!selectedRows.value.size) {
    error.value = 'Please select at least one row to save.';
    return;
  }
  try {
    message.value = 'Saving rows...';
    await axios.post('https://api.tallyfy.in/api/saveLedgerRows', {
      email: userEmail.value,
      company: selectedCompany.value,
      tempTable: tempTable.value,
      rows: Array.from(selectedRows.value).map(i => tableData.value[i])
    });
    await refreshData();
    message.value = 'Rows saved successfully!';
    selectedRows.value = new Set();
    error.value = '';
  } catch (e) {
    console.error('Save error:', e);
    error.value = 'Failed to save rows: ' + (e.response?.data?.error || e.message);
  }
}

// Send to Tally
async function handleSendToTally() {
  try {
    message.value = 'Sending to Tally...';
    await axios.post('https://api.tallyfy.in/api/sendLedgerToTally', {
      email: userEmail.value,
      company: selectedCompany.value,
      tempTable: tempTable.value
    });
    message.value = 'Data sent to Tally successfully!';
    error.value = '';
    fetchCounts(); // Update counts after sending
  } catch (e) {
    console.error('Tally error:', e);
    error.value = 'Failed to send to Tally: ' + (e.response?.data?.error || e.message);
  }
}

// Cell update
function handleCellChange(idx, key, val) {
  tableData.value[idx][key] = val;
}

// Handle delete row
function handleDelete(idx) {
  console.log('Delete row:', idx);
  // You can implement the actual delete functionality here
  // For now, just log the action
}

// Download skipped report
async function downloadSkippedReport() {
  if (!skippedReport.value || !skippedReport.value.reportFile) return;
  try {
    const r = await axios.get('https://api.tallyfy.in/api/downloadSkippedReport', {
      params: { path: skippedReport.value.reportFile }, responseType: 'blob'
    });
    const url = URL.createObjectURL(new Blob([r.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'Skipped_Ledgers_Report.xlsx');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    skippedReport.value = null;
  } catch (e) {
    console.error('Download error:', e);
    error.value = 'Failed to download report';
  }
}
</script>

<style>
.ledger-excel-view {
  display: flex;
  flex-direction: column;
  background-color: #f9fafb;
  min-block-size: 100vh;
}

.header-section {
  position: sticky;
  z-index: 30;
  background-color: white;
  border-block-end: 1px solid rgba(0, 0, 0, 10%);
  inset-block-start: 0;
}

.company-name-field {
  border-radius: 4px;
  background-color: #f8f9fa;
  margin-inline-start: auto;
  max-inline-size: 300px;
  padding-block: 6px;
  padding-inline: 12px;
}

.company-input {
  overflow: hidden;
  color: #333;
  font-size: 0.875rem;
  font-weight: 500;
  text-overflow: ellipsis;
}

.stats-section {
  position: sticky;
  z-index: 30;
  background-color: white;
  border-block-end: 1px solid rgba(0, 0, 0, 10%);
  inset-block-start: 72px;
  padding-block: 15px;
}

.stats-counters {
  display: flex;
  gap: 10px;
}

.stat-card {
  border-radius: 8px;
  min-inline-size: 120px;
  padding-block: 10px;
  padding-inline: 20px;
  text-align: center;
}

.stat-label {
  font-size: 0.875rem;
  font-weight: 500;
  margin-block-end: 4px;
}

.stat-value {
  font-size: 1.75rem;
  font-weight: 600;
  line-height: 1.2;
}

.total-rows {
  background-color: #e8eaf6;
  color: #3949ab;
}

.saved {
  background-color: #e8f5e9;
  color: #43a047;
}

.sent {
  background-color: #fff8e1;
  color: #ffb300;
}

.action-buttons {
  margin-inline-end: 20px;
}

.alerts-section {
  position: sticky;
  z-index: 30;
  background-color: #f9fafb;
  inset-block-start: 140px;
}

.edit-instruction {
  position: sticky;
  z-index: 30;
  background-color: #f9fafb;
  color: #6c757d;
  inset-block-start: 185px;
  margin-block-end: 10px;
}

.section-label {
  color: #666;
  font-size: 14px;
  font-weight: 500;
}

.data-table-container {
  position: relative;
  flex: 1;
  margin-block-end: 20px;
}

.table-wrapper {
  position: relative;
  overflow: hidden;
  border-radius: 8px;
  background-color: white;
  block-size: calc(100vh - 230px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 5%);
}

.table-scroll {
  position: relative;
  overflow: auto;
  block-size: 100%;
  inline-size: 100%;
}

.data-table {
  border-collapse: collapse;
  inline-size: max-content;
  min-inline-size: 100%;
  table-layout: fixed;
}

.data-table th,
.data-table td {
  position: relative;
  overflow: hidden;
  border: 1px solid #e9ecef;
  padding-block: 12px;
  padding-inline: 16px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.data-table thead th {
  position: sticky;
  z-index: 20;
  background-color: #f8f9fa;
  font-size: 0.8rem;
  font-weight: 600;
  inset-block-start: 0;
  padding-block: 12px;
  padding-inline: 16px;
  text-align: start;
}

.sr-no-column {
  inline-size: 60px;
  text-align: center;
}

.select-column {
  inline-size: 40px;
  text-align: center;
}

.name-column {
  inline-size: 180px;
}

.parent-column {
  inline-size: 150px;
}

.gst-column,
.tax-column,
.reg-column,
.type-column {
  inline-size: 130px;
}

.yes-no-column {
  inline-size: 80px;
}

.table-checkbox {
  block-size: 16px;
  cursor: pointer;
  inline-size: 16px;
}

.table-row {
  transition: background-color 0.15s ease;
}

.table-row:hover {
  background-color: rgba(0, 123, 255, 5%);
}

.action-column {
  position: sticky;
  z-index: 25;
  background-color: white;
  box-shadow: -2px 0 4px rgba(0, 0, 0, 8%);
  inline-size: 60px;
  inset-inline-end: 0;
  padding-block: 8px;
  padding-inline: 0;
  text-align: center;
}

/* Fix for the action column header and cells being properly sticky */
thead th.action-column {
  z-index: 25;
  background-color: #f8f9fa;
  box-shadow: -2px 0 4px rgba(0, 0, 0, 8%);
  inset-inline-end: 0;
}

.select-field {
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
}

.select-icon {
  font-size: 12px;
  opacity: 0.5;
}

.edit-mode {
  inline-size: 100%;
}

.edit-input,
.edit-select {
  border: 1px solid #80bdff;
  border-radius: 4px;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 25%);
  inline-size: 100%;
  outline: none;
  padding-block: 4px;
  padding-inline: 8px;
}

.column-header {
  display: flex;
  flex-direction: column;
}

.column-title {
  font-weight: 600;
  white-space: nowrap;
}

.column-filter {
  inline-size: 100%;
}

.filter-input,
.filter-select {
  border: 1px solid #dee2e6;
  border-radius: 4px;
  background-color: white;
  font-size: 0.75rem;
  inline-size: 100%;
  padding-block: 4px;
  padding-inline: 6px;
}

.filter-select {
  block-size: 28px;
}

.filter-placeholder {
  block-size: 28px;
}

/* Style the delete button to match the design */
.delete-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  block-size: 100%;
  color: #dc3545;
  inline-size: 100%;
  transition: color 0.2s;
}

.delete-btn:hover {
  color: #bd2130;
}

@media screen and (max-width: 768px) {
  .header-section,
  .alerts-section,
  .stats-section,
  .edit-instruction,
  .data-table-container {
    padding-inline: 12px;
  }

  .stats-section {
    flex-direction: column;
  }

  .stats-counters {
    margin-block-start: 15px;
  }
}
</style>
