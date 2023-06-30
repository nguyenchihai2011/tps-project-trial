import axios from "axios";

const state = {
  buildingsColumns: [],
};

const getters = {
  getBuildingsColumns: (state) => {
    return state.buildingsColumns;
  },
};

const mutations = {
  setBuildingsColumns: (state, payload) => {
    state.buildingsColumns = payload;
  },
};

const actions = {
  fetchAPIBuildingsColumns: async ({ commit }) => {
    try {
      const response = await axios.get(
        "/api/org-members/63c7f081-ef87-4421-bc5e-ca4a9b891b6b/preferences/buildingsColumns/"
      );
      const data = response.data.value;
      commit("setBuildingsColumns", data);
    } catch (error) {
      console.log(error);
    }
  },
};

export default { state, getters, mutations, actions };
