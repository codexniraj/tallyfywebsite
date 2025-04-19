<script setup>
import { computed, directive, onMounted, ref, watch } from 'vue'

const props = defineProps({
  // Data properties
  headers: {
    type: Array,
    required: true,
  },
  items: {
    type: Array,
    default: () => [],
  },
  // Table appearance
  density: {
    type: String,
    default: 'default',
    validator: (val) => ['default', 'comfortable', 'compact'].includes(val),
  },
  height: {
    type: [String, Number],
    default: null,
  },
  fixedHeader: {
    type: Boolean,
    default: false,
  },
  bordered: {
    type: Boolean,
    default: false,
  },
  striped: {
    type: Boolean,
    default: false,
  },
  hover: {
    type: Boolean,
    default: true,
  },
  // Functionality
  selectable: {
    type: Boolean,
    default: false,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  loadingText: {
    type: String,
    default: 'Loading data...',
  },
  noDataText: {
    type: String,
    default: 'No data available',
  },
  // Pagination
  itemsPerPage: {
    type: Number,
    default: 10,
  },
  showPagination: {
    type: Boolean,
    default: true,
  },
  // Sorting
  sortable: {
    type: Boolean,
    default: true,
  },
  initialSortBy: {
    type: Object,
    default: () => ({ key: '', order: 'asc' }),
  },
  // Filtering
  searchable: {
    type: Boolean,
    default: true,
  },
  // Editing functionality
  editable: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits([
  'update:selected',
  'row-click',
  'cell-click',
  'sort',
  'page-change',
  'items-per-page-change',
  'search',
  'update:item' // New emit for updating item values
])

// Search functionality
const searchQuery = ref('')
const columnFilters = ref({})

// Date range filter
const dateRange = ref({
  from: '',
  to: ''
})

const searchResults = computed(() => {
  const filtered = filteredItems.value.filter(item => {
    // Apply column-specific filters
    for (const [key, value] of Object.entries(columnFilters.value)) {
      if (value && item[key] !== undefined) {
        const itemValue = String(item[key]).toLowerCase()
        const filterValue = String(value).toLowerCase()
        if (!itemValue.includes(filterValue)) {
          return false
        }
      }
    }
    
    // Apply date range filter if both dates are provided
    if (dateRange.value.from && dateRange.value.to && item.date) {
      try {
        const itemDate = new Date(item.date.split('/').reverse().join('-'))
        const fromDate = new Date(dateRange.value.from)
        const toDate = new Date(dateRange.value.to)
        
        // Add one day to toDate to make it inclusive
        toDate.setDate(toDate.getDate() + 1)
        
        if (itemDate < fromDate || itemDate >= toDate) {
          return false
        }
      } catch (e) {
        // Handle invalid date format
        console.error('Invalid date format', e)
      }
    }
    
    // Apply global search if provided
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase()
      return Object.values(item).some(value => 
        value !== null && 
        value !== undefined && 
        String(value).toLowerCase().includes(query)
      )
    }
    
    return true
  })
  
  return filtered
})

// Sorting
const sortBy = ref(props.initialSortBy)
const sortItems = (items) => {
  if (!sortBy.value.key) return items
  
  return [...items].sort((a, b) => {
    const aValue = a[sortBy.value.key]
    const bValue = b[sortBy.value.key]
    
    if (aValue === bValue) return 0
    
    const result = aValue > bValue ? 1 : -1
    return sortBy.value.order === 'asc' ? result : -result
  })
}

const handleSort = (key) => {
  if (!props.sortable) return
  
  if (sortBy.value.key === key) {
    sortBy.value.order = sortBy.value.order === 'asc' ? 'desc' : 'asc'
  } else {
    sortBy.value = { key, order: 'asc' }
  }
  
  emit('sort', sortBy.value)
}

// Pagination
const currentPage = ref(1)
const computedItemsPerPage = ref(props.itemsPerPage)

const filteredItems = computed(() => {
  return sortItems(props.items)
})

const totalPages = computed(() => {
  if (filteredItems.value.length === 0) return 1
  return Math.ceil(filteredItems.value.length / computedItemsPerPage.value)
})

const paginatedItems = computed(() => {
  if (!props.showPagination) return searchResults.value;
  
  const start = (currentPage.value - 1) * computedItemsPerPage.value;
  const end = start + computedItemsPerPage.value;
  
  return searchResults.value.slice(start, end);
})

const handlePageChange = (page) => {
  currentPage.value = page
  emit('page-change', page)
}

const handleItemsPerPageChange = (itemsPerPage) => {
  computedItemsPerPage.value = itemsPerPage
  currentPage.value = 1
  emit('items-per-page-change', itemsPerPage)
}

// Selection
const selectedRows = ref([])

// Function to select all rows with the same reference number
const handleSelectRow = (row, event) => {
  console.log('handleSelectRow called with row:', row)
  
  if (!row) return
  
  // If the row has a reference_no field, we'll select all rows with the same reference number
  if (row.reference_no !== undefined) {
    console.log('Row has reference_no:', row.reference_no)
    
    // Do not allow selection if status is "send to tally"
    if (row.status && row.status.toLowerCase() === "send to tally") {
      console.log('Cannot select row with status "send to tally"')
      return
    }
    
    // Find all rows with the same reference number
    const relatedRows = props.items.filter(item => 
      item.reference_no === row.reference_no
    )
    
    console.log('Found related rows:', relatedRows.length)
    
    // Check if all related rows are already selected
    const allSelected = relatedRows.every(relatedRow => 
      selectedRows.value.some(selectedRow => selectedRow.id === relatedRow.id)
    )
    
    if (allSelected) {
      // If all are selected, deselect them
      console.log('All related rows are selected, deselecting them')
      selectedRows.value = selectedRows.value.filter(selectedRow => 
        !relatedRows.some(relatedRow => relatedRow.id === selectedRow.id)
      )
    } else {
      // If not all are selected, select all related rows that aren't "send to tally"
      console.log('Not all related rows are selected, selecting them')
      const rowsToAdd = relatedRows.filter(relatedRow => 
        !relatedRow.status || relatedRow.status.toLowerCase() !== "send to tally"
      )
      
      // Add only rows that aren't already selected
      rowsToAdd.forEach(rowToAdd => {
        if (!selectedRows.value.some(selectedRow => selectedRow.id === rowToAdd.id)) {
          selectedRows.value.push(rowToAdd)
        }
      })
    }
  } else {
    // Default behavior for rows without reference_no
    console.log('Row does not have reference_no, using default selection behavior')
    if (event.target.checked) {
      selectedRows.value.push(row)
    } else {
      const index = selectedRows.value.findIndex(item => item.id === row.id)
      if (index !== -1) {
        selectedRows.value.splice(index, 1)
      }
    }
  }
  
  emit('update:selected', selectedRows.value)
}

const handleSelectAll = (event) => {
  selectedRows.value = event.target.checked ? [...paginatedItems.value] : []
  emit('update:selected', selectedRows.value)
}

const isRowSelected = (row) => {
  return selectedRows.value.some(selectedRow => selectedRow.id === row.id)
}

const allRowsSelected = computed(() => {
  return paginatedItems.value.length > 0 && selectedRows.value.length === paginatedItems.value.length
})

// Row and cell click handlers
const handleRowClick = (row, event) => {
  // Avoid emitting when clicking on checkboxes or action buttons
  if (event.target.closest('input[type="checkbox"]') || event.target.closest('button')) {
    return
  }
  emit('row-click', row)
}

const handleCellClick = (row, header, event) => {
  // Avoid emitting when clicking on checkboxes or action buttons
  if (event.target.closest('input[type="checkbox"]') || event.target.closest('button')) {
    return
  }
  emit('cell-click', { row, header })
}

// Reset filters
const resetFilters = () => {
  searchQuery.value = ''
  columnFilters.value = {}
  dateRange.value = { from: '', to: '' }
  currentPage.value = 1
}

// Reset pagination when filters change
watch(columnFilters, () => {
  currentPage.value = 1
}, { deep: true })

watch(dateRange, () => {
  currentPage.value = 1
}, { deep: true })

// Reset pagination when items change
watch(() => props.items, () => {
  currentPage.value = 1
}, { deep: true })

// Reset pagination when search changes
watch(searchQuery, () => {
  currentPage.value = 1
})

// Update computedItemsPerPage when prop changes
watch(() => props.itemsPerPage, (newValue) => {
  computedItemsPerPage.value = newValue
})

// Function to check if a row's reference number should be highlighted
const shouldHighlightRow = (item) => {
  if (!item || item.reference_no === undefined) return false
  
  // Count how many items have this reference number
  const sameRefCount = props.items.filter(row => 
    row.reference_no === item.reference_no
  ).length
  
  // Highlight only if there are multiple rows with the same reference number
  return sameRefCount > 1
}

// Handle cell editing
const editingCell = ref(null)
const editValue = ref('')

// Add the formatDate function after the other utility functions
const formatDate = (value) => {
  if (!value) return '';
  if (typeof value === 'number') {
    const jsDate = new Date((value - 25569) * 86400 * 1000);
    return jsDate.toISOString().split('T')[0];
  }
  const parsed = new Date(value);
  if (!isNaN(parsed.getTime())) {
    return parsed.toISOString().split('T')[0];
  }
  return '';
};

const startEditing = (row, header) => {
  // Only allow editing if editable is true and not in a special column
  if (!props.editable || !header || !row) return
  if (['id', 'status'].includes(header.key)) return // Don't allow editing of ID or status

  editingCell.value = { rowId: row.id, key: header.key }
  // Format date value if it's a date field
  editValue.value = header.key === 'date' ? formatDate(row[header.key]) : row[header.key]
  
  // Focus and select text in the next tick after the input is rendered
  setTimeout(() => {
    const inputElement = document.querySelector('.native-edit-input')
    if (inputElement) {
      inputElement.focus()
      if (header.key !== 'date') {
        inputElement.select()
      }
    }
  }, 10)
}

const saveEdit = (event) => {
  if (!editingCell.value) return

  const { rowId, key } = editingCell.value
  const row = props.items.find(item => item.id === rowId)
  if (!row) return

  // Create a modified row with the updated value
  const updatedRow = { ...row, [key]: editValue.value }
  
  // Emit the updated item
  emit('update:item', { originalRow: row, updatedRow, field: key, value: editValue.value })
  
  // Store the current cell position for navigation
  const currentIndex = props.headers.findIndex(h => h.key === key)
  const nextHeader = props.headers[currentIndex + 1]
  const navigateToNext = event && event.key === 'Enter' && nextHeader
  
  // Reset editing state
  editingCell.value = null
  editValue.value = ''
  
  // If Enter was pressed, navigate to the next cell in the row
  if (navigateToNext) {
    setTimeout(() => {
      editingCell.value = { rowId, key: nextHeader.key }
      editValue.value = row[nextHeader.key]
    }, 10)
  }
}

const cancelEdit = () => {
  editingCell.value = null
  editValue.value = ''
}

// Add a custom directive to select all text on focus
const vSelectAll = directive('select-all', {
  mounted: (el) => {
    const inputEl = el.querySelector('input')
    if (inputEl) {
      inputEl.addEventListener('focus', () => {
        setTimeout(() => {
          inputEl.select()
        }, 10)
      })
    }
  }
})

// Add event handler for tab key
const handleTabKey = (event) => {
  if (!editingCell.value) return

  // Prevent default tab behavior
  event.preventDefault()

  const { rowId, key } = editingCell.value
  const row = props.items.find(item => item.id === rowId)
  if (!row) return

  // Save current edit
  const updatedRow = { ...row, [key]: editValue.value }
  emit('update:item', { originalRow: row, updatedRow, field: key, value: editValue.value })

  // Find current position
  const headers = props.headers.filter(h => !['id', 'status'].includes(h.key))
  const currentIndex = headers.findIndex(h => h.key === key)
  
  // Calculate next position (with shift+tab going backwards)
  let nextIndex = event.shiftKey ? currentIndex - 1 : currentIndex + 1
  
  // Handle row boundaries
  if (nextIndex < 0 || nextIndex >= headers.length) {
    // Find current row index
    const rowIndex = paginatedItems.value.findIndex(item => item.id === rowId)
    
    if (event.shiftKey && nextIndex < 0) {
      // Move to previous row, last cell
      const prevRowIndex = rowIndex - 1
      if (prevRowIndex >= 0) {
        const prevRow = paginatedItems.value[prevRowIndex]
        nextIndex = headers.length - 1
        
        // Reset current edit
        editingCell.value = null
        editValue.value = ''
        
        // Start editing next cell
        setTimeout(() => {
          editingCell.value = { rowId: prevRow.id, key: headers[nextIndex].key }
          editValue.value = prevRow[headers[nextIndex].key] || ''
        }, 10)
      }
    } else if (!event.shiftKey && nextIndex >= headers.length) {
      // Move to next row, first cell
      const nextRowIndex = rowIndex + 1
      if (nextRowIndex < paginatedItems.value.length) {
        const nextRow = paginatedItems.value[nextRowIndex]
        nextIndex = 0
        
        // Reset current edit
        editingCell.value = null
        editValue.value = ''
        
        // Start editing next cell
        setTimeout(() => {
          editingCell.value = { rowId: nextRow.id, key: headers[nextIndex].key }
          editValue.value = nextRow[headers[nextIndex].key] || ''
        }, 10)
      }
    }
    return
  }
  
  // Move to next cell in same row
  const nextHeader = headers[nextIndex]
  
  // Reset current edit
  editingCell.value = null
  editValue.value = ''
  
  // Start editing next cell
  setTimeout(() => {
    editingCell.value = { rowId, key: nextHeader.key }
    editValue.value = row[nextHeader.key] || ''
  }, 10)
}

onMounted(() => {
  computedItemsPerPage.value = props.itemsPerPage
})
</script>

<template>
  <div class="excel-view">
    <!-- Table controls -->
    <div class="excel-view__controls mb-4">
      <div class="excel-view__actions d-flex align-center flex-wrap gap-4">
        <!-- Left side - Title and export options -->
        <div class="d-flex align-center">
          <slot name="title">
            <h5 class="font-weight-medium mb-0">Data Table</h5>
          </slot>
        </div>
        
        <!-- Right side - Buttons -->
        <div class="d-flex align-center flex-wrap gap-4 ms-auto">
          <!-- Action buttons -->
          <div class="excel-view__export-actions d-flex gap-2">
            <slot name="actions">
              <!-- Export buttons removed permanently -->
            </slot>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Main table wrapper -->
    <div class="excel-view__main-wrapper" :class="{ 'excel-view__main-wrapper--bordered': bordered }">
      <!-- Date Range Filter outside table -->
      <div v-if="searchable" class="excel-view__date-range-container">
        <div class="d-flex flex-wrap align-center gap-4">
          <div class="d-flex align-center">
            <span class="text-body-2 font-weight-medium me-2">FROM</span>
            <VTextField
              v-model="dateRange.from"
              type="date"
              density="compact"
              hide-details
              placeholder="dd-mm-yyyy"
              variant="outlined"
              class="date-range-field"
            />
          </div>
          <div class="d-flex align-center">
            <span class="text-body-2 font-weight-medium me-2">TO</span>
            <VTextField
              v-model="dateRange.to"
              type="date"
              density="compact"
              hide-details
              placeholder="dd-mm-yyyy"
              variant="outlined"
              class="date-range-field"
            />
          </div>
          <VBtn
            variant="tonal"
            color="secondary"
            size="small"
            @click="resetFilters"
            class="ms-auto"
          >
            Clear Filters
          </VBtn>
        </div>
      </div>
      
      <!-- Table container -->
      <div 
        class="excel-view__table-wrapper"
        :class="{ 
          'excel-view__table-wrapper--fixed-header': fixedHeader
        }"
        :style="height ? { height: typeof height === 'number' ? `${height}px` : height } : {}"
      >
        <table 
          class="excel-view__table" 
          :class="{ 
            'excel-view__table--striped': striped,
            'excel-view__table--hover': hover,
            'excel-view__table--bordered': bordered,
            [`excel-view__table--${density}`]: true,
          }"
        >
          <!-- Table header -->
          <thead class="excel-view__header">
            <tr class="excel-view__header-row">
              <!-- SR. NO. column with optional checkbox -->
              <th 
                class="excel-view__th excel-view__th--sr-no" 
                :class="{ 'excel-view__th--with-checkbox': selectable }"
              >
                <div class="excel-view__th-content">
                  <div class="d-flex align-center w-100">
                    <VCheckbox
                      v-if="selectable"
                      :model-value="allRowsSelected"
                      hide-details
                      density="compact"
                      class="me-3 sr-checkbox"
                      @change="handleSelectAll"
                    />
                    <span class="ms-2 text-right">SR. NO.</span>
                  </div>
                  <VIcon
                    v-if="sortable"
                    icon="bx-chevron-down"
                    size="18"
                    class="invisible"
                  />
                </div>
                
                <!-- Column search within the header -->
                <div v-if="searchable" class="excel-view__th-search mt-2">
                  <VTextField
                    v-model="columnFilters['id']"
                    density="compact"
                    placeholder="Search..."
                    hide-details
                    variant="outlined"
                    prepend-inner-icon="bx-search"
                    class="column-filter"
                  />
                </div>
              </th>
              
              <!-- Regular data columns (skip the ID column since we merged it) -->
              <th
                v-for="header in headers.filter(h => h.key !== 'id')"
                :key="header.key"
                class="excel-view__th"
                :class="{ 
                  'excel-view__th--sortable': sortable && header.sortable !== false,
                  'excel-view__th--sorted': sortable && sortBy.key === header.key,
                  [`excel-view__th--align-${header.align || 'start'}`]: true 
                }"
                :style="header.width ? { width: header.width } : {}"
                @click="sortable && header.sortable !== false && handleSort(header.key)"
              >
                <div class="excel-view__th-content">
                  <span>{{ header.title }}</span>
                  <VIcon
                    v-if="sortable && header.sortable !== false"
                    :icon="sortBy.key === header.key 
                      ? (sortBy.order === 'asc' ? 'bx-chevron-up' : 'bx-chevron-down') 
                      : 'bx-chevron-down'"
                    size="18"
                    :class="{ 'invisible': sortBy.key !== header.key }"
                  />
                </div>
                
                <!-- Column search within the header -->
                <div v-if="searchable && header.key !== 'date'" class="excel-view__th-search mt-2">
                  <VTextField
                    v-model="columnFilters[header.key]"
                    density="compact"
                    placeholder="Search..."
                    hide-details
                    variant="outlined"
                    prepend-inner-icon="bx-search"
                    class="column-filter"
                  />
                </div>
              </th>
              
              <!-- Slot for custom header actions column -->
              <slot name="header-actions">
                <th v-if="$slots['item-actions']" class="excel-view__th excel-view__th--actions" width="60">
                  <div class="excel-view__th-content justify-center">
                    <VIcon icon="bx-trash" size="20" />
                  </div>
                </th>
              </slot>
            </tr>
          </thead>
          
          <!-- Table body -->
          <tbody class="excel-view__body">
            <!-- Loading state -->
            <tr v-if="loading" class="excel-view__loading">
              <td :colspan="headers.length + (($slots['item-actions']) ? 1 : 0)">
                <div class="d-flex align-center justify-center py-6">
                  <VProgressCircular indeterminate color="primary" />
                  <span class="ml-2">{{ loadingText }}</span>
                </div>
              </td>
            </tr>
            
            <!-- Empty state -->
            <tr v-else-if="searchResults.length === 0" class="excel-view__empty">
              <td :colspan="headers.length + (($slots['item-actions']) ? 1 : 0)">
                <div class="d-flex justify-center align-center text-center py-6">
                  <VIcon icon="bx-info-circle" color="secondary" class="mr-2" />
                  <span>{{ searchQuery ? 'No matching records found' : noDataText }}</span>
                </div>
              </td>
            </tr>
            
            <!-- Data rows -->
            <template v-else>
              <tr
                v-for="(item, index) in searchResults"
                :key="index"
                class="excel-view__row"
                :class="{ 
                  'excel-view__row--selected': isRowSelected(item),
                  'excel-view__row--grouped': shouldHighlightRow(item)
                }"
                @click="handleRowClick(item, $event)"
              >
                <!-- SR. NO. cell with optional checkbox -->
                <td class="excel-view__td excel-view__td--sr-no">
                  <div class="d-flex align-center w-100">
                    <VCheckbox
                      v-if="selectable"
                      :model-value="isRowSelected(item)"
                      hide-details
                      density="compact"
                      class="me-3 sr-checkbox"
                      @change="(e) => handleSelectRow(item, e)"
                    />
                    <span class="ms-2 text-right">{{ item.id }}</span>
                  </div>
                </td>
                
                <!-- Regular data cells (skip the ID column since we merged it) -->
                <td
                  v-for="header in headers.filter(h => h.key !== 'id')"
                  :key="header.key"
                  class="excel-view__td"
                  :class="`excel-view__td--align-${header.align || 'start'}`"
                  @click="handleCellClick(item, header, $event)"
                  @dblclick="startEditing(item, header)"
                >
                  <!-- Show input when editing this cell -->
                  <div v-if="editingCell && editingCell.rowId === item.id && editingCell.key === header.key">
                    <input
                      v-if="header.key !== 'date'"
                      ref="editInput"
                      v-model="editValue"
                      class="native-edit-input"
                      autofocus
                      @keyup.enter="saveEdit"
                      @keyup.esc="cancelEdit"
                      @keydown.tab="handleTabKey"
                      @blur="saveEdit"
                    />
                    <input
                      v-else
                      ref="editInput"
                      v-model="editValue"
                      type="date"
                      class="native-edit-input"
                      autofocus
                      @keyup.enter="saveEdit"
                      @keyup.esc="cancelEdit"
                      @keydown.tab="handleTabKey"
                      @blur="saveEdit"
                    />
                  </div>
                  <!-- Show formatted date or regular value -->
                  <template v-else>
                    <span v-if="header.key === 'date'">{{ formatDate(item[header.key]) }}</span>
                    <span v-else>{{ item[header.key] }}</span>
                  </template>
                </td>
                
                <!-- Actions cell with only delete icon -->
                <td v-if="$slots['item-actions']" class="excel-view__td excel-view__td--actions">
                  <slot 
                    name="item-actions" 
                    :item="item"
                    :index="index"
                  >
                    <!-- Default implementation with just the delete icon -->
                    <div class="d-flex justify-center">
                      <VBtn
                        size="small"
                        icon
                        variant="text"
                        color="error"
                        @click.stop
                      >
                        <VIcon icon="bx-trash" />
                      </VBtn>
                    </div>
                  </slot>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
    </div>
    
    <!-- Pagination -->
    <div 
      v-if="showPagination && !loading && totalPages > 1" 
      class="excel-view__pagination d-flex align-center justify-space-between mt-4"
    >
      <div class="excel-view__items-per-page">
        <VSelect
          v-model="computedItemsPerPage"
          density="compact"
          label="Rows per page"
          :items="[5, 10, 15, 20, 25, 50, 100]"
          variant="outlined"
          hide-details
          class="rows-per-page-select"
          @update:model-value="handleItemsPerPageChange"
        />
      </div>
      
      <div class="excel-view__pages">
        <VPagination
          v-model="currentPage"
          :length="totalPages"
          :total-visible="5"
          rounded
          @update:model-value="handlePageChange"
        />
      </div>
      
      <div class="excel-view__page-info">
        <span class="text-caption">
          Page {{ currentPage }} of {{ totalPages }}
          ({{ filteredItems.length }} items)
        </span>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
