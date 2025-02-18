import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import api from "./api";

createApp(App).provide("api", api).use(router).mount("#app");
