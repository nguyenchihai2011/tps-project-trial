<template>
  <v-container fluid>
    <!-- BuildingHeader -->
    <building-header />
    <!-- BuildingDataTable -->
    <v-card class="building__table">
      <building-data-table />
      <v-data-table
        :headers="buildingsColumns"
        :items="getBuildings"
        :items-per-page="itemsPerPage"
        :page="page"
        :server-items-length="getMetaBuildings.total_results"
        @pagination="handlePagination"
        show-select
        v-model="selectedBuilding"
        fixed-header
        class="custom-data-table"
        :footer-props="{
          'items-per-page-options': [5, 10, 25, 50],
        }"
        ref="dataTable"
      >
        <template v-slot:header="{ buildingsColumns }">
          <thead>
            <tr>
              <!-- Custom header cell -->
              <th v-for="header in buildingsColumns" :key="header.text">
                <span class="custom-header">
                  {{ header.text }}
                </span>
              </th>
            </tr>
          </thead>
        </template>
        <template v-slot:header.ref_id="{ header }">
          <span>{{ header.value }} <v-icon>mdi-pencil</v-icon></span>
        </template>
        <template v-slot:header.building_type="{ header }">
          <span>{{ header.value }} <v-icon>mdi-pencil</v-icon></span>
        </template>
        <template v-slot:item.ref_id="{ item }">
          <td>
            <v-edit-dialog :return-value.sync="item.ref_id" large>
              {{ item.ref_id || "___" }}
              <template v-slot:input>
                <v-text-field
                  v-model="item.ref_id"
                  label="Building ID"
                ></v-text-field>
              </template>
            </v-edit-dialog>
          </td>
        </template>
        <template v-slot:item.building_type="{ item }">
          <td>
            <v-edit-dialog :return-value.sync="item.building_type" large>
              {{ item.building_type }}
              <template v-slot:input>
                <v-select
                  v-model="selectedBuildingType"
                  :items="getBuildingTypes"
                  :menu-props="{ bottom: true, offsetY: true }"
                  label="Select a building type*"
                  chips
                  small-chips
                  clearable
                >
                </v-select>
              </template>
            </v-edit-dialog>
          </td>
        </template>
        <template v-slot:item.state="{ item }">
          <td>
            <v-chip
              class="ma-2"
              :color="
                item.state !== 'ACTIVE'
                  ? item.state === 'INACTIVE'
                    ? 'yellow'
                    : 'grey'
                  : 'green'
              "
              text-color="white"
            >
              {{ item.state | capitalize }}
            </v-chip>
          </td>
        </template>
        <template slot="footer.page-text">
          <v-row>
            <v-row align="center" class="to-top-of-table">
              <v-btn
                v-show="scrollShow"
                color="primary"
                text
                class="ma-2"
                @click="scrollToTop()"
              >
                <v-icon left> mdi-chevron-up </v-icon> TO TOP OF TABLE
              </v-btn>
            </v-row>
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
                  v-model="page"
                  :items="
                    Array.from(
                      { length: getMetaBuildings.total_pages },
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
                (getMetaBuildings.page - 1) * getMetaBuildings.page_size + 1
              }}-{{
                getMetaBuildings.total_results >
                getMetaBuildings.page * getMetaBuildings.page_size
                  ? getMetaBuildings.page * getMetaBuildings.page_size
                  : getMetaBuildings.total_results
              }}
              of {{ getMetaBuildings.total_results }}
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
import { mapActions, mapGetters, mapMutations } from "vuex";
import axios from "axios";

export default {
  data() {
    return {
      buildingsColumns: [],
      page: +this.$route.query.page || 1,
      itemsPerPage: +this.$route.query.pageSize || 50,
      pages: [],
      selectedBuilding: [],
      scrollShow: false,
      selectedBuildingType: "",
    };
  },
  components: {
    BuildingHeader,
    BuildingDataTable,
  },

  filters: {
    capitalize: function (value) {
      if (!value) return "";
      value = value.toString();
      return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
    },
  },

  computed: {
    ...mapGetters(["getBuildings", "getMetaBuildings", "getBuildingTypes"]),
  },

  watch: {
    selectedBuilding(newValue) {
      this.setSelectedBuilding(newValue);
    },
    page(newValue) {
      this.fetchAPIBuildings({
        page: newValue,
        page_size: this.itemsPerPage,
        sortBy: "name",
        desc: false,
        building_type: this.$route.query?.building_type,
      });
      this.$router.push({
        path: "/projects/75ea5a2e-e123-40df-a8c4-bf65386dba16/buildings",
        query: {
          page: newValue,
          pageSize: this.itemsPerPage,
          sortBy: "name",
          desc: false,
          building_type: this.$route.query?.building_type,
        },
      });
    },
    itemsPerPage(newValue) {
      this.fetchAPIBuildings({
        page: this.page,
        page_size: newValue,
        sortBy: "name",
        desc: false,
        building_type: this.$route.query?.building_type,
      });
      this.$router.push({
        path: "/projects/75ea5a2e-e123-40df-a8c4-bf65386dba16/buildings",
        query: {
          page: this.page,
          pageSize: newValue,
          sortBy: "name",
          desc: false,
          building_type: this.$route.query?.building_type,
        },
      });
    },
  },

  methods: {
    ...mapActions(["fetchAPIBuildings"]),
    ...mapMutations(["setSelectedBuilding"]),
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
    async handlePagination(pagination) {
      try {
        this.page = pagination.page;
        this.itemsPerPage = pagination.itemsPerPage;
      } catch (error) {
        console.log(error);
      }
    },

    handleScroll(event) {
      if (event.target.scrollTop) {
        this.scrollShow = true;
      } else {
        this.scrollShow = false;
      }
    },

    scrollToTop() {
      const dataTable = this.$refs.dataTable.$el.querySelector("thead");
      dataTable.scrollIntoView({ top: 0, behavior: "smooth" });
    },
  },

  created() {
    const query = this.$route.query;
    this.fetchAPIBuildings({
      page: query.page || 1,
      page_size: query.pageSize || 50,
      sortBy: query.sortBy || "name",
      desc: query.desc || false,
      building_type: query.building_type || "",
    });

    this.getBuildingsColumns();
  },

  mounted() {
    const scrollArea = this.$refs.dataTable.$el.querySelector(
      ".v-data-table__wrapper"
    );
    scrollArea.addEventListener("scroll", this.handleScroll);
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

.to-top-of-table {
  position: absolute;
  left: -390px;
}

.v-data-footer__pagination {
  position: relative;
}
</style>
