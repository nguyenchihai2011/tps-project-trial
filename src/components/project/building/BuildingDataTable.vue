<template>
  <div class="building__table__header">
    <table-header
      icon="mdi-music-accidental-sharp"
      lable="Total Building Quantity: "
      data="1 Building"
    />
    <table-header icon="mdi-currency-usd" lable="Total Cost: " data="$0.00" />
    <table-header icon="mdi-memory" lable="Total Area: " data="0 sq ft" />

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
import TableHeader from "./table/TableHeader.vue";
export default {
  components: {
    TableHeader,
  },
};
</script>

<style>
.table__header__icon {
  font-size: 16px !important;
  color: #939393;
}
</style>
