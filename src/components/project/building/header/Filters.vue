<template>
  <dialog-component :icon="icon" :tooltip="tooltip" :badge="!!selectFilter">
    <template slot="content">
      <v-text-field
        prepend-inner-icon="mdi-magnify"
        label="Search filters..."
        class="align-center pb-1"
        height="40px"
        hide-details
        dense
        solo
        flat
      />
      <v-divider></v-divider>
      <v-expansion-panels accordion flat class="filter-content">
        <v-expansion-panel>
          <v-expansion-panel-header
            ><label
              ><v-icon v-if="!!selectFilter" color="green" left
                >mdi-check</v-icon
              >Building Type</label
            ></v-expansion-panel-header
          >
          <v-expansion-panel-content>
            <v-select
              v-model="selectFilter"
              :items="getBuildingTypes"
              :menu-props="{ bottom: true, offsetY: true }"
              label="Building Type"
              chips
              small-chips
              clearable
            >
            </v-select>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </template>
    <template>
      <v-container class="px-0">
        <v-row>
          <v-col lg="6" class="pr-1"
            ><primary-button
              text="Clear Filters"
              outlined
              minWidth="100%"
            ></primary-button
          ></v-col>
          <v-col lg="6" class="pl-1">
            <primary-button text="Done" minWidth="100%"> </primary-button>
          </v-col>
        </v-row>
      </v-container>
    </template>
  </dialog-component>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import DialogComponent from "./DialogComponent.vue";
import PrimaryButton from "@/components/buttons/PrimaryButton.vue";
export default {
  data() {
    return {
      selectFilter: this.$route.query.building_type || "",
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

  computed: {
    ...mapGetters(["getBuildingTypes"]),
  },

  watch: {
    selectFilter(newValue) {
      this.fetchAPIBuildings({
        page: 1,
        page_size: this.$route.query.pageSize,
        sortBy: this.$route.query.sortBy,
        desc: this.$route.query.desc,
        project: "75ea5a2e-e123-40df-a8c4-bf65386dba16",
        building_type: newValue,
      });
      this.$router.push({
        path: "/projects/75ea5a2e-e123-40df-a8c4-bf65386dba16/buildings",
        query: {
          page: 1,
          pageSize: this.$route.query.pageSize,
          sortBy: this.$route.query.sortBy,
          desc: this.$route.query.desc,
          building_type: newValue,
        },
      });
    },
  },

  methods: {
    ...mapActions(["fetchAPIBuildings"]),
  },
};
</script>

<style>
.filter-content {
  height: calc(100vh - 154px);
  overflow-y: auto;
  overflow-x: hidden;
}
</style>
