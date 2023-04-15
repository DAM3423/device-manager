<template>
  <v-container class="d-flex justify-center align-center fill-height">
    <v-data-table :headers="headers" :items="items" :options.sync="options" :server-items-length="totalItems"
      :loading="loading" class="elevation-1">
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>Devices</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <v-dialog v-model="dialog" max-width="500px">
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">
                New Item
              </v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="text-h5">{{ formTitle }}</span>
              </v-card-title>

              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12" md="6">
                      <v-text-field v-model="editedItem.brand" label="Brand"></v-text-field>
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-text-field v-model="editedItem.model" label="Model"></v-text-field>
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-text-field v-model="editedItem.os" label="Operating System"></v-text-field>
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-text-field v-model="editedItem.release_date" label="Release Date"></v-text-field>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="close">
                  Cancel
                </v-btn>
                <v-btn color="blue darken-1" text @click="save">
                  Save
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-dialog v-model="dialogDelete" max-width="500px">
            <v-card>
              <v-card-title class="text-h5">Are you sure you want to delete this item?</v-card-title>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="closeDelete">Cancel</v-btn>
                <v-btn color="blue darken-1" text @click="deleteItemConfirm">OK</v-btn>
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
        <v-alert v-model="deleteAlert" variant="tonal" closable close-label="Close Alert" color="red"
          title="Entry deleted">
          Entry deleted
        </v-alert>
        <v-alert v-model="successAlert" variant="tonal" closable close-label="Close Alert" color="green"
          title="Entry added">
          Entry added
        </v-alert>
      </template>
      <template v-slot:[`item.actions`]="{ item }">
        <v-icon small class="mr-2" @click="editItem(item)">
          mdi-pencil
        </v-icon>
        <v-icon small @click="deleteItem(item)">
          mdi-delete
        </v-icon>
      </template>
    </v-data-table>
  </v-container>
</template>
<script>
import axios from 'axios'

export default {
  data: () => ({
    dialog: false,
    dialogDelete: false,
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
    editedIndex: -1,
    editedItem: {
      brand: '',
      model: '',
      os: '',
      release_date: '',
    },
    defaultItem: {
      brand: '',
      model: '',
      os: '',
      release_date: '',
    },
    successAlert: false,
    deleteAlert: false
  }),
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
    },
  },
  watch: {
    options: {
      handler() {
        this.fetchItems();
      },
      deep: true,
    },
    dialog(val) {
      val || this.close()
    },
    dialogDelete(val) {
      val || this.closeDelete()
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
      this.editedIndex = this.items.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },
    deleteItem(item) {
      this.editedIndex = this.items.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialogDelete = true
    },
    async deleteItemConfirm() {
      const response = await axios.delete(`${this.apiEndpoint}/${this.editedItem.id}`);

      this.closeDelete();
      this.fetchItems();
      this.showAlert('delete');
    },
    close() {
      this.dialog = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },
    closeDelete() {
      this.dialogDelete = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },
    save() {
      if (this.editedIndex > -1) {
        axios.put(`${this.apiEndpoint}/${this.editedItemId}`, this.editedItemData)
          .then(response => {
            console.log('PUT request successful!');
            console.log(response.data);
          })
          .catch(error => {
            console.error('PUT request failed:', error);
          });
      } else {
        axios.post(`${this.apiEndpoint}`, this.editedItem)
          .then(() => {
            this.showAlert('success');
            this.fetchItems();
          })
          .catch(error => {
            console.error('POST request failed:', error);
          });
      }
      this.close()
    }, showAlert(type) {
      if (type === 'delete') {
        this.deleteAlert = !this.deleteAlert;
        this.successAlert = false;
      } else if (type === 'success') {
        this.successAlert = !this.successAlert;
        this.deleteAlert = false;
      }
    }
  },
}
</script>