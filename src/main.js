import Vue from "vue";
import App from "./App";
import router from "./router/index";
import axios from "axios";

import store from "./vuex/store";
import VueClipboard from 'vue-clipboard2'
import PaperDashboard from "./plugins/paperDashboard";
import "vue-notifyjs/themes/default.css";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";

Vue.use(ElementUI);
Vue.use(PaperDashboard);
Vue.use(VueClipboard);

router.beforeEach((to, from, next) => {
  if (to.path === "/forgot_password") {
    next();
    return;
  }
  if (to.path === "/login") {
    sessionStorage.removeItem("JSONWebToken");
  }
  let token = JSON.parse(sessionStorage.getItem("JSONWebToken"));

  if (!token && to.path !== "/login" && to.path !== "/register") {
    next({path: "/login"});
  } else {
    axios.defaults.headers.common["Authorization"] = token;
    next();
  }
});


/* eslint-disable no-new */
new Vue({
  router,
  store: store,
  render: h => h(App)
}).$mount("#app");