/* Global styles for editable cells */
.excel-view {
  .v-field {
    border-radius: 0;
    background: transparent !important;
    box-shadow: none !important;

    &__input {
      padding: 0 !important;
      color: inherit !important;
      font-family: inherit !important;
      font-size: inherit !important;
      min-block-size: unset !important;
    }

    &__outline,
    &__overlay {
      display: none !important;
      border: none !important;
      background: transparent !important;
      opacity: 0 !important;
    }

    &--focused {
      background: transparent !important;
      box-shadow: none !important;

      .v-field__outline {
        display: none !important;
        border: none !important;
        background: transparent !important;
        opacity: 0 !important;
      }
    }
  }

  .v-text-field {
    position: absolute;
    padding: 0 !important;
    margin: 0 !important;
    background: transparent !important;
    inset: -1px;

    .v-input__control,
    .v-input__slot,
    .v-field-container,
    .v-field {
      border: none !important;
      background: transparent !important;
      box-shadow: none !important;
      min-block-size: unset !important;
    }

    input {
      padding: inherit !important;
      border: none !important;
      margin: 0 !important;
      background: transparent !important;
      block-size: 100% !important;
      box-shadow: inset 0 0 0 1px rgba(var(--v-theme-primary), 0.3) !important;
      caret-color: rgba(var(--v-theme-primary), 1) !important;
      min-block-size: unset !important;
      outline: none !important;
    }

    .v-messages,
    .v-counter {
      display: none !important;
    }
  }

  .excel-view__td--align-center .v-field__input {
    text-align: center !important;
  }

  .excel-view__td--align-end .v-field__input {
    text-align: end !important;
  }

  /* Add a cursor style to show cells are editable */
  .excel-view__td {
    position: relative;
    cursor: cell !important;

    &:hover {
      background-color: rgba(var(--v-theme-primary), 0.04) !important;
    }
  }

  /* Style for the native input */
  .native-edit-input {
    position: absolute;
    z-index: 1;
    padding: inherit;
    border: none;
    margin: 0;
    background-color: transparent;
    block-size: 100%;
    box-shadow: inset 0 0 0 1px rgba(var(--v-theme-primary), 0.3);
    color: inherit;
    font-family: inherit;
    font-size: inherit;
    inline-size: 100%;
    inset: 0;
    outline: none;
    text-align: inherit;

    &:focus {
      background-color: transparent;
      outline: none;
    }
  }

  /* Align text inputs properly */
  .excel-view__td--align-center .native-edit-input {
    text-align: center;
  }

  .excel-view__td--align-end .native-edit-input {
    text-align: end;
  }
}
</style>

