import * as types from "../mutation-types";

const state = {
  main: {
    linkedAccount: {},
    userInfo: {}
  }
};

const mutations = {
  initWizard() {
    state.main = {
      linkedAccount: {},
      userInfo: {}
    };
  },
  setLinkedAccount(state, $data) {
    state.main.linkedAccount = $data;
  },
  setUserInfo(state, $data) {
    state.main.userInfo = $data;
  },
  [types.WIZARD_USER_INFO](state, $data) {
    state.main.userInfo = $data;
  }
};

export default {
  state,
  mutations
};
