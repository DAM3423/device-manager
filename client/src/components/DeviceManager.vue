<template>
  <v-container class="d-flex justify-center align-center fill-height">
    <v-row>
      <v-col>
        <v-card>
          <v-data-table
            :headers="headers"
            :items="items"
            :options.sync="options"
            :server-items-length="totalItems"
            :loading="loading"
            :search="search"
            class="elevation-1"
          >
            <template v-slot:top>
              <v-toolbar flat>
                <v-toolbar-title>Devices</v-toolbar-title>
                <v-divider class="mx-4" inset vertical></v-divider>
                <v-spacer></v-spacer>
                <v-dialog v-model="dialog" max-width="500px">
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      color="primary"
                      dark
                      class="mb-2"
                      v-bind="attrs"
                      v-on="on"
                    >
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
                            <v-text-field
                              v-model="editedItem.brand"
                              label="Brand"
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" md="6">
                            <v-text-field
                              v-model="editedItem.model"
                              label="Model"
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" md="6">
                            <v-text-field
                              v-model="editedItem.os"
                              label="Operating System"
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" md="6">
                            <v-menu
                              v-model="releaseDateMenu"
                              :close-on-content-click="false"
                              :nudge-right="40"
                              transition="scale-transition"
                              offset-y
                            >
                              <template v-slot:activator="{ on }">
                                <v-text-field
                                  v-model="editedItem.release_date"
                                  label="Release date"
                                  prepend-icon="mdi-calendar"
                                  readonly
                                  v-on="on"
                                ></v-text-field>
                              </template>
                              <v-date-picker
                                format="YYYY-MM"
                                v-model="editedItem.release_date"
                                type="month"
                                @input="releaseDateMenu = false"
                              ></v-date-picker>
                            </v-menu>
                          </v-col>
                          <v-col cols="12" md="6">
                            <v-menu
                              v-model="receivedDatetimeMenu"
                              :close-on-content-click="false"
                              :nudge-right="40"
                              transition="scale-transition"
                              offset-y
                            >
                              <template v-slot:activator="{ on }">
                                <v-text-field
                                  v-model="editedItem.received_datetime"
                                  label="Received date"
                                  prepend-icon="mdi-calendar"
                                  readonly
                                  v-on="on"
                                ></v-text-field>
                              </template>
                              <v-date-picker
                                format="YYYY-MM-DD"
                                v-model="editedItem.received_datetime"
                                @input="receivedDatetimeMenu = false"
                              ></v-date-picker>
                            </v-menu>
                          </v-col>
                          <v-col cols="12" md="6">
                            <v-switch
                              v-model="editedItem.is_new"
                              label="New"
                            ></v-switch>
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
                    <v-card-title class="text-h5"
                      >Are you sure you want to delete this item?</v-card-title
                    >
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn color="blue darken-1" text @click="closeDelete"
                        >Cancel</v-btn
                      >
                      <v-btn
                        color="blue darken-1"
                        text
                        @click="deleteItemConfirm"
                        >OK</v-btn
                      >
                      <v-spacer></v-spacer>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </v-toolbar>
              <v-text-field
                class="mx-4"
                v-model="search"
                append-icon="mdi-magnify"
                label="Search"
                single-line
                hide-details
              ></v-text-field>
              <v-alert
                class="mx-4"
                v-model="deleteAlert"
                variant="tonal"
                closable
                close-label="Close Alert"
                color="red"
                title="Entry deleted"
              >
                Entry deleted
              </v-alert>
              <v-alert
                class="mx-4"
                v-model="successAlert"
                variant="tonal"
                closable
                close-label="Close Alert"
                color="green"
                :title="successMessage"
              >
                {{ successMessage }}
              </v-alert>
            </template>
            <template v-slot:[`item.actions`]="{ item }">
              <v-icon small class="mr-2" @click="editItem(item)">
                mdi-pencil
              </v-icon>
              <v-icon small @click="deleteItem(item)"> mdi-delete </v-icon>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import axios from "axios";

