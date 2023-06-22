import axios from "axios";

const state = {
  buildingsFull: [],
  buildings: [],
  filter: "",
  metaBuilding: {},
  selectedBuilding: [],
};

const getters = {
  getBuildingsFull: (state) => {
    return state.buildingsFull;
  },
  getBuildings: (state) => {
    return state.buildings;
  },
  getMetaBuildings: (state) => {
    return state.metaBuilding;
  },
  getSelectedBuilding: (state) => {
    return state.buildingsFull.filter(
      (item) => item.id === state.selectedBuilding[0]
    );
  },
  getSelectedBuildingLength: (state) => {
    return state.selectedBuilding.length;
  },
};

const mutations = {
  setBuildingsFull: (state, payload) => {
    state.buildingsFull = payload;
  },
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
  fetchAPIBuildingsFull: async ({ commit }) => {
    try {
      const response = await axios.get(
        "/api/projects/75ea5a2e-e123-40df-a8c4-bf65386dba16/"
      );

      const data = response.data.buildings.map((item) => {
        return { ...item, building_type: item.building_type?.id };
      });

      commit("setBuildingsFull", data);
    } catch (error) {
      console.log(error);
    }
  },
  fetchAPIBuildings: async ({ commit }, payload) => {
    try {
      const response = await axios.get("/api/buildings/", {
        params: {
          page_size: payload.page_size,
          page: payload.page,
          sort: payload.sortBy || "name",
          project: "75ea5a2e-e123-40df-a8c4-bf65386dba16",
          state: ["ACTIVE", "INACTIVE", "REDACTED"],
          building_type: payload.building_type,
        },
      });

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
