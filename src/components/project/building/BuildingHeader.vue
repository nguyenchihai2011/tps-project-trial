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
    >
      <template v-slot:append>
        <v-icon v-if="search !== ''" @click="search = ''">mdi-close</v-icon>
      </template>
    </v-text-field>
    <div class="d-flex align-center">
      <building-modal
        icon="mdi-plus"
        tooltip="Add/Create"
        transition="scroll-x-reverse-transition"
      />
      <building-modal
        icon="mdi-pencil"
        tooltip="Edit"
        transition="scroll-x-reverse-transition"
      />
      <filter-modal
        icon="mdi-filter-variant"
        tooltip="Filter"
        transition="scroll-x-reverse-transition"
      />
      <table-settings
        icon="mdi-cog"
        tooltip="Table Settings"
        transition="scroll-x-reverse-transition"
      />
      <building-menu
        icon="mdi-dots-vertical"
        tooltip="More (Menu)"
        transition="scroll-x-reverse-transition"
      />
    </div>
  </v-card>
</template>

<script>
import HistoryTaskModal from "./header/HistoryTaskModal.vue";
import BuildingModal from "./header/BuildingModal.vue";
import FilterModal from "./header/FilterModal.vue";
import TableSettings from "./header/TableSettings.vue";
import BuildingMenu from "./header/BuildingMenu.vue";
export default {
  data() {
    return {
      search: "",
    };
  },
  components: {
    HistoryTaskModal,
    BuildingModal,
    FilterModal,
    TableSettings,
    BuildingMenu,
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
