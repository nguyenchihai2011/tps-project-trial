import axios from "axios";
import qs from "qs";

const state = {
  buildingstypes: [],
  loading: false,
};

const getters = {
  getBuildingTypes: (state) => {
    return state.buildingstypes;
  },
  getBuildingTypesLoading: (state) => {
    return state.loading;
  },
};

const mutations = {
  setBuildingTypes: (state, payload) => {
    state.buildingstypes = payload;
  },
  setBuildingTypesLoading: (state, payload) => {
    state.loading = payload;
  },
};

const actions = {
  fetchAPIBuildingTypes: async ({ commit }) => {
    try {
      commit("setBuildingTypesLoading", true);
      const response = await axios.get("/api/custom-columns/", {
        params: {
          page_size: 5000,
          sort: "",
          project_id: "75ea5a2e-e123-40df-a8c4-bf65386dba16",
          section: "BUILDING",
          status: ["ACTIVE", "MANDATORY"],
        },
        paramsSerializer: (params) => {
          return qs.stringify(params, { arrayFormat: "repeat" });
        },
      });
      const data = response.data.results[0].column_choices.map((item) => {
        return { value: item.id, text: item.option_name };
      });
      commit("setBuildingTypes", data);
      commit("setBuildingTypesLoading", false);
    } catch (error) {
      console.log(error);
    }
  },
};

export default { state, getters, mutations, actions };
