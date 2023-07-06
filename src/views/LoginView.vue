<template>
  <div>
    <button @click="handleLogin()">Login</button>
    <button @click="handleRefresh()">Re</button>
  </div>
</template>

<script>
import axios from "axios";
export default {
  methods: {
    async handleLogin() {
      try {
        const response = await axios.post("/api/auth/login/", {
          email: "local.development@attainia.com",
          password: "password",
        });
        console.log(response.data);
        localStorage.setItem("orgMemberId", response.data.decoded_jwt.sub);
        localStorage.setItem("userId", response.data.decoded_jwt.mbr);
        this.$router.push(
          "/projects/75ea5a2e-e123-40df-a8c4-bf65386dba16/buildings"
        );
      } catch (err) {
        console.log(err);
      }
    },

    async handleRefresh() {
      // try {
      //   const response = await axios.put(
      //     "/api/org-members/63c7f081-ef87-4421-bc5e-ca4a9b891b6b/preferences/buildingsColumns/",
      //     {
      //       value: {
      //         active_idx: -1,
      //         table_settings: [],
      //       },
      //     }
      //   );
      // } catch (err) {}
    },
  },
  created() {
    var x = "2023-07-06T08:50:39.608351Z";
    var y = "2023-07-06T08:50:39.608632Z";
    console.log(x == y);
  },
};
</script>
