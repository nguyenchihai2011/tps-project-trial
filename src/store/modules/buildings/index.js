import axios from "axios";

const state = {
  buildings: [],
  filter: "",
  metaBuilding: {},
  selectedBuilding: [],
};

const getters = {
  getBuildings: (state) => {
    return state.buildings;
  },
  getMetaBuildings: (state) => {
    return state.metaBuilding;
  },
  getSelectedBuilding: (state) => {
    return state.selectedBuilding;
  },
  getSelectedBuildingLength: (state) => {
    return state.selectedBuilding.length;
  },
};

const mutations = {
  setBuildings: (state, payload) => {
    state.buildings = payload;
  },
  setFilter: (state, payload) => {
    state.filter = payload;
  },
  setMetaBuilding: (state, payload) => {
    state.metaBuilding = payload;
  },
  setSelectedBuilding: (state, payload) => {
    state.selectedBuilding = payload;
  },
};

const actions = {
  fetchAPIBuildings: async ({ commit }, payload) => {
    try {
      const response = await axios.get("/api/buildings/", {
        params: {
          page_size: payload?.page_size,
          page: payload.page,
          sort: payload.sortBy || "name",
          project: "75ea5a2e-e123-40df-a8c4-bf65386dba16",
          state: ["ACTIVE", "INACTIVE", "REDACTED"],
          building_type: payload?.building_type,
        },
      });

      //Mockoon
      // const response = await axios.get("/api/buildings/pagesize50/page1");
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
