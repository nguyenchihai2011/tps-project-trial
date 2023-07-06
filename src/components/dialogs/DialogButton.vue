<template>
  <v-dialog
    v-model="dialog"
    persistent
    transition="scroll-x-reverse-transition"
    content-class="right-modal"
  >
    <template v-slot:activator="{ on, attrs }">
      <icon-button
        :on="on"
        :attrs="attrs"
        :icon="icon"
        :tooltip="tooltip"
        :disabled="disabled"
        :handleClick="handleClick"
        :badge="badge"
      />
    </template>

    <!-- Header dialog -->
    <v-list-item height="48px" class="px-0">
      <v-list-item-title class="title">
        {{ tooltip }}
      </v-list-item-title>
      <v-spacer></v-spacer>
      <v-dialog v-if="dialogClose" v-model="dialog1" persistent max-width="500">
        <template v-slot:activator="{ on, attrs }">
          <v-btn class="dialog__button" depressed fab v-bind="attrs" v-on="on">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </template>
        <v-card>
          <v-card-title class="text-h5"> Unsaved Changes </v-card-title>
          <v-card-text
            >You have unsaved changes, are you sure you want to
            cancel?</v-card-text
          >
          <v-card-actions>
            <v-spacer></v-spacer>

            <primary-button
              text="No, Return"
              :onCreate="handleNo"
              outlined
            ></primary-button>

            <primary-button
              text="Yes, Cancel"
              :onCreate="handleYes"
              minWidth="180px"
            ></primary-button>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-btn
        v-else
        class="dialog__button"
        depressed
        fab
        @click="handleCloseCpnDialog()"
        ><v-icon>mdi-close</v-icon></v-btn
      >
    </v-list-item>

    <!-- Content dialog -->
    <slot name="content" :onClose="onClose"></slot>

    <v-divider></v-divider>
    <!-- Footer dialog -->
    <slot name="default" :onClose="onClose"></slot>
  </v-dialog>
</template>

<script>
import IconButton from "@/components/buttons/IconButton.vue";
import PrimaryButton from "@/components/buttons/PrimaryButton.vue";
import { mapActions } from "vuex";
export default {
  data() {
    return {
      dialog: false,
      dialog1: false,
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
    disabled: {
      type: Boolean,
      default: false,
    },
    handleClick: {
      type: Function,
      required: false,
    },
    badge: {
      type: Boolean,
      default: false,
    },
    dialogClose: {
      type: Boolean,
      default: false,
    },
  },

  components: {
    IconButton,
    PrimaryButton,
  },

  methods: {
    ...mapActions(["fetchAPITableSettings"]),
    handleNo() {
      this.dialog1 = false;
    },
    handleYes() {
      this.dialog = false;
    },
    onClose() {
      this.dialog = false;
    },
    handleCloseCpnDialog() {
      this.dialog = false;
      if (this.tooltip === "Table Settings") {
        this.fetchAPITableSettings();
      }
    },
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
