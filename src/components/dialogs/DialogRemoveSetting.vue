<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" persistent max-width="600">
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          class="text-capitalize"
          text
          style="color: red"
          v-bind="attrs"
          v-on="on"
        >
          Remove
        </v-btn>
      </template>
      <v-card>
        <v-card-title class="text-h5"> Remove Table Setting </v-card-title>
        <v-card-text
          >This setting is currently in use, please select a new table setting
          to apply before you remove it.</v-card-text
        >
        <v-card-text
          ><v-autocomplete
            v-model="tableSetting"
            :items="getSettings"
            label="Setting Name"
            :menu-props="{ offsetY: true }"
            item-text="name"
            return-object
          >
            <template v-slot:item="{ item }">
              <div>{{ item.name }}</div>
            </template>
          </v-autocomplete></v-card-text
        >
        <v-card-actions class="flex-wrap">
          <div class="col col-12">
            <v-btn
              color="error"
              outlined
              min-width="100%"
              @click="dialog = false"
              class="text-capitalize"
            >
              Remove And Close Table Settings
            </v-btn>
          </div>
          <div class="col col-12">
            <v-btn
              color="error"
              min-width="100%"
              @click="dialog = false"
              class="text-capitalize"
            >
              Remove And Return Table Settings
            </v-btn>
          </div>
          <div class="col col-12">
            <v-btn
              color="primary"
              outlined
              min-width="100%"
              @click="dialog = false"
              class="text-capitalize"
            >
              Cancel
            </v-btn>
          </div>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      tableSetting: {
        column_sizes: [],
        columns: ["ref_id", "name", "building_type", "skup_total", "state"],
        fixed_number: 2,
        is_in_use: false,
        name: "Default",
        show_inactive_state: false,
        show_redacted_state: false,
      },
      tableSettings: [],
      dialog: false,
    };
  },

  computed: {
    ...mapGetters(["getSettings"]),
  },
};
</script>

<style></style>
