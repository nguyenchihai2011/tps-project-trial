import axios from "axios";

const state = {
  buildingstypes: [],
};

const getters = {
  getBuildingTypes: (state) => {
    return state.buildingstypes;
  },
};

const mutations = {
  setBuildingTypes: (state, payload) => {
    state.buildingstypes = payload;
  },
};

const actions = {
  fetchAPIBuildingTypes: async ({ commit }) => {
    try {
      const response = await axios.get(
        "/api/custom-columns/?page_size=5000&sort=&project_id=75ea5a2e-e123-40df-a8c4-bf65386dba16&section=BUILDING&status=ACTIVE&status=MANDATORY"
      );
      const data = response.data.results[0].column_choices.map((item) => {
        return { value: item.id, text: item.option_name };
      });
      commit("setBuildingTypes", data);
    } catch (error) {
      console.log(error);
    }
  },
};

export default { state, getters, mutations, actions };
