<template>
  <dialog-component :icon="icon" :tooltip="tooltip">
    <template slot="content">
      <v-divider></v-divider>
      <v-container class="table-settings-content">
        <v-row>
          <b>
            <p v-if="!isCreate" class="mt-4">Setting</p>
            <p v-else class="mt-4">Create New Setting</p>
          </b>
        </v-row>
        <v-row align="center">
          <v-col sm="8" class="pa-0">
            <v-autocomplete
              v-if="!isCreate"
              v-model="tableSetting"
              :items="getSettings"
              label="Setting Name"
              :menu-props="{ offsetY: true }"
              item-text="name"
              item-value="id"
              return-object
              @blur="saveAsNew()"
            >
              <template v-slot:item="{ item }">
                <div>{{ item.name }}</div>
                <v-spacer></v-spacer>
                <div v-if="item.name !== 'Default'">
                  <DialogRemoveSetting
                    :tableSettings="tableSettings"
                  ></DialogRemoveSetting>
                </div>
              </template>
            </v-autocomplete>

            <v-text-field
              v-else
              v-model="tableSetting.name"
              label="Setting Name"
            ></v-text-field>
          </v-col>
          <v-col sm="4" class="pr-0">
            <v-btn
              v-if="!isCreate"
              color="primary"
              min-width="100%"
              class="text-capitalize"
              @click="openCreateSetting()"
            >
              <v-icon left> mdi-plus </v-icon>
              Add New
            </v-btn>
            <v-btn
              v-else
              color="primary"
              min-width="100%"
              outlined
              class="text-capitalize"
              @click="cancelCreate()"
            >
              Cancel
            </v-btn>
          </v-col>
        </v-row>
        <v-row>
          <b><p class="mt-4">Visibility</p></b>
        </v-row>
        <div>
          <v-checkbox
            v-model="tableSetting.show_redacted_state"
            :label="`Show Redacted Buildings`"
            hide-details
            class="mt-3"
          ></v-checkbox>
          <v-checkbox
            v-model="tableSetting.show_inactive_state"
            :label="`Show Inactived Buildings`"
            hide-details
            class="mt-3"
          ></v-checkbox>
        </div>
        <v-row>
          <v-col sm="8">
            <v-select
              v-model="tableSetting.fixed_number"
              :items="[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]"
              label="Freeze Lefthand Columns"
              class="mt-8"
            ></v-select>
          </v-col>
        </v-row>
        <v-row>
          <b><p>Columns</p></b>
        </v-row>
        <v-row>
          <p style="font-size: 14px">
            Choose which columns to display, and define their order.
          </p>
        </v-row>
        <v-row class="columns-content">
          <v-col sm="6" style="padding: 12px 0px">
            <b><span style="font-size: 14px">Available Columns</span></b>
            <p style="font-size: 14px">Select columns to add</p>

            <v-text-field
              v-model="search"
              prepend-inner-icon="mdi-magnify"
              label="Search result..."
              class="building__header__search align-center mr-3"
              height="42px"
              hide-details
              dense
              solo
              clearable
            >
            </v-text-field>
            <v-checkbox
              class="ml-2 checkbox-all"
              label="Select All"
              hide-details
              color="primary"
              v-model="selectAll"
              :indeterminate="!selectAll && tableSetting.columns.length > 0"
            ></v-checkbox>
            <v-checkbox
              class="ml-2"
              v-for="column in columns"
              v-model="tableSetting.columns"
              :value="column.value"
              :key="column.value"
              :label="column.text"
              hide-details
            ></v-checkbox>
          </v-col>
          <v-col
            sm="6"
            class="py-3 px-4"
            style="border-left: 2px solid #8080805c"
            ><b><span style="font-size: 14px">Selected Columns</span></b>
            <p style="font-size: 14px">Drag and drop to reorder</p>

            <draggable v-model="tableSetting.columns">
              <v-list-item v-for="(item, i) in textColumns" :key="i">
                <v-list-item-icon>
                  <v-icon>mdi-drag-horizontal-variant</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>{{ item.text }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </draggable>
          </v-col>
        </v-row>
      </v-container>
    </template>

    <template>
      <v-container class="px-0">
        <v-row v-if="!isCreate">
          <v-col lg="6" class="pr-1">
            <v-btn
              color="primary"
              min-width="100%"
              outlined
              :disabled="isSaveAsNew"
              class="text-capitalize"
            >
              Save as New
            </v-btn>
          </v-col>
          <v-col lg="6" class="pl-1">
            <v-btn
              v-if="!isUpdate"
              color="primary"
              min-width="100%"
              class="text-capitalize"
              @click="saveAndApply()"
            >
              Save and Apply
            </v-btn>
            <v-btn
              v-else
              color="primary"
              min-width="100%"
              class="text-capitalize"
              @click="updateSetting()"
            >
              Update Setting
            </v-btn>
          </v-col>
        </v-row>
        <v-row v-else>
          <v-col lg="6" class="pr-1">
            <v-btn
              color="primary"
              min-width="100%"
              outlined
              class="text-capitalize"
              @click="createSetting()"
            >
              Create
            </v-btn>
          </v-col>
          <v-col lg="6" class="pl-1">
            <v-btn
              color="primary"
              min-width="100%"
              class="text-capitalize"
              @click="createApplySetting()"
            >
              Create and Apply
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </template>
  </dialog-component>
</template>

<script>
import DialogComponent from "./DialogComponent.vue";
import DialogRemoveSetting from "@/components/dialogs/DialogRemoveSetting.vue";
import PrimaryButton from "@/components/buttons/PrimaryButton.vue";
import draggable from "vuedraggable";
import columns from "@/mixins/columns";
import { mapActions, mapGetters } from "vuex";
import axios from "axios";
export default {
  data() {
    return {
      tableSettings: [],
      tableSetting: {
        id: 0,
        columns: [
          "name",
          "ref_id",
          "full_address",
          "building_type",
          "skup_total",
          "state",
        ],
        fixed_number: 2,
        is_in_use: false,
        name: "Default",
        show_inactive_state: false,
        show_redacted_state: false,
      },
      isCreate: false,
      isUpdate: false,
      isSaveAsNew: true,
      search: "",

      selectedColumns: [],
      selectAll: false,
    };
  },
  props: {
    icon: {
      type: String,
      required: true,
    },
    tooltip: {
      type: String,
      required: true,
    },
  },
  components: {
    DialogRemoveSetting,
    DialogComponent,
    PrimaryButton,
    draggable,
  },

  mixins: [columns],

  watch: {
    selectAll(newValue) {
      if (newValue) {
        this.selectedColumns = this.columns;
      } else {
        this.selectedColumns = [];
      }
    },
    selectedColumns(newValue) {
      if (newValue.length === this.columns.length) {
        this.selectAll = true;
      }
    },
    // tableSetting: {
    //   handler(newValue) {
    //     if (newValue.id === oldValue.id) {
    //       const objSettingCpn = JSON.stringify(this.tableSetting);
    //       const objSettingStore = JSON.stringify(this.getSelectedSetting);
    //       if (objSettingCpn === objSettingStore) {
    //         this.isUpdate = false;
    //       } else {
    //         this.isUpdate = true;
    //       }
    //     }
    //   },
    //   deep: true,
    // },
  },

  computed: {
    ...mapGetters([
      "getTableSettings",
      "getColumns",
      "getSettings",
      "getSettingsCopy",
      "getSelectedSetting",
    ]),

    textColumns() {
      return this.tableSetting.columns.map((value) =>
        this.columns.find((column) => column.value === value)
      );
    },
  },

  methods: {
    ...mapActions(["fetchAPITableSettings", "fetchAPIBuildings"]),
    saveAsNew() {
      this.isSaveAsNew = false;
    },
    openCreateSetting() {
      this.isCreate = true;
      this.tableSetting = {
        columns: [
          "name",
          "ref_id",
          "full_address",
          "building_type",
          "skup_total",
          "state",
        ],
        fixed_number: 2,
        is_in_use: false,
        name: "",
        show_inactive_state: false,
        show_redacted_state: false,
      };
    },

    async chooseSetting(idx) {
      try {
        const response = await axios.put(
          "/api/org-members/63c7f081-ef87-4421-bc5e-ca4a9b891b6b/preferences/buildingsColumns/",
          {
            value: {
              active_idx: idx,
              table_settings: [
                ...this.getTableSettings.table_settings,
                this.tableSetting,
              ],
            },
          }
        );
      } catch (err) {
        console.log(err);
      }
    },

    saveAndApply() {
      this.chooseSetting(this.tableSetting.id - 1);
    },
    async createSetting() {
      try {
        const response = await axios.put(
          "/api/org-members/63c7f081-ef87-4421-bc5e-ca4a9b891b6b/preferences/buildingsColumns/",
          {
            value: {
              active_idx: 0,
              table_settings: [
                ...this.getTableSettings.table_settings,
                this.tableSetting,
              ],
            },
          }
        );
      } catch (err) {
        console.log(err);
      }
    },

    createApplySetting() {
      this.createSetting();
      this.chooseSetting(this.getTableSettings.table_settings.length);
      const query = this.$route.query;
      this.fetchAPIBuildings({
        page: query.page,
        page_size: query.pageSize,
        sortBy: query.sortBy,
        desc: query.desc,
        building_type: query.building_type,
      });
    },

    async updateSetting() {
      let tableSettingArr = this.getTableSettings.table_settings;
      tableSettingArr.splice(
        this.tableSetting.id - 1,
        this.tableSetting.id,
        this.tableSetting
      );
      try {
        const response = await axios.put(
          "/api/org-members/63c7f081-ef87-4421-bc5e-ca4a9b891b6b/preferences/buildingsColumns/",
          {
            value: {
              active_idx: this.tableSetting.id - 1,
              table_settings: tableSettingArr,
            },
          }
        );
      } catch (err) {
        console.log(err);
      }
    },
    cancelCreate() {
      this.isCreate = false;
      this.tableSetting = { ...this.getSelectedSetting };
    },
  },

  async created() {
    await this.fetchAPITableSettings();
    this.tableSetting = { ...this.getSelectedSetting };
    this.tableSettings = { ...this.getSettings };
  },

  updated() {
    const objSettingCpn = JSON.stringify(this.tableSetting);
    const objSettingStore = JSON.stringify(
      this.getSettingsCopy[this.tableSetting.id]
    );
    if (objSettingCpn === objSettingStore) {
      this.isUpdate = false;
    } else {
      this.isUpdate = true;
    }
  },
};
</script>

<style>
.columns-content {
  border-top: 2px solid #8080805c;
}

.table-settings-content {
  height: calc(100vh - 110px);
  overflow-y: auto;
  overflow-x: hidden;
}
</style>
