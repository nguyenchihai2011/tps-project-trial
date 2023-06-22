<template>
  <dialog-component :icon="icon" :tooltip="tooltip" :dialogClose="true">
    <template slot="content">
      <v-divider></v-divider>
      <v-list class="create-edit-content">
        <v-form ref="entryForm">
          <v-text-field
            v-model="building.name"
            :rules="rules.buildingName"
            label="Name*"
          ></v-text-field>
          <v-select
            v-model="building.building_type"
            :items="getBuildingTypes"
            :rules="rules.buildingType"
            label="Building Type*"
          ></v-select>
          <v-text-field label="Building ID"></v-text-field>
          <v-select
            v-model="building.state"
            :items="state"
            label="State*"
          ></v-select>

          <v-text-field label="Notes"></v-text-field>
          <v-text-field label="Address Line 1"></v-text-field>
          <v-text-field label="Address Line 2"></v-text-field>
          <v-text-field label="City"></v-text-field>
          <v-text-field label="State/Province"></v-text-field>
          <v-text-field label="Postal Code"></v-text-field>
          <v-select
            :items="country"
            v-model="building.country"
            label="Select Country"
          ></v-select>
        </v-form>
        <v-list-item-subtitle class="text-caption"
          >*indicates required field</v-list-item-subtitle
        >
      </v-list>
    </template>

    <template>
      <v-container class="px-0">
        <v-row>
          <v-col lg="6" class="pr-1"
            ><primary-button
              text="Save And Create Another"
              :onCreate="handleCreateBuilding"
              outlined
              minWidth="100%"
            ></primary-button
          ></v-col>
          <v-col lg="6" class="pl-1">
            <primary-button
              text="Save"
              :onCreate="handleCreateBuilding"
              minWidth="100%"
            >
            </primary-button>
          </v-col>
        </v-row>
      </v-container>
    </template>
  </dialog-component>
</template>

<script>
import country from "@/mixins/country";
import { mapActions, mapGetters } from "vuex";
import DialogComponent from "./DialogComponent.vue";
import PrimaryButton from "@/components/buttons/PrimaryButton.vue";
import axios from "axios";

export default {
  data() {
    return {
      state: [
        { text: "Active", value: "ACTIVE" },
        { text: "Inactive", value: "INACTIVE" },
        { text: "Redacted", value: "REDACTED" },
      ],

      building: {
        id: "",
        project_id: "75ea5a2e-e123-40df-a8c4-bf65386dba16",
        country: "US",
        name: "",
        ref_id: "",
        address_line1: "",
        address_line2: "",
        city: "",
        state_province: "",
        postal_code: "",
        building_type: "",
        state: "ACTIVE",
        notes: "",
      },
      rules: {
        buildingName: [],
        buildingType: [],
      },
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

  mixins: [country],

  components: {
    DialogComponent,
    PrimaryButton,
  },

  watch: {
    "building.name"(val) {
      this.rules.buildingName = [];
    },
    "building.refId"(val) {
      this.rules.buildingType = [];
    },
  },

  computed: {
    ...mapGetters(["getBuildingTypes", "getSelectedBuildingLength"]),
  },

  methods: {
    ...mapActions(["fetchAPIBuildings", "fetchAPIBuildingTypes"]),

    async handleCreateBuilding() {
      this.rules.buildingName = [(v) => !!v || "This field is required"];
      this.rules.buildingType = [(v) => !!v || "This field is required"];

      if (this.$refs.entryForm.validate()) {
        try {
          const response = await axios.post("/api/buildings/", this.building, {
            headers: {
              "x-camelcase": 1,
            },
          });
          this.building = {
            id: "",
            project_id: "75ea5a2e-e123-40df-a8c4-bf65386dba16",
            country: "US",
            name: "",
            ref_id: "",
            address_line1: "",
            address_line2: "",
            city: "",
            state_province: "",
            postal_code: "",
            building_type: "",
            state: "ACTIVE",
            notes: "",
          };
          this.rules.buildingName = [];
          this.rules.buildingType = [];
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
  },

  mounted() {
    this.fetchAPIBuildingTypes();
  },
};
</script>

<style>
.create-edit-content {
  height: calc(100vh - 110px);
  overflow-y: auto;
  overflow-x: hidden;
}
</style>
