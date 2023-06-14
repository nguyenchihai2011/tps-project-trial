<template>
  <v-dialog
    v-model="dialog"
    :transition="transition"
    persistent
    content-class="right-modal"
  >
    <template v-slot:activator="{ on, attrs }">
      <icon-button :on="on" :attrs="attrs" :icon="icon" :tooltip="tooltip" />
    </template>
    <v-list-item height="48px">
      <v-list-item-title class="title"> Table Settings </v-list-item-title>
      <v-spacer></v-spacer>
      <v-btn class="dialog__button" depressed fab @click="dialog = !dialog"
        ><v-icon>mdi-close</v-icon></v-btn
      >
    </v-list-item>

    <v-card-text
      >Let Google help apps determine location. This means sending anonymous
      location data to Google, even when no apps are running.</v-card-text
    >
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="green darken-1" text @click="dialog = false">
        Disagree
      </v-btn>
      <v-btn color="green darken-1" text @click="dialog = false"> Agree </v-btn>
    </v-card-actions>
  </v-dialog>
</template>

<script>
import IconButton from "@/components/buttons/IconButton.vue";
export default {
  data() {
    return {
      dialog: false,
    };
  },

  props: {
    transition: {
      type: String,
      required: true,
    },
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
    IconButton,
  },
};
</script>

<style scoped>
.right-modal {
  max-width: 500px !important;
  height: 100%;
  background-color: white;
  margin: 0 !important;
  padding: 0 16px;
  position: fixed;
  right: 0;
}

.right-modal .dialog__button {
  width: 36px !important;
  height: 36px !important;
}
</style>
