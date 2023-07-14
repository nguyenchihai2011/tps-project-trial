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
import { mapActions, mapGetters, mapMutations } from "vuex";
export default {
  data() {
    return {
      search: "",
      controller: new AbortController(),
    };
  },

  computed: {
    ...mapGetters({
      s_search: "getSearch",
      s_show_state: "getShowStateBuilding",
    }),
  },

  watch: {
    search: debounce(function (newValue) {
      // Huỷ request trước nếu tồn tại
      this.controller.abort();
      // Tạo mới AbortController
      this.controller = new AbortController();
      this.setSearch(newValue);
      this.fetchAPIBuildings({
        page: this.$route.query.page,
        page_size: this.$route.query.pageSize,
        sortBy: this.$route.query.sortBy,
        building_type: this.$route.query.building_type,
        state: this.s_show_state,
        signal: this.controller.signal,
      });
    }, 1000),

    s_search(newValue) {
      this.search = newValue;
    },
  },

  methods: {
    ...mapMutations(["setSearch"]),
    ...mapActions(["fetchAPIBuildings"]),
  },
};
</script>

<style>
.search .v-input__slot {
  background-color: rgba(0, 0, 0, 0.06) !important;
}
</style>
