<template>
  <div>
    <button @click="handleLogin()">Login</button>
    <button @click="handleCreateBuilding()">Create</button>
    <button @click="handleDeleteBuilding()">Delete</button>
  </div>
</template>

<script>
import axios from "axios";
export default {
  methods: {
    async handleLogin() {
      const response = await axios.post("/api/auth/login/", {
        email: "local.development@attainia.com",
        password: "password",
      });
      console.log(response);
    },

    async handleCreateBuilding() {
      const response = await axios.post("/api/buildings/", {
        id: "",
        projectId: "75ea5a2e-e123-40df-a8c4-bf65386dba16",
        country: "US",
        name: "Heading 9",
        refId: "",
        addressLine1: "",
        addressLine2: "",
        city: "",
        stateProvince: "",
        postalCode: "",
        buildingType: "1aaa19cd-7525-40d4-88b1-88b253c04708",
        state: "ACTIVE",
        notes: "",
      });
      console.log(response);
    },

    async handleDeleteBuilding() {
      const response = await axios.delete("/api/buildings/bulk/", {
        data: { ids: ["1906a2d1-b045-47ce-bb8b-0bda48bd0442"] },
      });
      console.log(response);
    },
  },
};
</script>
