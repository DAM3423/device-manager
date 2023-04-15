<template>
  <v-container class="d-flex justify-center align-center fill-height">
    <!-- <v-data-table :headers="headers" :items="items" :page.sync="page" :items-per-page.sync="perPage"
      :total-items="totalItems" :loading="loading" :server-items-length="true" @pagination="fetchItems">
    </v-data-table> -->
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
    page: 1,
    perPage: 10,
    totalItems: 0,
    loading: false,
    apiEndpoint: 'http://localhost:8080/devices',
  }),
  methods: {
    async fetchItems() {
      this.loading = true
      try {
        const response = await axios.get(this.apiEndpoint, {
          params: {
            page: this.page,
            perPage: this.perPage,
          },
        })
        console.log(response.data);
        this.items = response.data.items
        this.totalItems = response.data.totalItems
      } catch (error) {
        console.error(error)
      } finally {
        this.loading = false
      }
    },
  },
  created() {
    this.fetchItems()
  },
}
</script>