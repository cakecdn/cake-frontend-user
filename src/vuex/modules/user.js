const state = {
  main: {
    uid: null,
    name: "未登录",
    group: "匿名访问",
    createdAt: new Date(),
    avatarUrl: ""
  }
};

const mutations = {
  loginInit(state, $message) {
    state.main.uid = $message[0];
    state.main.name = $message[1];
    state.main.group = $message[2];
    state.main.avatarUrl = $message[3];
  },
  logout(state) {
    state.main.name = "未登录";
    state.main.group = "匿名访问";
    state.main.status.name = "offline";
    state.main.status.online = false;
  },
  setWizard(state, $wizard) {
    state.main.wizard = $wizard;
  },
  setAvatar(state, $avatarUrl) {
    state.main.avatarUrl = $avatarUrl;
  }
};

export default {
  state,
  mutations
};
