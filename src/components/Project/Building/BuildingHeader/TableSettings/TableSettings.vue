<template>
  <dialog-button :icon="icon" :tooltip="tooltip">
    <template v-slot:content="{ onClose }">
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
            <v-combobox
              v-if="!isCreate"
              v-model="tableSetting"
              :items="s_settings"
              label="Setting Name"
              :menu-props="{ offsetY: true }"
              item-text="name"
              item-value="id"
              return-object
              @change="handleChange"
            >
              <template v-slot:item="{ item }">
                <div>{{ item.name }}</div>
                <v-spacer></v-spacer>
                <div v-if="item.name !== 'Default'">
                  <DialogRemoveSetting
                    :tableSettingProp="item"
                    :onClose="onClose"
                  >
                  </DialogRemoveSetting>
                </div>
              </template>
            </v-combobox>

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
            :disabled="isDisabled"
          ></v-checkbox>
          <v-checkbox
            v-model="tableSetting.show_inactive_state"
            :label="`Show Inactived Buildings`"
            hide-details
            class="mt-3"
            :disabled="isDisabled"
          ></v-checkbox>
        </div>
        <v-row>
          <v-col sm="8">
            <v-select
              v-model="tableSetting.fixed_number"
              :items="[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]"
              label="Freeze Lefthand Columns"
              class="mt-8"
              :disabled="isDisabled"
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
              v-model="selectedAll"
              :indeterminate="!selectedAll && tableSetting?.columns?.length > 0"
              :disabled="isDisabled"
              @change="handleSelectedAll()"
            ></v-checkbox>

            <v-checkbox
              class="ml-2"
              v-for="column in columns"
              v-model="tableSetting.columns"
              :value="column.value"
              :key="column.value"
              :label="column.text"
              hide-details
              :disabled="isDisabled"
            ></v-checkbox>
          </v-col>
          <v-col
            sm="6"
            class="py-3 px-4"
            style="border-left: 2px solid #8080805c"
            ><b><span style="font-size: 14px">Selected Columns</span></b>
            <p style="font-size: 14px">Drag and drop to reorder</p>

            <draggable
              v-model="tableSetting.columns"
              :disabled="isDisabled"
              :class="{ 'disabled-vuedragable': isDisabled }"
            >
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

    <template v-slot:default="{ onClose }">
      <v-container class="px-0">
        <v-row v-if="!isCreate">
          <v-col lg="6" class="pr-1">
            <v-btn
              color="primary"
              min-width="100%"
              outlined
              :disabled="isSaveAsNew"
              class="text-capitalize"
              @click="saveAsNew(onClose)"
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
              @click="saveAndApply(onClose)"
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
              @click="createApplySetting(onClose)"
            >
              Create and Apply
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </template>
  </dialog-button>
</template>

