import { createApp } from 'vue';
import "./assets/style.css";
import App from './App.vue';
import router from './router';
import naive from "naive-ui";
import { createPinia } from 'pinia';

createApp(App).use(createPinia()).use(router).use(naive).mount('#app')
