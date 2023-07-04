import axios from "axios";

const tableSetting = {
  async changeSetting(active_idx, table_settings) {
    try {
      const response = await axios.put(
        "/api/org-members/63c7f081-ef87-4421-bc5e-ca4a9b891b6b/preferences/buildingsColumns/",
        {
          value: {
            active_idx: active_idx,
            table_settings: table_settings,
          },
        }
      );
    } catch (err) {
      console.log(err);
    }
  },
};

export default tableSetting;
