<template>
  <dialog-button
    :icon="icon"
    :tooltip="tooltip"
    :handleClick="handleClick"
    :dialogClose="true"
  >
    <template v-slot:content>
      <v-divider></v-divider>
      <v-list class="create-edit-content">
        <v-form ref="entryForm">
          <v-text-field
            v-model="building.name"
            :rules="rules.required"
            label="Name*"
          ></v-text-field>
          <v-select
            v-model="building.building_type"
            :items="s_building_type"
            :rules="rules.required"
            :loading="s_loading"
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

    <template v-slot:default="{ onClose }">
      <v-container class="px-0">
        <v-row>
          <v-col lg="6" class="pr-1">
            <v-btn
              class="text-capitalize"
              color="primary"
              outlined
              min-width="100%"
              @click="handleCreate()"
              >Save And Create Another
            </v-btn>
          </v-col>
          <v-col lg="6" class="pl-1">
            <v-btn
              class="text-capitalize"
              color="primary"
              min-width="100%"
              @click="handleCreateAndClose(onClose)"
              >Save
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </template>
  </dialog-button>
</template>

<script>
import country from "@/mixins/country";
import { mapActions, mapGetters } from "vuex";
import DialogButton from "@/components/Dialogs/DialogButton.vue";
import projectBuildings from "@/requestHttp/projectBuildings";

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
        required: [],
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
    handleClick: {
      type: Function,
      required: true,
    },
  },

  mixins: [country],

  components: {
    DialogButton,
  },

  computed: {
    ...mapGetters({
      s_building_type: "getBuildingTypes",
      s_show_state: "getShowStateBuilding",
      s_loading: "getBuildingTypesLoading",
    }),
  },

  methods: {
    ...mapActions(["fetchAPIBuildings"]),

    async handleCreate() {
      this.rules.required = [(value) => !!value || "This field is required"];

      if (this.$refs.entryForm.validate()) {
        try {
          await projectBuildings.createBuilding(this.building);
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
          this.rules.required = [];
          const query = this.$route.query;
          this.fetchAPIBuildings({
            page: query.page || 1,
            page_size: query.pageSize || 50,
            sortBy: query.sortBy || "name",
            desc: query.desc || false,
            building_type: query.building_type || "",
            state: this.s_show_state,
          });
        } catch (err) {
          console.log(err);
        }
      }
    },
    async handleCreateAndClose(onClose) {
      await this.handleCreate();
      if (this.rules.required.length === 0) {
        onClose();
      }
    },
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
