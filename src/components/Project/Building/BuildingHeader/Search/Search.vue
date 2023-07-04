<template>
  <v-text-field
    v-model="search"
    prepend-inner-icon="mdi-magnify"
    label="Search result..."
    class="search align-center mx-2"
    height="42px"
    hide-details
    dense
    solo
    clearable
  >
  </v-text-field>
</template>

<script>
import debounce from "@/utils/debounce.js";
import { mapActions } from "vuex";
export default {
  data() {
    return {
      search: "",
      controller: new AbortController(),
    };
  },

  watch: {
    search: debounce(function (newValue) {
      // Huỷ request trước nếu tồn tại
      this.controller.abort();
      // Tạo mới AbortController
      this.controller = new AbortController();
      this.fetchAPIBuildings({
        page: this.$route.query.page,
        page_size: this.$route.query.pageSize,
        sortBy: "name",
        building_type: this.$route.query.building_type,
        search: newValue,
        signal: this.controller.signal,
      });
    }, 1000),
  },

  methods: {
    ...mapActions(["fetchAPIBuildings"]),
  },
};
</script>

<style>
.search .v-input__slot {
  background-color: rgba(0, 0, 0, 0.06) !important;
}
</style>
