<template>
  <v-dialog v-model="dialogConfirm" persistent max-width="500">
    <template v-slot:activator="{ on, attrs }">
      <slot name="button" :attrs="attrs" :on="on"></slot>
    </template>
    <v-card>
      <v-card-title class="text-h5"> Unsaved Changes </v-card-title>
      <v-card-text
        >You have unsaved changes, are you sure you want to cancel?</v-card-text
      >
      <v-card-actions>
        <v-spacer></v-spacer>

        <v-btn
          class="text-capitalize"
          color="primary"
          outlined
          @click="handleReturn()"
          >No, Return
        </v-btn>

        <v-btn
          class="text-capitalize"
          color="primary"
          min-width="180px"
          @click="handleCancel()"
          >Yes, Cancel
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  data() {
    return {
      dialogConfirm: false,
    };
  },

  methods: {
    handleReturn() {
      this.dialogConfirm = false;
    },
    handleCancel() {
      this.$emit("update:close");
    },
  },
};
</script>
