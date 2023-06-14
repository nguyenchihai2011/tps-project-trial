import Vue from "vue";
import Vuex from "vuex";

import buildings from "./modules/buildings";
import buildingtypes from "./modules/buildingtypes";

Vue.use(Vuex);

export const store = new Vuex.Store({
  modules: {
    buildings,
    buildingtypes,
  },
});
