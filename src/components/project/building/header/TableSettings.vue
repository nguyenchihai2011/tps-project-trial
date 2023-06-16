<template>
  <dialog-component :icon="icon" :tooltip="tooltip">
    <template slot="content">
      <v-divider></v-divider>
      <v-container>
        <v-row>
          <b><p class="mt-4">Setting</p></b>
        </v-row>
        <v-row align="center">
          <v-col sm="8" class="pa-0">
            <v-select
              v-model="selectedSetting"
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
            v-model="checkbox1"
            :label="`Checkbox 1: ${checkbox1.toString()}`"
            hide-details
            class="mt-3"
          ></v-checkbox>
          <v-checkbox
            v-model="checkbox2"
            :label="`Checkbox 2: ${checkbox2.toString()}`"
            hide-details
            class="mt-3"
          ></v-checkbox>
        </div>
        <v-row>
          <v-col sm="8">
            <v-select
              v-model="selectedFreezeColumns"
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
          <v-col></v-col>
          <v-col></v-col>
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
            ></primary-button
          ></v-col>
          <v-col lg="6" class="pl-1">
            <primary-button text="Save"> </primary-button>
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
export default {
  data() {
    return {
      settingDefault: {
        name: "Default",
        columns: ["ref_id", "name", "building_type", "skup_total", "state"],
        isInUse: false,
        fixedNumber: 2,
        showInactiveState: false,
        showRedactedState: false,
      },

      settings: {},

      selectedSetting: {},

      checkbox1: true,
      checkbox2: false,

      selectedFreezeColumns: 2,
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
</style>
