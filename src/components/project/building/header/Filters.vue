<template>
  <dialog-component :icon="icon" :tooltip="tooltip"
    ><v-list>
      <v-text-field label="Name*"></v-text-field>
      <v-text-field label="Building Type*"></v-text-field>
      <v-text-field label="Building ID"></v-text-field>
      <v-text-field label="State*"></v-text-field>
      <v-text-field label="Notes"></v-text-field>
      <v-text-field label="Address Line 1"></v-text-field>
      <v-text-field label="Address Line 2"></v-text-field>
      <v-text-field label="City"></v-text-field>
      <v-text-field label="State/Province"></v-text-field>
      <v-text-field label="Postal Code"></v-text-field>
      <v-text-field label="Select Country"></v-text-field>
      <v-list-item-subtitle class="text-caption"
        >*indicates required field</v-list-item-subtitle
      >
    </v-list></dialog-component
  >
</template>

<script>
import DialogComponent from "./DialogComponent.vue";
export default {
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
  },
};
</script>
