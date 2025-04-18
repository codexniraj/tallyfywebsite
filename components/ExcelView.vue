<script setup>
import { computed, onMounted, ref, watch } from 'vue'

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

const handleSelectAll = (event) => {
  selectedRows.value = event.target.checked ? [...paginatedItems.value] : []
  emit('update:selected', selectedRows.value)
}

const handleSelectRow = (row, event) => {
  if (event.target.checked) {
    selectedRows.value.push(row)
  } else {
    const index = selectedRows.value.findIndex(item => item === row)
    if (index !== -1) {
      selectedRows.value.splice(index, 1)
    }
  }
  emit('update:selected', selectedRows.value)
}

const isRowSelected = (row) => {
  return selectedRows.value.includes(row)
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

onMounted(() => {
  computedItemsPerPage.value = props.itemsPerPage
})
</script>

<template>
  <div class="excel-view">
    <!-- Table controls - reduce margin -->
    <div class="excel-view__controls mb-2">
      <div class="excel-view__actions d-flex align-center flex-wrap gap-3">
        <!-- Left side - Title slot preserved but with minimal space -->
        <div class="d-flex align-center">
          <slot name="title">
            <!-- Title slot intentionally empty -->
          </slot>
        </div>
        
        <!-- Right side - Buttons -->
        <div class="d-flex align-center flex-wrap gap-3 ms-auto">
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
        <div class="d-flex flex-wrap align-center gap-3">
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
                :class="{ 'excel-view__row--selected': isRowSelected(item) }"
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
                >
                  <!-- Use slot if provided -->
                  <slot
                    :name="`item.${header.key}`"
                    :item="item"
                    :value="item[header.key]"
                    :index="index"
                  >
                    {{ item[header.key] }}
                  </slot>
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
    background-color: rgba(var(--v-theme-surface), 1);
    border-block-end: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
    padding-block: 8px;
    padding-inline: 12px;

    .date-range-field {
      inline-size: 160px;
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
