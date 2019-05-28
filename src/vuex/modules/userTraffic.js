import * as types from "../mutation-types";

const state = {
  main: {}
};

const mutations = {
  [types.FETCH_USER_TRAFFIC](state, $response) {
    state.main = $response.data;
  }
};

export default {
  state,
  mutations
};
