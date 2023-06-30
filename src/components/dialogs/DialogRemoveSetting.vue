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
          @click="remove()"
        >
          Remove
        </v-btn>
      </template>
      <v-card>
        <v-card-title class="text-h5"> Remove Table Setting </v-card-title>
        <v-card-text v-if="tableSettingProp.id !== getSelectedSetting.id"
          >You are about to remove <b>{{ tableSettingProp.name }}</b> for this
          table. Removing selected table setting will delete that configuration
          from your table setting and will no longer be available for
          selection.</v-card-text
        >
        <v-card-text v-else
          >This setting is currently in use, please select a new table setting
          to apply before you remove it.</v-card-text
        >

        <v-card-text
          ><v-autocomplete
            v-model="tableSetting"
            :items="tableSettings"
            label="Setting Name"
            :menu-props="{ offsetY: true }"
            item-text="name"
            item-value="id"
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
              @click="removeAndCloseSetting()"
              class="text-capitalize"
            >
              Remove And Close Table Settings
            </v-btn>
          </div>
          <div class="col col-12">
            <v-btn
              color="error"
              min-width="100%"
              @click="removeAndReturnSetting()"
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
import axios from "axios";
import { mapActions, mapGetters, mapMutations } from "vuex";

export default {
  data() {
    return {
      tableSetting: {
        id: 0,
        columns: [
          "name",
          "ref_id",
          "full_address",
          "building_type",
          "skup_total",
          "state",
        ],
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

  props: {
    tableSettingProp: {
      type: Object,
      required: true,
    },
    onClose: {
      type: Function,
      required: true,
    },
  },

  computed: {
    ...mapGetters(["getSettings", "getSelectedSetting"]),
  },

  methods: {
    ...mapMutations(["setSelectedSetting"]),
    ...mapActions(["fetchAPITableSettings"]),
    async remove() {
      if (this.tableSettingProp.id !== this.getSelectedSetting.id) {
        this.tableSetting = this.getSelectedSetting;
      }

      this.tableSettings = this.getSettings.filter(
        (setting) => setting.id !== this.tableSettingProp.id
      );
    },

    async removeAndReturnSetting() {
      try {
        const idSetting =
          this.tableSettingProp.id > this.tableSetting.id
            ? this.tableSetting.id - 1
            : this.tableSetting.id - 2;
        let updateSettings = this.tableSettings
          .filter((setting) => setting.id > 0)
          .map((setting) => {
            delete setting.id;
            return setting;
          });

        const response = await axios.put(
          "/api/org-members/63c7f081-ef87-4421-bc5e-ca4a9b891b6b/preferences/buildingsColumns/",
          {
            value: {
              active_idx: idSetting,
              table_settings: updateSettings,
            },
          }
        );
        this.setSelectedSetting(this.tableSetting);
        this.fetchAPITableSettings();
        this.dialog = false;
      } catch (err) {
        console.log(err);
      }
    },

    async removeAndCloseSetting() {
      await this.removeAndReturnSetting();
      this.onClose();
    },
  },
};
</script>

<style></style>
