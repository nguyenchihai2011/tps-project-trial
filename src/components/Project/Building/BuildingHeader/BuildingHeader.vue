<template>
  <v-card class="building__header" :outlined="false">
    <v-card-title>Buildings</v-card-title>
    <v-spacer></v-spacer>
    <history-task-modal
      icon="mdi-checkbox-marked-circle"
      tooltip="There are currently no running building tasks."
    />
    <search />
    <div class="d-flex align-center">
      <create icon="mdi-plus" tooltip="Add/Create" />
      <edit
        icon="mdi-pencil"
        tooltip="Edit"
        :disabled="getSelectedBuildingLength != 1"
        :handleEdit="handleEdit"
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
import { mapGetters, mapMutations } from "vuex";
import axios from "axios";

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
    ...mapGetters(["getSelectedBuildingLength", "getSelectedBuilding"]),
  },

  methods: {
    ...mapMutations(["setInfoBuilding"]),
    async handleEdit() {
      const response = await axios.get(
        `/api/buildings/${this.getSelectedBuilding[0]}/`
      );
      response.data.building_type = response.data.building_type.id;
      this.setInfoBuilding(response.data);
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
