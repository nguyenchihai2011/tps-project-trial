<template>
  <v-container fluid data-app>
    <!-- BuildingHeader -->
    <building-header />
    <!-- BuildingDataTable -->
    <v-card class="building__table">
      <building-data-table />
      <v-data-table
        :headers="buildingsColumns"
        :items="buildings.buildings"
        :items-per-page="itemsPerPage"
        :page="selectedPage"
        @update:items-per-page="handleItemsPerPage"
        ref="dataTable"
        show-select
        fixed-header
        class="custom-data-table"
        :footer-props="{
          'items-per-page-options': [5, 10, 25, 50],
          pagination: {
            page: buildings.metaBuilding.page,
            itemsPerPage: buildings.metaBuilding.page_size,
            pageStart:
              (buildings.metaBuilding.page - 1) *
                buildings.metaBuilding.page_size +
              1,
            pageStop:
              buildings.metaBuilding.total_results >
              buildings.metaBuilding.page * buildings.metaBuilding.page_size
                ? buildings.metaBuilding.page * buildings.metaBuilding.page_size
                : buildings.metaBuilding.total_results,
            pageCount: buildings.metaBuilding.total_pages,
            itemsLength: buildings.metaBuilding.total_results,
          },
        }"
      >
        <template slot="footer.prepend">
          <v-btn
            color="primary"
            class="ma-2"
            @click="$vuetify.goTo($refs.dataTable)"
          >
            <v-icon left> mdi-chevron-up </v-icon> TO TOP OF TABLE
          </v-btn>
        </template>
        <template slot="footer.page-text">
          <v-row>
            <v-row align="center">
              <div>
                <v-subheader
                  style="font-size: 12px; color: rgba(0, 0, 0, 0.87)"
                >
                  Go to page
                </v-subheader>
              </div>

              <div>
                <v-select
                  v-model="selectedPage"
                  :items="
                    Array.from(
                      { length: buildings.metaBuilding.total_pages },
                      (_, i) => i + 1
                    )
                  "
                  item-text="key"
                  item-value="value"
                  label="Select"
                  single-line
                  hide-details
                  class="pt-0 mt-0"
                  :style="{
                    fontSize: 12 + 'px',
                    color: 'rgba(0, 0, 0, 0.87)',
                    width: 46 + 'px',
                  }"
                ></v-select>
              </div>
            </v-row>
            <v-row align="center" class="ml-14 mr-8"
              >{{
                (buildings.metaBuilding.page - 1) *
                  buildings.metaBuilding.page_size +
                1
              }}-{{
                buildings.metaBuilding.total_results >
                buildings.metaBuilding.page * buildings.metaBuilding.page_size
                  ? buildings.metaBuilding.page *
                    buildings.metaBuilding.page_size
                  : buildings.metaBuilding.total_results
              }}
              of {{ buildings.metaBuilding.total_results }}
            </v-row>
          </v-row>
        </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>

<script>
import BuildingHeader from "@/components/project/building/BuildingHeader.vue";
import BuildingDataTable from "@/components/project/building/BuildingDataTable.vue";
import { mapActions, mapState } from "vuex";
import axios from "axios";
import buildings from "@/store/modules/buildings";

export default {
  data() {
    return {
      selected: [],
      buildingsColumns: [],
      selectedPage: 1,
      itemsPerPage: 50,
      pages: [],
    };
  },
  components: {
    BuildingHeader,
    BuildingDataTable,
  },

  computed: {
    ...mapState(["buildings"]),
  },

  watch: {
    async selectedPage() {
      try {
        // const response = await axios.get("/api/buildings/", {
        //   params: {
        //     page_size: buildings.state.metaBuilding.page_size,
        //     page: this.selectedPage,
        //     sort: "name",
        //     project: "75ea5a2e-e123-40df-a8c4-bf65386dba16",
        //     state: ["ACTIVE", "INACTIVE", "REDACTED"],
        //   },
        // });

        //Mockoon
        const response = await axios.get(
          `/api/buildings/pagesize${buildings.state.metaBuilding.page_size}/page${this.selectedPage}`
        );
        const data = response.data.results.map((item) => {
          return { ...item, building_type: item.building_type?.option_name };
        });

        this.$store.commit("setBuildings", data);
        this.$store.commit("setMetaBuilding", response.data.meta);
      } catch (error) {
        console.log(error);
      }
    },
  },

  methods: {
    ...mapActions(["fetchAPIBuildings"]),

    async getBuildingsColumns() {
      try {
        const response = await axios.get(
          "/api/org-members/63c7f081-ef87-4421-bc5e-ca4a9b891b6b/preferences/buildingsColumns/"
        );
        const data = response.data.value;
        this.buildingsColumns = data.table_settings[
          data.active_idx
        ].columns.map((item, index) => {
          return {
            text: item,
            value: item,
            divider: true,
            class: item,
            resizable: true,
          };
        });
      } catch (err) {
        console.log(err);
      }
    },
    async handleItemsPerPage(value) {
      try {
        // const response = await axios.get("/api/buildings/", {
        //   params: {
        //     page_size: value,
        //     page: 1,
        //     sort: "name",
        //     project: "75ea5a2e-e123-40df-a8c4-bf65386dba16",
        //     state: ["ACTIVE", "INACTIVE", "REDACTED"],
        //   },
        // });

        //Mockoon
        const response = await axios.get(
          `/api/buildings/pagesize${value}/page1`
        );
        const data = response.data.results.map((item) => {
          return { ...item, building_type: item.building_type?.option_name };
        });
        this.selectedPage = 1;

        this.$store.commit("setBuildings", data);
        this.$store.commit("setMetaBuilding", response.data.meta);
      } catch (error) {
        console.log(error);
      }
    },
  },

  created() {
    this.fetchAPIBuildings();
    this.getBuildingsColumns();
  },
};
</script>

<style>
.building__table {
  padding: 4px 16px 16px;
}
.building__table__header {
  display: flex;
  padding: 8px;
  border: thin solid rgba(0, 0, 0, 0.12);
  background-color: #e3e3e3;
}

.building__button {
  align-self: center;
  width: 40px !important;
  height: 40px !important;
}
.building__icon--bold {
  color: rgba(0, 0, 0, 0.87);
}

.custom-data-table .v-data-table-header > tr > th {
  text-align: center !important;
}

.custom-data-table .v-data-table__wrapper {
  max-height: 400px;
  overflow: auto;
}
</style>