export default {
  data: () => ({
    dialog: false,
    dialogDelete: false,
    headers: [
      { text: "Brand", value: "brand", width: "20%" },
      { text: "Model", value: "model", width: "20%" },
      { text: "OS", value: "os", width: "30%" },
      { text: "Release Date", value: "release_date", width: "20%" },
      { text: "Actions", value: "actions", width: "10%", sortable: false },
    ],
    items: [],
    totalItems: 0,
    loading: false,
    options: {},
    apiEndpoint: "http://localhost:8080/devices",
    httpOptions: {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    },
    editedIndex: -1,
    editedItem: {
      brand: "",
      model: "",
      os: "",
      release_date: "",
      is_new: null,
      received_datetime: "",
    },
    defaultItem: {
      brand: "",
      model: "",
      os: "",
      release_date: "",
      is_new: null,
      received_datetime: "",
    },
    successAlert: false,
    successMessage: "",
    deleteAlert: false,
    search: "",
    releaseDateMenu: false,
    receivedDatetimeMenu: false,
  }),
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "New Item" : "Edit Item";
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
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
    search(val) {
      this.string = val;
      this.fetchItems();
    },
  },
  methods: {
    async fetchItems() {
      this.loading = true;

      const { sortBy, sortDesc, page, itemsPerPage } = this.options;

      try {
        const response = await axios.post(
          `${this.apiEndpoint}/index`,
          {
            page: page,
            itemsPerPage: itemsPerPage,
            sortBy: sortBy,
            sortDesc: sortDesc,
            search: this.search,
          },
          this.httpOptions
        );
        this.items = this.formatDatesForTable(response.data.items);
        this.totalItems = parseInt(response.data.total_items);
      } catch (error) {
        console.error(error);
      } finally {
        this.loading = false;
      }
    },
    formatDatesForTable(items) {
      for (let i = 0; i < items.length; i++) {
        // Change release_date format from YYYY/MM to YYYY-MM
        items[i].release_date = items[i].release_date.replace("/", "-");

        // Change received_datetime format from ISO string to YYYY/MM/DD
        const dateObj = new Date(items[i].received_datetime);
        const year = dateObj.getUTCFullYear();
        const month = ("0" + (dateObj.getUTCMonth() + 1)).slice(-2);
        const day = ("0" + dateObj.getUTCDate()).slice(-2);
        items[i].received_datetime = `${year}-${month}-${day}`;
      }

      return items;
    },
    formatDateForSubmission(item) {
      const newReleaseDate = item.release_date.replace(/-/g, "/");
      const newReceivedDate = new Date(item.received_datetime).toISOString();

      return {
        ...item,
        release_date: newReleaseDate,
        received_datetime: newReceivedDate,
      };
    },
    editItem(item) {
      this.editedIndex = this.items.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },
    deleteItem(item) {
      this.editedIndex = this.items.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },
    async deleteItemConfirm() {
      await axios.delete(
        `${this.apiEndpoint}/delete/${this.editedItem.id}`,
        this.httpOptions
      );

      this.closeDelete();
      this.fetchItems();
      this.showAlert("delete");
    },
    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },
    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },
    save() {
      if (this.editedIndex > -1) {
        const selectedKeys = [
          "brand",
          "model",
          "os",
          "is_new",
          "received_datetime",
          "release_date",
        ];

        const selectedObject = Object.fromEntries(
          Object.entries(this.editedItem).filter(([key]) =>
            selectedKeys.includes(key)
          )
        );

        axios
          .put(
            `${this.apiEndpoint}/update/${this.editedItem.id}`,
            this.formatDateForSubmission(selectedObject),
            this.httpOptions
          )
          .then(() => {
            this.showAlert("success-edit");
            this.fetchItems();
          })
          .catch((error) => {
            console.error("PUT request failed:", error);
          });
      } else {
        axios
          .post(
            `${this.apiEndpoint}/create`,
            this.formatDateForSubmission(this.editedItem),
            this.httpOptions
          )
          .then(() => {
            this.showAlert("success");
            this.fetchItems();
          })
          .catch((error) => {
            console.error("POST request failed:", error);
          });
      }
      this.close();
    },
    showAlert(type) {
      if (type === "delete") {
        this.deleteAlert = !this.deleteAlert;
        this.successAlert = false;
      } else if (type === "success") {
        this.successMessage = "Entry created";
        this.successAlert = true;
        this.deleteAlert = false;
      } else if (type === "success-edit") {
        this.successMessage = "Entry updated";
        this.successAlert = true;
        this.deleteAlert = false;
      }
    },
  },
};
</script>
