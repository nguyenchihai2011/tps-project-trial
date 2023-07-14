import projectBuildings from "@/requestHttp/projectBuildings";

const state = {
  buildings: [],
  metaBuilding: {},
  selectedBuilding: [],
  infoBuilding: {},
  loading: true,
  search: "",
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
  getSelectedBuildingIds: (state) => {
    return state.selectedBuilding.map((item) => item.id);
  },
  getQuantitySelectedBuilding: (state) => {
    return state.selectedBuilding.length;
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
  getSearch: (state) => {
    return state.search;
  },
};

const mutations = {
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
  setSearch: (state, payload) => {
    state.search = payload;
  },
};

const actions = {
  fetchAPIBuildings: async ({ commit }, payload) => {
    try {
      commit("setLoading", true);
      const buildings = await projectBuildings.getBuildings(
        {
          page_size: payload.page_size || 50,
          page: payload.page || 1,
          sort:
            payload.sortBy !== undefined
              ? payload.sortBy === ""
                ? ""
                : payload.sortBy
              : "name",
          project: "75ea5a2e-e123-40df-a8c4-bf65386dba16",
          search: state.search,
          state: payload.state,
          building_type: payload.building_type,
        },
        payload.signal
      );

      const data = buildings.results.map((item) => {
        return { ...item, building_type: item.building_type?.option_name };
      });
      commit("setBuildings", data);
      commit("setMetaBuilding", buildings.meta);
      commit("setLoading", false);
    } catch (error) {
      console.log(error);
    }
  },
};

export default { state, getters, mutations, actions };
