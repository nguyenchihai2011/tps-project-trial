<template>
  <dialog-component :icon="icon" :tooltip="tooltip">
    <template slot="content">
      <v-divider></v-divider>
      <v-container class="table-settings-content">
        <v-row>
          <b><p class="mt-4">Setting</p></b>
        </v-row>
        <v-row align="center">
          <v-col sm="8" class="pa-0">
            <v-select
              v-model="settingDefault.freezeColumns"
              :items="settings.table_settings"
              item-value="name"
              item-text="name"
              label="Setting Name"
            ></v-select>
          </v-col>
          <v-col sm="4" class="pr-0"
            ><v-btn color="primary" min-width="100%">
              <v-icon left> mdi-plus </v-icon>
              Add New
            </v-btn></v-col
          >
        </v-row>
        <v-row>
          <b><p class="mt-4">Visibility</p></b>
        </v-row>
        <div>
          <v-checkbox
            v-model="settingDefault.showRedactedState"
            :label="`Show Redacted Buildings`"
            hide-details
            class="mt-3"
          ></v-checkbox>
          <v-checkbox
            v-model="settingDefault.showInactiveState"
            :label="`Show Inactived Buildings`"
            hide-details
            class="mt-3"
          ></v-checkbox>
        </div>
        <v-row>
          <v-col sm="8">
            <v-select
              v-model="settingDefault.freezeColumns"
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
          <v-col style="padding: 12px 0px">
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
              class="ml-2"
              v-model="selectAll"
              label="Select All"
              hide-details
            ></v-checkbox>
            <v-checkbox
              class="ml-2"
              v-for="column in columns"
              :key="column.value"
              v-model="column.value"
              :label="column.text"
              hide-details
            ></v-checkbox>
          </v-col>
          <v-col style="padding: 12px 0px"
            ><b><span style="font-size: 14px">Selected Columns</span></b>
            <p style="font-size: 14px">Drag and drop to reorder</p>
            <v-list>
              <v-list-item-group v-model="model">
                <v-list-item v-for="(item, i) in items" :key="i">
                  <v-list-item-icon>
                    <v-icon> mdi-drag-horizontal-variant</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title>Select</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list-item-group>
            </v-list></v-col
          >
        </v-row>
      </v-container>
    </template>

    <template>
      <v-container class="px-0">
        <v-row>
          <v-col lg="6" class="pr-1"
            ><primary-button
              text="Save And Create Another"
              outlined
              minWidth="100%"
            ></primary-button
          ></v-col>
          <v-col lg="6" class="pl-1">
            <primary-button text="Save" minWidth="100%"> </primary-button>
          </v-col>
        </v-row>
      </v-container>
    </template>
  </dialog-component>
</template>

<script>
import axios from "axios";
import DialogComponent from "./DialogComponent.vue";
import PrimaryButton from "@/components/buttons/PrimaryButton.vue";
import columns from "@/mixins/columns";
export default {
  data() {
    return {
      settingDefault: {
        name: "Default",
        columns: ["ref_id", "name", "building_type", "skup_total", "state"],
        isInUse: false,
        freezeColumns: 3,
        showRedactedState: false,
        showInactiveState: true,
      },

      search: "",

      settings: {},

      selectedSetting: {},

      checkbox1: true,
      checkbox2: false,

      selectedFreezeColumns: 2,
      selectAll: false,

      model: 1,
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
    DialogComponent,
    PrimaryButton,
  },

  mixins: [columns],

  methods: {
    async fetchAPIBuildingsColumn() {
      try {
        const response = await axios.get(
          "/api/org-members/63c7f081-ef87-4421-bc5e-ca4a9b891b6b/preferences/buildingsColumns/"
        );
        const data = response.data.value;
        this.settings = data;
        if (data.active_idx === -1) {
          this.selectedSetting = this.settingDefault;
        } else {
          this.selectedSetting = data.table_settings[data.active_idx];
        }
      } catch (err) {
        console.log(err);
      }
    },
  },

  created() {
    this.fetchAPIBuildingsColumn();
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
