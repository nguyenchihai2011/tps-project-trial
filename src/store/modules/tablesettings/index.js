import axios from "axios";

const state = {
  tableSettings: {},
  settings: [],
  settingsCopy: [],
  selectedSetting: {
    id: 0,
    columns: [
      "ref_id",
      "name",
      "skup_total",
      "building_type",
      "full_address",
      "state",
    ],
    fixed_number: 2,
    is_in_use: false,
    name: "Default",
    show_inactive_state: false,
    show_redacted_state: false,
  },
  fixedColumns: 2,
  columnSizes: [],
  columns: [],
};

const getters = {
  getTableSettings: (state) => {
    return state.tableSettings;
  },

  getSettings: (state) => {
    let settingArr = [
      {
        columns: [
          "ref_id",
          "name",
          "skup_total",
          "building_type",
          "full_address",
          "state",
        ],
        fixed_number: 2,
        is_in_use: false,
        name: "Default",
        show_inactive_state: false,
        show_redacted_state: false,
      },
      ...state.settings,
    ];
    return settingArr.map((set, index) => {
      return {
        id: index,
        ...set,
      };
    });
  },

  getSettingsNotDefault: (state) => {
    return state.settings;
  },

  getSettingsCopy: (state) => {
    let settingArr = [
      {
        columns: [
          "ref_id",
          "name",
          "skup_total",
          "building_type",
          "full_address",
          "state",
        ],
        fixed_number: 2,
        is_in_use: false,
        name: "Default",
        show_inactive_state: false,
        show_redacted_state: false,
      },
      ...state.settingsCopy,
    ];
    return settingArr.map((set, index) => {
      return {
        id: index,
        ...set,
      };
    });
  },

  getSelectedSetting: (state) => {
    return state.selectedSetting;
  },

  getColumns: (state) => {
    return state.columns;
  },
  getFixedColumns: (state) => {
    return state.fixedColumns;
  },
  getColumnSizes: (state) => {
    return state.columnSizes;
  },
};

const mutations = {
  setTableSettings: (state, payload) => {
    state.tableSettings = payload;
  },
  setSettings: (state, payload) => {
    state.settings = payload;
  },
  setSettingsCopy: (state, payload) => {
    state.settingsCopy = payload;
  },
  setSelectedSetting: (state, payload) => {
    state.selectedSetting = payload;
  },
  setColumns: (state, payload) => {
    state.columns = payload;
  },
  setFixedColumns: (state, payload) => {
    state.fixedColumns = payload;
  },
  setColumnSizes: (state, payload) => {
    state.columnSizes = payload;
  },
};

const actions = {
  fetchAPITableSettings: async ({ commit }) => {
    try {
      const response = await axios.get(
        "/api/org-members/63c7f081-ef87-4421-bc5e-ca4a9b891b6b/preferences/buildingsColumns/"
      );
      const data = response.data.value;
      commit("setTableSettings", data);
      commit("setSettings", data.table_settings);
      commit("setSettingsCopy", data.table_settings);
      if (data.active_idx !== -1) {
        commit("setSelectedSetting", {
          id: data.active_idx + 1,
          ...data.table_settings[data.active_idx],
        });
        commit("setColumns", data.table_settings[data.active_idx].columns);
        commit(
          "setFixedColumns",
          data.table_settings[data.active_idx].fixed_number
        );
        commit(
          "setColumnSizes",
          data.table_settings[data.active_idx].column_sizes
        );
      }
    } catch (error) {
      console.log(error);
    }
  },
};

export default { state, getters, mutations, actions };
