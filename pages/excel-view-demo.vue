<script setup>
import { onMounted, ref } from 'vue'
import ExcelView from '~/components/ExcelView.vue'

definePageMeta({ layout: 'default' })

// Define headers for the table
const headers = [
  { 
    title: 'Sr. No.', 
    key: 'id', 
    sortable: true, 
    width: '80px',
    align: 'center',
  },
  { 
    title: 'Journal No', 
    key: 'journal_no', 
    sortable: true, 
    width: '120px',
    align: 'start',
  },
  { 
    title: 'Reference No', 
    key: 'reference_no', 
    sortable: true, 
    width: '120px',
    align: 'start',
  },
  { 
    title: 'Date', 
    key: 'date', 
    sortable: true, 
    width: '120px',
    align: 'start',
  },
  { 
    title: 'Cost Center', 
    key: 'cost_center', 
    sortable: true, 
    align: 'start', 
  },
  { 
    title: 'Particulars', 
    key: 'particulars', 
    sortable: true, 
    align: 'start', 
  },
  { 
    title: 'Dr/Cr', 
    key: 'dr_cr', 
    sortable: true, 
    width: '100px',
    align: 'center', 
  },
  { 
    title: 'Amount', 
    key: 'amount', 
    sortable: true, 
    width: '120px',
    align: 'end', 
  },
  { 
    title: 'Ledger Narration', 
    key: 'ledger_narration', 
    sortable: true, 
    align: 'start', 
  },
  { 
    title: 'Status', 
    key: 'status', 
    sortable: true, 
    width: '120px',
    align: 'center', 
  },
]

