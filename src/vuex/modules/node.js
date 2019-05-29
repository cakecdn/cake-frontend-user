const state = {
  main: {
    name: "",
    uploadUrl: "",
    downloadUrl: ""
  }
};

const mutations = {
  setUrls(state, $dataArr) {
    state.main.name = $dataArr[0];
    state.main.uploadUrl = $dataArr[1];
    state.main.downloadUrl = $dataArr[2];
  }
};

export default {
  state,
  mutations
};