<style lang="scss" scoped>
.excel-view {
  inline-size: 100%;

  &__main-wrapper {
    overflow: hidden;
    border-radius: 8px;

    &--bordered {
      border: 2px solid rgba(var(--v-border-color), var(--v-border-opacity));
    }
  }

  &__date-range-container {
    padding: 12px;
    background-color: rgba(var(--v-theme-surface), 1);
    border-block-end: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));

    .date-range-field {
      inline-size: 180px;
    }

    span {
      color: rgba(var(--v-theme-on-surface), var(--v-high-emphasis-opacity));
    }
  }

  &__table-wrapper {
    position: relative;
    overflow: auto;
    inline-size: 100%;
    max-block-size: 100%;

    &--fixed-header {
      .excel-view__header {
        position: sticky;
        z-index: 2;
        background-color: rgba(var(--v-theme-surface), 1);
        inset-block-start: 0;
      }
    }
  }

  &__table {
    border-collapse: collapse;
    inline-size: 100%;

    &--striped {
      tbody tr:nth-child(even) {
        background-color: rgba(var(--v-theme-surface-variant), 0.3);
      }
    }

    &--hover {
      tbody tr:hover {
        background-color: rgba(var(--v-theme-primary), 0.04);
      }
    }

    &--bordered {
      border-collapse: separate;
      border-spacing: 0;
    }

    &--compact {
      th,
      td {
        padding-block: 6px;
        padding-inline: 8px;
      }
    }

    &--comfortable {
      th,
      td {
        padding-block: 12px;
        padding-inline: 16px;
      }
    }

    &--default {
      th,
      td {
        padding-block: 16px;
        padding-inline: 16px;
      }
    }
  }

  &__header-row {
    background-color: #f7f7f7;
  }

  &__th {
    background-color: #f7f7f7;
    color: rgba(var(--v-theme-on-surface), var(--v-high-emphasis-opacity));
    font-size: 0.8125rem;
    font-weight: 600;
    letter-spacing: 0.5px;
    padding-block-end: 14px;
    text-align: start;
    text-transform: uppercase;
    white-space: nowrap;

    &--sortable {
      cursor: pointer;
      user-select: none;

      &:hover {
        background-color: rgba(var(--v-theme-surface-variant), 0.5);
      }
    }

    &--sorted {
      background-color: rgba(var(--v-theme-primary), 0.08) !important;
      color: rgb(var(--v-theme-primary));
    }

    &-search {
      margin-block-start: 8px;

      .column-filter {
        font-size: 0.8125rem;
      }
    }

    &-content {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    &--align-center {
      text-align: center;

      .excel-view__th-content {
        justify-content: center;
      }
    }

    &--align-end {
      text-align: end;

      .excel-view__th-content {
        justify-content: flex-end;
      }
    }

    &--actions {
      position: sticky;
      z-index: 1;
      background-color: rgba(var(--v-theme-surface), 1);
      box-shadow: -2px 0 4px rgba(0, 0, 0, 5%);
      inline-size: 60px;
      inset-inline-end: 0;
      text-align: center;
    }

    &--sr-no {
      inline-size: 100px;
      min-inline-size: 100px;

      .excel-view__th-content {
        justify-content: flex-start;
      }

      &.excel-view__th--with-checkbox {
        inline-size: 120px;
        min-inline-size: 120px;
      }
    }
  }

  &__td {
    position: relative;
    background-color: inherit;
    text-align: start;

    &--align-center {
      text-align: center;
    }

    &--align-end {
      text-align: end;
    }

    &--actions {
      position: sticky;
      z-index: 1;
      background-color: inherit;
      box-shadow: -2px 0 4px rgba(0, 0, 0, 5%);
      inline-size: 60px;
      inset-inline-end: 0;
      text-align: center;
      white-space: nowrap;
    }

    &--sr-no {
      inline-size: 100px;
      min-inline-size: 100px;

      &:has(.sr-checkbox) {
        inline-size: 120px;
        min-inline-size: 120px;
      }
    }
  }

  &__row {
    &--selected {
      background-color: rgba(var(--v-theme-primary), 0.08) !important;
    }
  }

  // Additional global styles
  .excel-view__table--bordered {
    th,
    td {
      border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
    }
  }

  &__pagination {
    .rows-per-page-select {
      inline-size: 160px;
    }
  }

  &__search {
    .search-field {
      inline-size: 250px;
    }
  }

  // Add styling for the checkbox
  .sr-checkbox {
    .v-selection-control {
      padding: 0;
      margin: 0;
      min-block-size: 24px;
    }

    .v-selection-control__wrapper {
      padding: 0;
      margin: 0;
    }

    .v-selection-control__input {
      transform: scale(0.85);
    }
  }
}

// Responsive adjustments
@media (max-width: 960px) {
  .excel-view {
    &__controls {
      flex-direction: column;
      align-items: flex-start !important;

      > div {
        inline-size: 100%;
        margin-block-end: 16px;
      }
    }

    &__pagination {
      flex-direction: column;
      gap: 16px;

      > div {
        display: flex;
        justify-content: center;
        inline-size: 100%;
      }
    }
  }
}

@media (max-width: 600px) {
  .excel-view {
    &__actions {
      flex-direction: column;
      align-items: flex-start !important;

      > div {
        inline-size: 100%;
        margin-block-end: 8px;
      }
    }

    &__search {
      .search-field {
        inline-size: 100%;
      }
    }
  }
}
</style> 
