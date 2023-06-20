<template>
  <dialog-component :icon="icon" :tooltip="tooltip" :disabled="disabled">
    <template slot="content">
      <v-divider></v-divider>
      <v-list class="create-edit-content">
        <v-text-field
          v-model="building.name"
          :rules="rulesTextField"
          label="Name*"
        ></v-text-field>
        <v-select
          v-model="building.buildingType"
          :items="getBuildingTypes"
          :rules="rulesTextField"
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
            ></primary-button
          ></v-col>
          <v-col lg="6" class="pl-1">
            <primary-button text="Save" :onCreate="handleCreateBuilding">
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
        projectId: "75ea5a2e-e123-40df-a8c4-bf65386dba16",
        country: "US",
        name: "",
        refId: "",
        addressLine1: "",
        addressLine2: "",
        city: "",
        stateProvince: "",
        postalCode: "",
        buildingType: "",
        state: "ACTIVE",
        notes: "",
      },
      rulesTextField: [(v) => !!v || "This field is required."],
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
    disabled: {
      type: Boolean,
      default: false,
    },

    buildingEdit: {
      type: Object,
    },
  },

  mixins: [country],

  components: {
    DialogComponent,
    PrimaryButton,
  },

  computed: {
    ...mapGetters(["getBuildingTypes"]),
  },

  methods: {
    ...mapActions(["fetchAPIBuildingTypes"]),
    async handleCreateBuilding() {
      try {
        const response = await axios.post("/api/buildings/", this.building, {
          headers: {
            "x-camelcase": 1,
          },
        });
      } catch (err) {
        console.log(err);
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