// Sample data
const generateSampleData = (count = 200) => {
  const statusOptions = ['pending', 'saved', 'sent to tally']
  const drCrOptions = ['Dr', 'Cr']
  const costCenters = ['Marketing', 'Sales', 'Finance', 'HR', 'IT', 'Admin', 'Operations']
  const particulars = [
    'Office Rent', 'Salaries', 'Utilities', 'Internet Services', 
    'Software Subscriptions', 'Travel Expenses', 'Marketing Campaign', 
    'Equipment Purchase', 'Legal Services', 'Consulting Fees'
  ]
  
  return Array.from({ length: count }, (_, i) => {
    const amount = Math.floor(Math.random() * 10000) + 1000
    
    return {
      id: i + 1,
      journal_no: Math.floor(Math.random() * 100) + 1,
      reference_no: Math.floor(Math.random() * 1000) + 1000,
      date: new Date(2023, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toLocaleDateString(),
      cost_center: costCenters[Math.floor(Math.random() * costCenters.length)],
      particulars: particulars[Math.floor(Math.random() * particulars.length)],
      dr_cr: drCrOptions[Math.floor(Math.random() * drCrOptions.length)],
      amount: amount,
      ledger_narration: `Payment for ${particulars[Math.floor(Math.random() * particulars.length)].toLowerCase()}`,
      status: statusOptions[Math.floor(Math.random() * statusOptions.length)],
    }
  })
}

// Table data
const items = ref([])
const loading = ref(true)
const selectedRows = ref([])

// Demo settings
const settings = ref({
  density: 'default',
  height: 400,
  fixedHeader: true,
  bordered: true,
  striped: true,
  hover: true,
  selectable: true,
  showPagination: true,
  searchable: true,
  itemsPerPage: 10
})

// Demo methods
const handleRowClick = (row) => {
  console.log('Row clicked:', row)
}

const handleCellClick = ({ row, header }) => {
  console.log('Cell clicked:', { row, header })
}

const handleSort = (sortBy) => {
  console.log('Sort changed:', sortBy)
}

const handleSearch = (query) => {
  console.log('Search query:', query)
}

const handleExportExcel = (data) => {
  console.log('Export to Excel:', data.length, 'rows')
  alert(`Export to Excel: ${data.length} rows`)
}

const handleExportCsv = (data) => {
  console.log('Export to CSV:', data.length, 'rows')
  alert(`Export to CSV: ${data.length} rows`)
}

const toggleLoading = () => {
  loading.value = !loading.value
  
  if (loading.value) {
    items.value = []
    setTimeout(() => {
      items.value = generateSampleData()
      loading.value = false
    }, 1500)
  }
}

const refreshData = () => {
  loading.value = true
  items.value = []
  
  setTimeout(() => {
    items.value = generateSampleData()
    loading.value = false
  }, 1000)
}

onMounted(() => {
  // Simulate API loading
  setTimeout(() => {
    items.value = generateSampleData()
    loading.value = false
  }, 1000)
})
</script>

<template>
  <VRow>
    <!-- Settings Panel -->
    <VCol cols="12">
      <VCard title="Excel View Settings">
        <VCardText>
          <VRow>
            <VCol cols="12" md="3">
              <VSelect
                v-model="settings.density"
                label="Density"
                :items="['default', 'comfortable', 'compact']"
                variant="outlined"
                hide-details
              />
            </VCol>
            
            <VCol cols="12" md="3">
              <VTextField
                v-model.number="settings.height"
                label="Height (px)"
                type="number"
                variant="outlined"
                hide-details
              />
            </VCol>
            
            <VCol cols="12" md="3">
              <VSelect
                v-model.number="settings.itemsPerPage"
                label="Items Per Page"
                :items="[5, 10, 15, 20, 25, 50, 100]"
                variant="outlined"
                hide-details
              />
            </VCol>
            
            <VCol cols="12" md="3">
              <div class="d-flex gap-2">
                <VBtn color="primary" @click="refreshData">
                  Refresh Data
                </VBtn>
                <VBtn @click="toggleLoading">
                  {{ loading ? 'Stop Loading' : 'Simulate Loading' }}
                </VBtn>
              </div>
            </VCol>
          </VRow>
          
          <VRow class="mt-4">
            <VCol cols="12">
              <div class="d-flex flex-wrap gap-4">
                <VSwitch
                  v-model="settings.fixedHeader"
                  label="Fixed Header"
                  hide-details
                  density="compact"
                />
                <VSwitch
                  v-model="settings.bordered"
                  label="Bordered"
                  hide-details
                  density="compact"
                />
                <VSwitch
                  v-model="settings.striped"
                  label="Striped"
                  hide-details
                  density="compact"
                />
                <VSwitch
                  v-model="settings.hover"
                  label="Hover Effect"
                  hide-details
                  density="compact"
                />
                <VSwitch
                  v-model="settings.selectable"
                  label="Selectable"
                  hide-details
                  density="compact"
                />
                <VSwitch
                  v-model="settings.showPagination"
                  label="Show Pagination"
                  hide-details
                  density="compact"
                />
                <VSwitch
                  v-model="settings.searchable"
                  label="Searchable"
                  hide-details
                  density="compact"
                />
              </div>
            </VCol>
          </VRow>
        </VCardText>
      </VCard>
    </VCol>
    
    <!-- Excel View Demo -->
    <VCol cols="12">
      <VCard>
        <VCardText>
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
            v-model:selected="selectedRows"
            @row-click="handleRowClick"
            @cell-click="handleCellClick"
            @sort="handleSort"
            @search="handleSearch"
            @export-excel="handleExportExcel"
            @export-csv="handleExportCsv"
          >
            <template #title>
              <h4 class="font-weight-medium">Journal Transactions</h4>
            </template>
            
            <template #item.status="{ value }">
              <VChip
                size="small"
                :color="value === 'pending' ? 'warning' : value === 'saved' ? 'success' : 'primary'"
              >
                {{ value }}
              </VChip>
            </template>
            
            <template #item.dr_cr="{ value }">
              <span :class="value === 'Dr' ? 'text-primary' : 'text-error'">
                {{ value }}
              </span>
            </template>
            
            <template #item.amount="{ value }">
              ₹ {{ value.toLocaleString() }}
            </template>
            
            <template #item-actions="{ item }">
              <div class="d-flex gap-1">
                <VBtn
                  size="small"
                  icon
                  variant="text"
                  color="error"
                >
                  <VIcon icon="bx-trash" />
                </VBtn>
              </div>
            </template>
          </ExcelView>
        </VCardText>
      </VCard>
    </VCol>
    
    <!-- Selected Rows Panel -->
    <VCol cols="12" v-if="settings.selectable && selectedRows.length > 0">
      <VCard title="Selected Rows">
        <VCardText>
          <div class="d-flex gap-2 mb-4">
            <VBtn size="small" color="primary" prepend-icon="bx-save">
              Save Selected ({{ selectedRows.length }})
            </VBtn>
            <VBtn size="small" color="primary" prepend-icon="bx-send">
              Send to Tally ({{ selectedRows.length }})
            </VBtn>
            <VBtn size="small" color="error" prepend-icon="bx-trash">
              Delete Selected ({{ selectedRows.length }})
            </VBtn>
          </div>
          
          <div class="selected-rows-list">
            <div v-for="(row, index) in selectedRows" :key="index" class="selected-row mb-2 pa-2">
              <strong>{{ row.id }}.</strong> {{ row.particulars }} - 
              <span :class="row.dr_cr === 'Dr' ? 'text-primary' : 'text-error'">{{ row.dr_cr }}</span> - 
              <span class="text-end">₹ {{ row.amount.toLocaleString() }}</span>
            </div>
          </div>
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
</template>

<style lang="scss" scoped>
.selected-rows-list {
  max-block-size: 300px;
  overflow-y: auto;

  .selected-row {
    border-radius: 4px;
    background-color: rgba(var(--v-theme-surface-variant), 0.3);
  }
}
</style> 
