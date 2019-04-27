import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";

import * as actions from "./actions";
import * as getters from "./getters";
import modules from "./modules";

Vue.use(Vuex);

export default new Vuex.Store({
  actions,
  getters,
  modules,
  strict: process.env.NODE_ENV !== "production", // process.env.NODE_ENV
  plugins: [
    createPersistedState({
      storage: window.sessionStorage
    })
  ]
});
