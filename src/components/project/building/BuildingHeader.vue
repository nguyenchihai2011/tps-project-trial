<template>
  <v-card class="building__header" :outlined="false">
    <v-card-title>Buildings</v-card-title>
    <v-spacer></v-spacer>
    <history-task-modal
      icon="mdi-checkbox-marked-circle"
      tooltip="There are currently no running building tasks."
    />
    <v-text-field
      v-model="search"
      prepend-inner-icon="mdi-magnify"
      label="Search result..."
      class="building__header__search align-center mx-2"
      height="42px"
      hide-details
      dense
      solo
      clearable
    >
    </v-text-field>
    <div class="d-flex align-center">
      <create icon="mdi-plus" tooltip="Add/Create" />
      <edit
        icon="mdi-pencil"
        tooltip="Edit"
        type="Edit"
        :disabled="getSelectedBuildingLength != 1"
      />
      <filters icon="mdi-filter-variant" tooltip="Filter" />
      <table-settings icon="mdi-cog" tooltip="Table Settings" />
      <building-menu icon="mdi-dots-vertical" tooltip="More (Menu)" />
    </div>
  </v-card>
</template>

<script>
import HistoryTaskModal from "./header/HistoryTaskModal.vue";
import Create from "./header/Create.vue";
import Edit from "./header/Edit.vue";
import Filters from "./header/Filters.vue";
import TableSettings from "./header/TableSettings.vue";
import BuildingMenu from "./header/BuildingMenu.vue";
import { mapActions, mapGetters } from "vuex";
import debounce from "@/utils/debounce.js";

export default {
  data() {
    return {
      search: "",
      controller: new AbortController(),
    };
  },

  components: {
    HistoryTaskModal,
    Create,
    Edit,
    Filters,
    TableSettings,
    BuildingMenu,
  },

  computed: {
    ...mapGetters(["getSelectedBuildingLength", "getSelectedBuilding"]),
  },

  watch: {
    search: debounce(function (newValue) {
      // Huỷ request trước nếu tồn tại
      this.controller.abort();
      // Tạo mới AbortController
      this.controller = new AbortController();
      this.fetchAPIBuildings({
        page: this.$route.query.page,
        page_size: this.$route.query.pageSize,
        sortBy: "name",
        building_type: this.$route.query.building_type,
        search: newValue,
        signal: this.controller.signal,
      });
    }, 1000),
  },

  methods: {
    ...mapActions(["fetchAPIBuildings"]),
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

.building__header__search .v-input__slot {
  background-color: rgba(0, 0, 0, 0.06) !important;
}
.building__header__search #input-13 {
  min-height: 32px;
  padding: 8px 0;
}
</style>
