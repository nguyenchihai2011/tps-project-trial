<template>
  <v-container fluid>
    <building-header />
    <v-card class="building__table">
      <meta-table />
      <data-table />

      <v-snackbar v-model="snackbar" :timeout="timeout" :color="color">
        {{ text }}
        <template v-slot:action="{ attrs }">
          <v-btn text v-bind="attrs" @click="snackbar = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </template>
      </v-snackbar>
    </v-card>
  </v-container>
</template>

<script>
import BuildingHeader from "@/components/Project/Building/BuildingHeader/BuildingHeader.vue";
import MetaTable from "@/components/Project/Building/MetaTable/MetaTable.vue";
import DataTable from "@/components/Project/Building/DataTable/DataTable.vue";

export default {
  data() {
    return {
      snackbar: false,
      text: "",
      color: "",
      timeout: -1,
    };
  },
  provide() {
    return {
      getSnackbar: () => this.snackbar,
      setSnackbar: (value, text, color, timeout) => {
        this.snackbar = value;
        this.text = text;
        this.color = color;
        this.timeout = timeout;
      },
    };
  },
  components: {
    BuildingHeader,
    MetaTable,
    DataTable,
  },
};
</script>

<style>
.building__table {
  padding: 4px 16px 16px;
}

.v-snack__wrapper {
  bottom: 50px;
}
</style>
