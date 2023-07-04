import axios from "axios";

const state = {
  buildings: [],
  metaBuilding: {},
  selectedBuilding: [],
  infoBuilding: {},
  loading: true,
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
  getInfoBuilding: (state) => {
    return state.infoBuilding;
  },
  getLoading: (state) => {
    return state.loading;
  },
};

const mutations = {
  setBuildingsFull: (state, payload) => {
    state.buildingsFull = payload;
  },
  setBuildings: (state, payload) => {
    state.buildings = payload;
  },
  setMetaBuilding: (state, payload) => {
    state.metaBuilding = payload;
  },
  setSelectedBuilding: (state, payload) => {
    state.selectedBuilding = payload;
  },
  setInfoBuilding: (state, payload) => {
    state.infoBuilding = payload;
  },
  setLoading: (state, payload) => {
    state.loading = payload;
  },
};

const actions = {
  fetchAPIBuildings: async ({ commit }, payload) => {
    try {
      commit("setLoading", true);
      const response = await axios.get("/api/buildings/", {
        params: {
          page_size: payload.page_size || 50,
          page: payload.page || 1,
          sort:
            payload.sortBy !== undefined
              ? payload.sortBy === ""
                ? ""
                : payload.sortBy
              : "name",
          project: "75ea5a2e-e123-40df-a8c4-bf65386dba16",
          search: payload.search,
          state: ["ACTIVE", "INACTIVE", "REDACTED"],
          building_type: payload.building_type,
        },
        signal: payload.signal,
      });

      const data = response.data.results.map((item) => {
        return { ...item, building_type: item.building_type?.option_name };
      });
      commit("setBuildings", data);
      commit("setMetaBuilding", response.data.meta);
      commit("setLoading", false);
    } catch (error) {
      console.log(error);
    }
  },
};

export default { state, getters, mutations, actions };
