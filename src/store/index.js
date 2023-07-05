import Vue from "vue";
import Vuex from "vuex";

import buildingscolumns from "./modules/buildingscolumns";
import buildings from "./modules/buildings";
import buildingtypes from "./modules/buildingtypes";
import tablesettings from "./modules/tablesettings";
import menuComments from "./modules/menuComments";

Vue.use(Vuex);

export const store = new Vuex.Store({
  modules: {
    buildingscolumns,
    buildings,
    buildingtypes,
    tablesettings,
    menuComments,
  },
});
