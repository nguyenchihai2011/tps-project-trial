import axios from "axios";

const tableSetting = {
  async getTableSetting() {
    const response = await axios.get(
      "/api/org-members/63c7f081-ef87-4421-bc5e-ca4a9b891b6b/preferences/buildingsColumns/"
    );
    return response.data;
  },
  async updateSetting(payload) {
    const response = await axios.put(
      "/api/org-members/63c7f081-ef87-4421-bc5e-ca4a9b891b6b/preferences/buildingsColumns/",
      payload
    );
  },
};

export default tableSetting;
