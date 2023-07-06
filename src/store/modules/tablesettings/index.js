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
    return settingArr.map((setting, index) => {
      if (setting.name === undefined) {
        setting.name = "Custom" + index;
      }
      return {
        id: index,
        ...setting,
      };
    });
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
    return settingArr.map((setting, index) => {
      return {
        id: index,
        ...setting,
      };
    });
  },

  getSelectedSetting: (state) => {
    return state.selectedSetting;
  },

  getShowStateBuilding: (state) => {
    let states = ["ACTIVE"];
    if (state.selectedSetting.show_inactive_state) {
      states.push("INACTIVE");
    }
    if (state.selectedSetting.show_redacted_state) {
      states.push("REDACTED");
    }
    return states;
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
      }
    } catch (error) {
      console.log(error);
    }
  },
};

export default { state, getters, mutations, actions };
