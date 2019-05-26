const state = {
  main: {
    uploadUrl: "",
    downloadUrl: ""
  }
};

const mutations = {
  setUrls(state, $dataArr) {
    state.main.uploadUrl = $dataArr[0];
    state.main.downloadUrl = $dataArr[1];
  }
};

export default {
  state,
  mutations
};
