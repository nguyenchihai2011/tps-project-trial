const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  transpileDependencies: ["vuetify"],
  devServer: {
    proxy: {
      // "/api": {
      //   target: "http://192.168.90.49:8080/api", // Replace with the target URL of your API
      //   changeOrigin: true,
      //   pathRewrite: {
      //     "^/api": "", // Remove the '/api' prefix when forwarding requests
      //   },
      // },
      "/api": {
        target: "http://localhost:3000/api", // Replace with the target URL of your API
        changeOrigin: true,
        pathRewrite: {
          "^/api": "", // Remove the '/api' prefix when forwarding requests
        },
      },
    },
  },
});
