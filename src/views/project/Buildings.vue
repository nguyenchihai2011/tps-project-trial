<template>
  <v-container fluid>
    <!-- BuildingHeader -->
    <building-header />
    <!-- BuildingDataTable -->
    <v-card class="building__table">
      <building-data-table />
      <v-data-table
        :headers="usedColumns"
        :items="getBuildings"
        :items-per-page="itemsPerPage"
        :page="page"
        :server-items-length="getMetaBuildings.total_results"
        @pagination="handlePagination"
        show-select
        v-model="selectedBuilding"
        fixed-header
        :fixed-columns="2"
        class="custom-data-table resize-table"
        :footer-props="{
          'items-per-page-options': [5, 10, 25, 50],
        }"
        ref="dataTable"
      >
        <template
          v-for="(column, index) in usedColumns"
          v-slot:[`header.${column.value}`]="{ header }"
        >
          <span @click="handleSortBy(header)">
            {{ header.text }}
            <v-icon v-if="header.edit === 'true'">mdi-pencil</v-icon>
          </span>
          <div class="resize-handle" @mousedown="resizeMousedown"></div>
        </template>

        <template v-slot:item.ref_id="{ item }">
          <td>
            <v-edit-dialog
              :return-value="item.ref_id"
              @open="copyData(item)"
              @close="save(item)"
            >
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
            <v-edit-dialog
              :return-value="item.building_type"
              @open="copyData(item)"
              @close="save(item)"
            >
              {{ item.building_type }}
              <template v-slot:input>
                <v-select
                  v-model="selectedBuildingType"
                  :items="getBuildingTypes"
                  :menu-props="{ bottom: true, offsetY: true }"
                  label="Select a building type*"
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
import columns from "@/mixins/columns.js";

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
      ref_id: "",
      resizeInfo: {
        pageX: Number,
        curCol: null,
        curColWidth: Number,
      },
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

  mixins: [columns],

  computed: {
    ...mapGetters(["getBuildings", "getMetaBuildings", "getBuildingTypes"]),
  },

  watch: {
    selectedBuilding(newValue) {
      this.setSelectedBuilding(newValue.map((item) => item.id));
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
    ...mapActions(["fetchAPIBuildings", "fetchAPIBuildingsFull"]),
    ...mapMutations(["setSelectedBuilding"]),
    async getBuildingsColumns() {
      try {
        const response = await axios.get(
          "/api/org-members/63c7f081-ef87-4421-bc5e-ca4a9b891b6b/preferences/buildingsColumns/"
        );
        const data = response.data.value;

        this.filterColumns(data.table_settings[data.active_idx].columns);
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

    copyData(item) {
      this.ref_id = item.ref_id;
    },

    async save(item) {
      if (item.ref_id !== this.ref_id) {
        try {
          const response = await axios.patch(
            `/api/buildings/${item.id}`,
            { ref_id: item.ref_id },
            {
              headers: {
                "x-camelcase": 1,
              },
            }
          );
          this.selectedBuildingType = "";
          const query = this.$route.query;
          this.fetchAPIBuildings({
            page: query.page || 1,
            page_size: query.pageSize || 50,
            sortBy: query.sortBy || "name",
            desc: query.desc || false,
            building_type: query.building_type || "",
          });
        } catch (err) {
          console.log(err);
        }
      } else if (this.selectedBuildingType) {
        try {
          const response = await axios.patch(
            `/api/buildings/${item.id}`,
            { building_type: this.selectedBuildingType },
            {
              headers: {
                "x-camelcase": 1,
              },
            }
          );
          this.selectedBuildingType = "";
          const query = this.$route.query;
          this.fetchAPIBuildings({
            page: query.page || 1,
            page_size: query.pageSize || 50,
            sortBy: query.sortBy || "name",
            desc: query.desc || false,
            building_type: query.building_type || "",
          });
        } catch (err) {
          console.log(err);
        }
      }
    },

    handleSortBy(header) {
      const query = this.$route.query;
      let sortBy = "";
      let desc = "";

      if (query.desc == "" || query.desc == undefined) {
        sortBy = header.sortBy;
        desc = false;
      } else if (query.desc == "false") {
        sortBy = "-" + header.sortBy;
        desc = true;
      } else {
        sortBy = "";
        desc = "";
      }

      this.fetchAPIBuildings({
        page: query.page || 1,
        page_size: query.pageSize || 50,
        sortBy: sortBy,

        building_type: query.building_type || "",
      });
      this.$router.push({
        path: "/projects/75ea5a2e-e123-40df-a8c4-bf65386dba16/buildings",
        query: {
          page: query.page || 1,
          page_size: query.pageSize || 50,
          sortBy: sortBy,
          desc: desc,
          building_type: query.building_type || "",
        },
      });
    },

    setColumnWidths() {
      const table = document.querySelector(".resize-table");

      const headerCells = table.getElementsByTagName("th");

      this.columnWidths = Array.from(headerCells).map((cell) => {
        return cell.offsetWidth;
      });
    },

    resizeMousedown(e) {
      this.resizeInfo.curCol = e.target.parentElement;
      this.resizeInfo.pageX = e.pageX;

      this.resizeInfo.curColWidth = this.resizeInfo.curCol.offsetWidth;
    },

    resizeMousemove(e) {
      if (this.resizeInfo.curCol) {
        var diffX = e.pageX - this.resizeInfo.pageX;

        this.resizeInfo.curCol.style.minWidth =
          this.resizeInfo.curColWidth + diffX + "px";

        this.resizeInfo.curCol.style.width =
          this.resizeInfo.curColWidth + diffX + "px";
      }
    },

    async resizeMouseup(e) {
      if (!!this.resizeInfo.curCol) {
        var parent = this.resizeInfo.curCol.parentNode;
        var children = parent.children;

        // Tìm vị trí của phần tử con trong danh sách các phần tử con của cha
        var index = Array.prototype.indexOf.call(
          children,
          this.resizeInfo.curCol
        );

        console.log(index);

        try {
          const response = await axios.get(
            "/api/org-members/63c7f081-ef87-4421-bc5e-ca4a9b891b6b/preferences/buildingsColumns/"
          );
          const data = response.data.value;

          // data = data.table_settings[data.active_idx].column_sizes.splice(
          //   index,
          //   1,
          //   this.resizeInfo.curColWidth + 10
          // );

          console.log(data);

          // const res = await axios.put(
          //   "/api/org-members/63c7f081-ef87-4421-bc5e-ca4a9b891b6b/preferences/buildingsColumns/",
          //   { value: data }
          // );
        } catch (err) {
          console.log(err);
        }

        this.resizeInfo.curCol = undefined;
        this.resizeInfo.pageX = undefined;
        this.resizeInfo.curColWidth = undefined;
      }
    },
  },

  created() {
    const query = this.$route.query;
    this.fetchAPIBuildings({
      page: query.page || 1,
      page_size: query.pageSize || 50,
      sortBy: query.sortBy || "name",
      desc: query.desc,
      building_type: query.building_type || "",
    });

    this.getBuildingsColumns();
    this.fetchAPIBuildingsFull();
  },

  mounted() {
    const scrollArea = this.$refs.dataTable.$el.querySelector(
      ".v-data-table__wrapper"
    );
    scrollArea.addEventListener("scroll", this.handleScroll);
    document.addEventListener("mousemove", this.resizeMousemove);
    document.addEventListener("mouseup", this.resizeMouseup);
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

.header-row {
  display: flex;
  align-items: center;
}

.resize-handle {
  position: absolute;
  top: 0;
  right: -5px;
  width: 10px;
  height: 100%;
  cursor: col-resize;
}

.resize-handle:hover {
  background-color: #ddd;
}
</style>
