import axios from "axios";
import qs from "qs";

const dataBuildings = {
  async getBuildings(params, signal) {
    const response = await axios.get("/api/buildings/", {
      params,
      paramsSerializer: (params) => {
        return qs.stringify(params, { arrayFormat: "repeat" });
      },
      signal,
    });

    return response.data;
  },
  async getSingleBuilding(idBuilding) {
    const response = await axios.get(`/api/buildings/${idBuilding}/`);
    return response.data;
  },

  async createBuilding(payload) {
    const response = await axios.post("/api/buildings/", payload, {
      headers: {
        "x-camelcase": 1,
      },
    });
  },

  async copyBuilding(payload) {
    const response = await axios.post("/api/buildings/copy/", payload);
  },

  async updateBuilding(idBuilding, payload) {
    const response = await axios.patch(
      `/api/buildings/${idBuilding}`,
      payload,
      {
        headers: {
          "x-camelcase": 1,
        },
      }
    );
  },

  async redactedBuilding(payload) {
    const response = await axios.patch("/api/buildings/bulk/", payload, {
      headers: {
        "x-camelcase": 1,
      },
    });
  },

  async deleteBuilding(payload) {
    const response = await axios.delete("/api/buildings/bulk/", payload, {
      headers: {
        "x-camelcase": 1,
      },
    });
  },
};

export default dataBuildings;
