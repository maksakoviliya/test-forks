import { createRouter, createWebHistory } from "vue-router";
import Home from "@/views/Home.vue";
import Forks from "@/views/Forks.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/search",
    name: "Forks",
    component: Forks,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
