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
        :items-per-page="pagination.itemsPerPage"
        :page="pagination.page"
        :server-items-length="getMetaBuildings.total_results"
        @pagination="handlePagination"
        show-select
        v-model="selectedBuilding"
        fixed-header
        :loading="getLoading"
        class="custom-data-table resize-table"
        :footer-props="{
          'items-per-page-options': [5, 10, 25, 50],
          disablePagination: getLoading,
          disableItemsPerPage: getLoading,
        }"
        ref="dataTable"
      >
        <!-- Custom header -->

        <template
          v-for="(column, index) in usedColumns"
          v-slot:[`header.${column.value}`]="{ header }"
        >
          <span @click="handleSortBy(header)">
            {{ header.text }}
            <v-icon style="font-size: 16px" v-if="header.edit === 'true'"
              >mdi-pencil</v-icon
            >
          </span>
          <div class="resize-handle" @mousedown="resizeMousedown"></div>
        </template>

        <!-- Custom item -->
        <template
          v-for="(data, index) in usedColumns"
          v-slot:[`item.${data.value}`]="{ item }"
        >
          <td>
            <v-edit-dialog
              v-if="data.edit === 'true'"
              :return-value="item[data.value]"
              @open="copyData(item)"
              @close="save(item)"
            >
              <span v-if="item[data.value] != 'Error'">
                {{ item[data.value] || "——" }}
              </span>
              <span
                v-else
                style="color: red"
                @click.stop="
                  fetchAPIBuildings({
                    page: $route.query.page,
                    page_size: $route.query.pageSize,
                    sortBy: $route.query.sortBy,
                    desc: $route.query.desc,
                    building_type: $route.query.building_type,
                  })
                "
              >
                <div>Error</div>
                <div>Click to refresh</div>
              </span>

              <template v-slot:input>
                <v-text-field
                  v-model="item[data.value]"
                  label="Building ID"
                ></v-text-field>
              </template>
            </v-edit-dialog>

            <span v-else> {{ item[data.value] }} </span>
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
                    ? 'grey'
                    : 'yellow'
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
                  v-model="pagination.page"
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
                  :disabled="getLoading"
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
      <v-snackbar v-model="snackbar" timeout="-1" color="rgb(184, 15, 0)">
        Ensure this field has no more than 50 characters.

        <template v-slot:action="{ attrs }">
          <v-btn text v-bind="attrs" @click="snackbar = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </template>
      </v-snackbar>
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
      pagination: {
        page: +this.$route.query.page || 1,
        itemsPerPage: +this.$route.query.pageSize || 50,
      },
      selectedBuilding: [],
      scrollShow: false,
      selectedBuildingType: "",
      ref_id: "",
      resizeInfo: {
        pageX: Number,
        curCol: null,
        curColWidth: Number,
        diffX: Number,
      },
      snackbar: false,
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
    ...mapGetters([
      "getBuildingsColumns",
      "getBuildings",
      "getMetaBuildings",
      "getBuildingTypes",
      "getLoading",
      "getFixedColumns",
      "getColumnSizes",
    ]),
  },

  watch: {
    selectedBuilding(newValue) {
      this.setSelectedBuilding(newValue.map((item) => item.id));
    },

    pagination: {
      deep: true,
      handler: function (newValue) {
        this.fetchAPIBuildings({
          page: newValue.page,
          page_size: newValue.itemsPerPage,
          sortBy: this.$route.query.sortBy,
          desc: this.$route.query.desc,
          building_type: this.$route.query.building_type,
        });

        this.$router.push({
          path: "/projects/75ea5a2e-e123-40df-a8c4-bf65386dba16/buildings",
          query: {
            page: newValue.page,
            pageSize: newValue.itemsPerPage,
            sortBy: this.$route.query.sortBy,
            desc: this.$route.query.desc,
            building_type: this.$route.query.building_type,
          },
        });
      },
    },

    getBuildingsColumns(newValue) {
      this.mapingColumns();
    },
  },

  methods: {
    ...mapActions([
      "fetchAPIBuildingsColumns",
      "fetchAPIBuildings",
      "fetchAPIBuildingsFull",
      "fetchAPITableSettings",
    ]),
    ...mapMutations(["setSelectedBuilding"]),

    mapingColumns() {
      let columns = this.getBuildingsColumns;
      if (columns.active_idx !== -1) {
        this.filterColumns(columns.table_settings[columns.active_idx]);
      } else {
        this.filterColumns({
          columns: [
            "ref_id",
            "name",
            "skup_total",
            "building_type",
            "full_address",
            "state",
          ],
          fixed_number: 2,
          is_in_use: false,
          name: "Default",
          show_inactive_state: false,
          show_redacted_state: false,
        });
      }
    },
    async handlePagination(pagination) {
      try {
        this.pagination.page = pagination.page;
        this.pagination.itemsPerPage = pagination.itemsPerPage;
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
            page: query.page,
            page_size: query.pageSize,
            sortBy: query.sortBy,
            desc: query.desc,
            building_type: query.building_type,
          });
        } catch (err) {
          console.log(err);
          // item.ref_id = "Error\nClick to refresh";
          item.ref_id = "Error";
          this.snackbar = true;
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
      if (this.$route.query.sortBy !== header.sortBy) {
        this.sortBy = header.sortBy;
        this.sortDesc = false;
      } else {
        if (this.$route.query.desc == "false") {
          this.sortDesc = true;
          this.sortBy = "-" + header.sortBy;
        } else if (this.$route.query.desc == "true") {
          this.sortDesc = "";
          this.sortBy = "";
        } else {
          this.sortDesc = false;
          this.sortBy = header.sortBy;
        }
      }

      const query = this.$route.query;

      this.fetchAPIBuildings({
        page: query.page,
        page_size: this.pagination.itemsPerPage,
        sortBy: this.sortBy,
        building_type: query.building_type,
      });
      this.$router.push({
        path: "/projects/75ea5a2e-e123-40df-a8c4-bf65386dba16/buildings",
        query: {
          page: query.page,
          page_size: this.pagination.itemsPerPage,
          sortBy: this.sortBy.replace(/-/g, ""),
          desc: this.sortDesc,
          building_type: query.building_type,
        },
      });
    },

    resizeMousedown(e) {
      this.resizeInfo.curCol = e.target.parentElement;
      this.resizeInfo.pageX = e.pageX;

      this.resizeInfo.curColWidth = this.resizeInfo.curCol.offsetWidth;
    },

    resizeMousemove(e) {
      if (this.resizeInfo.curCol) {
        this.resizeInfo.diffX = e.pageX - this.resizeInfo.pageX;

        this.resizeInfo.curCol.style.minWidth =
          this.resizeInfo.curColWidth + this.resizeInfo.diffX + "px";

        this.resizeInfo.curCol.style.width =
          this.resizeInfo.curColWidth + this.resizeInfo.diffX + "px";
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

        try {
          const response = await axios.get(
            "/api/org-members/63c7f081-ef87-4421-bc5e-ca4a9b891b6b/preferences/buildingsColumns/"
          );
          const data = response.data.value;

          let table_settings__column_sizes =
            data.table_settings[data.active_idx].column_sizes;
          table_settings__column_sizes.splice(
            index,
            1,
            this.resizeInfo.curColWidth + this.resizeInfo.diffX
          );

          let table_setting = {
            ...data.table_settings[data.active_idx],
            column_sizes: table_settings__column_sizes,
          };

          let table_settings = data.table_settings;
          table_settings.splice(data.active_idx, 1, table_setting);

          const res = await axios.put(
            "/api/org-members/63c7f081-ef87-4421-bc5e-ca4a9b891b6b/preferences/buildingsColumns/",
            { value: { ...data, table_settings: table_settings } }
          );
        } catch (err) {
          console.log(err);
        }

        this.resizeInfo.curCol = undefined;
        this.resizeInfo.pageX = undefined;
        this.resizeInfo.curColWidth = undefined;
        this.resizeInfo.diffX = undefined;
      }
    },
  },

  async created() {
    await this.fetchAPIBuildingsColumns();
    this.mapingColumns();
    const query = this.$route.query;
    this.fetchAPIBuildings({
      page: query.page,
      page_size: query.pageSize,
      sortBy: query.sortBy,
      desc: query.desc,
      building_type: query.building_type,
    });
    // this.columnsUsed();
    this.fetchAPIBuildingsFull();
    this.fetchAPITableSettings();
  },

  mounted() {
    const scrollArea = this.$refs.dataTable.$el.querySelector(
      ".v-data-table__wrapper"
    );

    scrollArea.addEventListener("scroll", this.handleScroll);

    document.addEventListener("mousemove", this.resizeMousemove);
    document.addEventListener("mouseup", this.resizeMouseup);
  },

  updated() {
    for (var i = 2; i <= this.getFixedColumns; i++) {
      //Mảng chiều rộng của các cột trước i;
      const arrLeft = this.getColumnSizes.slice(0, i - 1);

      //Tổng giá trị chiều rộng của các cột trước i
      const totalLeft = arrLeft.reduce((total, cur) => total + cur, 0);

      //DOM element là header cột thứ i
      document.querySelector(
        `.resize-table th:nth-child(${i})`
      ).style.cssText = `position: sticky !important; width: ${
        this.getColumnSizes[i - 1]
      }px; min-width: ${
        this.getColumnSizes[i - 1]
      }px; left: ${totalLeft}px; z-index: 4 !important; background-color: #fff; border: thin solid rgba(0, 0, 0, 0.12);`;
      const item_table = document.querySelectorAll(
        `.resize-table tbody tr > td:nth-child(${i})`
      );

      if (i === this.getFixedColumns) {
        document
          .querySelector(`.resize-table th:nth-child(${i})`)
          .style.setProperty("border-right", "thin solid rgba(0, 0, 0, 0.6)");
      }

      //DOM element là items cột thứ i
      item_table.forEach((element) => {
        element.style.cssText = `position: sticky !important; width: ${
          this.getColumnSizes[i - 1]
        }px; min-width: ${
          this.getColumnSizes[i - 1]
        }px; left: ${totalLeft}px; z-index: 3 !important; background-color: #fff; border: thin solid rgba(0, 0, 0, 0.12);`;
      });

      if (i === this.getFixedColumns) {
        item_table.forEach((element) => {
          element.style.setProperty(
            "border-right",
            "thin solid rgba(0, 0, 0, 0.6)"
          );
        });
      }
    }
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
  width: 100%;
  overflow: auto;
  position: relative;
  white-space: nowrap;
  border-collapse: collapse;
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
  right: -3px;
  width: 6px;
  height: 100%;
  cursor: col-resize;
}

.resize-handle:hover {
  background-color: #ddd;
}

.freeze-column {
}

.resize-table th:first-child,
.resize-table tbody tr > td:first-child {
  position: sticky !important;
  width: 58px;
  min-width: 58px;
  max-width: 58px;
  left: 0px;
  z-index: 4 !important;
  background-color: #fff;
  border-left: thin solid rgba(0, 0, 0, 0.12);
}

.resize-table tbody tr > td:first-child {
  z-index: 3 !important;
}

.v-data-table__progress {
  position: sticky;
  z-index: 5;
}

.v-snack__wrapper {
  bottom: 50px;
}
</style>
