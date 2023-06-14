import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "home",
    component: () => import("../views/HomeView.vue"),
  },
  {
    path: "/login",
    name: "login",
    component: () => import("../views/LoginView.vue"),
  },
  {
    path: "/projects",
    component: () => import("../views/ProjectView.vue"),
    children: [
      {
        path: "/",
        name: "projects",
        component: () => import("../views/project/ProjectList.vue"),
      },
      {
        path: ":id/buildings",
        name: "buildings",
        component: () => import("../views/project/Buildings.vue"),
      },
    ],
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