<script>
import Vue from "vue";
import isEqual from "lodash/isEqual";
import DialogButton from "@/components/Dialogs/DialogButton.vue";
import DialogRemoveSetting from "@/components/Dialogs/DialogRemoveSetting.vue";
import draggable from "vuedraggable";
import columns from "@/mixins/columns";
import { mapActions, mapGetters, mapMutations } from "vuex";
import tableSettingAPI from "@/requestHttp/tableSetting";
export default {
  data() {
    return {
      tableSettings: [],
      tableSetting: {
        id: 0,
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
      },
      isDisabled: true,
      isCreate: false,
      isUpdate: false,
      isSaveAsNew: true,
      search: "",
      selectedAll: false,
      currentID: 0,
      currentName: "Default",
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
    DialogButton,
    draggable,
  },

  mixins: [columns],

  watch: {
    tableSetting: {
      handler(newValue) {
        // watch trạng thái của selectedAll
        if (newValue.columns?.length === this.columns.length) {
          this.selectedAll = true;
        } else {
          this.selectedAll = false;
        }

        // kiểm tra trạng thái setting xem có cho phép chỉnh sửa hay không (isDisabled) và có thay đổi gì không (isUpdate)
        if (this.tableSetting.id === 0) {
          this.isDisabled = true;
        } else {
          this.isDisabled = false;
          const compareObject = isEqual(
            this.tableSetting,
            this.s_settings_copy[this.tableSetting.id]
          );
          if (compareObject) {
            this.isUpdate = false;
          } else {
            this.isUpdate = true;
          }
        }
      },
      deep: true,
    },

    s_selected_setting() {
      if (this.s_selected_setting.id === 0) {
        this.tableSetting = {
          id: 0,
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
        };
      } else {
        this.tableSetting = this.s_selected_setting;
      }
    },

    s_settings() {
      this.tableSettings = this.s_settings;
    },
  },

  computed: {
    ...mapGetters({
      s_show_state: "getShowStateBuilding",
      s_table_settings: "getTableSettings",
      s_selected_setting: "getSelectedSetting",
      s_settings: "getSettings",
      s_settings_copy: "getSettingsCopy",
    }),

    textColumns() {
      return this.tableSetting.columns?.map((value) =>
        this.columns.find((column) => column.value === value)
      );
    },
  },

  methods: {
    ...mapMutations([
      "setTableSettings",
      "setSettings",
      "setSettingsCopy",
      "setSearch",
    ]),
    ...mapActions(["fetchAPITableSettings", "fetchAPIBuildings"]),

    async saveAndApply(onClose) {
      let active_idx = this.tableSetting.id - 1;
      let table_settings = this.s_table_settings.table_settings;
      tableSettingAPI.updateSetting({
        value: {
          active_idx: active_idx,
          table_settings: table_settings,
        },
      });
      await this.fetchAPITableSettings();
      this.setSearch("");
      const query = this.$route.query;
      this.fetchAPIBuildings({
        page: query.page,
        page_size: query.pageSize,
        sortBy: query.sortBy,
        desc: query.desc,
        building_type: query.building_type,
        state: this.s_show_state,
      });

      onClose();
    },

    openCreateSetting() {
      this.isCreate = true;
      this.isDisabled = false;
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

    cancelCreate() {
      this.isCreate = false;
      this.isUpdate = false;
      this.tableSetting = this.s_selected_setting;
    },

    createSetting() {
      let active_idx = this.s_table_settings.active_idx;
      let table_settings = [
        ...this.s_table_settings.table_settings,
        this.tableSetting,
      ];
      tableSettingAPI.updateSetting({
        value: {
          active_idx: active_idx,
          table_settings: table_settings,
        },
      });

      Vue.set(
        this.tableSetting,
        "id",
        this.s_table_settings.table_settings.length + 1
      );

      this.setSettings(table_settings);
      this.setSettingsCopy(table_settings);
      this.setTableSettings({
        active_idx,
        table_settings,
      });
      this.isCreate = false;
    },

    async createApplySetting(onClose) {
      let active_idx = this.s_table_settings.table_settings.length;
      let table_settings = [
        ...this.s_table_settings.table_settings,
        this.tableSetting,
      ];
      tableSettingAPI.updateSetting({
        value: {
          active_idx: active_idx,
          table_settings: table_settings,
        },
      });

      Vue.set(
        this.tableSetting,
        "id",
        this.s_table_settings.table_settings.length + 1
      );
      this.isCreate = false;
      await this.fetchAPITableSettings();
      this.setSearch("");
      const query = this.$route.query;
      this.fetchAPIBuildings({
        page: query.page,
        page_size: query.pageSize,
        sortBy: query.sortBy,
        desc: query.desc,
        building_type: query.building_type,
        state: this.s_show_state,
      });
      onClose();
    },

    async updateSetting() {
      let tableSettingNoId = Object.assign({}, this.tableSetting);
      delete tableSettingNoId.id;
      let updateSettings = this.s_table_settings.table_settings;
      updateSettings.splice(this.tableSetting.id - 1, 1, tableSettingNoId);

      let active_idx = this.tableSetting.id - 1;
      let table_settings = updateSettings;
      tableSettingAPI.updateSetting({
        value: {
          active_idx: active_idx,
          table_settings: table_settings,
        },
      });

      this.setSettings(table_settings);
      this.setSettingsCopy(table_settings);
      this.setTableSettings({
        active_idx,
        table_settings,
      });
      this.isUpdate = false;
    },

    async saveAsNew(onClose) {
      let newSetting = Object.assign({}, this.tableSetting);
      delete newSetting.id;

      let active_idx = this.s_table_settings.active_idx;
      let table_settings = [
        ...this.s_table_settings.table_settings,
        newSetting,
      ];
      tableSettingAPI.updateSetting({
        value: {
          active_idx: active_idx,
          table_settings: table_settings,
        },
      });
      this.isCreate = false;
      this.isUpdate = false;
      this.isSaveAsNew = true;
      this.fetchAPITableSettings();
      onClose();
    },

    handleSelectedAll() {
      if (this.selectedAll) {
        this.tableSetting.columns = this.columns.map((item) => item.value);
      } else {
        this.tableSetting.columns = [];
      }
    },

    handleChange(value) {
      // Khi vừa thay đổi tên và blur ra ngoài
      if (typeof value === "string") {
        this.tableSetting = this.s_settings[this.currentID];
        this.tableSetting.name = value;
        this.tableSettings.splice(this.currentID, 1, this.tableSetting);
        if (value !== this.s_settings_copy[this.currentID].name) {
          this.isSaveAsNew = false;
        } else {
          this.isSaveAsNew = true;
        }
      }
      // Khi chuyển qua setting khác và chuyển ngược lại setting vừa thay đổi
      else if (value.name !== this.s_settings_copy[value.id].name) {
        this.currentID = value.id;
        this.isSaveAsNew = false;
      }
      // Khi chuyển qua setting khác
      else {
        this.currentID = value.id;
        this.isSaveAsNew = true;
      }
    },
  },

  async created() {
    await this.fetchAPITableSettings();
    this.tableSetting = this.s_selected_setting;
    this.tableSettings = this.s_settings;
    this.currentID = this.s_selected_setting.id;
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

.checkbox-all.v-input--indeterminate span {
  color: #03a9f4;
}

.disabled-vuedragable {
  opacity: 0.5;
}
</style>
