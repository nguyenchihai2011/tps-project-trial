<template>
  <v-container fluid data-app>
    <!-- BuildingHeader -->
    <building-header />
    <!-- BuildingDataTable -->
    <v-card class="building__table">
      <building-data-table />
      <v-data-table
        v-model="selected"
        :headers="headers"
        :items="getBuildings"
        :search="search"
        item-key="name"
        show-select
        :footer-props="{
          'items-per-page-options': [5, 10, 25, 50],
        }"
      >
        <template v-slot:footer.prepend>
          <v-btn color="primary" dark class="ma-2">
            <v-icon left> mdi-chevron-up </v-icon> TO TOP OF TABLE
          </v-btn>
        </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>

<script>
import BuildingHeader from "@/components/project/building/BuildingHeader.vue";
import BuildingDataTable from "@/components/project/building/BuildingDataTable.vue";
import { mapActions, mapGetters, mapState } from "vuex";

export default {
  data() {
    return {
      search: "",
      selected: [],
      selectedPage: 1,
      headers: [
        {
          text: "Building ID",

          value: "ref_id",
        },
        { text: "Building Name", value: "name" },
        { text: "State", value: "state" },
      ],
      // buildings: [],
    };
  },
  components: {
    BuildingHeader,
    BuildingDataTable,
  },

  computed: {
    ...mapGetters(["getBuildings"]),
  },

  methods: {
    ...mapActions(["fetchAPIBuildings"]),
  },

  mounted() {
    this.fetchAPIBuildings();
  },
};
</script>

<style>
.building__table {
  padding: 4px 16px 16px;
}
.building__table__header {
  display: flex;
  padding: 8px;
  border: thin solid rgba(0, 0, 0, 0.12);
  background-color: #e3e3e3;
}

.building__button {
  align-self: center;
  width: 40px !important;
  height: 40px !important;
}
.building__icon--bold {
  color: rgba(0, 0, 0, 0.87);
}
</style>
