const state = {
  main: {
    name: "",
    uploadUrl: "",
    downloadUrl: "",
    selections: []
  }
};

const mutations = {
  initNode(state, $dataArr) {
    state.main.name = $dataArr[0];
    state.main.uploadUrl = $dataArr[1];
    state.main.downloadUrl = $dataArr[2];
    state.main.selections = $dataArr[3];
  }
};

export default {
  state,
  mutations
};
