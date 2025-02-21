import { createRouter, createWebHistory, type RouteRecordRaw } from "vue-router";
import HomeView from "../views/HomeView.vue";
import SensorDataView from "../views/SensorDataView.vue";
import DeviceStatusView from "../views/DeviceStatusView.vue";
import GrowthStageView from "../views/GrowthStageView.vue";
import RealTimeVpdView from "../views/RealTimeVpdView.vue";
import PredictedDeviceStates from "../views/PredictedDeviceStates.vue"

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/control-panel",
    name: "ControlPanel",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/ControlPanelView.vue"),
  },
  { path: "/sensor-data", name: "SensorData", component: SensorDataView },
  { path: "/device-status", name: "DeviceStatus", component: DeviceStatusView },
  { path: "/growth-stage", name: "GrowthStage", component: GrowthStageView },
  { path: "/real-time-vpd", name: "RealTimeVpd", component: RealTimeVpdView },
  { path: "/predict", name: "PredictedDeviceStates", component: PredictedDeviceStates },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
