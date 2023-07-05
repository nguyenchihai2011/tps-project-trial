<template>
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
    class="resize-table"
    :footer-props="{
      'items-per-page-options': [5, 10, 25, 50],
      disablePagination: getLoading,
      disableItemsPerPage: getLoading,
    }"
    ref="dataTable"
  >
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
      <div class="resize-handle" @mousedown="handleResizeMousedown"></div>
    </template>

    <template
      v-for="(data, index) in usedColumns"
      v-slot:[`item.${data.value}`]="{ item }"
    >
      <td>
        <v-edit-dialog
          v-if="data.edit === 'true'"
          :return-value="item[data.value]"
          @open="handleCopyData(item)"
          @close="handleSaveData(item)"
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
                state: this.getShowStateBuilding,
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

    <template v-slot:item.name="{ item }">
      <td>
        <span>
          {{ item.name }}
        </span>
        <v-icon v-if="item.has_comments">mdi-message-reply-text</v-icon>
      </td>
    </template>
    <template v-slot:item.building_type="{ item }">
      <td>
        <v-edit-dialog
          :return-value="item.building_type"
          @open="handleCopyData(item)"
          @close="handleSaveData(item)"
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
            @click="handleScrollToTop()"
          >
            <v-icon left> mdi-chevron-up </v-icon> TO TOP OF TABLE
          </v-btn>
        </v-row>
        <v-row align="center">
          <div>
            <v-subheader style="font-size: 12px; color: rgba(0, 0, 0, 0.87)">
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
          >{{ (getMetaBuildings.page - 1) * getMetaBuildings.page_size + 1 }}-{{
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
</template>

<script>
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
    };
  },
  inject: ["getSnackbar", "setSnackbar"],

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
      "getSelectedSetting",
      "getColumnSizes",
      "getSelectedBuilding",
      "getSelectedBuildingLength",
      "getShowStateBuilding",
    ]),
  },

  watch: {
    selectedBuilding(newValue) {
      if (this.getSelectedBuildingLength === 0) {
        newValue.splice(0, newValue.length - 1);
      }
      this.setSelectedBuilding(newValue.map((item) => item.id));
      if (newValue.length === 0) {
        this.setComments([]);
      }
      if (newValue.length === 1) {
        this.fetchAPIComments({
          content_type: "building",
          object_id: this.getSelectedBuilding[0],
          page_size: 25,
          page: 1,
          fields:
            "id,created_by.email,created_by.first_name,created_by.last_name,text,modified_at,created_at,modified_by.user_id",
        });
      }
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
          state: this.getShowStateBuilding,
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
      "fetchAPITableSettings",
      "fetchAPIComments",
    ]),
    ...mapMutations(["setSelectedBuilding", "setComments"]),

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

    handleScrollToTop() {
      const dataTable = this.$refs.dataTable.$el.querySelector("thead");
      dataTable.scrollIntoView({ top: 0, behavior: "smooth" });
    },

    handleCopyData(item) {
      this.ref_id = item.ref_id;
    },

    async handleSaveData(item) {
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
            state: this.getShowStateBuilding,
          });
        } catch (err) {
          item.ref_id = "Error";
          this.setSnackbar(
            true,
            "Ensure this field has no more than 50 characters.",
            "rgb(184, 15, 0)",
            -1
          );
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
            state: this.getShowStateBuilding,
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
        state: this.getShowStateBuilding,
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

    handleResizeMousedown(e) {
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
      if (typeof this.resizeInfo.curCol !== "undefined") {
        const table = document.querySelector("table");
        const firstRow = table.rows[0];
        let column_sizes = [];
        for (var i = 0; i < firstRow.cells.length; i++) {
          column_sizes.push(firstRow.cells[i].offsetWidth);
        }
        const response = await axios.get(
          "/api/org-members/63c7f081-ef87-4421-bc5e-ca4a9b891b6b/preferences/buildingsColumns/"
        );
        const data = response.data.value;
        data.table_settings[data.active_idx].column_sizes = column_sizes;

        const res = await axios.put(
          "/api/org-members/63c7f081-ef87-4421-bc5e-ca4a9b891b6b/preferences/buildingsColumns/",
          { value: data }
        );
        console.log("mouseup!");

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
    await this.fetchAPITableSettings();
    const query = this.$route.query;
    this.fetchAPIBuildings({
      page: query.page,
      page_size: query.pageSize,
      sortBy: query.sortBy,
      desc: query.desc,
      building_type: query.building_type,
      state: this.getShowStateBuilding,
    });
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
    const table = document.querySelector("table");
    const firstRow = table.rows[0];

    for (var i = 2; i <= this.getSelectedSetting.fixed_number; i++) {
      let distanceLeft = 0;
      for (var j = 0; j < i - 1; j++) {
        distanceLeft += firstRow.cells[j].offsetWidth;
      }
      document.querySelector(
        `.resize-table th:nth-child(${i})`
      ).style.cssText = `position: sticky !important; width: ${
        firstRow.cells[i - 1].offsetWidth
      }px; min-width: ${
        firstRow.cells[i - 1].offsetWidth
      }px; left: ${distanceLeft}px; z-index: 4 !important; background-color: #fff; border: thin solid rgba(0, 0, 0, 0.12);`;
      const item_table = document.querySelectorAll(
        `.resize-table tbody tr > td:nth-child(${i})`
      );
      if (i === this.getSelectedSetting.fixed_number) {
        document
          .querySelector(`.resize-table th:nth-child(${i})`)
          .style.setProperty("border-right", "thin solid rgba(0, 0, 0, 0.6)");
      }

      item_table.forEach((element) => {
        element.style.cssText = `position: sticky !important; width: ${
          firstRow.cells[i - 1].offsetWidth
        }px; left: ${distanceLeft}px; z-index: 3 !important; background-color: #fff; border: thin solid rgba(0, 0, 0, 0.12);`;
      });
      if (i === this.getSelectedSetting.fixed_number) {
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
.v-data-table-header th.sortable.active {
  color: #017acd !important;
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

.resize-table .v-data-table-header > tr > th {
  text-align: center !important;
}

.resize-table .v-data-table__wrapper {
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
  right: 0px;
  width: 3px;
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
  left: 0px;
  width: auto;
  z-index: 4 !important;
  background-color: #fff;
  border-left: thin solid rgba(0, 0, 0, 0.12);
  text-align: center;
}

.v-data-table__checkbox.v-simple-checkbox {
  text-align: center;
}

.resize-table tbody tr > td:first-child {
  z-index: 3 !important;
}

.v-data-table__progress {
  position: sticky;
  z-index: 5;
}
</style>
