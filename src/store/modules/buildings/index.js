import axios from "axios";

const state = {
  buildings: [],
  pageSize: 50,
  page: 1,
};

const getters = {
  getBuildings: (state) => {
    return state.buildings;
  },
};

const mutations = {
  setBuildings: (state, payload) => {
    state.buildings = payload;
  },
};

const actions = {
  fetchAPIBuildings: async ({ commit }) => {
    try {
      const response = await axios.get(
        "/api/buildings/?page_size=10&page=1&sort=name&project=75ea5a2e-e123-40df-a8c4-bf65386dba16&state=ACTIVE&state=INACTIVE&state=REDACTED"
      );
      commit("setBuildings", response.data.results);
    } catch (error) {
      console.log(error);
    }
  },
};

export default { state, getters, mutations, actions };
