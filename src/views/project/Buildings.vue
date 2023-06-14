<template>
  <v-container fluid data-app>
    <!-- BuildingHeader -->
    <building-header />
    <!-- BuildingDataTable -->
    <v-card class="building__table">
      <div class="building__table__header">
        <div>
          <v-icon>mdi-music-accidental-sharp </v-icon>
          <span>Total Building Quantity: </span>
          <span>1 Building</span>
        </div>
        <div>
          <v-icon>mdi-currency-usd </v-icon>
          <span>Total Cost: </span>
          <span>$0.00</span>
        </div>
        <div>
          <v-icon> mdi-memory </v-icon>
          <span>Total Area: </span>
          <span>0 sq ft</span>
        </div>
        <v-icon>mdi-information</v-icon>
      </div>
      <v-data-table
        v-model="selected"
        :headers="headers"
        :items="buildings"
        :search="search"
        item-key="name"
        show-select
        :footer-props="{
          'items-per-page-options': [5, 10, 25, 50],
        }"
      >
        <template v-slot:footer.prepend>
          <v-btn color="primary" dark class="ma-2">
            <v-icon left> mdi-chevron-up </v-icon> TO TOP OF TABLE
          </v-btn>
        </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>

<script>
import BuildingHeader from "@/components/project/building/BuildingHeader.vue";
import BuildingDataTable from "@/components/project/building/BuildingDataTable.vue";

export default {
  data() {
    return {
      search: "",
      selected: [],
      selectedPage: 1,
      headers: [
        {
          text: "Dessert (100g serving)",

          value: "name",
        },
        { text: "Calories", value: "calories" },
        { text: "Fat (g)", value: "fat" },
        { text: "Carbs (g)", value: "carbs" },
        { text: "Protein (g)", value: "protein" },
        { text: "Iron (%)", value: "iron" },
      ],
      buildings: [
        {
          name: "Frozen Yogurt",
          calories: 159,
          fat: 6.0,
          carbs: 24,
          protein: 4.0,
          iron: 1,
        },
        {
          name: "Ice cream sandwich",
          calories: 237,
          fat: 9.0,
          carbs: 37,
          protein: 4.3,
          iron: 1,
        },
        {
          name: "Eclair",
          calories: 262,
          fat: 16.0,
          carbs: 23,
          protein: 6.0,
          iron: 7,
        },
        {
          name: "Cupcake",
          calories: 305,
          fat: 3.7,
          carbs: 67,
          protein: 4.3,
          iron: 8,
        },
        {
          name: "Gingerbread",
          calories: 356,
          fat: 16.0,
          carbs: 49,
          protein: 3.9,
          iron: 16,
        },
        {
          name: "Jelly bean",
          calories: 375,
          fat: 0.0,
          carbs: 94,
          protein: 0.0,
          iron: 0,
        },
        {
          name: "Lollipop",
          calories: 392,
          fat: 0.2,
          carbs: 98,
          protein: 0,
          iron: 2,
        },
        {
          name: "Honeycomb",
          calories: 408,
          fat: 3.2,
          carbs: 87,
          protein: 6.5,
          iron: 45,
        },
        {
          name: "Donut",
          calories: 452,
          fat: 25.0,
          carbs: 51,
          protein: 4.9,
          iron: 22,
        },
        {
          name: "KitKat",
          calories: 518,
          fat: 26.0,
          carbs: 65,
          protein: 7,
          iron: 6,
        },
      ],
    };
  },
  components: {
    BuildingHeader,
    BuildingDataTable,
  },
};
</script>

<style>
.building__table {
  padding: 4px 16px 16px;
}
.building__table__header {
  display: flex;
  padding: 8px;
  border: thin solid rgba(0, 0, 0, 0.12);
  background-color: #e3e3e3;
}

.building__button {
  align-self: center;
  width: 40px !important;
  height: 40px !important;
}
.building__icon--bold {
  color: rgba(0, 0, 0, 0.87);
}
</style>
