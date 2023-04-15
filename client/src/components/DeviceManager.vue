<template>
  <v-container class="d-flex justify-center align-center fill-height">
    <v-data-table :headers="headers" :items="items" :options.sync="options" :server-items-length="totalItems"
      :loading="loading" class="elevation-1">
      <v-btn color="primary" class="mr-2" small @click="editItem(item)">Edit</v-btn>
      <v-btn color="error" small @click="deleteItem(item)">Delete</v-btn>
    </v-data-table>
  </v-container>
</template>
<script>
import axios from 'axios'

export default {
  data: () => ({
    headers: [
      { text: 'Brand', value: 'brand' },
      { text: 'Model', value: 'model' },
      { text: 'OS', value: 'os' },
      { text: 'Release Date', value: 'release_date' },
      { text: 'Actions', value: 'actions', sortable: false },
    ],
    items: [],
    totalItems: 0,
    loading: false,
    options: {},
    apiEndpoint: 'http://localhost:8080/devices',
  }),
  watch: {
    options: {
      handler() {
        this.fetchItems();
      },
      deep: true,
    },
  },
  methods: {
    async fetchItems() {
      this.loading = true

      const { sortBy, sortDesc, page, itemsPerPage } = this.options

      try {
        const response = await axios.get(this.apiEndpoint, {
          params: {
            page: page,
            itemsPerPage: itemsPerPage,
            sortBy: sortBy,
            sortDesc: sortDesc
          },
        })
        this.items = response.data.items
        this.totalItems = parseInt(response.data.total_items)
      } catch (error) {
        console.error(error)
      } finally {
        this.loading = false
      }
    },
    editItem(item) {
      console.log(item);
    },
    deleteItem(item) {
      console.log(item);
    },
  },
}
</script>