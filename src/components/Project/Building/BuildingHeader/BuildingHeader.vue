<template>
  <v-card class="building__header" :outlined="false">
    <v-card-title>Buildings</v-card-title>
    <v-spacer></v-spacer>
    <!-- <history-task-modal
      icon="mdi-checkbox-marked-circle"
      tooltip="There are currently no running building tasks."
    /> -->
    <search />
    <div class="d-flex align-center">
      <create
        icon="mdi-plus"
        tooltip="Add/Create"
        :handleClick="handleCreate"
      />
      <edit
        icon="mdi-pencil"
        tooltip="Edit"
        :disabled="s_quantity_selected_building !== 1"
        :handleClick="handleEdit"
      />
      <filters icon="mdi-filter-variant" tooltip="Filter" />
      <table-settings icon="mdi-cog" tooltip="Table Settings" />
      <MenuBuilding icon="mdi-dots-vertical" tooltip="More (Menu)" />
    </div>
  </v-card>
</template>

<script>
import Search from "./Search/Search.vue";
import Create from "./Create/Create.vue";
import Edit from "./Edit/Edit.vue";
import Filters from "./Filters/Filters.vue";
import TableSettings from "./TableSettings/TableSettings.vue";
import MenuBuilding from "./Menu/Menu.vue";
import HistoryTaskModal from "./History/HistoryTaskModal.vue";
import { mapGetters, mapMutations, mapActions } from "vuex";
import projectBuildings from "@/requestHttp/projectBuildings";

export default {
  components: {
    Search,
    Create,
    Edit,
    Filters,
    TableSettings,
    MenuBuilding,
    HistoryTaskModal,
  },

  computed: {
    ...mapGetters({
      s_selected_building_ids: "getSelectedBuildingIds",
      s_quantity_selected_building: "getQuantitySelectedBuilding",
    }),
  },

  methods: {
    ...mapMutations(["setInfoBuilding"]),
    ...mapActions(["fetchAPIBuildingTypes"]),
    async handleCreate() {
      this.fetchAPIBuildingTypes();
    },
    async handleEdit() {
      try {
        let building = await projectBuildings.getSingleBuilding(
          this.s_selected_building_ids[0]
        );
        building.building_type = building.building_type.id;
        this.setInfoBuilding(building);
        this.fetchAPIBuildingTypes();
      } catch (err) {
        console.log(err);
      }
    },
  },
};
</script>

<style>
.building__header {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  padding: 4px 16px 16px;
}
</style>
