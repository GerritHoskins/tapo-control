import { createRouter, createWebHistory, type RouteRecordRaw } from "vue-router";
import HomeView from "../views/HomeView.vue";
import RealTimeVpdView from "../views/RealTimeVpdView.vue";
import PredictedDeviceStates from "../views/PredictedDeviceStates.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/device-status",
    name: "DeviceStatus",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/DeviceStatusView.vue"),
  },
  { path: "/real-time-vpd", name: "RealTimeVpd", component: RealTimeVpdView },
  { path: "/predict", name: "PredictedDeviceStates", component: PredictedDeviceStates },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
