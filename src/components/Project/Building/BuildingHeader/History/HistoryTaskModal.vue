<template>
  <v-bottom-sheet v-model="sheet" persistent content-class="bottom-modal">
    <template v-slot:activator="{ on, attrs }">
      <icon-button :on="on" :attrs="attrs" :icon="icon" :tooltip="tooltip" />
    </template>
    <v-sheet class="text-center" height="200px">
      <v-btn class="mt-6" text color="error" @click="sheet = !sheet">
        close
      </v-btn>
      <div class="py-3">This is a bottom sheet using the persistent prop</div>
    </v-sheet>
  </v-bottom-sheet>
</template>

<script>
import IconButton from "@/components/Buttons/IconButton.vue";
export default {
  data() {
    return {
      sheet: false,
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
.bottom-modal {
  height: 50vh;
  background-color: white;
}
</style>
