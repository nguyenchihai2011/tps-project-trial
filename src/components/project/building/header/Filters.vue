<template>
  <dialog-component :icon="icon" :tooltip="tooltip">
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
          <v-expansion-panel-header>Building Type</v-expansion-panel-header>
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
            ><primary-button text="Clear Filters" outlined></primary-button
          ></v-col>
          <v-col lg="6" class="pl-1">
            <primary-button text="Done"> </primary-button>
          </v-col>
        </v-row>
      </v-container>
    </template>
  </dialog-component>
</template>

<script>
import { mapGetters } from "vuex";
import DialogComponent from "./DialogComponent.vue";
import PrimaryButton from "@/components/buttons/PrimaryButton.vue";
export default {
  data() {
    return {
      selectFilter: "",
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
};
</script>

<style>
.filter-content {
  height: calc(100vh - 154px);
  overflow-y: auto;
  overflow-x: hidden;
}
</style>
