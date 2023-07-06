<template>
  <div class="building__table__header">
    <meta-item
      icon="mdi-music-accidental-sharp"
      lable="Total Building Quantity: "
      :data="meta.total_active_quantity + ' Building'"
    />
    <meta-item
      icon="mdi-currency-usd"
      lable="Total Cost: "
      :data="'$' + meta.total_skup_extended_cost?.toFixed(2)"
    />
    <meta-item
      icon="mdi-memory"
      lable="Total Area: "
      :data="meta.total_room_area + ' sq ft'"
    />

    <v-tooltip top>
      <template v-slot:activator="{ on, attrs }">
        <v-icon class="table__header__icon" v-bind="attrs" v-on="on"
          >mdi-information</v-icon
        >
      </template>
      <span>These values do not include Redacted or Inactive objects</span>
    </v-tooltip>
  </div>
</template>

<script>
import MetaItem from "@/components/Project/Building/MetaTable/MetaItem/MetaItem.vue";
import { mapGetters } from "vuex";
export default {
  components: {
    MetaItem,
  },

  computed: {
    ...mapGetters({
      meta: "getMetaBuildings",
    }),
  },
};
</script>

<style>
.table__header__icon {
  font-size: 16px !important;
  color: #939393;
}
</style>
