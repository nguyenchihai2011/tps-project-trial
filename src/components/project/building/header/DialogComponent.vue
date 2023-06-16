<template>
  <v-dialog
    v-model="dialog"
    persistent
    transition="scroll-x-reverse-transition"
    content-class="right-modal"
  >
    <template v-slot:activator="{ on, attrs }">
      <icon-button :on="on" :attrs="attrs" :icon="icon" :tooltip="tooltip" />
    </template>

    <!-- Header dialog -->
    <v-list-item height="48px" class="px-0">
      <v-list-item-title class="title">
        {{ tooltip }}
      </v-list-item-title>
      <v-spacer></v-spacer>
      <v-btn class="dialog__button" depressed fab @click="dialog = !dialog"
        ><v-icon>mdi-close</v-icon></v-btn
      >
    </v-list-item>

    <!-- Content dialog -->
    <slot name="content"></slot>

    <v-divider></v-divider>
    <!-- Footer dialog -->
    <slot name="default"></slot>
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

<style>
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
