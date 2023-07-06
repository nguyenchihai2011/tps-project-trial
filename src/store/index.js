import Vue from "vue";
import Vuex from "vuex";

import buildings from "./modules/buildings";
import buildingtypes from "./modules/buildingtypes";
import tablesettings from "./modules/tableSettings";
import menuComments from "./modules/menuComments";

Vue.use(Vuex);

export const store = new Vuex.Store({
  modules: {
    buildings,
    buildingtypes,
    tablesettings,
    menuComments,
  },
});
