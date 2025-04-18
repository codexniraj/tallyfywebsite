# Tallyfy Universal Components

## ExcelView Component

The ExcelView component is a versatile and high-performance data table component that offers Excel-like functionality with advanced features for displaying, filtering, sorting, and interacting with tabular data.

### Features

- **Responsive Design**: Adapts to different screen sizes
- **Density Options**: Choose between 'default', 'comfortable', and 'compact' density
- **Fixed Header**: Keep headers visible while scrolling
- **Row Selection**: Select multiple rows for bulk actions
- **Pagination**: Configurable items per page
- **Sorting**: Sort by any column (can be enabled/disabled per column)
- **Search**: Global search functionality
- **Customization**: Slots for custom cell rendering
- **Theming**: Integrated with Vuetify theme system
- **Export**: Export data to Excel or CSV
- **Loading State**: Built-in loading state with progress indicator

### Usage

```vue
<script setup>
import ExcelView from '~/components/ExcelView.vue'

// Define table headers
const headers = [
  { 
    title: 'Name', 
    key: 'name', 
    sortable: true, 
    width: '200px',
    align: 'start',
  },
  { 
    title: 'Amount', 
    key: 'amount', 
    sortable: true, 
    width: '120px',
    align: 'end', 
  },
  { 
    title: 'Status', 
    key: 'status', 
    sortable: true, 
    width: '120px',
    align: 'center', 
  },
]

// Table data
const items = ref([
  { name: 'Item 1', amount: 1000, status: 'active' },
  { name: 'Item 2', amount: 2000, status: 'pending' },
  { name: 'Item 3', amount: 3000, status: 'completed' },
])

// Selected rows
const selectedRows = ref([])

// Handle row selection
const handleSelection = (rows) => {
  console.log('Selected rows:', rows)
}
</script>

<template>
  <ExcelView
    :headers="headers"
    :items="items"
    density="comfortable"
    height="400"
    fixed-header
    striped
    hover
    selectable
    v-model:selected="selectedRows"
    @selection="handleSelection"
  >
    <!-- Custom status cell -->
    <template #item.status="{ value }">
      <VChip
        size="small"
        :color="value === 'active' ? 'success' : value === 'pending' ? 'warning' : 'info'"
      >
        {{ value }}
      </VChip>
    </template>
    
    <!-- Custom actions cell -->
    <template #item-actions="{ item }">
      <div class="d-flex gap-1">
        <VBtn
          size="small"
          icon
          variant="text"
          color="primary"
        >
          <VIcon icon="bx-edit" />
        </VBtn>
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
</template>
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| headers | Array | Required | An array of column definitions |
| items | Array | [] | The data to display in the table |
| density | String | 'default' | Table density ('default', 'comfortable', 'compact') |
| height | String/Number | null | Fixed height for the table |
| fixedHeader | Boolean | false | Keep the header fixed when scrolling |
| bordered | Boolean | false | Add borders to the table |
| striped | Boolean | false | Apply striped styling to rows |
| hover | Boolean | true | Apply hover effect to rows |
| selectable | Boolean | false | Enable row selection with checkboxes |
| loading | Boolean | false | Show loading state |
| loadingText | String | 'Loading data...' | Text to display when loading |
| noDataText | String | 'No data available' | Text to display when there is no data |
| itemsPerPage | Number | 10 | Items per page when pagination is enabled |
| showPagination | Boolean | true | Show pagination controls |
| sortable | Boolean | true | Enable sorting |
| initialSortBy | Object | { key: '', order: 'asc' } | Initial sort configuration |
| searchable | Boolean | true | Show search field |

### Events

| Event | Parameters | Description |
|-------|------------|-------------|
| update:selected | Array | Emitted when selection changes |
| row-click | Object | Emitted when a row is clicked |
| cell-click | { row, header } | Emitted when a cell is clicked |
| sort | { key, order } | Emitted when sort changes |
| page-change | Number | Emitted when page changes |
| items-per-page-change | Number | Emitted when items per page changes |
| search | String | Emitted when search query changes |
| export-excel | Array | Emitted when export to Excel is clicked |
| export-csv | Array | Emitted when export to CSV is clicked |

### Slots

| Slot | Description |
|------|-------------|
| title | Custom title content |
| actions | Custom actions in the header |
| `item.{key}` | Custom cell content for column with `key` |
| item-actions | Custom actions for each row |
| header-actions | Custom header for actions column |

## Example Pages

For examples of how to use the ExcelView component, see:

- `/pages/excel-view-demo.vue`: Demo page showcasing all features
- `/pages/journal-transactions.vue`: Real-world implementation for journal transactions 
