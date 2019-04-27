const state = {
  main: {
    name: "未登录",
    group: "匿名访问",
    status: {
      color: "#3c763d",
      name: "offline",
      online: false
    },
    createdAt: new Date(),
    wizard: 0,
    avatarUrl: ""
  }
};

const mutations = {
  loginInit(state, $message) {
    state.main.name = $message[0];
    state.main.group = $message[1];
    state.main.wizard = $message[2];
    state.main.avatarUrl = $message[3];
    state.main.status.name = "online";
    state.main.status.online = true;
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
