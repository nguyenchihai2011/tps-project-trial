import axios from "axios";

const state = {
  buildings: [],
  metaBuilding: {},
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
  setMetaBuilding: (state, payload) => {
    state.metaBuilding = payload;
  },
};

const actions = {
  fetchAPIBuildings: async ({ commit }) => {
    try {
      // const response = await axios.get("/api/buildings/", {
      //   params: {
      //     page_size: 50,
      //     page: 1,
      //     sort: "name",
      //     project: "75ea5a2e-e123-40df-a8c4-bf65386dba16",
      //     state: ["ACTIVE", "INACTIVE", "REDACTED"],
      //   },
      // });

      //Mockoon
      const response = await axios.get("/api/buildings/pagesize50/page1");
      // const response = await axios.get("/api/buildings/");
      const data = response.data.results.map((item) => {
        return { ...item, building_type: item.building_type?.option_name };
      });
      commit("setBuildings", data);
      commit("setMetaBuilding", response.data.meta);
    } catch (error) {
      console.log(error);
    }
  },
};

export default { state, getters, mutations, actions };
