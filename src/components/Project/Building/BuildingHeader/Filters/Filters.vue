<template>
  <dialog-button :icon="icon" :tooltip="tooltip" :badge="!!selectedFilter">
    <template v-slot:content>
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
              ><v-icon v-if="!!selectedFilter" color="green" left
                >mdi-check</v-icon
              >Building Type</label
            ></v-expansion-panel-header
          >
          <v-expansion-panel-content>
            <v-select
              v-model="selectedFilter"
              :items="s_building_type"
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
    <template v-slot:default="{ onClose }">
      <v-container class="px-0">
        <v-row>
          <v-col lg="6" class="pr-1"
            ><v-btn
              class="text-capitalize"
              color="primary"
              outlined
              min-width="100%"
              @click="handleClearFilter()"
              >Clear Filters
            </v-btn></v-col
          >
          <v-col lg="6" class="pl-1">
            <v-btn
              class="text-capitalize"
              color="primary"
              min-width="100%"
              @click="onClose()"
              >Done
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </template>
  </dialog-button>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import DialogButton from "@/components/Dialogs/DialogButton.vue";
export default {
  data() {
    return {
      selectedFilter: this.$route.query.building_type || "",
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
    DialogButton,
  },

  computed: {
    ...mapGetters({
      s_building_type: "getBuildingTypes",
      s_show_state: "getShowStateBuilding",
    }),
  },

  watch: {
    selectedFilter(newValue) {
      this.fetchAPIBuildings({
        page: 1,
        page_size: this.$route.query.pageSize,
        sortBy: this.$route.query.sortBy,
        desc: this.$route.query.desc,
        project: "75ea5a2e-e123-40df-a8c4-bf65386dba16",
        building_type: newValue,
        state: this.s_show_state,
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
    handleClearFilter() {
      this.selectedFilter = "";
    },
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
