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
      <dialog-confirm-unsave v-if="dialogClose" @update:close="dialog = false">
        <template v-slot:button="{ attrs, on }"
          ><v-btn class="dialog__button" depressed fab v-bind="attrs" v-on="on">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </template>
      </dialog-confirm-unsave>
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
import IconButton from "@/components/Buttons/IconButton.vue";
import DialogConfirmUnsave from "./DialogConfirmUnsave.vue";
import { mapActions } from "vuex";
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
    DialogConfirmUnsave,
  },

  methods: {
    ...mapActions(["fetchAPITableSettings"]),

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
