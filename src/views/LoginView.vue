<template>
  <div>
    <button @click="handleLogin()">Login</button>
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
        localStorage.setItem("orgMemberId", response.data.decoded_jwt.sub);
        localStorage.setItem("userId", response.data.decoded_jwt.mbr);
        this.$router.push(
          "/projects/75ea5a2e-e123-40df-a8c4-bf65386dba16/buildings"
        );
      } catch (err) {
        console.log(err);
      }
    },
  },
};
</script>
