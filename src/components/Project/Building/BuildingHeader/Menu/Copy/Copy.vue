<template>
  <v-dialog v-model="dialogCopy" persistent max-width="290px">
    <template v-slot:activator="{ on, attrs }">
      <div>
        <v-btn
          text
          class="px-0 text-capitalize"
          v-bind="attrs"
          v-on="on"
          height="48px"
          color="rgba(0,0,0,0.6)"
          min-width="100%"
          :disabled="s_quantity_selected_building < 1"
        >
          <v-list-item-icon>
            <v-icon>mdi-content-copy</v-icon>
          </v-list-item-icon>
          <v-list-item-content> Copy (Clone) </v-list-item-content>
        </v-btn>
      </div>
    </template>
    <v-card>
      <v-card-title class="text-h5"> Copy Building </v-card-title>
      <v-card-text
        >Are you sure you want to copy
        {{ s_quantity_selected_building }} Building?</v-card-text
      >
      <v-card-actions>
        <v-spacer></v-spacer>

        <v-btn
          color="primary"
          outlined
          class="text-capitalize"
          @click="dialogCopy = false"
        >
          Cancel
        </v-btn>

        <v-btn color="primary" class="text-capitalize" @click="handleCopy()">
          Copy
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from "vuex";
import projectBuildings from "@/requestHttp/projectBuildings";

export default {
  data() {
    return {
      dialogCopy: false,
    };
  },

  inject: ["getSnackbar", "setSnackbar"],

  computed: {
    ...mapGetters({
      s_selected_building: "getSelectedBuilding",
      s_selected_building_ids: "getSelectedBuildingIds",
      s_quantity_selected_building: "getQuantitySelectedBuilding",
      s_show_state: "getShowStateBuilding",
    }),
  },

  methods: {
    ...mapMutations(["setSelectedBuilding"]),
    ...mapActions(["fetchAPIBuildings", "fetchAPITableSettings"]),

    async handleCopy() {
      try {
        const actions = this.s_selected_building_ids.map((building) => {
          return { building };
        });
        await projectBuildings.copyBuilding({ actions, changeNote: null });

        this.setSnackbar(
          true,
          "Successful! Your buildings has been copied.",
          "success",
          5000
        );
        this.setSelectedBuilding([]);
        this.fetchAPITableSettings();
        const query = this.$route.query;
        this.fetchAPIBuildings({
          page: query.page,
          page_size: query.pageSize,
          sortBy: query.sortBy,
          desc: query.desc,
          building_type: query.building_type,
          state: this.s_show_state,
        });
        this.dialogCopy = false;
      } catch (err) {
        console.log(err);
      }
    },
  },
};
</script>
