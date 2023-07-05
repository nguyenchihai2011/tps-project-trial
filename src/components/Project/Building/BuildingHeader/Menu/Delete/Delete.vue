<template>
  <v-dialog v-model="dialogDelete" persistent max-width="40vw">
    <template v-slot:activator="{ on, attrs }">
      <div>
        <v-btn
          text
          class="px-0 text-capitalize"
          v-bind="attrs"
          v-on="on"
          height="48px"
          color="rgba(0,0,0,0.6)"
          min-width="100%"
          :disabled="getSelectedBuildingLength < 1"
        >
          <v-list-item-icon>
            <v-icon>mdi-delete</v-icon>
          </v-list-item-icon>
          <v-list-item-content> Permanently Delete </v-list-item-content>
        </v-btn>
      </div>
    </template>
    <v-card>
      <v-card-title class="text-h5"> Permanently Delete Building </v-card-title>
      <v-card-text
        ><p>
          You are about to PERMANENTLY delete 1 building. If any items in this
          building are assigned to a request approval, both items and requests
          will be deleted and CANNOT be recovered. Do you want to continue?
        </p>
        <p class="mb-0">
          If not, click "Redact" for a recoverable selection.
        </p></v-card-text
      >
      <v-card-actions>
        <v-spacer></v-spacer>

        <v-btn
          color="primary"
          outlined
          @click="dialogDelete = false"
          class="text-capitalize"
        >
          No, Cancel
        </v-btn>

        <v-btn
          color="primary"
          @click="handleRedacted()"
          class="text-capitalize"
        >
          Redact
        </v-btn>

        <v-btn color="error" @click="handleDelete()" class="text-capitalize">
          Yes, Permanently Delete
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import axios from "axios";
import { mapGetters, mapMutations, mapActions } from "vuex";

export default {
  data() {
    return {
      dialogDelete: false,
    };
  },

  inject: ["getSnackbar", "setSnackbar"],

  computed: {
    ...mapGetters(["getSelectedBuilding", "getSelectedBuildingLength"]),
  },

  methods: {
    ...mapMutations(["setSelectedBuilding", "setRefreshDataTable"]),
    ...mapActions([
      "fetchAPIBuildingsColumns",
      "fetchAPIBuildings",
      "fetchAPITableSettings",
    ]),
    async handleDelete() {
      const response = await axios.delete(
        "/api/buildings/bulk/",
        {
          data: { ids: this.getSelectedBuilding },
        },
        {
          headers: {
            "x-camelcase": 1,
          },
        }
      );

      this.setSnackbar(
        true,
        "Successful! Your buildings has been deleted.",
        "success",
        5000
      );
      this.setSelectedBuilding([]);
      this.fetchAPIBuildingsColumns();
      const query = this.$route.query;
      this.fetchAPIBuildings({
        page: query.page,
        page_size: query.pageSize,
        sortBy: query.sortBy,
        desc: query.desc,
        building_type: query.building_type,
      });
      this.fetchAPITableSettings();
      this.dialogDelete = false;
    },

    async handleRedacted() {
      const response = await axios.patch(
        "/api/buildings/bulk/",
        {
          change_note: null,
          ids: this.getSelectedBuilding,
          project_ids: "75ea5a2e-e123-40df-a8c4-bf65386dba16",
          state: "REDACTED",
        },
        {
          headers: {
            "x-camelcase": 1,
          },
        }
      );
      this.setSnackbar(
        true,
        "Successful! Your buildings has been redacted.",
        "success",
        5000
      );
      this.dialogDelete = false;
      this.setSelectedBuilding([]);
      this.fetchAPIBuildingsColumns();
      const query = this.$route.query;
      this.fetchAPIBuildings({
        page: query.page,
        page_size: query.pageSize,
        sortBy: query.sortBy,
        desc: query.desc,
        building_type: query.building_type,
      });
      this.fetchAPITableSettings();
    },
  },
};
</script>
