<template>
  <div>
    <h2>Vuetify Labs Components</h2>

    <!-- VDataTable (if using server/virtual) -->
    <VDataTableServer
      :items="items"
      :headers="headers"
    />

    <!-- VInfiniteScroll -->
    <VInfiniteScroll
      :items="items"
      :on-load="loadMore"
    />

    <!-- VDateInput -->
    <VDateInput
      v-model="date"
      label="Select Date"
    />

    <!-- VNumberInput -->
    <VNumberInput
      v-model="number"
      label="Enter Number"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'

const date = ref(new Date())
const number = ref(0)
const items = ref([])
const headers = [
  { title: 'Name', value: 'name' },
  { title: 'Email', value: 'email' },
]

const loadMore = async ({ done }) => {
  // Load more items...
  done('ok')
}
</script>
