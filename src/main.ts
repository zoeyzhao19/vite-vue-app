import { createApp } from "vue";
import App from "./App.vue";
import elementPlus from "@/plugins/element-plus";
import "@/styles/index.scss";
import "vite-plugin-svg-icons/register";
import "element3/lib/theme-chalk/index.css";
import router from "@/router";
import store from "@/store";

createApp(App)
  .use(router)
  .use(store)
  .use(elementPlus)
  .mount("#app");
