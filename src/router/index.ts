import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import HomeView from "../views/HomeView.vue";
import ControlPanelView from "@/views/ControlPanelView.vue";
import SensorDataView from "@/views/SensorDataView.vue";
import DeviceStatusView from "@/views/DeviceStatusView.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/about",
    name: "about",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/AboutView.vue"),
  },
  { path: "/control-panel", name: "ControlPanel", component: ControlPanelView },
  { path: "/sensor-data", name: "SensorData", component: SensorDataView },
  { path: "/device-status", name: "DeviceStatus", component: DeviceStatusView },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
